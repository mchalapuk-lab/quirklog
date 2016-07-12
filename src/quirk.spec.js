'use strict';

var quirk = require('./quirk');

var testParams = [
  [
    'BrowserEvent',
    { timestamp: [ 0, 1 ], event: { type: 'test' } },
    [
      [ 'timestamp', undefined, 'init.timestamp must be an array; got undefined' ],
      [ 'timestamp', [], 'init.timestamp.length must be 2; got 0' ],
      [ 'timestamp', [ {}, 4 ], 'init.timestamp must contain only numbers; got { 0:[object Object] }' ],
      [ 'timestamp', [ 0, null ], 'init.timestamp must contain only numbers; got { 1:null }' ],
      [ 'timestamp', undefined, 'init.timestamp must be an array; got undefined' ],
      [ 'event', undefined, 'init.event is required; got undefined' ],
    ],
  ],
  [
    'PropertyChange',
    { timestamp: [ 0, 4 ], instance: 'a', propertyName: 'b', oldValue: 'c', newValue: 'd' },
    [
      [ 'timestamp', undefined, 'init.timestamp must be an array; got undefined' ],
      [ 'instance', undefined, 'init.instance is required; got undefined' ],
      [ 'propertyName', undefined, 'init.propertyName is required; got undefined' ],
      [ 'oldValue', undefined, 'init.oldValue is required; got undefined' ],
      [ 'newValue', undefined, 'init.newValue is required; got undefined' ],
    ],
  ],
];

testParams.forEach(function(param) {
  var className = param[0];
  var initProto = param[1];
  var errors = param[2];

  var QuirkType = quirk[className];

  describe('quirk.'+ className, function() {
    function Init() {}
    Init.prototype = initProto;

    var init = null;

    beforeEach(function() {
      init = new Init();
    });

    errors.forEach(function(error) {
      var key = error[0];
      var value = error[1];
      var message = error[2];

      it('throws when called with init.'+ key +'='+ value, function() {
        init[key] = value;
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

          testedQuirk(visitor);

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

