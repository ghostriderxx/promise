//
// exam06.js
//
Promise.resolve(1)
	.then((res) => {
		console.log(res);
		return 2;
	})
	.catch((res) => {
		console.log(res);
		return 3;
	})
	.then((res) => {
		console.log(res);
	});
// 
// 解析：每次调用p.then或p.catch都会返回一个新的promise，
//       从而实现了链式调用；第一个.then中未抛出异常，
//       所以不会被.catch语句捕获，会正常进入第二个.then执行；
//
// 答案：1 2
//