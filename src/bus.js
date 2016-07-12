'use strict';

var check = require('./check');
var Visitor = require('./visitor');

module.exports = Bus;

function Bus() {
  var priv = {};
  priv.subscribers = [];

  var pub = {};
  pub.constructor = Bus;
  pub.subscribe = subscribe.bind(pub, priv);
  pub.unsubscribe = unsubscribe.bind(pub, priv);
  pub.emit = emit.bind(pub, priv);
  return pub;
}

function subscribe(priv, visitor) {
  priv.subscribers.push(checkIsVisitor(visitor, 'visitor'));
}

function unsubscribe(priv, visitor) {
  var index = priv.subscribers.indexOf(checkIsVisitor(visitor, 'visitor'));
  if (index === -1) {
    throw new Error('visitor was not subscribed');
  }
}

function emit(priv, quirk) {
  check(quirk, 'quirk').isFunction();
}

function checkIsVisitor(value, name) {
  check(value, name).isObject();
  Object.keys(Visitor.prototype).forEach(function(key) {
    check(value[key], name +'.'+ key).isFunction();
  });
  return value;
}

/*
  eslint-env node
 */

