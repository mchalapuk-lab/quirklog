'use strict';

var timestamp = require('./core/timestamp');
var Visitor = require('./core/visitor');
var Observer = require('./core/observer');
var Bus = require('./core/bus');
var Serializer = require('./core/serializer');

var focusEvents = require('./events/focus');
var loadEvents = require('./events/load');
var viewEvents = require('./events/view');
var transitionEvents = require('./events/transition');

var events = focusEvents.concat(loadEvents, viewEvents, transitionEvents);

var offsetProperties = require('./properties/offset');
var documentProperties = require('./properties/document');
var windowProperties = require('./properties/window');
var renderProperties = require('./properties/render');

function observe($wnd) {
  var $doc = $wnd.document;
  var $html = $doc.documentElement;

  var bus = new Bus();
  var observer = new Observer(bus, timestamp);
  var serializer = new Serializer($wnd);

  bus.subscribe(new Visitor(function(quirk) {
    var serialized = serializer.serialize(quirk);
    console.log(serialized);
  }));

  observer.observeBrowserEvents($wnd, events);
  observer.observePropertyChanges('window', $wnd, windowProperties.concat(renderProperties), true);
  observer.observePropertyChanges('document', $doc, documentProperties, true);
  observer.observePropertyChanges('html', $html, offsetProperties, true);

  $wnd.addEventListener('load', function() {
    $doc.body.className = 'visible';
    observer.observeBrowserEvents($doc.body, events);
    observer.observePropertyChanges('body', $doc.body, offsetProperties, true);
  });

  $wnd.setInterval(observer.tick, 10);
}

observe(window);

/*
  eslint-env node, browser
 */

