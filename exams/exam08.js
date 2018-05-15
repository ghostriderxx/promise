
//
// exam08.js
//
Promise.reject('a').then(()=>{  
    console.log('a passed'); 
}).catch(()=>{  
    console.log('a failed'); 
});  
Promise.reject('b').catch(()=>{  
    console.log('b failed'); 
}).then(()=>{  
    console.log('b passed');
})  
//
// 解释：p.then(fn)、p.catch(fn)中的fn都是异步执行，上述代码可理解为：
//
//       setTimeout(function(){
//             setTimeout(function(){
//                  console.log('a failed'); 
//             });	
//       });
//       setTimeout(function(){
//             console.log('b failed');
//
//             setTimeout(function(){
//                  console.log('b passed'); 
//             });
//       });
//
// 答案：b failed
//       a failed
//       b passed
//