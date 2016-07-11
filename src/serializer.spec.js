'use strict';

var jsdom = require('jsdom');

var Serializer = require('./serializer');

var window = jsdom.jsdom('<body><div><b>You\'re so bold!</b><div></body>').defaultView;

describe('serializer,', function() {
  var testedSerializer = null;

  beforeEach(function() {
    testedSerializer = new Serializer(window);
  });

  var params = [
    { type: 'number', value: 0 },
    { type: 'string', value: 'tolarance' },
    { type: 'object', value: { 'for': 'intolerance' } },
    { type: 'function', value: function() {} },
    { type: 'undefined', value: undefined },
    { type: 'null', value: null },
  ];

  params.forEach(function(param) {
    describe('when serializing a value of type '+ param.type, function() {
      it('produces a string', function() {
        var serialized = testedSerializer.serialize(param.value);
        expect(serialized).toEqual(jasmine.any(String));
      });
      it('deserializes back to an equal value', function() {
        var serialized = testedSerializer.serialize(param.value);
        var deserialized = testedSerializer.deserialize(serialized);
        expect(deserialized).toEqual(param.value);
      });
    });
  });

  var params = [
    { name: 'document', value: window.document },
    { name: 'window', value: window },
    { name: '<body> element', value: window.document.body },
    { name: '<b> element', value: window.document.body.firstChild },
  ];

  params.forEach(function(param) {
    describe('when serializing an object containing a '+ param.name, function() {
      var expected = null;
      beforeEach(function() {
        expected = { elem: param.value };
      });

      it('produces back to an object with the same element', function() {
        var serialized = testedSerializer.serialize(expected);
        var deserialized = testedSerializer.deserialize(serialized);
        expect(deserialized).toBe(expected);
      });

      describe('from another document', function() {
        var anotherSerializer = null;

        beforeEach(function() {
          anotherSerializer = new Serializer(jsdom.jsdom(window.document.body.outerHTML).defaultView);
        });

        it('throws an error', function() {
          expect(anotherSerializer.serialize.bind(testedSerializer, param))
            .toThrow(new Error('trying to serialize DOM element from another document'));
        });
      });
    });

  });
});

/*
  eslint-env node, jasmine
 */

/*
  eslint no-undefined: 0
 */

/*
  globals createDocument
 */

