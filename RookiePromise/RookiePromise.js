/**
 * 2.1. Promise States
 *      A promise must be in one of three states: 
 *      pending, fulfilled, or rejected.
 */
const STATE_PENDING = "pending";
const STATE_FULFILLED = "fulfilled";
const STATE_REJECTED = "rejected";

function RookiePromise(fn) {
	this._state = STATE_PENDING;
	this._value = undefined;
	this._callbacks = [];
	this._errorbacks = [];

	/**
	 * 2.3. The Promise Resolution Procedure
	 *      The promise resolution procedure is an abstract operation 
	 *      taking as input a promise and a value, which we denote as 
	 *      [[Resolve]](promise, x)
	 */
	var executed = false;
	function resolve(promise, x){
		// 保证resolve、reject接口最多只被执行一次
		if(executed){
			return;
		}
		executed = true;

		var innerResolve = (promise, x) => {
			if(promise === x){
				this._reject(new TypeError("出错了, promise === x, 会造成死循环!"));
			}else if(x instanceof RookiePromise){
				if(x._state == STATE_PENDING){
					x.then((value) => {
						innerResolve(promise, value);
					}, (reason) => {
						this._reject(reason);
					});
				}else if(x._state == STATE_FULFILLED){
					this._fulfill(x._value);
				}else if(x._state == STATE_REJECTED){
					this._reject(x._value);
				}
			}else if(x && (typeof x == "function" || typeof x == "object")){
				try{
					let then = x.then;

					if(typeof then === "function"){ //thenable
						var executed = false;
						try{
							then.call(x, (value) => {
								if(executed){
									return;
								}	
								executed = true;
								innerResolve(promise, value);
							}, (reason) => {
								if(executed){
									return;
								}	
								executed = true;
								this._reject(reason);
							});
						}catch(e){
							if(executed){
								return;
							}
							throw e;
						}
					}else{
						this._fulfill(x);
					}
				}catch(ex){
					this._reject(ex);
				}
			}else{
				this._fulfill(x);
			}
		};
		innerResolve(promise, x)
	}
	
	function reject(promise, reason){
		this._reject(reason);
	}

	resolve = resolve.bind(this, this); // 通过bind模拟规范中的 [[Resolve]](promise, x) 行为
	reject = reject.bind(this, this);

	fn(resolve, reject); // new RookiePromise((resolve, reject) => { ... })
}

/**
 * 2.1. Promise States
 *
 * A promise must be in one of three states: pending, fulfilled, or rejected.
 *
 * 2.1.1. When pending, a promise:
 *      2.1.1.1 may transition to either the fulfilled or rejected state.
 * 2.1.2. When fulfilled, a promise:
 *      2.1.2.1 must not transition to any other state.
 *      2.1.2.2 must have a value, which must not change.
 * 2.1.3. When rejected, a promise:
 *      2.1.3.1 must not transition to any other state.
 *      2.1.3.2 must have a reason, which must not change.
 *
 * Here, “must not change” means immutable identity (i.e. ===), 
 * but does not imply deep immutability.
 */
RookiePromise.prototype._fulfill = function(value) {
	if(this._state == STATE_PENDING){
		this._state = STATE_FULFILLED;
		this._value = value;

		this._notify(this._callbacks, this._value);

		this._errorbacks = [];
		this._callbacks = [];
	}
}
RookiePromise.prototype._reject = function(reason) {
	if(this._state == STATE_PENDING){
		this._state = STATE_REJECTED;
		this._value = reason;

		this._notify(this._errorbacks, this._value);

		this._errorbacks = [];
		this._callbacks = [];
	}
}
RookiePromise.prototype._notify = function(fns, param) {
	setTimeout(()=>{
		for(var i=0; i<fns.length; i++){
			fns[i](param);
		}
	}, 0);
}

/**
 * 2.2. The then Method
 *      A promise’s then method accepts two arguments:
 *           promise.then(onFulfilled, onRejected)
 */
RookiePromise.prototype.then = function(onFulFilled, onRejected) {
	// 2.2.7. then must return a promise [3.3].
	//            promise2 = promise1.then(onFulFilled, onRejected);
	//
	return new RookiePromise((resolve, reject)=>{
		// 2.2.1. Both onFulfilled and onRejected are optional arguments:
		//      2.2.1.1. If onFulfilled is not a function, it must be ignored.
		//      2.2.1.2. If onRejected is not a function, it must be ignored.
		if(typeof onFulFilled == "function"){
			this._callbacks.push(function(value){
				try{
					// 2.2.5. onFulfilled and onRejected must be called as functions (i.e. with no this value)
					var value = onFulFilled(value);
					resolve(value);
				}catch(ex){
					// 2.2.7.2. If either onFulfilled or onRejected throws an exception e, 
					//          promise2 must be rejected with e as the reason.
					reject(ex);
				}
			});
		}else{
			// 2.2.7.3. If onFulfilled is not a function and promise1 is fulfilled, 
			//          promise2 must be fulfilled with the same value as promise1.
			this._callbacks.push(resolve); // 值穿透
		}

		if(typeof onRejected == "function"){
			this._errorbacks.push(function(reason){
				try{
					// 2.2.5. onFulfilled and onRejected must be called as functions (i.e. with no this value)
					var value = onRejected(reason);
					resolve(value);
				}catch(ex){
					// 2.2.7.2. If either onFulfilled or onRejected throws an exception e, 
					//          promise2 must be rejected with e as the reason.
					reject(ex);
				}
			});
		}else{
			// 2.2.7.4. If onRejected is not a function and promise1 is rejected, 
			//          promise2 must be rejected with the same reason as promise1.
			this._errorbacks.push(reject); // 值穿透
		}

		// 2.2.6. then may be called multiple times on the same promise.
		//      2.2.6.1. If/when promise is fulfilled, all respective onFulfilled callbacks must 
		//               execute in the order of their originating calls to then.
		//      2.2.6.2. If/when promise is rejected, all respective onRejected callbacks must 
		//               execute in the order of their originating calls to then.
		if(this._state == STATE_REJECTED){
			// 2.2.4. onFulfilled or onRejected must not be called until the 
			//        execution context stack contains only platform code.
			this._notify(this._errorbacks, this._value);
			this._errorbacks = [];
			this._callbacks = [];
		}else if(this._state == STATE_FULFILLED){
			// 2.2.4. onFulfilled or onRejected must not be called until the 
			//        execution context stack contains only platform code.
			this._notify(this._callbacks, this._value);
			this._errorbacks = [];
			this._callbacks = [];
		}
	});
};

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