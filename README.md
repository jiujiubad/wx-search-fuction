<img src="https://ws2.sinaimg.cn/large/006tKfTcgy1fmyvrz607ig308m0fnh98.gif" width="250">

这是豆瓣电影的小项目，主要完成页面显示、搜索功能。

# 参考资料

蓝鸥出品，搜索百度传课，《微信小程序全方位深度解析》、《高级api视频教程》

免费在线视频地址http://edu.manew.com/course/193/learn#lesson/2858

四个页面：推荐电影页、搜索页、详情页、我的页

可以封装在app.js的组件（因为都是固定写法）：加载中的动画、request请求api、

# 零、初配置

<img src="https://ws4.sinaimg.cn/large/006tKfTcgy1fmyn3z8vozj30d90lbjrh.jpg" width="200">

app.json

```
{
  "pages":[
    "pages/index/index",
    "pages/movie/movie",
    "pages/search/search",
    "pages/profile/profile"
  ],
  "window":{
    "backgroundTextStyle":"light",
    "navigationBarBackgroundColor": "#000",
    "navigationBarTitleText": "豆瓣电影",
    "navigationBarTextStyle":"white"
  },
    "tabBar": {
      "selectedColor": "red",
      "list": [
        {
          "pagePath": "pages/index/index",
          "text": "推荐电影"
        },
        {
          "pagePath": "pages/search/search",
          "text": "搜索"
        },
        {
          "pagePath": "pages/profile/profile",
          "text": "我的"
        }                
      ]
    }
}

```



# 一、推荐页

## 1、加载数据显示加载中，数据加载完成后不显示加载中。

这里先用ES5的写法，你也可以转ES6写法。

1）index.js

```
var API_URL = 'https://api.douban.com/v2/movie/top250'
Page({
  data: {
    movies: []
  },
  onLoad:function(){
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
      }
    })
  }
})
```

- 遇到的bug，请求url时400 (Bad Request)
  - request里的content-type由application/json改成json

## 2、布局

<img src="https://ws3.sinaimg.cn/large/006tKfTcgy1fmyovjy3vnj306409umxj.jpg" width="200">

### 2.1 顶部的view

wxml

```
<view class="page-header"> <!--因为这里样式几个页面一样，所以卸载app.wxss里-->
  <text class='page-header-text'>{{title}}</text>
</view>
```

wxss

```
page{
  font-family: "Microsoft YaHei";
  background: #fff;
  display: flex;
  flex-direction: column;
}

/*index header共用*/
.page-header{
  display: flex;
  justify-content: center;
  border-bottom: 2rpx solid #ccc;
  margin-bottom: 10rpx;
}
.page-header-text{
  padding: 20rpx 40rpx;
  color: #999;
  font-size: 40rpx;
}
```

js

```
  onLoad:function(){
    var that = this; //保存this的数据
    wx.request({
	  ...
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
```

### 2.2 下边内容的view

1）能滚动，所以外边的容器是scroll-view，设置flex:1占满剩余空间，以及display。

2）在容器里，有一个页头导航即标题位置，用navigator。在里面跳转页面和传递列表数组。

3）因为除了推荐页外，搜索页也用到相同的css，所有我把样式写到app.wxss。

- 文字盒子item设置flex:1占满空间

- 要让每行文字独占一行，而不是收尾相连，设置 display: block（搞不懂的话加个background背景颜色就能看清楚了）;

  - ```
    item .title,.item .sub-title{
      display: block;
    }
    ```

index.wxml

```
<scroll-view class='page-body' scroll-y="true">
  <navigator url="../movie/movie" open-type="switchTab" wx:for="{{movies}}" wx:key=""> <!--../返回上一层-->
    <view class='item'>
      <image class="poster" src="{{item.images.small}}"></image>
      <view class="meta">
        <text class="title">{{item.title}}</text>
        <text class="sub-title">{{item.original_title}}({{item.year}})</text>
        <text class="artists">
          <text wx:for="{{item.directors}}" wx:key="">{{item.name}}</text><!--wx:for数组里可以嵌套wx:for数组-->
        </text>
      </view>
      <view class="rating">
        <text>{{item.rating.average}}</text>
      </view>      
    </view>
  </navigator>
</scroll-view>
```

app.wxss

```
/*index body共用*/
.page-body{
  display: flex;
  flex:1;
  flex-direction: column;
}
.item{
  display: flex;
  padding: 20rpx 40rpx;
  border-bottom: 2rpx solid #eee;
}
.item .poster{
  width: 128rpx;
  height: 128rpx;
  margin-right: 20rpx;
}
.item .meta{
  flex:1;
}
.item .title,.item .sub-title{
  display: block;
  margin-bottom: 14rpx;
}
.item .title{
  font-size: 32rpx;
}
.item .sub-title{
  font-size: 22rpx;
  color: #c0c0c0;
}
.item .artists{
  font-size: 26rpx;
  color: #999;
}
.item .rating{
  font-size: 28rpx;
  font-weight: bold;
  color: red;
}
```



# 二、详情页

https://api.douban.com/v2/movie/subject，详情页后面要接一个id（上一节的api即https://api.douban.com/v2/movie/top250可以获取）

> 测试api，在浏览器输入https://api.douban.com/v2/movie/subject/1292063，可以拿到一笔数据。

### 3.1 从api里拿到数据

1）在index页拿到想要传递的id

```
<navigator url="../movie/movie?id={{item.id}}" wx:for="{{movies}}" wx:key="">
```

2）movie.js测试能不能拿到id

```
  onLoad:function(params){
    console.log(params);
  }
```

3）api请求

```
var API_URL = "https://api.douban.com/v2/movie/subject"
Page({
  data: {

  },
  onLoad:function(params){
    console.log(params);
    var that = this;
    wx.request({
      url: API_URL+'/'+params.id,
      header: {
        'content-type': 'json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
      }
    })
  }
})
```

### 3.2 布局结构

<img src="https://ws2.sinaimg.cn/large/006tKfTcgy1fmys3zbcshj30670a0t95.jpg" width="200">

最外层，是一个可以滚动的容器，scroll-view；

上边，包括图片、标题等；

下边，正文；

### 3.3 页面代码

movie.wxml

```
<scroll-view scroll-y="true">
  <view class='meat'>
    <image class='poster' src='{{movie.images.large}}' background-size="cover"></image>
    <text class="title">{{movie.title}}({{movie.year}})</text>
    <text class='info'>评分：{{movie.rating}}</text>
    <text class='info'>导演：<block wx:for="{{movie.directors}}" wx:key="">{{item.name}}</block></text>
    <text class="info">主演：<block wx:for="{{movie.casts}}" wx:key="">{{item.casts}}</block></text>
  </view>
  <view class='summary'>
    <text class="label">摘要：</text>
    <text class='content'>{{movie.summary}}</text>
  </view>
</scroll-view>
```

movie.wxss

```
.meta{
  display: flex;
  flex-direction: column;
  align-content: center;
  height: 1000rpx;
  padding: 50rpx 40rpx;
}
.poster{
  width: 80%;
  height: 500rpx;
  margin: 20rpx;
}
.title{
  font-style: 42rpx;
  color: #444;
}
.info{
  font-size: 18rpx;
  color: #888;
  margin-top: 20rpx;
  width: 80%;
}
.summary{
  width: 80%;
  margin: 30rpx auto;
}
.label {
  display: block;
}
.content{
  color: #666;
  font-size: 20rpx;
  padding: 10rpx;
}
```



# 三、搜索页

用到的api是https://api.douban.com/v2/movie/search，后面接`?q=搜索内容`即接着参数q，q等于搜索的内容。

> 测试api，在浏览器输入`https://api.douban.com/v2/movie/search?q=宫崎骏`，可以拿到一笔数据。

## ！！！所以搜索功能是在后端实现的，做成post的api，小程序只是从这个api里请求到数据然后在wxml里显示出来。

## 1、拆分功能

1）文本输入框

2）拾取光标的时候会触发搜索

3）搜索的时候有loading的动画

## 2、拿到数据

### 2.1 文本输入框

search.wxml

```
<view class="page-header">
  <input class='page-header-text' placeholder='输入搜索关键词' auto-focus bindchange="search"/>
</view>
```

### 2.2 `bindchange="search"`，绑定change事件，当search的值改变的时候触发search。

1）浏览器输入`https://api.douban.com/v2/movie/search?q=宫崎骏`，观察获得的数据，是和推荐页拿到的数据结构一样，所以这里js里的data还是用movies。

2）search的function里，先执行输入值的判断，如果值为空则return返回，如果有值才会执行搜索。

```
var API_URL = 'https://api.douban.com/v2/movie/search'
Page({
  data:{
    movies: []
  },
  search:function(e){
    if(!e.detail.value){
      return;
    }
    wx.showToast({ //加载中的动画效果
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
      }
    })
  }
})
```

3）测试：在微信开发工具里测试搜索“宫崎骏”，cosole里发现成功拿到数组数据。

### 2.3 关闭加载中的动画，并把movies数组由[]改成刚刚拿到的数组数据

1）在search function的success function里加入

```
success: function (res) {
    console.log(res.data)
    wx.hideToast();
    that.setData({
      movies: res.data.subjects
    })
  }
```

## 3、在页面显示数据

<img src="https://ws4.sinaimg.cn/large/006tKfTcgy1fmyucsotwqj305x09r0sy.jpg" width="200">

1）复制index.wxml的scroll-view部分，粘贴到search.wxml。

- 因为index这部分的css是放在app.wxss，所以也不用再改样式，很方便。
- 更重要的是因为结构一样，js里传递数据的数组都是用movies:[]，所以可以显示搜索结果。而wxml里的页面跳转也是传递{{item.id}}，所以也可以进到详情页。

```
<scroll-view class='page-body' scroll-y="true">
  <navigator url="../movie/movie?id={{item.id}}" wx:for="{{movies}}" wx:key=""> <!--../返回上一层-->
    <view class='item'>
      <image class="poster" src="{{item.images.small}}"></image>
      <view class="meta">
        <text class="title">{{item.title}}</text>
        <text class="sub-title">{{item.original_title}}({{item.year}})</text>
        <text class="artists">
          <text wx:for="{{item.directors}}" wx:key="">{{item.name}}</text><!--wx:for数组里可以嵌套wx:for数组-->
        </text>
      </view>
      <view class="rating">
        <text>{{item.rating.average}}</text>
      </view>      
    </view>
  </navigator>
</scroll-view>
```



# 四、99对本教程页面套路总结

基本流程都是这样的，如果复杂一点可能就是对应的接口多一点。

## 1、先在php、rails等后端做好相关功能的api。

1）比如搜索要做成post的api、首页显示则做get的api；

## 2、在浏览器输入api，看能不能拿到一笔与本页面相关的数据。

1）如果拿不到还是先去把api做好。

## 3、拆分功能。

1）一般可以归为两类（①拿到数据、②显示数据）。

## 4、拿到数据。

1）具体是在wxml绑定事件、或跳转页面传递参数，然后在js里发起request请求。

## 5、显示数据。

1）wxml和wxss页面，一开始可以总览全局，看哪些页面结构相同可以把css放在app.wxss共用。

2）写页面的顺序是：先骨架布局wxml、再穿衣服wxss、最后才考虑js动画

3）如下图，一个框起来的模块就写一个view，里边可以夹杂各种image、text，分别设置class

```
  <view class='summary'>
  	<image class='poster' src='{{movie.images.large}}' background-size="cover"></image>
    <text class="label">摘要：</text>
    <text class='content'>{{movie.summary}}</text>
  </view>
```



<img src="https://ws1.sinaimg.cn/large/006tKfTcgy1fmyvbphsooj308n04tq2w.jpg" width="250">
