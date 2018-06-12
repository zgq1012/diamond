// pages/member/exchange.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  page:1,
  list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
chushi:function(){
  wx.showLoading({
    title: "玩儿命加载中"
  })
  var token = wx.getStorageSync('user')['token'];
  var that = this;
  that.setData({
    token: token,
  })
  that.load1()
  },
  load1: function () {
    var that = this;
    var data={
      token: that.data.token,
      page: that.data.page
    }
    //console.log("列表请求",data)

    wx.request({
      url: app.globalData.http + "UserCenter/getConvertOrderList",
      data: {
        token: that.data.token,
        page: that.data.page
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code = 200) {
          var arr = that.data.list;
          var arr1 = res.data.data.list;
          if (arr1.length > 0) {
            for (var x = 0; x < arr1.length; x++) {
              arr.push(arr1[x]);
            }
          }
          that.setData({
            list: arr,
            have: res.data.data.paging.nextPage
          })
        } else {
          if (!that.data.al) {
            app.tishi("请稍等", "loading");
            that.chushi(that.data.options);
            that.setData({
              al: 1,
              list: []
            })
          }
        }
      },
      fail: function (res) { },
      complete: function (res) { wx.hideLoading();
      //console.log("列表返回",res.data) 
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  kan: function (e) {
    var that = this;
    var ordercd = e.target.dataset.order_cd;
    var send = {
      url: "UserCenter/getOrderVoucher",
      data: {
        token: that.data.token,
        ordercd: ordercd
      },
      ok: true,
      send: "查看卡密发送",
      back: "查看卡密返回"
    }
    app.request1(that, send, that.fun)//请求函数
  }, fun: function (data) {
    if (data.code == 200) {
      this.setData({
        card_number: data.data.card_number,
        card_pwd: data.data.card_pwd,
        open: 1
      })
    }

  },
   que: function (e) {
    this.setData({
      model: 1,
      order_cd: e.target.dataset.order_cd
    })
    //console.log(e.target.dataset.order_cd)
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
  que1: function (e) {
    this.setData({
      model1: 1,
      backprice: e.target.dataset.backprice,
      order_cd: e.target.dataset.order_cd
    })
    //console.log("单号", e.target.dataset.order_cd)
  },
  tiqu: function () {
    var that = this;
    var data = {
      token: that.data.token,
      ordercd: that.data.order_cd
    }
    //console.log("提取卡密", data)
    wx.request({
      url: app.globalData.http + 'UserCenter/takeCard',
      data: {
        token: that.data.token,
        ordercd: that.data.order_cd
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
            card_number: res.data.data.card_number,
            card_pwd: res.data.data.card_pwd,
            open: 1,
            model: 0,
            list:[]
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
        //console.log("提取卡密返回", res.data) 
        },
    })
  },
  duihuan: function () {
    var that = this;
    wx.request({
      url: app.globalData.http + 'UserCenter/exchangeToDiamond',
      data: {
        token: that.data.token,
        ordercd: that.data.order_cd
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code == 200) {
          app.tishi("兑换成功");

          that.setData({
            model2: 1,
            model: 0,
            model1: 0,
            list: []
          })
          that.chushi(that.data.options);
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
      complete: function (res) { },  que: function (e) {
    this.setData({
      model: 1,
      order_cd:e.target.dataset.order_cd
    })
    //console.log(e.target.dataset.order_cd)
  },
  que1: function (e) {
    this.setData({
      model1: 1,
      backprice: e.target.dataset.backprice,
      order_cd: e.target.dataset.order_cd
    })
    //console.log("单号", e.target.dataset.order_cd)
  },
  tiqu:function () {
    var that = this;
    var data={
      token: that.data.token,
      ordercd: that.data.order_cd
    }
    //console.log("提取卡密",data)
    wx.request({
      url: app.globalData.http + 'UserCenter/takeCard',
      data: {
        token: that.data.token,
        ordercd: that.data.order_cd
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            card_number: res.data.data.card_number,
            card_pwd: res.data.data.card_pwd,
            list:[],
            open:1,
            model:0,
          })
          that.chushi(that.data.options);
          app.tishi("提取成功");
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
         //console.log("提取卡密返回",res.data)
         },
    })
  },
  duihuan:function () {
    var that = this;
    wx.request({
      url: app.globalData.http + 'UserCenter/exchangeToDiamond',
      data: {
        token: that.data.token,
        ordercd: that.data.order_cd
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code == 200) {
          app.tishi("兑换成功");
          
          that.setData({
            model2: 1,
            model: 0,
            model1: 0,
            list:[]
          })
          that.chushi(that.data.options);
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
  cancel:function () {
    this.setData({
      model: 0,
      model1: 0,
      model2: 0,
    })
  },
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  this.setData({
    list:[],
    page:1
  })

  app.login1(this)
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
    if(this.data.have){
      var page = this.data.page + 1;
      this.setData({
        page: page
      })
      this.load1()
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})