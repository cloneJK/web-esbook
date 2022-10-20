// $.ajaxPrefilter
//每次调用$.ajax()发起请求的函数都会先调用下这个函数
// //在这个函数中就能拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function (options) {

    //再发起真正的ajax请求之前 统一拼接
    options.url = `http://127.0.0.1:3305` + options.url
    console.log(options.url);

    //统一为有权限的接口 设置headers请求头
    //判断 如果请求的地址里面 有my那就是要请求头的 不是 就不用请求头
    if (options.url.indexOf('/my/') !== -1) {

        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    //全家挂载complete
    options.complete=function(res){
        //在complete回调函数里面可以使用res.responseJSON拿到服务器响应回来的数据
        // console.log(res.responseJSON);

        if(res.responseJSON.status===1&&res.responseJSON.message==='身份认证失败！'){
            localStorage.removeItem('token')
            location.href='/login.html'
        }
    }



})


