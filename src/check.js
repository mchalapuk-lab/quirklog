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
    if (typeof this.value === 'undefined' || this.value === null) {
      throw new Error(this.name +' is required; got '+ this.value);
    }
    return this;
  },
  isNumber: function() {
    return isOfType(this, 'number');
  },
  isString: function() {
    return isOfType(this, 'string');
  },
  isFunction: function() {
    return isOfType(this, 'function');
  },
  isObject: function() {
    return isOfType(this, 'object');
  },
  isUndefined: function() {
    return isOfType(this, 'undefined');
  },
  isArray: function() {
    if (Object.prototype.toString.call(this.value) !== '[object Array]') {
      throw new Error(this.name +' must be an array; got '+ this.value);
    }
    Object.setPrototypeOf(this, arrayCheck.prototype);
    return this;
  },
};

function isOfType(checkObj, type) {
  if (typeof checkObj.value !== type) {
    var article = 'aeiou'.indexOf(type[0]) === -1? 'a': 'an';
    throw new Error(checkObj.name +' must be '+ article +' '+ type +'; got '+ checkObj.value);
  }
  return checkObj;
}

function arrayCheck() {}

arrayCheck.prototype = {
  ofLength: function(requiredLength) {
    if (this.value.length !== check(requiredLength, 'requiredLength').isNumber().value) {
      throw new Error(this.name +'.length must be '+ requiredLength +'; got '+ this.value.length);
    }
    return this;
  },
  ofLengthGreaterThan: function(length) {
    if (this.value.length <= check(length, 'length').isNumber().value) {
      throw new Error(this.name +'.length must be > '+ length +'; got '+ this.value.length);
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
      var errValStr = errors.reduce(buildString, '').substr(2);
      throw new Error(this.name +' must contain only '+ filterName +'; got { '+ errValStr +' }');
    }
    return this;
  },
};

Object.setPrototypeOf(arrayCheck.prototype, check.prototype);

/*
  eslint-env node
 */
