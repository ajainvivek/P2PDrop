import Ember from 'ember';

const {
  Mixin
} = Ember;

export default Mixin.create({
  prettyBytes : function (num) {
  	if (typeof num !== 'number') {
  		throw new TypeError('Expected a number, got ' + typeof num);
  	}

  	var exponent;
  	var unit;
  	var neg = num < 0;
  	var units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  	if (neg) {
  		num = -num;
  	}

  	if (num < 1) {
  		return (neg ? '-' : '') + num + ' B';
  	}

  	exponent = Math.min(Math.floor(Math.log(num) / Math.log(1000)), units.length - 1);
  	num = Number((num / Math.pow(1000, exponent)).toFixed(2));
  	unit = units[exponent];

  	return (neg ? '-' : '') + num + ' ' + unit;
  }
});
