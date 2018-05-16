/**
 * In order to test your promise library, 
 * you must expose a very minimal adapter interface. 
 * These are written as Node.js modules with a few well-known exports:
 *
 *     resolved(value): creates a promise that is resolved with value.
 *     rejected(reason): creates a promise that is already rejected with reason.
 *     deferred(): creates an object consisting of { promise, resolve, reject }:
 *         promise is a promise that is currently in the pending state.
 *         resolve(value) resolves the promise with value.
 *         reject(reason) moves the promise from the pending state to the rejected state, 
 *                        with rejection reason reason.
 *
 * https://github.com/promises-aplus/promises-tests
 */

var RookiePromise = require('./RookiePromise.js');

RookiePromise.resolved = RookiePromise.resolve;
RookiePromise.rejected = RookiePromise.reject;
RookiePromise.deferred = function() {
    let defer = {};
    defer.promise = new RookiePromise((resolve, reject) => {
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}

module.exports = RookiePromise






var dummy = { dummy: "dummy" };
var sentinel = { sentinel: "sentinel" };
var sentinel2 = { sentinel2: "sentinel2" };
var sentinel3 = { sentinel3: "sentinel3" };
var other = { other: "other" };

var outerThenableFactory = function (value) {
    return ;
};

var promise = RookiePromise.resolve(dummy).then(function onBasePromiseFulfilled() {
    return {
        then: function (resolvePromise) {
            resolvePromise({
                then: function (onFulfilled) {
                    onFulfilled({
                        then: function (onFulfilled) {
                            setTimeout(function () {
                                onFulfilled(sentinel);
                            }, 0);
                        }
                    });
                    throw other;
                }
            });
        }
    };
});
promise.then(function onPromiseFulfilled(value) {
    console.log(value===sentinel, value, sentinel);
});






