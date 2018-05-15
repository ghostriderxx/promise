function RookiePromise(fn) {}

RookiePromise.prototype.then = function(onFulFilled, onRejected) {}

RookiePromise.prototype.catch = function(onRejected) {}

RookiePromise.resolve = function(value) {}

RookiePromise.reject = function(reason) {}

RookiePromise.all = function(values) {};

RookiePromise.race = function(values) {};

module.exports = RookiePromise;