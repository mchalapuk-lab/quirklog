'use strict';

var check = require('./check');

module.exports = Observer;

function Observer(bus) {
  var priv = {};
  priv.bus = check(bus, 'bus').isNotEmpty();
  check(bus.emit, 'bus.emit').isFunction();

  var pub = {};
  pub.constructor = Observer;
  pub.observeBrowserEvents = observeBrowserEvents.bind(pub, priv);
  pub.observePropertyChanges = observePropertyChanges.bind(pub, priv);
  return pub;
}

function observeBrowserEvents(priv, nodes, events) {
}

function observePropertyChanges(priv, objects, propertyNames) {
}

/*
  eslint-env node
 */

