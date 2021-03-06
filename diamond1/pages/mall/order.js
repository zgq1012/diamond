//index.js
//获取应用实例
var add123 = require('../../utils/address.js');
add123 = add123.add123;
const app = getApp()

Page({
  data: {
    shengs: [],
    shis: [],
    xians: [],
    province:"",
    city:"",
    county:"",
    sheng:"",
    shi:"",
    xian:""
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {

    this.setData({
      options:options,
      sku:options.sku,
      phone:options.phone,
      type:options.type
    })
    app.login1(this);
  },
  chushi:function(options){
    wx.showLoading({
      title: "玩儿命加载中"
    })
    var that = this;
    ////console.log(options,"订单")
    var arrayTemp = [];
    for (var i = 0; i < add123.length; i++) {
      arrayTemp.push(add123[i].p);
      // //console.log(this.data.citylist[i].p);  
    }
    that.setData({
      shengs: arrayTemp,
    })

    var token = wx.getStorageSync('user')['token'];
    that.setData({
      token: token,
    })
    var data={
      token: that.data.token,
      sku: options.sku
    }
    //console.log("兑换订单发送",data)
    wx.request({
      url: app.globalData.http+'Convert/detail',
      data: {
        token:that.data.token,
        sku:options.sku
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if(res.data.code=200){
          that.setData({
            product: res.data.data.product,
            price:res.data.data.price,
            
          })
        }else{
          // if (!that.data.al) {
          //   app.tishi("请稍等", "loading");
          //   wx.clearStorageSync("user")
          //   app.login1(that);
          //   that.setData({
          //     al: 1,
          //     list: []
          //   })
          // }
          app.tishi(res.data.data, "none")
          setTimeout(function () {
            wx.switchTab({
              url: '/pages/mall/index',
            })
          }, 1000)
        }
      },
      fail: function(res) {},
      complete: function (res) { wx.hideLoading();//console.log("订单返回",res.data)
      },
    })
  },
  ren:function(e){
    this.setData({
      ren:e.detail.value
    })
   // //console.log(this.data.ren)
  },
  shu:function(e){
    var phone = e.detail.value;
    var a = app.phone(phone);
    if (a == 1) {
      app.tishi("手机号长度不对", "none")
    } else if (a == 2) {
      app.tishi("手机号格式不对", "none")
    } else if (a == 3) {
      app.tishi("请填写手机号", "none")
    }
    this.setData({
      phone: phone
    })
  },
  address:function(){
    var that=this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.address']) {
          wx.openSetting({
          })
        } else {
          //打开选择地址  
          wx.chooseAddress({
            success: function (res) {
              //console.log(res.userName)
              //console.log(res.postalCode)
              //console.log(res.provinceName)
              //console.log(res.cityName)
              //console.log(res.countyName)
              //console.log(res.detailInfo)
              //console.log(res.nationalCode)
              //console.log(res.telNumber)
            }
          })
        }
      },
      fail(res) {
        //console.log('调用失败')
      }
    })  

  },
  address1:function(){
    this.setData({
      show:!this.data.show
    })
  },
  bindChange: function (e) {
    var that = this;
    var val = e.detail.value
    var a = val[0], b = val[1], c = val[2];
    if (a == 0) {
      that.setData({
        a: 0,
        shis: [],
        xians: [],
        sheng: '',
        shi: '',
        xian: '',
        view: ''
      })
      return
    }
    if (a != that.data.a) {//切换省份
      that.setData({
        value: [a, 0, 0]
      })
      var arr = add123[a].c;
      var arrayTemp = [];
      for (var i = 0; i < arr.length; i++) {
        arrayTemp.push(arr[i].n);
      }
      //console.log(arrayTemp, "市")
      var arr1 = add123[a]['c'][0].a;
      var arrayTemp1 = [];
      if (arr1) {
        for (var i = 0; i < arr1.length; i++) {
          arrayTemp1.push(arr1[i].s);
        }
      }


      that.setData({
        shis: arrayTemp,
        a: a,
        xians: arrayTemp1
      })

    } else if (b != that.data.b) {//切换市
      var arr = add123[a]['c'][b].a;
      if (arr) {
        var arrayTemp = [];
        for (var i = 0; i < arr.length; i++) {
          arrayTemp.push(arr[i].s);
        }
        //console.log(arrayTemp, "县")
        that.setData({
          xians: arrayTemp,
          b: b,
        })
      }
    }

    that.setData({
      sheng: that.data.shengs[a],
      shi: that.data.shis[b] || '',
      xian: that.data.xians[c] || ''
    })
    //console.log(that.data.shengs[a], that.data.shis[b], that.data.xians[c])
  },
  sure:function(){
    this.setData({
      province: this.data.sheng,
      city: this.data.shi,
      county:this.data.xian,
      view: (this.data.sheng + " " + this.data.shi + " " + this.data.xian).trim(),
      show:0
    })
  },
  info:function(e){
    this.setData({
      address:e.detail.value
    })
  },
  sub:function(){
    var that=this;
    if (!that.data.ren) {
      app.tishi("请填写收件人", "none");
      return
    }
    if (!that.data.phone) {
      app.tishi("请填写手机号", "none");
      return
    }
    if(that.data.type==1){
      if (!that.data.province) {
        app.tishi("请填写省份", "none");
        return
      }
      if (!that.data.city) {
        app.tishi("请填写城市", "none");
        return
      }
      if (!that.data.address) {
        app.tishi("请填写详细地址", "none");
        return
      }
    }

    var a = app.phone(that.data.phone);
    if (a == 1) {
      app.tishi("手机号长度不对", "none");
      return
    } else if (a == 2) {
      app.tishi("手机号格式不对", "none");
      return
    } else if (a == 3) {
      app.tishi("请填写手机号", "none");
      return
    }
that.order()
    // //console.log(that.data.token, that.data.ren, that.data.phone, that.data.province, that.data.city, that.data.county, that.data.address)
  },
  order:function(){
    var that=this;

    if(that.data.type==2){
      var data = {
        token: that.data.token,
        sku: that.data.sku,
        uname: that.data.ren,
        phone: that.data.phone,
       
      }
    }else{
      var data = {
        token: that.data.token,
        sku: that.data.sku,
        uname: that.data.ren,
        phone: that.data.phone,
        province: that.data.province,
        city: that.data.city,
        county: that.data.county,
        address: that.data.address
      }
    }
    wx.request({
      url: app.globalData.http +'Convert/submitOrder',
      data: data,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        if (res.data.code==200){
          wx.redirectTo({
            url:"success?order_cd="+res.data.data
          })
        }else{
          app.tishi(res.data.data,"none");
          that.chushi(that.data.options)
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },onShow:function(){
    this.chushi(this.data.options)
  }
})
