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
  isInstanceOf: function(Type) {
    check(Type).isNotEmpty().isFunction();
    if (!(this.value instanceof Type)) {
      throw new Error(this.name +' must be instance of '+ Type.name +'; got '+ this.value);
    }
    return this;
  },
};

/*
  eslint-env node
 */
