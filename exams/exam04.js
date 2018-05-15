//
// exam04.js
//
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log);
//
// 解释：p.then、.catch的入参应该是函数，传入非函数则会发生值穿透；
// 
// 答案：1
//