<img src="https://ws2.sinaimg.cn/large/006tKfTcgy1fmyvrz607ig308m0fnh98.gif" width="250">

这是豆瓣电影的小项目，主要完成页面显示、搜索功能。

# 参考资料

蓝鸥出品，搜索百度传课，《微信小程序全方位深度解析》、《高级api视频教程》

免费在线视频地址http://edu.manew.com/course/193/learn#lesson/2858

四个页面：推荐电影页、搜索页、详情页、我的页

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
