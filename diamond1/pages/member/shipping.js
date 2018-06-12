// pages/member/shipping.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    shipping_name:"",
    ordercd: "",
    shipping_order:"",

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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    ordercd:options.ordercd
  })
  app.login1(this)
  },
chushi:function(){
  var that=this;
  var token = wx.getStorageSync('user')['token'];
  that.setData({
    token: token,
  })
var send={
  url:"UserCenter/getShipInfoList",
  data:{
    token:that.data.token,
    ordercd:that.data.ordercd
  },
  ok:true,
  send: "物流发送",
  back:"物流返回"
}
  app.request1(that,send,that.fun)

},
fun:function(data){
  var that=this;
  if(data.code==200){
    var arr = data.data.track_list||[];
if(arr[0]){
  for (var x = 0; x < arr.length; x++) {
    var year = arr[x].timestr.split(" ")[0];
    var hour = arr[x].timestr.split(" ")[1];
    hour = hour.substr(0, 5);
    arr[x].year = year;
    arr[x].hour = hour;
  }
}

    that.setData({
      list: arr,
      shipping_name: data.data.ship_data.ship_name,
      shipping_order: data.data.ship_data.ship_cd,
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