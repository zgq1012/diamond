// pages/member/rule.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  page:1,
  have:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    options:options,
    periods_id: options.periods_id
  })
  app.login1(this)
  },
chushi:function(){
var that=this;

var token = wx.getStorageSync('user')['token'];
that.setData({
  token: token,
})
that.load1()
},
load1:function(){
  var that=this;
  var send = {
    url: "Lottery/partakeList",
    data: {
      token: that.data.token,
      periods_id: that.data.periods_id,
      page: that.data.page
    },
    ok: true,
    send: "参与记录发送",
    back: "参与记录返回"
  }
  app.request1(that, send, that.fun)//请求函数
    var send1 = {
      url: "Lottery/getOpenPrizedRule",
    data: {
    token: that.data.token,
      periods_id: that.data.periods_id,
  },
ok: true,
send: "开奖发送",
back: "开奖返回"
}
  app.request1(that, send1, that.fun1)//请求函数
},
fun1:function(data){
if(data.code==200){
  this.setData({
    b:data.data.B,
    prized_number: data.data.prized_number,
    a: data.data.A||"00000"
  })
}else{
  if (!this.data.al) {
    app.tishi("请稍等", "loading");
    wx.clearStorageSync("user")
    app.login1(this)
    this.setData({
      al: 1
    })
  }
}
},
fun:function(data){
  var that=this;
if(data.code==200){
  var arr=data.data.list;
  var arr1=[];
  for(var x=0;x<arr.length;x++){
    var t = arr[x].submit_timestamp.split(" ")[1];
    t = t.replace(/:/g, "");
    t=t.replace(".","");
    arr[x].t=t;
  }
  that.setData({
    list:arr,
    have: data.data.paging.nextPage
  })
}else{
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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