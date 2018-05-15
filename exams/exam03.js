//
// exam03.js
//
console.log(1);
new Promise(function (resolve, reject){
    reject();
    resolve();
}).then(function(){
    console.log(2);
}, function(){
    console.log(3);
});
console.log(4);
//
// 解析：Promise状态的一旦变成resolved或rejected，
//       Promise的状态和值就固定下来了，
//       不论你后续再怎么调用resolve或reject方法，
//       都不能改变它的状态和值。
// 
// 答案：1 4 3
//