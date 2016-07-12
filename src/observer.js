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

function observeBrowserEvents(priv, targets, eventTypes) {
  var targetArray = ensureArray(check(targets, 'targets').isNotEmpty().value);
  var eventArray = ensureArray(check(eventTypes, 'eventTypes').isNotEmpty().value);

  check(targetArray, 'targets').isArray().ofLengthGreaterThan(0).value.forEach(function(target, i) {
    check(target, 'targets['+ i +']').isObject();
    check(target.addEventListener, 'targets['+ i +'].addEventListener').isFunction();
  });
  check(eventArray, 'eventTypes').isArray().ofLengthGreaterThan(0).value.forEach(function(eventName, i) {
    check(eventName, 'eventTypes['+ i +']').isString();
  });
}

function observePropertyChanges(priv, objects, propertyNames) {
}

function ensureArray(maybeArray) {
  return maybeArray.forEach && maybeArray.filter && maybeArray.splice? maybeArray: [ maybeArray ];
}

/*
  eslint-env node
 */

