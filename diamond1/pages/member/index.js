// pages/member/index.js

var app = getApp();


var avatar = '../../icons/user.png';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: avatar,
    columnList: [
      {
        "url": "../member/exchange",
        "iconPath": "../../images/um.jpg",
        "columnName": "宝钻商城兑换记录"
      },

      {
        "url": "../member/d_list",
        "iconPath": "../../images/un.jpg",
        "columnName": "宝钻抽奖记录"
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    this.setData({
      options: options
    })
    
  },
  chushi: function (options) {
    ////console.log(options,"订单")
    wx.showLoading({
      title: "玩儿命加载中"
    })
    var token = wx.getStorageSync('user')['token'];
    var that = this;
    that.setData({
      token: token,
    })
    wx.request({
      url: app.globalData.http + 'UserCenter/index',
      data: {
        token: that.data.token
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code = 200) {
          that.setData({
           data:res.data.data
          })
          app.globalData.diamond = res.data.data.diamond;
        } else {
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
      complete: function (res) { wx.hideLoading()},
    })
  },
  onShow:function(){
    app.login1(this)
    // this.chushi(this.data.options);
    //console.log("每次进入刷新页面")
  }

})