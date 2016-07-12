'use strict';

var Observer = require('./observer');
var Visitor = require('./visitor');
var Bus = require('./bus');

var jsdom = require('jsdom');

describe('observer', function() {
  var constructorErrors = [
    [ undefined, 'bus is required; got undefined' ],
    [ {}, 'bus.emit must be a function; got undefined' ],
  ];

  constructorErrors.forEach(function(error) {
    var arg = error[0];
    var message = error[1];

    it('should throw when constructed with argument '+ arg, function() {
      expect(function() { return new Observer(arg); }).toThrow(new Error(message));
    });
  });

  it('should create observer when constructed with proper arguments', function() {
    var observer = new Observer(new Bus());
    expect(observer).not.toBeNull();
    expect(observer.constructor).toBe(Observer);
  });

  describe('.observeBrowserEvents', function() {
    var bus = null;
    var testedObserver = null;

    beforeEach(function() {
      bus = new Bus();
      testedObserver = new Observer(bus);
    });

    var document = jsdom.jsdom();

    afterAll(function() {
      document.defaultView.close();
    });

    function target() {
      return document.createElement('p');
    }

    var errors = [
      [ 'undefined targets', undefined, [ 'test' ], 'targets is required; got undefined' ],
      [ 'empty targets array', [], [ 'test' ], 'targets.length must be > 0; got 0' ],
      [ 'undefined events', [ target() ], undefined, 'eventTypes is required; got undefined' ],
      [ 'empty events array', [ target() ], [], 'eventTypes.length must be > 0; got 0' ],
      [
        'target without addEventListener function',
        [ {} ],
        [ 'test' ],
        'targets[0].addEventListener must be a function; got undefined',
      ],
      [
        'event that is not a string',
        [ target() ],
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
          .toThrow(new Error(message));
      });
    });

    var nonErrors = [
      [ 'targets and events as arrays', [ target() ], [ 'test' ] ],
      [ 'targets as array and event as string', [ target() ], 'test' ],
      [ 'target as object and events as array', target(), [ 'test' ] ],
    ];

    nonErrors.forEach(function(error) {
      var testName = error[0];
      var arg0 = error[1];
      var arg1 = error[2];

      it('should not throw when called with '+ testName, function() {
        testedObserver.observeBrowserEvents(arg0, arg1);
      });
    });

    describe('after called with a window instance and [ '+ eventTypes +' ]', function() {
      var window = null;
      var visitor = null;

      beforeEach(function() {
        window = jsdom.jsdom().defaultView;
        testedObserver.observeBrowserEvents(window, eventTypes);
        visitor = new Visitor();
        spyOn(visitor, 'visitBrowserEvent');
        bus.subscribe(visitor);
      });
      afterEach(function() {
        bus.unsubscribe(visitor);
        window.close();
      });
    });

    var eventTypes = [ 'testing', 'my', 'fancy', 'observer' ];

    describe('after called with a window instance and [ '+ eventTypes +' ]', function() {
      var window = null;
      var visitor = null;

      beforeEach(function() {
        window = jsdom.jsdom().defaultView;
        testedObserver.observeBrowserEvents(window, eventTypes);
        visitor = new Visitor();
        spyOn(visitor, 'visitBrowserEvent');
        bus.subscribe(visitor);
      });
      afterEach(function() {
        bus.unsubscribe(visitor);
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

          it('event of type '+ type +' dispatched on '+ dispatchName
              +' results in quirk on a bus', function() {
            var event = new window.CustomEvent(type);
            var target = getEventTarget(window);
            target.dispatchEvent(event);
            expect(visitor.visitBrowserEvent).toHaveBeenCalled();

            var args = visitor.visitBrowserEvent.calls.mostRecent.args;
            expect(args.length).toBe(1);
            expect(args[0].timestamp).toBe(jasmine.any(Array));
            expect(args[0].event).toEqual(event);
          });
        });
      });


    });
  });
});

/*
  eslint-env node, jasmine
 */

/*
  eslint
    max-nested-callbacks: 0
    no-undefined: 0
 */

