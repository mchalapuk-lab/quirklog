'use strict';

var Assertion = require('offensive/lib/model/assertion');
var check = require('offensive');

module.exports = check;
module.exports.nothrow = nothrow;

check.addAssertion('eventTarget', new Assertion(function(context) {
  context.has.method('addEventListener');
}));

check.addAssertion('onlyEventTargets', new Assertion(function(context) {
  context.contains.onlyElements('an EventTarget', function(element) {
    return nothrow(element).is.eventTarget._result;
  });
}));

check.addAssertion('aTimestamp', new Assertion(function(context) {
  context._push();

  if (context.contains.onlyNumbers._result) {
    context._reset();
    context.has.length(2);
  }
  context._pop();
}));

function nothrow(value) {
  return check.defensive(value, 'value');
}

/*
  eslint-env node
 */

/*
  eslint
    no-invalid-this: 0,
    no-underscore-dangle: 0,
 */

