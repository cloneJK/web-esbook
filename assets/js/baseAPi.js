// $.ajaxPrefilter
//每次调用$.ajax()发起请求的函数都会先调用下这个函数
//在这个函数中就能拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options){
    
    //再发起真正的ajax请求之前 统一拼接
    options.url=`http://www.liulongbin.top:3007`+options.url
    console.log(options.url);
})
