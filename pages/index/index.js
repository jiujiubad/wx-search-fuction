var API_URL = 'https://api.douban.com/v2/movie/top250'
Page({
  data: {
    movies: [],
    title: "加载中..",
  },
  onLoad:function(){
    var that = this;
    wx.showToast({ //界面-交互反馈-加载中。。
      title: '加载中...',
      icon:"loading",
      duration:10000
    });
    wx.request({
      url: API_URL, 
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        wx.hideToast(); //界面-交互反馈
        var data = res.data;
        that.setData({
          title: data.title,
          movies: data.subjects
        })
      }
    })
  }
  
})
