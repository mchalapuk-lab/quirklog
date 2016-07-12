'use strict';

var Bus = require('./bus');
var Visitor = require('./visitor');

describe('bus', function() {
  var testedBus = null;

  beforeEach(function() {
    testedBus = new Bus();
  });

  var subscribeErrors = [
    [ undefined, 'visitor must be an object; got undefined' ],
    [ 2, 'visitor must be an object; got 2' ],
    [ 'me too!', 'visitor must be an object; got me too!' ],
    [ {}, 'visitor.visitBrowserEvent must be a function; got undefined' ],
    [
      { visitBrowserEvent: function() {} },
      'visitor.visitPropertyChange must be a function; got undefined',
    ],
  ];

  describe('.subscribe', function() {
    subscribeErrors.forEach(function(param) {
      var arg = param[0];
      var message = param[1];

      it('throws when called with argument '+ arg, function() {
        expect(function() { testedBus.subscribe(arg); }).toThrow(new Error(message));
      });
    });
  });

  describe('.unsubscribe', function() {
    subscribeErrors.forEach(function(param) {
      var arg = param[0];
      var message = param[1];

      it('throws when called with argument '+ arg, function() {
        expect(function() { testedBus.unsubscribe(arg); }).toThrow(new Error(message));
      });
    });

    it('throws when called with visitor which was not subscribed', function() {
      expect(function() { testedBus.unsubscribe(new Visitor()); })
        .toThrow(new Error('visitor was not subscribed'));
    });

    it('doesn\'t throw when called wuth previously subscribed visitor', function() {
      var visitor = new Visitor();
      testedBus.subscribe(visitor);
      testedBus.unsubscribe(visitor);
    });
  });

  var emitErrors = [
    [ undefined, 'quirk must be a function; got undefined' ],
    [ 'function', 'quirk must be a function; got function' ],
    [ {}, 'quirk must be a function; got [object Object]' ],
  ];

  describe('.emit', function() {
    emitErrors.forEach(function(param) {
      var arg = param[0];
      var message = param[1];

      it('throws when called with argument '+ arg, function() {
        expect(function() { testedBus.emit(arg); }).toThrow(new Error(message));
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

