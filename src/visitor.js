'use strict';

module.exports = Visitor;

function Visitor() {}

[ 'visitBrowserEvent', 'visitPropertyChange' ].forEach(function(key) {
  Visitor.prototype[key] = noop;
});

function noop() {}

/*
  eslint-env node
 */

