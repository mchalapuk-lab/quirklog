'use strict';

var check = require('./check');
var quirk = require('./quirk');

module.exports = Observer;

function Observer(bus, timestamp) {
  var priv = {};
  priv.bus = check(bus, 'bus').is.not.Empty();
  check(bus.emit, 'bus.emit').is.aFunction();
  priv.timestamp = check(timestamp, 'timestamp').is.aFunction();
  priv.emitBrowserEvent = emitBrowserEvent.bind(priv, priv);
  priv.observedFields = [];

  var pub = {};
  pub.constructor = Observer;
  pub.observeBrowserEvents = observeBrowserEvents.bind(pub, priv);
  pub.observePropertyChanges = observePropertyChanges.bind(pub, priv);
  pub.tick = tick.bind(pub, priv);
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

function observePropertyChanges(priv, id, instance, propertyNames, emitInitial) {
  check(id, 'id').is.aString();
  check(instance, 'instance').is.not.Empty();
  var emitInitValues = check(emitInitial, 'emitInitial').is.either.Undefined.or.aBoolean() || false;

  var propertyArray = ensureArray(check(propertyNames, 'propertyNames').is.not.Empty());
  check(propertyArray, 'propertyNames').has.not.length(0).and.contains.onlyStrings();

  var startIndex = priv.observedFields.length;

  propertyArray.forEach(function(propertyName) {
    priv.observedFields.push({
      oldValue: instance[propertyName],
      get: get(propertyName),
      emit: emit(propertyName),
    });
  });

  if (!emitInitValues) {
    return;
  }

  priv.observedFields.slice(startIndex).forEach(function(observed) {
    observed.emit();
  });

  function get(key) {
    return function() { return instance[key]; };
  }

  function emit(key) {
    var initProto = { id: id, instance: instance, propertyName: key };
    return emitPropertyChange.bind(priv, priv, initProto);
  }
}

function tick(priv) {
  priv.observedFields.forEach(function(observed) {
    var newValue = observed.get();
    var oldValue = observed.oldValue;
    if (newValue === oldValue) {
      return;
    }
    observed.oldValue = newValue;
    observed.emit(oldValue);
  });
}

function emitBrowserEvent(priv, event) {
  priv.bus.emit(new quirk.BrowserEvent({
    timestamp: priv.timestamp(),
    event: event,
  }));
}

function emitPropertyChange(priv, initProto, oldValue) {
  var init = Object.create(initProto);
  init.newValue = init.instance[init.propertyName];
  init.oldValue = oldValue;
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

