var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    g: 0,
    a: "50",
    sdData: [],
    fabuData: [],
    banners: [
      '../../images/b2.jpg',
      '../../images/b1.jpg',
    ],
    icons: [
      {
        icon: '../../images/i1.png',
        name: '极速秒开',
        url: '../home/list',
      },
      {
        icon: '../../images/i2.png',
        name: '好运pk',
        url: '../home/pk_list',
      },
      {
        icon: '../../images/i3.png',
        name: '热卖爆款',
        url: '../home/u_list',
      },
      {
        icon: '../../images/i5.png',
        name: '最新揭晓',
        url: '../home/kai',
      }
    ],
    indexdata: {},
    nav: 1,
    page: 1,
    animationData: {},
    translate: 0,
    p: 0,
    have: 1,
    remindList: [],
    show:-1
  },
  price: function () {//价格单独
    var that = this;
    var p = 0;
    if (that.data.p == 0) {
      p = 4;
    } else if (that.data.p == 4) {
      p = 5;
    } else {
      p = 4;
    }
    that.setData({
      p: p,
      nav: p
    })
    that.navdata(p, 0);
  },
  /*
   * 生命周期函数--监听页面加载
   */
  g: function () {
    this.setData({
      g: !this.data.g
    })
  },
  navdata: function (a, page) {//根据参数请求不同数据
    var that = this;
    var page = page;
    page++;
    
    that.setData({
      page: page
    })
    var data={
      type:a,
      page:page,
      token: that.data.token
    }
    //console.log("发送",data)
    wx.request({
      url: app.globalData.http + "Lottery/getIndexPageList",
      data: {
        "type": a,
        page: page,
        token: that.data.token
      },
      header: {},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if (res.data.code = 200) {
          if (page > 1) {//加载更多页，在原来数组上添加数据
            var arr = that.data.pageData;
            var arr1 = res.data.data.list;
            for (var x = 0; x < arr1.length; x++) {
              arr.push(arr1[x]);
            }
            for(var x=0;x<arr.length;x++){
              arr[x]["rate"] = ((arr[x]["total"] - arr[x]["remain"]) / arr[x]["total"] * 100).toFixed(1);
            }
            that.setData({
              pageData: arr,
              page: page,
              have: res.data.data.paging.nextPage,

            })
          } else {//调用其他类型数据替换数组
            var arr = res.data.data.list;
          for (var x = 0; x < arr.length; x++) {
            arr[x]["rate"] = ((arr[x]["total"] - arr[x]["remain"]) / arr[x]["total"] * 100).toFixed(1);
          }
            that.setData({
              pageData: arr,
              page: page,
              have: res.data.data.paging.nextPage
            })
          }

        } else {
          app.tishi(res.data.data, "none");
          wx.clearStorageSync("user");
          app.login1(that.data.options)
        }

      },
      fail: function (res) { },
      complete: function (res) {
        //console.log("返回",res.data)
       },
    })
  },
  nav: function (e) {//用户切换数据
    this.setData({
      nav: e.target.dataset.nav
    })
    this.navdata(e.target.dataset.nav, 0);//用户点击行为默认从第一页开始
  },

  onLoad: function (options) {//初次加载
    this.setData({
      options: options
    })
    

  },
  chushi: function (options) {
    wx.showLoading({
      title: "玩儿命加载中"
    })
    var token = wx.getStorageSync('user')['token'];
    var that = this;
    var width = wx.getSystemInfoSync().windowWidth;
    that.setData({
      width: width,
      token: token,
      nav:1
    })
    wx.request({
      // url: app.globalData.http1 + 'index.json',
      url: app.globalData.http + '/Lottery/index',
      data: {
        "token": that.data.token
      },
      header: {},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        // //console.log(res, "数据")

        if (res.data.code == 200) {
          var arr = res.data.data.pageData.list;
          for (var x = 0; x < arr.length; x++) {
            arr[x]["rate"] = ((arr[x]["total"] - arr[x]["remain"]) / arr[x]["total"] * 100).toFixed(1);
          }
          var ar = res.data.data.marqueeList;
          if(ar.length==1){
            ar.push(arr[0]);
            ar.push(arr[0]);
          }else if(ar.length==2){
            ar.push(arr[0]);
          }
          that.setData({
            indexdata: res.data.data,
            banners: res.data.data.bannerList,
            marqueeList: ar,
            marqueeList1: res.data.data.marqueeList[0]||'',
            pageData: arr,
            nn: res.data.data.marqueeList.length,
            you_coin: res.data.data.you_coin,
            diamond: res.data.data.diamond,
            have: res.data.data.pageData.paging.nextPage,
            remindList: res.data.data.remindList||[]
          })
          that.ani();
          app.globalData.diamond = res.data.data.diamond;
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
      complete: function (res) { wx.hideLoading();
      //console.log("返回",res.data) 
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
    // this.chushi(this.data.options);
    //console.log("每次进入刷新页面")

  },
  ani: function () {//走马灯函数

    var animation = wx.createAnimation({
      duration: 60000,
      timingFunction: 'linear',
    })

    this.animation = animation
    var x = this.data.nn*3;
    var i = 650 / 750 * this.data.width
    x = x * i;
    // //console.log(x)
    animation.translate(-x).step()
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      // //console.log("重置走马灯")
      this.anim()
    }.bind(this), 59800)
  },
  anim: function () {
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: 'linear',
    })

    this.animation = animation
    animation.translate(0).step()
    this.setData({
      animationData: animation.export()
    })
    setTimeout(function () {
      // //console.log("执行走马灯")
      this.ani()
    }.bind(this), 0)
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
  getUserInfo: function (e) {
    //console.log(e, "授权")
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res.code, "code")
        wx.getUserInfo({
          success: res1 => {
            // //console.log(res1, "111")
            var url = "https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code"
            wx.request({
              url: app.globalData.http + "/Wxauth/jsLogin",
              // url: app.globalData.http +"/Wxauth/login",
              data: {
                code: res.code,
                wxdata: res1
              },
              header: {},
              method: 'POST',
              dataType: 'json',
              responseType: 'text',
              success: function (res2) {
                //console.log(res2, "登录返回", app.globalData.userInfo)

              },
              fail: function (res2) { },
              complete: function (res2) { },
            })
          }
        })
      }
    })
    app.globalData.userInfo = e.detail.userInfo
    //   this.setData({
    //     userInfo: e.detail.userInfo,
    //     hasUserInfo: true
    //   })
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
    var that = this;
    if (that.data.have) {
      that.navdata(that.data.nav, that.data.page);//用户点击行为默认从第一页开始

    } else {
      //console.log("没了")
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      return {
        title: "我赢得了(" + res.target.dataset.name + ")大奖",
        path: '/pages/home/index',
        imageUrl: res.target.dataset.img
      }
    }

  },
  share: function (e) {
    var name = e.target.dataset.name;
    //console.log(name)
  },close:function(e){
    //console.log(e.target.dataset.show)
    this.setData({
      show:e.target.dataset.show
    })
  }
})