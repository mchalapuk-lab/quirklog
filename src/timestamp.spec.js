'use strict';

var timestamp = require('./timestamp');

describe('timestamp,', function() {
  it('returns timestamp', function() {
    var stamp = timestamp();
    expect(stamp.length).toBe(2);
    expect(stamp[0]).toEqual(jasmine.any(Number));
    expect(stamp[1]).toEqual(jasmine.any(Number));
  });
});

/*
  eslint-env node, jasmine
 */
