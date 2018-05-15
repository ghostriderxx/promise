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

var RookiePromiseTestAdapter = require('./RookiePromise.js');

RookiePromiseTestAdapter.deferred = function() {
    let defer = {};
    new Promise((resolve, reject) => {
    	defer.promise = this;
        defer.resolve = resolve;
        defer.reject = reject;
    });
    return defer;
}

module.exports = RookiePromiseTestAdapter