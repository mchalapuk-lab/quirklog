'use strict';

var timestamp = require('./core/timestamp');
var Visitor = require('./core/visitor');
var Observer = require('./core/observer');
var Bus = require('./core/bus');
var Serializer = require('./core/serializer');

var focusEvents = require('./events/focus');
var loadEvents = require('./events/load');
var viewEvents = require('./events/view');

var events = focusEvents.concat(loadEvents, viewEvents);

var offsetProperties = require('./properties/offset');
var documentProperties = require('./properties/document');
var windowProperties = require('./properties/window');

function observe($wnd) {
  var $doc = $wnd.document;
  var $html = $doc.documentElement;

  var bus = new Bus();
  var observer = new Observer(bus, timestamp);

  observer.observeBrowserEvents($wnd, events);
  observer.observePropertyChanges('window', $wnd, windowProperties);
  observer.observePropertyChanges('document', $doc, documentProperties.concat(offsetProperties));
  observer.observePropertyChanges('html', $html, offsetProperties);

  return bus;
}

var serializer = new Serializer(window);
var bus = observe(window);

bus.subscribe(new Visitor(function(quirk) {
  var serialized = serializer.serialize(quirk);
  console.log(serialized);
}));

/*
  eslint-env node, browser
 */

