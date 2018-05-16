//
// exam07.js
//
Promise.resolve()
	.then( () => {
		return new Error('error!')
	})
	.then( res => {
		console.log('then: ', res)
	})
	.catch( err => {
		console.log('catch: ', err)
	});
//
// 解析：在 .then 或 .catch 中 return 一个 error 对象并不会抛出错误，
//       所以不会被后续的 .catch 捕获；
//
// 答案：then:  Error: error!
//          at ...
//          at ...
//