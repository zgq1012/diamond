var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    g: 0,
    a: "50",
    sdData: [],
    fabuData: [],
    banners: [
      '../../images/b2.jpg',
      '../../images/b1.jpg',
    ],
    icons: [
      {
        icon: '../../images/i1.png',
        name: '极速秒开',
        url: '../home/list',
      },
      {
        icon: '../../images/i2.png',
        name: '好运pk',
        url: '../home/pk_list',
      },
      {
        icon: '../../images/i3.png',
        name: '热卖爆款',
        url: '../home/u_list',
      },
      {
        icon: '../../images/i5.png',
        name: '最新揭晓',
        url: '../home/kai',
      }
    ],
    indexdata: {},
    nav: 1,
    page: 1,
    animationData: {},
    translate: 0,
    p: 0,
    have:1
  },
  
  /*
   * 生命周期函数--监听页面加载
   */
  g: function () {
    this.setData({
      g: !this.data.g
    })
  },
  

  onLoad: function (options) {

this.setData({
  options:options
})

  },
chushi:function(){
  wx.showLoading({
    title: "玩儿命加载中"
  })

  var token = wx.getStorageSync('user')['token'];
  var that = this;
  var width = wx.getSystemInfoSync().windowWidth;
  that.setData({
    width: width,
    token: token,
    moddel:0
  })
  wx.request({
    url: app.globalData.http + 'Convert/index',
    // url: app.globalData.http +'/Lottery/index',
    data: {
      "token": that.data.token
    },
    header: {},
    method: 'post',
    dataType: 'json',
    responseType: 'text',
    success: function (res) {
      // //console.log(res, "数据")
      if (res.data.code == 200) {
        that.setData({
          indexdata: res.data.data,
          banners: res.data.data.bannerList,
          pageData: res.data.data.pageData.list,
          you_coin: res.data.data.you_coin,
          diamond: res.data.data.diamond,
          have: res.data.data.pageData.paging.nextPage
        })
        app.globalData.diamond = res.data.data.diamond
      }else{
        if (!that.data.al) {
          app.tishi("请稍等", "loading");
          wx.clearStorageSync("user")
          app.login1(that);
          that.setData({
            al: 1,
            list: []
          })
        }
      }
    },
    fail: function (res) { },
    complete: function (res) { wx.hideLoading();
    //console.log("兑换首页返回",res.data)
    },
  })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.login1(this)
    // this.chushi(this.data.options);
    //console.log("每次进入刷新页面")

  },
 

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  navdata: function () {//根据参数请求不同数据
    var that = this;
    var page = that.data.page;
    page++;
    //console.log("请求页数", page)
    that.setData({
      page: page
    })
    wx.request({
      url: app.globalData.http +"Convert/productList ",
      data:{
        page: page,
        token:that.data.token
      },
      header: {},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if(res.data.code==200){
          var arr = that.data.pageData;
          var arr1 = res.data.data.list;
          for (var x = 0; x < arr1.length; x++) {
            arr.push(arr1[x]);
          }
          that.setData({
            pageData: arr,
            page: page,
            have: res.data.data.paging.nextPage
          })
        }else{
          app.tishi("请稍等","loading");
          that.chushi(that.data.options)
        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if(that.data.have){
      that.navdata();//用户点击行为默认从第一页开始

    }else{
      //console.log("没有了")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  dui:function(e){
    var that=this;
    var cha = e.target.dataset.price - app.globalData.diamond;
    if (cha>0){
      that.setData({
        model:1,
        cha:cha
      })
     
    }else{
wx.request({
  url: app.globalData.http +'Convert/toDoConvert',
  data: {
    token:that.data.token,
    sku: e.target.dataset.sku
  },
  header: {},
  method: 'POST',
  dataType: 'json',
  responseType: 'text',
  success: function(res) {
    if(res.data.code==200){
      wx.navigateTo({
        url: 'order?sku=' + e.target.dataset.sku + "&phone=" + res.data.data.phone + "&type=" + e.target.dataset.type,
      })
    }else{
      app.tishi("兑换失败");
      wx.clearStorageSync("user")
      app.login1(that)
    }
  },
  fail: function(res) {},
  complete: function(res) {},
})

    }
  },
  cancel:function(){
    this.setData({
      model:0
    })
  }
})