'use strict';

var check = require('./check');
var quirk = require('./quirk');

module.exports = Observer;

function Observer(bus, timestamp) {
  var priv = {};
  priv.bus = check(bus, 'bus').isNotEmpty().value;
  check(bus.emit, 'bus.emit').isFunction();
  priv.timestamp = check(timestamp, 'timestamp').isFunction().value;
  priv.emitBrowserEvent = emitBrowserEvent.bind(priv, priv);

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

  targetArray.forEach(function(target) {
    eventArray.forEach(function(eventType) {
      target.addEventListener(eventType, priv.emitBrowserEvent);
    });
  });
}

function observePropertyChanges(priv, objects, propertyNames) {
}

function emitBrowserEvent(priv, event) {
  priv.bus.emit(new quirk.BrowserEvent({
    timestamp: priv.timestamp(),
    event: event,
  }));
}

function ensureArray(maybeArray) {
  return maybeArray.forEach && maybeArray.filter && maybeArray.splice? maybeArray: [ maybeArray ];
}

/*
  eslint-env node
 */

