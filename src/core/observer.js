'use strict';

require('../../node_modules/object-observe/dist/object-observe');

var check = require('./check');
var quirk = require('./quirk');

module.exports = Observer;

function Observer(bus, timestamp) {
  var priv = {};
  priv.bus = check(bus, 'bus').is.not.Empty();
  check(bus.emit, 'bus.emit').is.aFunction();
  priv.timestamp = check(timestamp, 'timestamp').is.aFunction();
  priv.emitBrowserEvent = emitBrowserEvent.bind(priv, priv);

  var pub = {};
  pub.constructor = Observer;
  pub.observeBrowserEvents = observeBrowserEvents.bind(pub, priv);
  pub.observePropertyChanges = observePropertyChanges.bind(pub, priv);
  return pub;
}

function observeBrowserEvents(priv, targets, eventTypes) {
  var targetArray = ensureArray(check(targets, 'targets').is.not.Empty());
  var eventArray = ensureArray(check(eventTypes, 'eventTypes').is.not.Empty());

  check(targetArray, 'targets').has.not.length(0).and.contains.onlyEventTargets();
  check(eventArray, 'eventTypes').has.not.length(0).and.contains.onlyStrings();

  targetArray.forEach(function(target) {
    eventArray.forEach(function(eventType) {
      target.addEventListener(eventType, priv.emitBrowserEvent);
    });
  });
}

function observePropertyChanges(priv, id, object, propertyNames) {
  check(id, 'id').is.aString();
  check(object, 'object').is.not.Empty();

  var propertyArray = ensureArray(check(propertyNames, 'propertyNames').is.not.Empty());
  check(propertyArray, 'propertyNames').has.not.length(0).and.contains.onlyStrings();

  Object.observe(object, function(changes) {
    changes.forEach(function(change) {
      if (propertyNames.indexOf(change.name) !== -1 && change.type.match(/add|update|delete/)) {
        emitPropertyChange(priv, { id: id, instance: object }, change);
      }
    });
  });
}

function emitBrowserEvent(priv, event) {
  priv.bus.emit(new quirk.BrowserEvent({
    timestamp: priv.timestamp(),
    event: event,
  }));
}

function emitPropertyChange(priv, initProto, change) {
  var init = Object.create(initProto);
  init.propertyName = change.name;
  init.newValue = initProto.instance[change.name];
  init.oldValue = change.oldValue;
  init.timestamp = priv.timestamp();
  priv.bus.emit(new quirk.PropertyChange(init));
}

function ensureArray(maybeArray) {
  if (check.nothrow(maybeArray).is.anArray._result) {
    return maybeArray;
  }
  return [ maybeArray ];
}

/*
  eslint-env node
 */

/*
  eslint
    no-underscore-dangle: 0
 */

