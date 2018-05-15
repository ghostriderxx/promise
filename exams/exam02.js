//
// exam02.js
//
new Promise(resolve => { // p1
    resolve(1);
    
    // p2
    Promise.resolve().then(() => {
    	console.log(2); // t1
    });

    console.log(4)
}).then(t => {
	console.log(t); // t2
});

console.log(3);
//
// 解析：
// 1. new Promise(fn), fn 立即执行，所以先输出 4；
// 2. p1和p2的Promise在执行then之前都已处于resolve状态，
//    故按照then执行的先后顺序，将t1、t2放入microTask中等待执行；
// 3. 完成执行console.log(3)后，macroTask执行结束，然后microTask
//    中的任务t1、t2依次执行，所以输出3、2、1；
// 
// 答案：
// 4 3 2 1
//