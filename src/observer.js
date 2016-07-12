'use strict';

var check = require('./check');

module.exports = Observer;

function Observer() {
  var priv = {};

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

