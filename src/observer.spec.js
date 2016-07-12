'use strict';

var Observer = require('./observer');
var Bus = require('./bus');

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
});

/*
  eslint-env node, jasmine
 */

/*
  eslint
    max-nested-callbacks: 0
    no-undefined: 0
 */

