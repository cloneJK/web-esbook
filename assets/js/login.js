$(function () {
  //点击去注册的链接的时候 让登录页隐藏，注册页显示
  $("#link_reg").on("click", function () {
    $(".login-box").hide();
    $(".reg-box").show();
  });
  //相反
  $("#link_login").on("click", function () {
    $(".reg-box").hide();
    $(".login-box").show();
  });

  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    // 自定义一个叫做pwd的校验规则 第一个是规则 第二个是不满足规则透出的内容
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //   校验两次密码是否一致
    repwd: function (value) {
      //拿到输入的密码和再次输入的密码进行比对 失败提示出来
      var pwd = $(".reg-box [name=password]").val();
      if (pwd !== value) {
        return "两次密码不一致";
      }
    },
  });

  //http://www.liulongbin.top:3007

  // 注册提交事件
  $("#form_reg").on("submit", function (e) {
    // console.log(e);
    // 阻拦表单默认提交行为
    e.preventDefault();
    var data = {
      username: $("#form_reg [name=username]").val(),
      password: $("#form_reg [name=password]").val(),
    };
    $.post("/api/reguser", data, function (res) {
      console.log(res);
      if (res.status !== 0) {
        // return console.log(res.message)
        return layer.msg(res.message);
      }
      layer.msg("注册成功 请登录");

      $("#link_login").click();
    });
  });

  // 登录提交事件
  //qqwer123  123456
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Mjk0NjcsInVzZXJuYW1lIjoicXF3ZXIxMjMiLCJwYXNzd29yZCI6IiIsIm5pY2tuYW1lIjoiIiwiZW1haWwiOiIiLCJ1c2VyX3BpYyI6IiIsImlhdCI6MTY2NTk3MDY3NiwiZXhwIjoxNjY2MDA2Njc2fQ.6UB7jOCSp8c4F2dGFu5y1LkZF4H059EORQUcD_HYSXA
  $("#form_login").submit(function (e) {
    e.preventDefault();
    $.ajax({
      url: "/api/login",
      method: "POST",
      data: $(this).serialize(),
      success: function (res) {
        console.log(res);
        if (res.status !== 0) {
          return layer.msg("登录失败");
        }
        layer.msg("登录成功");
        console.log(res.token);
        localStorage.setItem("token", res.token);
        location.href = "/index.html";
      },
    });
  });
});
