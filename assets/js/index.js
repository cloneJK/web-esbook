$(function () {
  //获取用户基本信息
  getUserInfo();
  var layer = layui.layer;
  $("#btnLogout").on("click", function () {
    console.log("ok");
    //提示用户是否要登录
    layer.confirm(
      "确定退出登录?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        localStorage.removeItem("token");
        location.href = "/login.html";

        layer.close(index);
      }
    );
  });
});

//获取用户基本信息
function getUserInfo() {
  $.ajax({
    method: "GET",
    url: "/my/userinfo",

    success: function (res) {
      // console.log(res);
      if (res.status !== 0) {
        return layui.layer.msg("获取用户信息失败");
      }
      // layui.layer.msg('获取用户信息成功')
      //渲染用户头像
      rederAvater(res.data);
    },
    //不管成功还是失败都会调用complete
  });
}

function rederAvater(user) {
  //如果用户有nickname就使用不然用username做名称
  var name = user.nickname || user.username;
  //拼接欢迎词
  $("#welcome").html("欢迎 &nbsp;&nbsp;" + name);
  //设置头像 如果有图片头像就显示图片头像让文字头像隐藏
  if (user.user_pic !== null) {
    $(".layui-nav-img").attr("src", user.user_pic).show();
    $(".text-avatar").hide();
  } else {
    //如果有文字头像就隐藏图片头像
    $(".layui-nav-img").attr("src", user.user_pic).hide();
    //取名称第一个字母并作大写
    var first = name[0].toUpperCase();
    $(".text-avatar").html(first).show();
  }
}
