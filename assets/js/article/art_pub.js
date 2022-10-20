$(function () {
  var layer = layui.layer;
  var form = layui.form;
  initCate();
  //初始化富文本编辑器
  initEditor();
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/artcate/cates",
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.msg);
        }
        //调用成功 渲染分类下拉菜单

        var htmlStr = template("tpl-cate", res);
        // console.log(htmlStr);
        $("[name=cate_id]").html(htmlStr);
        form.render();
      },
    });
  }
  //实现基本裁剪效果：
  // 1. 初始化图片裁剪器
  var $image = $("#image");

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: ".img-preview",
  };

  // 3. 初始化裁剪区域
  $image.cropper(options);

  //更换裁剪的图片;
  //拿到用户选择的文件

  $("#btnChooseImage").on("click", function () {
    $("#coverFile").click();
  });

  //监听coverFile的change事件 获取用户选中文件列表
  $("#coverFile").on("change", function (e) {
    //获取到文件的列表数组
    var files = e.target.files;
    if (files.length === 0) {
      return;
    }
    //根据选择的文件，创建一个对应的 URL 地址
    var newImgURL = URL.createObjectURL(files[0]);
    //先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
    $image
      .cropper("destroy") // 销毁旧的裁剪区域
      .attr("src", newImgURL) // 重新设置图片路径
      .cropper(options); // 重新初始化裁剪区域
  });

  //默认文章的发布状态
  var art_state = "已发布";
  //为提交草稿添加点击事件
  $("#btnSave2").on("click", function () {
    art_state = "草稿";
  });
 
  //表单submit事件
  $("#form-pub").on("submit", function (e) {
    e.preventDefault();
    //基于form表单 创建FormDate
    var fd = new FormData($(this)[0]);
    fd.append("state", art_state);

    //将封面裁剪后的图片 输出为文件对象
    $image
      .cropper("getCroppedCanvas", {
        // 创建一个 Canvas 画布
        width: 400,
        height: 280,
      })
      .toBlob(function (blob) {
        // 将 Canvas 画布上的内容，转化为文件对象
        // 得到文件对象后，进行后续的操作
        //将文件对象存入FormData
        console.log(blob);
        fd.append("cover_img", blob);
        //发起ajax请求
        publishArticle(fd);
      });
  });

  function publishArticle(fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      //注意如果向服务器提交是formdata格式数据
      //必须增加下面两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg(res, msg);
        }
        layer.msg(res.msg);
        location.href = "/article/art_list.html";
      },
    });
  }
});
