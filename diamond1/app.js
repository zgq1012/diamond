
var md5 = require("utils/md5.js");
App({
  onLaunch: function () {
    // 登录

    // wx.login({
    //   success: res1 => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     wx.getUserInfo({
    //       success: res => {
    //         wx.request({
    //           url: "https://mallapi.1365game.com/Wxauth/jsLogin",
    //           data: {
    //             code: res1.code,
    //             wxdata: res
    //           },
    //           header: {},
    //           method: 'POST',
    //           dataType: 'json',
    //           responseType: 'text',
    //           success: function (res) {
    //             // //console.log(res.data.data,"s");
    //             wx.setStorageSync('user', res.data.data);
    //             // wx.switchTab({
    //             //   url: '/pages/home/index'
    //             // })
    //           },
    //           fail: function (res) { },
    //           complete: function (res) { },
    //         })
    //       }
    //     })
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // wx.switchTab({
              //   url: '/pages/home/index'
              // })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          wx.redirectTo({
            url: '/pages/login/index',
          })
        }



      }
    })
  },
  showModel: function () {
    wx.showToast({
      title: '正在加载....',
      icon: 'loading',
      duration: 1500
    });
  },
  login1: function (that) {
    //     if(!that){//没有传递that
    // return
    //     }
    var user = wx.getStorageSync('user');

    if (!user) {
 
      wx.login({
        success: res1 => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.getUserInfo({
            success: res => {
              wx.request({
                url: "https://mallapi.1365game.com/Wxauth/jsLogin",
                data: {
                  code: res1.code,
                  wxdata: res
                },
                header: {},
                method: 'POST',
                dataType: 'json',
                responseType: 'text',
                success: function (res) {
                  // //console.log(res.data.data,"s");
                  if (res.data.data.token) {
                    wx.setStorageSync('user', res.data.data);
                    // wx.showToast({
                    //   title: "登录成功",
                    //   icon: "none",
                    //   duration: 1000
                    // });
                    that.chushi(that.data.options)
                  }

                },
                fail: function (res) { },
                complete: function (res) { },
              })
            }
          })
        }
      })
    } else {
      that.chushi(that.data.options)
    }
  },
  tishi: function (tit, icon, time) {
    var tit = tit || "请稍等";
    var icon = icon || "loading";
    var time = time || 1500
    wx.showToast({
      title: tit,
      icon: icon,
      duration: time
    });
  },
  phone: function (mobile) {

    if (!mobile) {

      return 3;
    }
    var mobile1 = mobile.split("");
    if (mobile1.length != 11) {

      return 1;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!myreg.test(mobile)) {
      return 2
    }
    return false;
  },

  globalData: {
    userInfo: null,
    http: "https://mallapi.1365game.com/",
    // http: "http://39.104.81.249:5015",
    http1: "https://16kg.cn/interface/",
    diamond: 0,
    token: null
  },
  request1: function (that, obj,fun) {
    var send = obj.send || "发送";
    var back = obj.back || "返回";
    var ok = obj.ok;//是否输出
    var method = obj.method || "POST";
    var obj1 = {
      url: this.globalData.http + obj.url,
      data: obj.data,
    }
    if (ok) {
     //console.log(send, obj1)//输出
    }
    wx.request({
      url: obj1.url,
      data: obj1.data,
      header: {},
      method: method,
      dataType: 'json',
      responseType: 'text',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) {
        if (ok) {
         //console.log(back,res.data)
        }
        fun(res.data)
      },
    })
  }

})