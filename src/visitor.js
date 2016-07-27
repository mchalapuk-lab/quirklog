'use strict';

var check = require('offensive');

module.exports = Visitor;

var visitMethods = [ 'visitBrowserEvent', 'visitPropertyChange', 'visitOther' ];

function Visitor(init) {
  var initProps = ensureObject(check(init || {}, 'init').is.either.anObject.or.aFunction());

  var that = this;
  visitMethods
    .filter(function(key) { return initProps[key]; })
    .forEach(function(key) { that[key] = check(initProps[key], 'init.'+ key).is.aFunction(); });
}

visitMethods.forEach(function(key) {
  Visitor.prototype[key] = callVisitOther;
});

Visitor.prototype.visitOther = noop;

function ensureObject(init) {
  return typeof init === 'function'? { visitOther: init }: init;
}

function callVisitOther(properties) {
  this.visitOther(properties);
}

function noop() {}

/*
  eslint-env node
 */

