// pages/login/index.js
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

    // app.showModel();
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.login({
            success: res1 => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              wx.getUserInfo({
                success: res => {
                  wx.showLoading({
                    title: "玩儿命加载中"
                  })
                 
                  wx.request({
                    url: app.globalData.http + "Wxauth/jsLogin",
                    data: {
                      code: res1.code,
                      wxdata: res
                    },
                    header: {},
                    method: 'POST',
                    dataType: 'json',
                    responseType: 'text',
                    success: function (res) {
                      // //console.log(res.data.data, "s");
                      wx.setStorageSync('user', res.data.data);
                      wx.switchTab({
                        url: '/pages/home/index'
                      })
                    },
                    fail: function (res) { },
                    complete: function (res) { wx.hideLoading()},
                  })
                }
              })
            }
          })
        }else{
          this.setData({
            sq:1
          })
        }
      }
    })
  },
  getUserInfo: function (e) {
    // //console.log(e)
    app.globalData.userInfo = e.detail.userInfo
   
    wx.login({
      success: res1 => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getUserInfo({
          success: res => {
            wx.showLoading({
              title: "玩儿命加载中"
            })
            //console.log(res, "用户信息")
            wx.request({
              url: app.globalData.http+"Wxauth/jsLogin",
              data: {
                code: res1.code,
                wxdata: res
              },
              header: {},
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (res) {
               //console.log(res.data.data,"登录返回");
                wx.setStorageSync('user', res.data.data);
                wx.switchTab({
                  url: '/pages/home/index'
                })
              },
              fail: function (res) { },
              complete: function (res) { wx.hideLoading() },
            })
          }
        })
      }
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