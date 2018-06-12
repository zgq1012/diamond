// pages/news/order.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  bb:10,
  dd:45,
  total:0,
  pay: {"appId":"wxa409c06d0222382a","nonceStr":"0hwsbzek4osig2f67eb1f79jklho8phq","package":"prepay_id= wx19002125721826e7a69c57354032416374","signType":"MD5","timeStamp":"1526660485","paySign":"1D6A5E629A7E3D261DCBD40993E9D28C"}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
this.setData({
  options:options,
  type:options.type||'',
  periods_id: options.periods_id
})
   

  },
  chushi: function (options){
    wx.showLoading({
      title: "玩儿命加载中"
    })
    var token = wx.getStorageSync('user')['token'];
    var that = this;
    that.setData({
      token: token
    })
    var that = this;
    var data={
      periods_id: options.periods_id,
      token: that.data.token
    }
    //console.log("发送",data)
    wx.request({
      url: app.globalData.http + "Lottery/partake",
      data: {
        periods_id: options.periods_id,
        token: that.data.token
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if(res.data.code==200){
          var bb = res.data.data.remain_times > 10 ? 10 : res.data.data.remain_times;
if(that.data.type==13){
bb=1
}
          that.setData({
            product: res.data.data,
            single_price: res.data.data.single_price,
            bb: bb,
            phone: res.data.data.phone
          })
          that.compute()
        }else{
        //   if(!that.data.al){
        //     app.tishi(res.data.data, "none")
        //     that.setData({
        //       al:1
        //     })
        //     wx.clearStorageSync("user");
        //     app.login1(that)
        //   }
          app.tishi(res.data.data, "none")
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/home/index',
            })
          },1000)

        }

      },
      fail: function (res) { },
      complete: function (res) { wx.hideLoading();
      //console.log("返回",res.data) 
      },
    })
  },
  bu:function(){
this.setData({
  bb: 1
})
  },
  phone:function(e){
    var phone=e.detail.value;
    var a=app.phone(phone);
    if(a==1){
      app.tishi("手机号长度不对","none")
    } else if (a == 2) {
      app.tishi("手机号格式不对", "none")
    } else if (a == 3) {
      app.tishi("请填写手机号", "none")
    }
      this.setData({
        phone:phone
      })
    
  },
  jia: function () {
    if (this.data.bb >= this.data.product.remain_times) {
      return
    } else {
      var bb = this.data.bb - 0 + 1;
      this.setData({
        bb: bb
      })
    }
    this.compute()
  },
  jian: function () {//减
    if (this.data.bb <=1) {
      return
    } else {
      var bb = this.data.bb -1;
      this.setData({
        bb: bb
      })
    }
    this.compute()
  },
  shuru:function(e){//输入
    var bb = parseInt(e.detail.value);
    if (bb > 0 && bb <= this.data.product.remain_times){
      this.setData({
        bb:bb
      })
    } else if (bb > this.data.product.remain_times){
      this.setData({
        bb: this.data.product.remain_times
      })
    }else if(bb<=0){
      this.setData({
        bb: 1
      })
    }
    this.compute()
  },
  fuzhi:function(e){
    var bb=e.target.dataset.z;
    if (bb <= this.data.product.remain_times){
        this.setData({
          bb:bb
        })
    }else{
      return
    }
    this.compute()
  },
qie:function(){
  var dd=this.data.dd==45?0:45
  
  this.setData({
    dd:dd
  })
  if (dd==0){//充值支付
    this.setData({
      gray:0,
      total: this.data.product.single_price * this.data.bb/10
    })
  }else{//余额支付
    if (this.data.product.single_price * this.data.bb >= this.data.product.diamond) {//余额不足
      this.setData({
        gray: 1,
        total: 0
      })
    }else{
      this.setData({
        gray:0,
        total: 0
      })
    }
  }

},
  compute:function(){//计算价格和宝钻
    var that=this;
    var dd=that.data.dd;
    var total = that.data.total;
    var diamond = that.data.product.single_price * that.data.bb;
    if (diamond <= that.data.product.diamond){//有宝钻
      dd=45;
      total=0;
    }else{
      dd=0;
      total=diamond/10;
    }
    that.setData({
      diamond:diamond,
      dd:dd,
      total:total,
      gray:0
    })

  },
xiadan:function(){

  var that=this;
  if(that.data.gray){
    app.tishi("宝钻不足","none");
    return
  }
  var a=app.phone(that.data.phone);
if(a==3){
  app.tishi("手机号不能为空", "none");
  return
}
  if (a == 1) {
    app.tishi("手机号长度不对", "none");
    return
  } else if (a == 2) {
    app.tishi("手机号格式不对", "none");
    return
  }

that.order()
},
order:function(){
  var that=this;
  var is_wxpay=that.data.dd==0?1:0;
  // //console.log(is_wxpay, that.data.product.periods, that.data.bb, that.data.phone)
  that.setData({
    is_wxpay: is_wxpay
  })
  var data={
    periods_id: that.data.periods_id,
    // periods_id: that.data.product.periods,
    times: that.data.bb,
    phone: that.data.phone,
    is_wxpay: is_wxpay,
    token: that.data.token
  }
  //console.log("下单",data)
  wx:wx.request({
    url: app.globalData.http +"Lottery/submitOrder",
    data: {
      periods_id: that.data.periods_id,
      // periods_id: that.data.product.periods,
      times:that.data.bb,
      phone:that.data.phone,
      is_wxpay:is_wxpay,
      token:that.data.token
    },
    header: {},
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {

      if(res.data.code==200){
        if (!that.data.is_wxpay) {//宝钻支付成功if ("Object" === res.data.data.constructor)
          var order = res.data.data;
          wx.redirectTo({
            url: 'success?periods_id=' + that.data.periods_id + "&order=" + order+"&type="+that.data.type
          })
        } else {//微信支付
          var pay = res.data.data.jsApiParameters
          if (!pay["appId"]) {
            pay = JSON.parse(pay)
          }
          that.setData({
            order: res.data.data.order_no,
            pay: pay
          })
         
          wx.requestPayment({
            'timeStamp': pay.timeStamp,
            'nonceStr': pay.nonceStr,
            'package': pay.package,
            'signType': 'MD5',
            'paySign': pay.paySign,
            'success': function (res) {
                app.tishi("支付成功")
                wx.navigateTo({
                  url: 'success?periods_id=' + that.data.periods_id + "&order=" + order + "&type=" + that.data.type
                })
            },
            'fail': function (res) {
              app.tishi(res.data,"none")
            }
          })
        }
      }else{
        app.tishi("下单失败","none");
        wx.clearStorageSync("user");
        app.login1(that);
      }

    },
    fail: function(res) {},
    complete: function(res) {
      //console.log( "支付返回",res.data)
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
  // this.chushi(this.data.options)
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