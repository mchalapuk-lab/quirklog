'use strict';

module.exports = function(value, name) {
  return check(value, check(name, 'name').isString().value);
};

function check(value, name) {
  var pub = {};
  pub.value = value;
  pub.name = name;
  pub.constructor = check;
  Object.setPrototypeOf(pub, check.prototype);
  return pub;
}

check.prototype = {
  isNotEmpty: function() {
    if (!this.value) {
      throw new Error(this.name +'is required: '+ this.value);
    }
    return this;
  },
  isNumber: function() {
    if (typeof this.value !== 'number') {
      throw new Error(this.name +' must be a number; got '+ this.value);
    }
    return this;
  },
  isString: function() {
    if (typeof this.value !== 'string') {
      throw new Error(this.name +' must be a string; got '+ this.value);
    }
    return this;
  },
  isFunction: function() {
    if (typeof this.value !== 'function') {
      throw new Error(this.name +' must be a function; got '+ this.value);
    }
    return this;
  },
  isArray: function() {
    if (!(this.value instanceof Array)) {
      throw new Error(this.name +' must be an array; got '+ this.value);
    }
    Object.setPrototypeOf(this, arrayCheck.prototype);
    return this;
  },
  isInstanceOf: function(Type) {
    check(Type).isNotEmpty().isFunction();
    if (!(this.value instanceof Type)) {
      throw new Error(this.name +' must be instance of '+ Type.name +'; got '+ this.value);
    }
    return this;
  },
};

function arrayCheck() {}

arrayCheck.prototype = {
  ofLength: function(requiredLength) {
    check(requiredLength, 'requiredLength').isNumber();
    if (this.value.length !== requiredLength) {
      throw new Error(this.name +'.length must be '+ requiredLength +'; got '+ this.value.length);
    }
    return this;
  },
  containingNumbers: function() {
    return this.containing('numbers', function(val) { return typeof val === 'number'; });
  },
  containing: function(filterName, filter) {
    check(filterName, 'name').isString();
    check(filter, 'filter').isFunction();
    var errors = [];
    this.value.forEach(function(val, i) {
      if (!filter(val)) {
        errors.push(i);
      }
    });
    if (errors.length) {
      var value = this.value;
      function buildString(string, index) { return string + ', '+ index +':'+ value[index]; }
      var errValStr = errors.reduce(buildString, '').substr(1);
      throw new Error(this.name +' must contain only '+ filterName +'; got {'+ errValStr +'}');
    }
    return this;
  },
};

Object.setPrototypeOf(arrayCheck.prototype, check.prototype);

/*
  eslint-env node
 */
