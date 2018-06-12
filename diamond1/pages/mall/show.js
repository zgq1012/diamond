var WxParse = require('../../wxParse/wxParse.js');
var app = getApp();


Page({
  data:{
    a:"33.3",
      id:'',
      content:'',
      supports: 0,
      upsImg:"../../icons/ups.png",
      collectImg:"../../icons/collect.png",
      str_arr:[]
  },
  dui:function(){//立即兑换
    var that=this;
    var cha = that.data.price - app.globalData.diamond;
    if (cha>0){
      that.setData({
        model: 1,
        cha:cha
      })
    }else{
      wx.request({
        url: app.globalData.http +"Convert/toDoConvert",
        data: {
          token:that.data.token,
          sku:that.data.sku
        },
        header: {},
        method: 'POST',
        dataType: 'json',
        responseType: 'text',
        success: function(res) {
          if(res.data.code==200){
            wx.navigateTo({
              url: 'order?sku='+that.data.sku+"&phone="+res.data.data.phone+"&type="+res.data.data.product.type,
            })
          }else{
            app.tishi("兑换失败");
            that.chushi(that.data.options)
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    }

  },
  cancel:function(){
    var that = this;
    that.setData({
      model: 0
    })
    //临时测试
    // wx.navigateTo({
    //   url: 'order?sku=' + that.data.sku + "&phone=15689598654",
    // })
  },
  onLoad:function(options){
    this.setData({
      options: options
    })
    app.login1(this)
  },
  chushi:function(options){
    wx.showLoading({
      title: "玩儿命加载中"
    })
    var token = wx.getStorageSync('user')['token'];
    var that = this;
    that.setData({
      token: token,
      sku:options.sku
    })
    wx.request({
      url: app.globalData.http + "Convert/detail",
      data: {
        sku: options.sku,
        token: that.data.token
      },
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
if(res.data.code==200){
  WxParse.wxParse('content', 'html', res.data.data.product.content, that);
  // WxParse.wxParse('content', 'html', "<div><strong>【现货】Iphone 8 Plus 64G红色特别版</strong><p>新一代Iphone，让智能看起来更不一样</p><p>各种简介说明</p></div>", that);
  
  that.node(that.data.content.nodes);
  that.setData({
    product: res.data.data.product,
    price: res.data.data.price
  })
}else{
  // //console.log(res,"兑换")
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
  fail: function(res) {},
  complete: function (res) { wx.hideLoading()},
})
  },
  node:function(arr){
    var that=this;
    for(var x=0;x<arr.length;x++){
        if(arr[x]['node']=="text"){
          var arr1=that.data.str_arr;
          arr1.push(arr[x].text);
          that.setData({
            str_arr:arr1
          })
        } else if (arr[x]['node'] == "element"){
          that.node(arr[x].nodes)
        }
    }
  }

})