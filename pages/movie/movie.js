var API_URL = "https://api.douban.com/v2/movie/subject"
Page({
  data: {
  
  },
  onLoad:function(params){
    console.log(params);
    var that = this; //保存this的数据
    wx.request({
      url: API_URL+'/'+params.id, 
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          movie: res.data
        })
      }
    })
  }
})