//
// exam05.js
//
Promise.resolve()
  .then(
  	value => { throw new Error('error'); }, 
  	reason => { console.error('fail1:', reason); }
  )
  .catch(
  	reason => { console.error('fail2:', reason); }
  );
//
// 解释：.then可以接收两个参数：.then(onResolved, onRejected)
//       .catch是.then的语法糖：.then(onRejected) ==> .then(null, onRejected)
// 
// 答案：fail2: Error: error
//       at .....
//       at .....