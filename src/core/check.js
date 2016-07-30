'use strict';

var Assertion = require('offensive/lib/model/assertion');
var check = require('offensive');

var Visitor = require('./visitor');

module.exports = check;
module.exports.nothrow = nothrow;

check.addAssertion('eventTarget', new Assertion(function(context) {
  context.has.method('addEventListener');
}));

check.addAssertion('onlyEventTargets', new Assertion(function(context) {
  context.eachElementIs('an EventTarget', function(element) {
    return nothrow(element).is.eventTarget._result;
  });
}));

check.addAssertion('onlyNotEmpty', new Assertion(function(context) {
  context.eachElementIs('not empty', function(element) {
    return nothrow(element).is.not.Empty._result;
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

check.addAssertion('aVisitor', new Assertion(function(context) {
  context._push();

  if (!context.is.not.Empty._result) {
    context._pop();
    return;
  }
  context._reset();
  context._push();

  Object.keys(Visitor.prototype).forEach(function(key) {
    if (context.has.method(key)._result) {
      context._reset();
      return;
    }
    context._pop();
    noop(context._operatorContext.and);
    context._push();
  });

  context._pop(true);
  context._pop(true);
}));

check.addAssertion('aQuirk', new Assertion(function(context) {
  context.has.method('applyVisitor');
}));

function nothrow(value) {
  return check.defensive(value, 'value');
}

function noop() {
  // noop
}

/*
  eslint-env node
 */

/*
  eslint
    no-invalid-this: 0,
    no-underscore-dangle: 0,
 */

