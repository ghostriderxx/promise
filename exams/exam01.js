//
// exam01.js
//
setTimeout(function(){
    console.log(1);
}, 0)

new Promise(function(resolve){
    console.log(2);
    resolve();
    console.log(3);
}).then(function(){
    console.log(4);
})

console.log(5);
//
// 解析：
// 1. new Promise(fn)后，函数fn会立即执行；
// 2. fn在执行过程中，由于调用了resolve，使得Promise立即转换为resolve状态，
//    这也促使p.then(fn)中的函数fn被立即放入microTask队列中，因此fn将会在
//    本轮事件循环的结束时执行，而不是下一轮事件循环的开始时执行；
// 3. setTimeout属于macroTask，是在下一轮事件循环中执行；
// 
// 答案：
// 2 3 5 4 1
//