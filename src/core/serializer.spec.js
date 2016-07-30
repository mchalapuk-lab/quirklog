'use strict';

var jsdom = require('jsdom');

var Serializer = require('./serializer');

var window = jsdom.jsdom('<body><div><b>You\'re so bold!</b><div></body>').defaultView;
window.document.evaluate = function() {
  throw new Error('not working very well in jsdom');
};

describe('serializer,', function() {
  var testedSerializer = null;

  beforeEach(function() {
    testedSerializer = new Serializer(window);
  });

  var simpleParams = [
    { type: 'number', value: 0 },
    { type: 'string', value: 'tolarance' },
    { type: 'object', value: { 'for': 'intolerance' } },
    { type: 'undefined', value: undefined },
    { type: 'null', value: null },
  ];

  simpleParams.forEach(function(param) {
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

  var domParams = [
    { name: 'document', value: window.document },
    { name: 'window', value: window },
    { name: '<body> element', value: window.document.body },
    { name: '<b> element', value: window.document.body.firstChild },
  ];

  domParams.forEach(function(param) {
    describe('when serializing an object containing a '+ param.name, function() {
      var expected = null;
      beforeEach(function() {
        expected = { elem: param.value };
      });

      it('deserializes back to an object with the same element', function() {
        var serialized = testedSerializer.serialize(expected);
        var deserialized = testedSerializer.deserialize(serialized);
        expect(deserialized.elem).toBe(expected.elem);
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
  eslint
    no-undefined: 0
    max-nested-callbacks: 0
 */

