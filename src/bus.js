'use strict';

module.exports = Bus;

function Bus() {
  var priv = {};
  priv.subscribers = {};

  var pub = {};
  pub.constructor = Bus;
  pub.subscribe = subscribe.bind(pub, priv);
  pub.unsubscribe = unsubscribe.bind(pub, priv);
  pub.emit = emit.bind(pub, priv);
  return pub;
}

function subscribe(visitor) {
}

function unsubscribe(visitor) {
}

function emit() {
}

/*
  eslint-env node
 */

