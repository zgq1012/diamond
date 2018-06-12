var WxParse = require('../../wxParse/wxParse.js');
var util = require('../../utils/util.js');
var app = getApp();

Page({
  data: {
    a: "33.3",
    id: '',
    content: '',
    supports: 0,
    upsImg: "../../icons/ups.png",
    collectImg: "../../icons/collect.png",
    top: 0,
    str_arr:[],
    page:1
  },
  onLoad: function (options) {
    this.setData({
      options: options,
      type: options.type || "",
      jie:options.jie||'',
      periods_id: options.periods_id||''
    })
    app.login1(this)
  },
  chushi: function (options) {
    wx.showLoading({
      title: "玩儿命加载中"
    })
    var token = wx.getStorageSync('user')['token'];
    var that = this;
    that.setData({
      token: token,
    })
    var data={
      periods_id: options.periods_id,
      token: that.data.token
    }
    //console.log("初始发送",data)
    wx.request({
      url: app.globalData.http + "Lottery/detail",
      header: {
        'content-type': 'application/json'
      },
      data: {
        periods_id: options.periods_id,
        token: that.data.token
      },
      dataType: 'json',
      method: 'post',
      success: function (res) {
        if (res.data.code == 200) {

          WxParse.wxParse('content', 'html', res.data.data.product.content, that);
          that.node(that.data.content.nodes);
          var arr = res.data.data.numberList;
          var arr_l = res.data.data.lastPeriodsList;
          
          var arr1 = [];
          var num = arr.length;
          var num_l = arr_l.length;
          console.log(num_l, "arr_l")
          if (num > 8) {//截取8个数据
            for (var x = 0; x < 8; x++) {
              if(x<7){
                arr1.push(arr[x]+"、")
              }else{
                arr1.push(arr[x])
              }
              
            }
          } else {
            for(var x=0;x<num;x++){
              if (x <num-1) {
                arr1.push(arr[x] + "、" )
              } else{
                arr1.push(arr[x])
              }
            }
          }
          var arr_p = res.data.data.partakeList.list;
          // for (var c = 0; c < arr_p.length; c++) {
          //   var t = util.formatTime(arr_p[c].submit_timestamp)
          //   arr_p[c].submit_timestamp = t
          // }
          if (!that.data.lun) {
            that.lun(num_l);
          }
          that.setData({
            data: res.data.data,
            product: res.data.data.product,
            new_periods_id: res.data.data.new_periods_id||'',
            rule_info: res.data.data.rule_info,
            numberList: arr,
            numberList1: arr1,
            numbernum: num,
            lastPeriodsList: arr_l,
            num_l: num_l,
            partakeList: arr_p,
            t: res.data.data.channel_type,
            have: res.data.data.partakeList.paging.nextPage,
            prizedInfo: res.data.data.prizedInfo||'',
            periods_status: res.data.data.periods_status||1,
            page:1,
            lun:1
          })
         
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
  node: function (arr) {

    var that = this;
    for (var x = 0; x < arr.length; x++) {
      if (arr[x]['node'] == "text") {
        var arr1 = that.data.str_arr;
        arr1.push(arr[x].text);
        that.setData({
          str_arr: arr1
        })
      } else if (arr[x]['node'] == "element") {
        that.node(arr[x].nodes)
      }
    }
  },
  lun: function (num_l) {
    var that = this;
    var num_l=num_l||that.data.num_l;
    var top = that.data.top;
    top = top - 68;
    top = Math.abs(top / 68) <=num_l ? top : 1;
    // console.log(top, "333")
    if (top == 1) {
      that.setData({
        tran: 1
      })
    } else {
      that.setData({
        tran: 0
      })
    }
    that.setData({
      top: top
    })
    if(top==1){
  that.lun1()
    }else{
      setTimeout(function () {
        that.lun()
      }, 3000)
    }

  },
  lun1:function(){
this.lun()
  },
  close: function () {
    var open = !this.data.open;
    this.setData({
      open: open
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    if (!that.data.have) {
      return
    }
    var page=that.data.page+1;
    var data= {
      "periods_id": that.data.periods_id,
      token: that.data.token,
      page: page
    }
    //console.log("记录发送",data)
    wx.request({
      url: app.globalData.http + "Lottery/partakeList",
      data: data,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        if(res.data.code==200){
          var arr_p = res.data.data.list;
          for (var c = 0; c < arr_p.length; c++) {
            var t = util.formatTime(arr_p[c].submit_timestamp)
            arr_p[c].submit_timestamp = t
          }
          var arr1 = that.data.partakeList;
          for (var d = 0; d < arr_p.length; d++) {
            arr1.push(arr_p[d]);
          }
          that.setData({
            partakeList: arr1,
            have: res.data.data.paging.nextPage,
            page:page
          })
          //console.log("记录返回",res.data)
        }else{
          app.tishi(res.data.data,"none")
          that.chushi(that.data.options)
        }

      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  onShow:function(){
    //this.chushi(this.data.options)
  }


})