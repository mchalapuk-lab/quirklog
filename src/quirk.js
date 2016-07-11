'use strict';

var check = require('./check');

module.exports = {
  BrowserEvent: BrowserEvent,
  PropertyChange: PropertyChange,
};

function BrowserEvent(init) {
  var priv = Quirk.call({}, init);
  priv.event = check(init.event, 'init.event').isNotEmpty().value;

  var pub = visitBrowserEvent.bind(null, priv);
  pub.constructor = BrowserEvent;
  return pub;
}

function visitBrowserEvent(priv, visitor) {
  return visitor.visitBrowserEvent({
    timestamp: priv.timestamp,
    event: priv.event,
  });
}

function PropertyChange(init) {
  var priv = Quirk.call({}, init);
  priv.instance = check(init.instance, 'init.instance').isNotEmpty().value;
  priv.propertyName = check(init.propertyName, 'init.propertyName').isNotEmpty().value;
  priv.oldValue = check(init.oldValue, 'init.oldValue').isNotEmpty().value;
  priv.newValue = check(init.newValue, 'init.newValue').isNotEmpty().value;

  var pub = visitPropertyChange.bind(null, priv);
  pub.constructor = PropertyChange;
  return pub;
}

function visitPropertyChange(priv, visitor) {
  return visitor.visitPropertyChange({
    timestamp: priv.timestamp,
    instance: priv.instance,
    propertyName: priv.propertyName,
    oldValue: priv.oldValue,
    newValue: priv.newValue,
  });
}

function Quirk(init) {
  var priv = this;
  check(init, 'init').isNotEmpty();
  priv.timestamp = check(init.timestamp, 'init.timestamp').isNumber().value;
  return priv;
}

/*
  eslint-env node
 */

/*
  eslint consistent-this: 0
 */

