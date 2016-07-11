'use strict';

var WSON = require('wson');
var domConnectors = require('wson-dom-connector');
var eventConnectors = require('wson-event-connector');
var _ = require('underscore');

module.exports = Serializer;

function Serializer(window) {
  var priv = {};
  priv.wson = new WSON({
    connectors: _.extend(domConnectors(window), eventConnectors(window)),
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

/*
  eslint-env node
 */

