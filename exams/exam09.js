//
// exam09.js
//
var p = new Promise(function(resolve, reject) {
    resolve("ok");
    throw new Error('error');
});
p.then(function(value){
	console.log(value); 
}).catch(function(err){
	console.log(err);
});
process.on('unhandledRejection', function (err, p) { 
	console.error('catch exception:',err.stack) 
});
//
// 解释：1. resolve("ok")后，Promise的状态已确定为resolve状态，无法更改，
//          后面抛出的异常不会使Promise的状态变化，并且异常会被吞掉；
//       2. unhandledRejection事件是在本轮事件循环结束时，
//          存在未捕获的reject错误时触发；
//
// 答案：ok
//