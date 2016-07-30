'use strict';

var Bus = require('./bus');
var Visitor = require('./visitor');

describe('bus', function() {
  var testedBus = null;

  beforeEach(function() {
    testedBus = new Bus();
  });

  var subscribeErrors = [
    [ undefined, 'visitor must be not empty; got undefined' ],
    [
      { visitBrowserEvent: function() {} },
      'visitor.visitPropertyChange must be a function; got undefined '+
        'and visitor.visitOther must be a function; got undefined',
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
    [ undefined, 'quirk must be not empty; got undefined' ],
    [ {}, 'quirk.applyVisitor must be a function; got undefined' ],
  ];

  describe('.emit', function() {
    var quirk = { applyVisitor: function() {} };

    emitErrors.forEach(function(param) {
      var arg = param[0];
      var message = param[1];

      it('throws when called with argument '+ arg, function() {
        expect(function() { testedBus.emit(arg); }).toThrow(new Error(message));
      });
    });

    it('doesn\'t throw when called with function as argument', function() {
      testedBus.emit(quirk);
    });

    describe('with visitor subscribed', function() {
      var visitor = new Visitor();

      beforeAll(function() {
        spyOn(quirk, 'applyVisitor');
      });
      beforeEach(function() {
        testedBus.subscribe(visitor);
      });
      afterEach(function() {
        quirk.applyVisitor.calls.reset();
      });

      it('calls this visitor', function() {
        testedBus.emit(quirk);
        expect(quirk.applyVisitor).toHaveBeenCalledWith(visitor);
      });

      describe('and then unsubscribed', function() {
        beforeEach(function() {
          testedBus.unsubscribe(visitor);
        });

        it('desn\'t call this visitor', function() {
          testedBus.emit(quirk);
          expect(quirk.applyVisitor).not.toHaveBeenCalled();
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

