'use strict';

var quirk = require('./quirk');

var testParams = [
  [
    'BrowserEvent',
    { timestamp: [ 0, 1 ], event: { type: 'test' } },
  ],
  [
    'PropertyChange',
    { timestamp: [ 0, 4 ], instance: 'a', propertyName: 'b', oldValue: 'c', newValue: 'd' },
  ],
];

testParams.forEach(function(param) {
  var className = param[0];
  var init = param[1];

  describe('quirk.'+ className, function() {
    var testedQuirk = null;
    beforeEach(function() {
      testedQuirk = quirk[className](init);
    });

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

/*
  eslint-env node, jasmine
 */

