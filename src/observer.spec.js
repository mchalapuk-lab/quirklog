'use strict';

var Observer = require('./observer');
var Visitor = require('./visitor');

var jsdom = require('jsdom');

function noop() {}
function fakeBus() { return { emit: noop }; }

describe('observer', function() {
  var constructorErrors = [
    [ 'undefined bus', undefined, noop, 'bus must be not empty; got undefined' ],
    [ 'bus without emit method', {}, noop, 'bus.emit must be a function; got undefined' ],
    [ 'undefined timestamp', fakeBus(), undefined, 'timestamp must be a function; got undefined' ],
    [ 'not callable timestamp', fakeBus(), 0, 'timestamp must be a function; got 0' ],
  ];

  constructorErrors.forEach(function(error) {
    var testName = error[0];
    var arg0 = error[1];
    var arg1 = error[2];
    var message = error[3];

    it('should throw when constructed with '+ testName, function() {
      expect(function() { return new Observer(arg0, arg1); }).toThrow(contractError(message));
    });
  });

  it('should create observer when constructed with proper arguments', function() {
    var observer = new Observer(fakeBus(), noop);
    expect(observer).not.toBeNull();
    expect(observer.constructor).toBe(Observer);
  });

  var bus = null;
  var timestamp = null;
  var testedObserver = null;

  beforeAll(function() {
    bus = fakeBus();
    spyOn(bus, 'emit');
    timestamp = jasmine.createSpy().and.returnValue([ 3, 141592 ]);
  });
  beforeEach(function() {
    testedObserver = new Observer(bus, timestamp);
  });
  afterEach(function() {
    bus.emit.calls.reset();
    timestamp.calls.reset();
  });

  var document = jsdom.jsdom();

  afterAll(function() {
    document.defaultView.close();
  });

  describe('.observeBrowserEvents', function() {
    function aTarget() {
      return document.createElement('p');
    }

    var errors = [
      [ 'undefined targets', undefined, [ 'test' ], 'targets must be not empty; got undefined' ],
      [ 'empty targets array', [], [ 'test' ], 'targets.length must be not 0; got 0' ],
      [ 'undefined events', [ aTarget() ], undefined, 'eventTypes must be not empty; got undefined' ],
      [ 'empty events array', [ aTarget() ], [], 'eventTypes.length must be not 0; got 0' ],
      [
        'target without addEventListener function',
        [ {} ],
        [ 'test' ],
        'targets[0] must be an EventTarget; got [object Object]',
      ],
      [
        'event that is not a string',
        [ aTarget() ],
        [ 0 ],
        'eventTypes[0] must be a string; got 0',
      ],
    ];

    errors.forEach(function(error) {
      var testName = error[0];
      var arg0 = error[1];
      var arg1 = error[2];
      var message = error[3];

      it('should throw when called with '+ testName, function() {
        expect(function() { testedObserver.observeBrowserEvents(arg0, arg1); })
          .toThrow(contractError(message));
      });
    });

    var nonErrors = [
      [ 'targets and events as arrays', [ aTarget() ], [ 'test' ] ],
      [ 'targets as array and event as string', [ aTarget() ], 'test' ],
      [ 'target as object and events as array', aTarget(), [ 'test' ] ],
    ];

    nonErrors.forEach(function(error) {
      var testName = error[0];
      var arg0 = error[1];
      var arg1 = error[2];

      it('should not throw when called with '+ testName, function() {
        testedObserver.observeBrowserEvents(arg0, arg1);
      });
    });

    var eventTypes = [ 'testing', 'my', 'fancy', 'observer' ];

    describe('after called with a window instance and [ '+ eventTypes +' ]', function() {
      var window = null;

      beforeEach(function() {
        window = jsdom.jsdom().defaultView;
        testedObserver.observeBrowserEvents(window, eventTypes);
      });
      afterEach(function() {
        window.close();
      });

      eventTypes.forEach(function(type) {
        function getWindow(win) { return win; }
        function getDocument(win) { return win.document; }
        function getBody(win) { return win.document.body; }

        var params = [
          [ 'window', getWindow ],
          [ 'document', getDocument ],
          [ 'body', getBody ],
        ];

        params.forEach(function(param) {
          var dispatchName = param[0];
          var getEventTarget = param[1];

          it('event of type '+ type +' dispatched on '+ dispatchName +
              ' results in quirk on a bus', function() {
            var event = new window.CustomEvent(type, { bubbles: true });
            var target = getEventTarget(window);
            target.dispatchEvent(event);

            var calls = bus.emit.calls;
            expect(calls.count()).toBe(1);

            var args = calls.mostRecent().args;
            expect(args.length).toBe(1);

            var properties = captureQuirkProperties(args[0]);
            expect(properties.timestamp).toEqual([ 3, 141592 ]);
            expect(properties.event).toBe(event);
          });
        });
      });
    });
  });

  describe('.observePropertyChanges', function() {
    var errors = [
      [ 'undefined objects', undefined, [ 'test' ], 'objects must be not empty; got undefined' ],
      [ 'empty objects array', [], [ 'test' ], 'objects.length must be not 0; got 0' ],
      [ 'undefined property names', [ {} ], undefined, 'propertyNames must be not empty; got undefined' ],
      [ 'empty property names array', [ {} ], [], 'propertyNames.length must be not 0; got 0' ],
      [
        'undefined object',
        [ undefined ],
        [ 'test' ],
        'objects[0] must be not empty; got undefined',
      ],
      [
        'property name that is not a string',
        [ {} ],
        [ 0 ],
        'propertyNames[0] must be a string; got 0',
      ],
    ];

    errors.forEach(function(error) {
      var testName = error[0];
      var arg0 = error[1];
      var arg1 = error[2];
      var message = error[3];

      it('should throw when called with '+ testName, function() {
        expect(function() { testedObserver.observePropertyChanges(arg0, arg1); })
          .toThrow(contractError(message));
      });
    });

    var nonErrors = [
      [ 'objects and property names as arrays', [ {} ], [ 'test' ] ],
      [ 'objects as array and property names as string', [ {} ], 'test' ],
      [ 'objects as object and property names as array', {}, [ 'test' ] ],
    ];

    nonErrors.forEach(function(error) {
      var testName = error[0];
      var arg0 = error[1];
      var arg1 = error[2];

      it('should not throw when called with '+ testName, function() {
        testedObserver.observePropertyChanges(arg0, arg1);
      });
    });


  });
});

function contractError(message) {
  var error = new Error(message);
  error.name = 'ContractError';
  return error;
}

function captureQuirkProperties(quirk) {
  var properties = null;
  quirk(new Visitor(function(props) { properties = props; }));
  return properties;
}

/*
  eslint-env node, jasmine
 */

/*
  eslint
    max-nested-callbacks: 0
    no-undefined: 0
 */

