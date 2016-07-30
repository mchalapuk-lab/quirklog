'use strict';

var Quirk = require('./quirk');
var Visitor = require('./visitor');

var WSON = require('wson');
var domConnectors = require('wson-dom-connector');
var eventConnectors = require('wson-event-connector');
var _ = require('underscore');

module.exports = Serializer;

var quirkConnectors = {
  'BrowserEvent': new BrowserEventConnector(),
  'PropertyChange': new PropertyChangeConnector(),
};

function Serializer(window) {
  var priv = {};
  priv.wson = new WSON({
    connectors: _.extend({}, domConnectors(window), eventConnectors(window), quirkConnectors),
  });

  var pub = {};
  pub.serialize = serialize.bind(pub, priv);
  pub.deserialize = deserialize.bind(pub, priv);
  Object.setPrototypeOf(pub, Serializer.prototype);
  pub.constructor = Serializer;
  return pub;
}

function serialize(priv, object) {
  try {
    var string = priv.wson.stringify(object);
    return string;
  } catch (e) {
    if (e instanceof Error && e.message === 'The supplied node is not contained by the root node.') {
      throw new Error('trying to serialize DOM element from another document', e);
    }
    throw e;
  }
}

function deserialize(priv, string) {
  var object = priv.wson.parse(string);
  return object;
}

function BrowserEventConnector() {
  return new QuirkConnector(Quirk.BrowserEvent, 'visitBrowserEvent', [
    'timestamp', 'event',
  ]);
}

function PropertyChangeConnector() {
  return new QuirkConnector(Quirk.PropertyChange, 'visitPropertyChange', [
    'timestamp', 'id', 'oldValue', 'newValue',
  ]);
}

function QuirkConnector(Class, visitMethod, properties) {
  var visitor = new Visitor();
  visitor[visitMethod] = returnValues;

  function returnValues(valueMap) {
    return properties.map(function(key) { return valueMap[key]; });
  }
  function split(quirk) {
    return quirk.applyVisitor(visitor);
  }
  function create(values) {
    var init = {};
    properties.forEach(function(key, i) {
      init[key] = values[i];
    });
    return new Class(init);
  }

  return {
    by: Class,
    split: split,
    create: create,
  };
}

/*
  eslint-env node
 */

