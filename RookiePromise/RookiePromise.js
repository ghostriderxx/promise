/**
 * A promise must be in one of three states: pending, fulfilled, or rejected.
 */
const STATE_PENDING = "pending";
const STATE_FULFILLED = "fulfilled";
const STATE_REJECTED = "rejected";

function RookiePromise(fn) {

	this._state = STATE_PENDING;
	this._value = undefined;

	function resolve(promise, value){
	}
	function reject(promise, reason){
	}

	resolve = resolve.bind(this, this); // [[Resolve]](promise, x)
	reject = reject.bind(this, this); // [[Reject]](promise, x)

	fn(resolve, reject);

}

RookiePromise.prototype.then = function(onFulFilled, onRejected) {
	// 1. Both onFulfilled and onRejected are optional arguments:
	//      i. If onFulfilled is not a function, it must be ignored.
	// 	   ii. If onRejected is not a function, it must be ignored.

}










RookiePromise.prototype.catch = function(onRejected) {
    return this.then(null, onRejected);
};
RookiePromise.resolve = function(value) {
    return new RookiePromise((resolve, reject) => resolve(value));
};
RookiePromise.reject = function(reason) {
    return new RookiePromise((resolve, reject) => reject(reason));
};
RookiePromise.all = function(values) {
    return new Promise((resolve, reject) => {
    	var result = [], remaining = values.length;
    	function resolveOne(index){
    		return function(value){
    			result[index] = value;
    			remaining--;
    			if(!remaining){
    				resolve(result);
    			}
    		};
    	}
        for (var i = 0; i < values.length; i++) {
            RookiePromise.resolve(values[i]).then(resolveOne(i), reject);
        }
    });
};
RookiePromise.race = function(values) {
    return new Promise((resolve, reject) => {
        for (var i = 0; i < values.length; i++) {
            RookiePromise.resolve(values[i]).then(resolve, reject);
        }
    });
};
module.exports = RookiePromise;