// pages/member/m_info.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
    })
    app.login1(this)
  },
  chushi: function (options) {
    ////console.log(options,"订单")
    wx.showLoading({
      title:"玩儿命加载中"
    })
    var token = wx.getStorageSync('user')['token'];
    var that = this;
    that.setData({
      token: token,
    })
    var data={
      token: that.data.token,
      ordercd: options.order_cd
    }
    //console.log("兑换详情发送",data)
    wx.request({
      url: app.globalData.http + 'UserCenter/getConvertOrderDetail ',
      data: {
        token: that.data.token,
        ordercd: options.order_cd
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code = 200) {
          
          that.setData({
            product: res.data.data.product,
            address: res.data.data.addr,
            order: res.data.data.orderInfo,
            shipInfo: res.data.data.shipInfo||'',
            voucher: res.data.data.voucher||''
          })

        } else {
          if (!that.data.al) {
            app.tishi("请稍等", "loading");
            wx.clearStorageSync("user")
            app.login1(that)
            that.setData({
              al: 1
            })
          }
        }
      },
      fail: function (res) { },
      complete: function (res) {
        wx.hideLoading();
       //console.log("详情返回",res.data)
       },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  que: function () {
    this.setData({
      model: 1
    })
  },
  que1: function (e) {
    this.setData({
      model1: 1,
      backprice: e.target.dataset.backprice || 0
    })
  },
  tiqu: function () {
    var that = this;
    wx.request({
      url: app.globalData.http + 'UserCenter/takeCard',
      data: {
        token: that.data.token,
        ordercd: that.data.order.order_cd
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code == 200) {
          app.tishi("提取成功");
          that.chushi(that.data.options);
          that.setData({
            voucher:res.data.data,
            model:0
          })
        } else {
          wx.clearStorageSync("user");
          app.tishi("提取失败");
          that.setData({
            model: 0,
            model1: 0,
            model2: 0,
          })
          app.login1(that)
        }
      },
      fail: function (res) { },
      complete: function (res) {
        //console.log(res, "提取卡密")
      },
    })
  },
  duihuan: function () {
    var that = this;
    wx.request({
      url: app.globalData.http + 'UserCenter/exchangeToDiamond',
      data: {
        token: that.data.token,
        ordercd: that.data.order.order_cd
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code == 200) {
          app.tishi("兑换成功");
          that.chushi(that.data.options);
          that.setData({
            model2: 1,
            model: 0,
            model1: 0,
          })
        } else {
          wx.clearStorageSync("user");
          that.setData({
            model2: 0,
            model: 0,
            model1: 0,
          })
          app.tishi("兑换失败");
          app.login1(that)
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  close: function () {
    var open = !this.data.open;
    this.setData({
      open: open
    })
  },
  cancel: function () {
    this.setData({
      model: 0,
      model1: 0,
      model2: 0,
    })
  }, copy: function (e) {
    wx.setClipboardData({
      data: e.target.dataset.km,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            app.tishi(res.data, 'none', 2000)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})