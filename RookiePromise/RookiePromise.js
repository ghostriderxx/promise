/**
 * A promise must be in one of three states: pending, fulfilled, or rejected.
 */
const STATE_PENDING = "pending";
const STATE_FULFILLED = "fulfilled";
const STATE_REJECTED = "rejected";

function RookiePromise(fn) {

	this._state = STATE_PENDING;
	this._value = undefined;
	this._callbacks = [];
	this._errorbacks = [];


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
			}else if(typeof x == "function" || typeof x == "object"){
				try{
					let then = x.then;

					if(typeof then === "function"){
						then.call(x, (value) => {
							innerResolve(promise, value);
						}, (reason) => {
							this._reject(reason);
						});
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

	resolve = resolve.bind(this, this); // [[Resolve]](promise, x)
	reject = reject.bind(this, this); // [[Reject]](promise, x)

	fn(resolve, reject);
}

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

RookiePromise.prototype.then = function(onFulFilled, onRejected) {
	return new RookiePromise((resolve, reject)=>{
		// 1. Both onFulfilled and onRejected are optional arguments:
		//      i. If onFulfilled is not a function, it must be ignored.
		// 	   ii. If onRejected is not a function, it must be ignored.

		if(typeof onFulFilled == "function"){
			this._callbacks.push(function(value){
				try{
					var value = onFulFilled(value);
					resolve(value);
				}catch(ex){
					reject(ex);
				}
			});
		}else{
			this._callbacks.push(resolve); // 值穿透
		}



		if(typeof onRejected == "function"){
			this._errorbacks.push(function(reason){
				try{
					var value = onRejected(reason);
					resolve(value);
				}catch(ex){
					console.log(ex);
					reject(ex);
				}
			});
		}else{
			this._errorbacks.push(reject); // 值穿透
		}

		if(this._state == STATE_REJECTED){
			this._notify(this._errorbacks, this._value);

			this._errorbacks = [];
			this._callbacks = [];
		}else if(this._state == STATE_FULFILLED){
			this._notify(this._callbacks, this._value);

			this._errorbacks = [];
			this._callbacks = [];
		}

	});
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