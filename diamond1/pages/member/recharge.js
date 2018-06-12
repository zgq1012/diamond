// pages/member/recharge.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ac: 10,
    ding: "￥1",
    song: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.login1(this)
  },
  chushi: function () {//初始
    wx.showLoading({
      title: "玩儿命加载中"
    })
    var token = wx.getStorageSync('user')['token'];
    var that = this;
    that.setData({
      token: token
    })
    wx.request({
      url: app.globalData.http + "UserCenter/getPaymentItemList",
      data: {
        token: that.data.token
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code == 200) {
          that.setData({
            list: res.data.data.list,
            ac: res.data.data.list[0].rmb,
            item_code: res.data.data.list[0].item_code,
            phone:res.data.data.phone||''
          })
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
      //console.log("充值",res.data)
      },
    })
  },
  xuan: function (e) {
    var ac = e.currentTarget.dataset.rmb;
    var item_code = e.currentTarget.dataset.item_code;
    this.setData({
      ac: ac,
      s: 0,
      item_code: item_code
    })
  },
  shu: function () {//选择自定义数量
    this.setData({
      s: 1,
      ac: 1,
      ding: "￥1",
      item_code:''
    })
  },
  ding: function (e) {//自定义金额
    var a = e.detail.value;
    a = a.replace("￥", "");
    var ac = Math.abs(parseInt(a));
    ac = ac ? ac : 10;
    //console.log(ac)
    var song = "";
    var arr = this.data.list;
    for (var x = 0; x < arr.length; x++) {
      if (ac >= arr[x].rmb) {
        song = arr[x].give_diamond_num > 0 ? "+" + arr[x].give_diamond_num : "";
      }
    }
    this.setData({
      ac: ac,
      ding: "￥" + ac,
      song: song
    })

  },
  phone: function (e) {
    this.hao(e.detail.value);
    this.setData({
      phone: e.detail.value
    })
  },
  hao: function (a) {
    var a = app.phone(a);
    if (a == 1) {
      app.tishi("手机号长度不对", "none");
      return 0;
    } else if (a == 2) {
      app.tishi("手机号格式不对", "none");
      return 0;
    } else if (a == 3) {
      app.tishi("请填写手机号", "none");
      return 0;
    }
    return 1;
  },
  cz: function () {
    var that = this;
    var p = that.hao(that.data.phone);
    if (p) {
      if(that.data.item_code){
        var data = {
          phone: that.data.phone,
          rmb: that.data.ac,
          token: that.data.token,
          item_code: that.data.item_code
        }
      }else{
        var data = {
          phone: that.data.phone,
          rmb: that.data.ac,
          token: that.data.token,
        }
      }

      //console.log("充值发送",data)
      wx.request({
        url: app.globalData.http + "UserCenter/recharge",
        data: data,
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          if (res.data.code == 200) {
            that.setData({
              order: res.data.data.order_no,
              pay: res.data.data.jsApiParameters
            })
            var pay = res.data.data.jsApiParameters;
            if(!pay["appId"]){
pay=JSON.parse(pay)
            }
            wx.requestPayment({
              'timeStamp': pay.timeStamp,
              'nonceStr': pay.nonceStr,
              'package': pay.package,
              'signType': 'MD5',
              'paySign': pay.paySign,
              'success': function (res) {
                app.tishi("支付成功")
                wx.switchTab({
                  url: '/pages/member/index',
                })
              },
              'fail': function (res) {
                app.tishi("充值失败", "none")
              }
            })
          } else {
            app.tishi("充值请求失败", "none")
            
          }
        },
        fail: function (res) { },
        complete: function (res) {
         //console.log(res.data,"充值返回")
         },
      })
    }
  },
  cancel: function () {
    var that = this;
    that.setData({
      model: 1
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
this.setData({
  list:[]
})
this.chushi()
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