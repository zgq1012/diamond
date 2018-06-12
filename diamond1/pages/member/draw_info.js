// pages/member/draw_info.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ex_diamond: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      ordercd: options.ordercd,
      lotteryperiods_id: options.lotteryperiods_id || ''
    })
    app.login1(this)
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
    var data={
      token: that.data.token,
      ordercd: options.ordercd
    }
   //console.log("订单初始化请求",data)
    wx.request({
      url: app.globalData.http + 'UserCenter/getLotteryOrderDetail',
      data: data,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code = 200) {
          var prizedInfo = res.data.data.prizedInfo || "",
            new_periods_id = res.data.data.new_periods_id || "", prized_number = res.data.data.prized_number || "";
          var arr = res.data.data.orderInfo.numberList;
          var arr1 = [];
          var num = arr.length;
          if (num > 9) {//截取9个数据
            for (var x = 0; x < 9; x++) {
              if (x < 8) {
                arr1.push(arr[x] + "、")
              } else {
                arr1.push(arr[x])
              }

            }
          } else {
            for (var x = 0; x < num; x++) {
              if (x < num - 1) {
                arr1.push(arr[x] + "、")
              } else {
                arr1.push(arr[x])
              }
            }
          }
          that.setData({
            product: res.data.data.product,
            address: res.data.data.addr,
            orderInfo: res.data.data.orderInfo,
            prizedInfo: prizedInfo,
            new_periods_id: new_periods_id,
            numberList: arr,
            numberList1: arr1,
            num: num,
            prized_number: prized_number,
            periods_id: res.data.data.periods_id,
            shipping: res.data.data.shipInfo||''
          })
          if (res.data.data.orderInfo.prized_status==12){//已提取
that.zm();
          }
//           if (res.data.data.orderInfo.prized_status == 3){//已发货
// that.shipping();
//           }
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
      complete: function (res) { wx.hideLoading();
    //console.log("初始化订单返回",res.data) 
      },
    })
 
   

  },
zm:function(){
var that=this;
  var data= {
    token: that.data.token,
    ordercd: that.data.ordercd
  }
  //console.log("请求账密发送",data)
wx.request({
  url: app.globalData.http + 'UserCenter/getOrderVoucher',
  data: data,
  header: {},
  method: 'POST',
  dataType: 'json',
  responseType: 'text',
  success: function (res) {
    if (res.data.code == 200) {

      that.setData({
        card_number: res.data.data.card_number,
        card_pwd: res.data.data.card_pwd,
      })
    }
  },
  fail: function (res) { },
  complete: function (res) {
    //console.log("账密返回",res.data) 
    },
})

},
shippling:function(){
var that=this;
  var data= {
    token: that.data.token,
    ordercd: that.data.ordercd
  }
  //console.log("物流请求发送",data)
wx.request({
  url: app.globalData.http + 'UserCenter/getShipInfoList ',
  data: {
    token: that.data.token,
    ordercd: that.data.ordercd
  },
  header: {},
  method: 'POST',
  dataType: 'json',
  responseType: 'text',
  success: function (res) {

    if (res.data.code == 200) {
      if (res.data.data) {
        that.setData({
          shipping: res.data.data.track_list[0]
        })
      }

    }
  },
  fail: function (res) { },
  complete: function (res) { 
    //console.log("物流返回",res.data)
    },
})
},
pay: function (e) {
  var that = this;
  var order_cd = e.target.dataset.order_cd;

  var send = {
    url: "UserCenter/orderPay",
    data: {
      token: that.data.token,
      ordercd: order_cd
    },
    ok: true,
    send: "订单支付发送",
    back: "订单支付返回"
  }
  app.request1(that, send, that.fun)//请求函数
},
fun: function (data) {
  var that = this;
  if (data.code == 200) {
    var pay = data.data.jsApiParameters || '';
    if (!pay) {//宝钻充足
      app.tishi("支付成功")
      setTimeout(function () {
        that.setData({
          list: []
        })
        that.chushi()
      }, 1500)
      return
    }
    if (!pay.appId) {
      pay = JSON.parse(pay)
    }
    wx.requestPayment({
      'timeStamp': pay.timeStamp,
      'nonceStr': pay.nonceStr,
      'package': pay.package,
      'signType': 'MD5',
      'paySign': pay.paySign,
      'success': function (res) {
        app.tishi("支付成功")
        setTimeout(function () {
          that.setData({
            list: []
          })
          that.chushi()
        }, 1500)
      },
      'fail': function (res) {
        app.tishi("支付失败", "none")
      }
    })
  } else {
    app.tishi(data.data, "none")

  }
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
      backprice: e.target.dataset.backprice||0
    })
  },
  tiqu: function () {
    var that = this;
    wx.request({
      url: app.globalData.http + 'UserCenter/takeCard',
      data: {
        token: that.data.token,
        ordercd: that.data.orderInfo.order_cd
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
        //console.log(res,"提取卡密")
       },
    })
  },
  duihuan: function () {
    var that = this;
    wx.request({
      url: app.globalData.http + 'UserCenter/exchangeToDiamond',
      data: {
        token: that.data.token,
        ordercd: that.data.orderInfo.order_cd
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
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
this.chushi(this.data.options)
  },
  copy: function (e) {
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