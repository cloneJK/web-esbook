$(function () {
  var form = layui.form;
  var layer = layui.layer;
  form.verify({
    nickname: function (value) {
      if (value.length > 6) {
        return "昵称长度必须在1-6个字符之间";
      }
    },
  });

  initUserInfo();

  function initUserInfo() {
    $.ajax({
      method: "GET",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败");
        }
        // console.log(res.data);
        //快速给表单赋值 在form里加一个属性 lay-filter 后面是设一个表单名
        //函数第一个参数 放lay-filter设置的表单名 第二个就是一个对象
        //这样就能直接识别赋值
        form.val("formUserInfo", res.data);
      },
    });
  }

  $("#btnReset").on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });

  //监听表单提交
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      method: "POST",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("更新信息失败");
        }
        layer.msg("更新成功");
        window.parent.getUserInfo()
      },
    });
  });
});
