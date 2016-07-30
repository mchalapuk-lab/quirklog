'use strict';

var check = require('./check');

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

Bus.prototype = {};
Bus.prototype.constructor = Bus;

function subscribe(priv, visitor) {
  check(visitor, 'visitor').is.aVisitor();
  priv.subscribers.push(visitor);
  return priv.subscribers.length;
}

function unsubscribe(priv, visitor) {
  check(visitor, 'visitor').is.aVisitor();
  var index = priv.subscribers.indexOf(visitor);
  if (index === -1) {
    throw new Error('visitor was not subscribed');
  }
  priv.subscribers.splice(index, 1);
  return priv.subscribers.length;
}

function emit(priv, quirk) {
  check(quirk, 'quirk').is.aQuirk();
  priv.subscribers.forEach(function(visitor) { quirk.applyVisitor(visitor); });
}

/*
  eslint-env node
 */

