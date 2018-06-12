// pages/member/record.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  page:1,
  list:[],
  have:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options,
      tab:options.tab
    })
    app.login1(this);
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
   that.load1()
  },
  load1:function(){
    var that=this;
    var url = "";
    if (that.data.tab == 1) {
      url = "UserCenter/getYoucoinList";
    } else if (that.data.tab == 2) {
      url = "UserCenter/getDiamondList";
    }
    var data={
      token: that.data.token,
      page: that.data.page
    }
    //console.log("发送",data)
    
    wx.request({
      url: app.globalData.http + url,
      data: data,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code = 200) {
          var arr=that.data.list;
          var arr1=res.data.data.list;
          if(arr1.length>0){
              for(var x=0;x<arr1.length;x++){
                  arr.push(arr1[x]);
              }
          }
          that.setData({
            list: arr,
            have: res.data.data.paging.nextPage
          })
          //console.log("返回", res.data.data)
        } else {
          if (!that.data.al) {
            app.tishi("请稍等", "loading");
            wx.clearStorageSync("user")
            app.login1(that);
            that.setData({
              al: 1,
              list:[]
            })
          }
        }
      },
      fail: function (res) { },
      complete: function (res) { wx.hideLoading() },
    })
  },
  tab:function(e){
    if (e.target.dataset.tab!=this.data.tab){
      this.setData({
        tab: e.target.dataset.tab,
        page: 1,
        list:[]
      })
      this.load1()
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