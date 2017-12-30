var API_URL = 'https://api.douban.com/v2/movie/search'
Page({
  data:{
    movies: []
  },
  search:function(e){
    if(!e.detail.value){
      return;
    }
    wx.showToast({
      title:"加载中..",
      icon:"loading",
      duration:10000
    });
    var that = this; //保存this的数据
    wx.request({
      url: API_URL + "?q=" + e.detail.value,
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        wx.hideToast();
        that.setData({
          movies: res.data.subjects 
        })
      }
    })
  }
})