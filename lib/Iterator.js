var inherits = require('util').inherits;
var Iterator = require('min-iterator');
 
function ArrayIterator (a) {
  this._a = a;
  this._i = 0;
}
inherits(ArrayIterator, Iterator);
 
ArrayIterator.prototype.next = function () {
  return this._i < this._a.length ? this._a[this._i++] : undefined;
};
module.exports = ArrayIterator;

//while ((v = it.next()) !== undefined) {
//  console.log(v);
//}
