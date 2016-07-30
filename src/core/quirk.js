'use strict';

var check = require('./check');

module.exports = {
  BrowserEvent: BrowserEvent,
  PropertyChange: PropertyChange,
};

function BrowserEvent(init) {
  var priv = Quirk.call({}, init);
  priv.event = check(init.event, 'init.event').is.not.Empty();

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
  check(init, 'init').has.property('oldValue').and.has.property('newValue');

  priv.id = check(init.id, 'init.id').is.aString();
  priv.instance = check(init.instance, 'init.instance').is.not.Empty();
  priv.propertyName = check(init.propertyName, 'init.propertyName').is.aString();
  priv.oldValue = init.oldValue;
  priv.newValue = init.newValue;

  var pub = visitPropertyChange.bind(null, priv);
  pub.constructor = PropertyChange;
  return pub;
}

function visitPropertyChange(priv, visitor) {
  return visitor.visitPropertyChange({
    timestamp: priv.timestamp,
    id: priv.id,
    instance: priv.instance,
    propertyName: priv.propertyName,
    oldValue: priv.oldValue,
    newValue: priv.newValue,
  });
}

function Quirk(init) {
  var priv = this;
  check(init, 'init').is.not.Empty();
  priv.timestamp = check(init.timestamp, 'init.timestamp').is.aTimestamp();
  return priv;
}

/*
  eslint-env node
 */

/*
  eslint consistent-this: 0
 */

