$(function () {
  //获取文章列表
  var layer = layui.layer;
  var form = layui.form;
  var laypage = layui.laypage;
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date);

    var y = dt.getFullYear();
    var m = padZero(dt.getMonth() + 1);
    var d = padZero(dt.getDate());

    var hh = padZero(dt.getHours());
    var mm = padZero(dt.getMinutes());
    var ss = padZero(dt.getSeconds());

    return y + "-" + m + "-" + d + " " + hh + ":" + mm + ":" + ss;
  };

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : "0" + n;
  }

  //定义一个查询的参数对象,将来请求数据的时候 将参数提交到服务器
  var q = {
    pagenum: 1,
    pagesize: 2,
    // cate_id: "",
    // state: "",
  };
  //获取文章列表数据
  initTable();
  initCate();
  function initTable() {
    $.ajax({
      method: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.msg);
        }
        //模板引擎渲染页面数据
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total);
      },
    });
  }

  //初始化文章分类方法
  function initCate() {
    $.ajax({
      method: "GET",
      url: "/my/artcate/cates",
      success: function (res) {
        // console.log(res);
        if (res.status !== 0) {
          return layer.msg(res.msg);
        }
        //调用模板引擎渲染分类可选项
        var htmlStr = template("tpl-cate", res);
        $("[name=cate_id]").html(htmlStr);
        // console.log(htmlStr);
        form.render();
      },
    });
  }
  //
  $("#form-search").on("submit", function (e) {
    e.preventDefault();
    //获取表单中选中的值
    var cate_id = $("[name=cate_id]").val();
    var state = $("[name=state]").val();
    // console.log(state);

    //因为是本地数据库 没有办法实现线上状态问题
    //这里对表单选中的数据做了处理 这样 那个有值就筛选那个 全没有值的就直接全部暴漏出来
    //这里加了个判断 如果cate_id里面有值，那就把值赋给q对象里面的cate_id
    //如果没有的话 那就删除掉q对象里面的cate_id
    if (cate_id) {
      q.cate_id = cate_id;
    } else {
      delete q.cate_id;
    }
    //这里加了个判断 如果state里面有值，那就把值赋给q对象里面的state
    //如果没有的话 那就删除掉q对象里面的state
    if (state) {
      q.state = state;
    } else {
      delete q.state;
    }

    //根据最新的筛选条件 重新渲染表格数据

    initTable();
  });
  //渲染分页
  function renderPage(total) {
    // console.log(total);

    //执行一个laypage实例
    laypage.render({
      elem: "pageBox", //注意，这里的 test1 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      limit: q.pagesize,
      layout: ["count", "limit", "prev", "page", "next", "skip"], //每页显示几条数据
      limits: [2, 3, 4, 10],
      curr: q.pagenum, //默认被选中的分页
      jump: function (obj, first) {
        //把最新的页码值赋给q里面的查询对象
        q.pagenum = obj.curr; //得到当前页，以便向服务端请求对应页的数据。
        // initTable()
        q.pagesize = obj.limit;
        if (!first) {
          initTable();
        }
      },
    });
  }

  //通过代理为删除按钮绑定点击事件
  $("tbody").on("click", ".btn-delete", function () {
    var id = $(this).attr("data-id");
    var len = $(".btn-delete").length;
    // console.log(len);
    layer.confirm(
      "是否确认删除?",
      { icon: 3, title: "提示" },
      function (index) {
        //do something

        console.log(id);
        $.ajax({
          method: "GET",
          url: `/my/article/delete/${id}`,
          success: function (res) {
            if (res.status !== 0) {
              return layer.msg(res.msg);
            }
            layer.msg(res.msg);
            //当数据删除完成时 需要判断当前这一页中 是否还有剩余数据
            //如果没有剩余数据 让页码值-1
            if (len === 1) {
              //len如果值等于1 证明删除直呼页面上没有数据
              //页码值自小必须是1
              q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
            }
            initTable();
          },
        });
        //关闭弹出层并提出提醒
        layer.close(index);
      }
    );
  });
});
