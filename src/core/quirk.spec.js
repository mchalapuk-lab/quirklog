'use strict';

var quirk = require('./quirk');

var testParams = [
  [
    'BrowserEvent',
    { timestamp: [ 0, 1 ], event: { type: 'test' } },
    [
      [ 'timestamp', undefined, 'init.timestamp must be an array; got undefined' ],
      [ 'timestamp', [], 'init.timestamp.length must be 2; got 0' ],
      [ 'timestamp', [ {}, 4 ], 'init.timestamp[0] must be a number; got [object Object]' ],
      [ 'timestamp', [ 0, null ], 'init.timestamp[1] must be a number; got null' ],
      [ 'event', undefined, 'init.event must be not empty; got undefined' ],
    ],
  ],
  [
    'PropertyChange',
    { timestamp: [ 0, 4 ], id: 'a', instance: 'a', propertyName: 'b', oldValue: 'c', newValue: 'd' },
    [
      [ 'timestamp', undefined, 'init.timestamp must be an array; got undefined' ],
      [ 'id', undefined, 'init.id must be a string; got undefined' ],
      [ 'instance', undefined, 'init.instance must be not empty; got undefined' ],
      [ 'propertyName', undefined, 'init.propertyName must be a string; got undefined' ],
      [ 'oldValue', undefined, 'init.oldValue must be not undefined; got undefined' ],
      [ 'newValue', undefined, 'init.newValue must be not undefined; got undefined' ],
    ],
  ],
];

testParams.forEach(function(param) {
  var className = param[0];
  var initProto = param[1];
  var errors = param[2];

  var QuirkType = quirk[className];

  describe('quirk.'+ className, function() {
    var init = null;

    beforeEach(function() {
      init = Object.assign({}, initProto);
    });

    errors.forEach(function(error) {
      var key = error[0];
      var value = error[1];
      var message = error[2];

      it('throws when called with init.'+ key +'='+ value, function() {
        if (typeof value === 'undefined') {
          delete init[key];
        } else {
          init[key] = value;
        }
        expect(function() { return new QuirkType(init); }).toThrow(new Error(message));
      });
    });

    it('constructs a quirk when called with propert init', function() {
      var testedQuirk = new QuirkType(init);
      expect(testedQuirk.constructor).toBe(QuirkType);

      describe('and', function() {
        it('passes all values from init to visit method', function() {
          var visitor = {};
          var methodName = 'visit'+ className;
          visitor[methodName] = function() {};
          var spy = spyOn(visitor, methodName);

          testedQuirk.applyVisitor(visitor);

          var expectation = expect(spy);
          expectation.toHaveBeenCalledWith(init);
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

