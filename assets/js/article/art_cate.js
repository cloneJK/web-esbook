$(function () {
  //获取文章列表
  var layer = layui.layer;
  var form = layui.form;
  initArtCateList();
  function initArtCateList() {
    $.ajax({
      method: "GET",
      url: "/my/artcate/cates",
      success: function (res) {
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        // console.log(res);
      },
    });
  }
  var indexAdd = null;
  $("#btnAddCate").on("click", function () {
    indexAdd = layer.open({
      type: 1,
      area: ["500px", "300px"],
      title: "添加文章分类",
      content: $("#dialog-add").html(),
    });
  });

  //通过代理形式 为表单绑定提交事件 submit
  //代理到body上面
  $("body").on("submit", "#form-add", function (e) {
    e.preventDefault();
    console.log($(this).serialize());
    $.ajax({
      method: "POST",
      url: "/my/artcate/addcates",
      data: $(this).serialize(),
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.msg);
        }
        initArtCateList();
        layer.msg("新增分类成功");

        layer.close(indexAdd);
      },
    });
  });

  //通过代理形式 为按钮添加点击事件
  var indexEdit = null;

  $("tbody").on("click", "#btn-edit", function () {
    //弹出修改文章分类信息层
    indexEdit = layer.open({
      type: 1,
      area: ["500px", "300px"],
      title: "修改文章分类",
      content: $("#dialog-edit").html(),
    });
    var id = $(this).attr("data-id");

      // console.log(id);
    $.ajax({
      method: "GET",
      url: "/my/artcate/cates/" + id,
      success: function (res) {
        // console.log(res)

        form.val("form-edit", res.data);
      },
    });
  });

  //通过代理的形式为修改分类的表单绑定submit事件
  $("body").on("submit", "#form-edit", function (e) {
    // console.log(1);
    e.preventDefault();
    // console.log( $(this).serialize());
    $.ajax({
      method: "POST",
      url: "/my/artcate/updatecate",
      data: $(this).serialize(),
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg("更新分类失败");
        }
        layer.msg("更新分类成功");
        layer.close(indexEdit);
        initArtCateList();
      },
    });
  });
  //代理的方式 为删除按钮添加点击事件
  $("body").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    layer.confirm(
      "请确认是否要删除?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something
        $.ajax({
          method: "GET",
          url: "/my/artcate/deletecate/" + id,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg("删除分类失败");
            }
            layer.msg("删除分类成功");
            layer.close(index);
            initArtCateList();
          },
        });
      }
    );
  });
});
