// pages/unBound/index.js
var app = getApp()
var interval = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: '',
    codeContent: '点击发送',
    currentTime: 61,
    codeDisabled: '',
  },

  codeInterval: function() {
    const that = this
    let currentTime = that.data.currentTime
    interval = setInterval(() => {
      currentTime--;
      that.setData({
        codeContent: currentTime + '秒'
      })
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          codeContent: '重新发送',
          currentTime: 61,
          codeDisabled: false
        })
      }
    }, 1000)
  },

  getPhone: function(e) {
    this.setData({
      phone: e.detail.value,
    })
  },

  getCode: function(e) {
    this.setData({
      code: e.detail.value
    })
  },

  send: function(e) {
    const that = this
    // const unionId = wx.getStorageSync('unionId')
    const phone = this.data.phone
    const pattern = /^[1][2-9][0-9]{9}$/
    if (!phone || !pattern.test(phone)) {
      wx.showModal({
        content: '请输入正确的11位手机号码',
        showCancel: false,
      });
    } else {
      that.codeInterval()
      that.setData({
        codeDisabled: true
      })
      // console.info(app.globalData.unionid)
      // console.info(app.globalData.openid)
      // console.info(phone)
      // console.info('---------------------')
      wx.request({
        url: 'http://api.minidope.com/api/v1.0/phone-vcode',
        method: 'POST',
        data: {
          unionid: app.globalData.unionid,
          openid: app.globalData.openid,
          userType: 1,
          phone: phone,
        },
        success: function(res) {
          console.log(res)
          if (res.data.code === 0) {
            wx.showToast({
              title: '已发送',
            })
          } else {
            wx.showModal({
              content: res.data.message,
              showCancel: false,
            })
          }
        },
        complete: function(res) {
          console.info(res)
        }
      })
    }
  },


  phoneBound: function() {
    const that = this
    const code = that.data.code
    const phone = that.data.phone
    const token = app.globalData.token
    // const unionId = wx.getStorageSync('unionId')
    // console.info('---------------------')
    // console.info(app.globalData.unionid)
    // console.info(app.globalData.openid)
    // console.info(phone)
    // console.info(code)
    // console.info(token)
    // console.info('---------------------')
    // console.info(phone)
    if (phone) {
      wx.request({
        url: 'http://api.minidope.com/api/v1.0/get_teacher_info',
        method: 'POST',
        data: {
          // unionid: app.globalData.unionid,
          // openid: app.globalData.openid,
          phone: phone,
          // vcode: code,
          // userType: 1,
          // token: token,
        },
        success: function(res) {
          if (res.data.data.teacherInfo.teacherId) {
            app.globalData.teacherInfo = res.data.data.teacherInfo
            app.globalData.userId = res.data.data.teacherInfo.teacherId
            wx.switchTab({
              url: '../index/index',
            })
          } else {
            wx.showModal({
              content: '该手机号未在线下登记',
              showCancel: false,
              success: function(res) {
                if (res.confirm) {
                  console.log('确定')
                }
              }
            })
          }
          // if(res.data.code === 0){
          //   wx.reLaunch({
          //     url: '../class/index',
          //   })
          // }else{
          //   wx.showModal({
          //     content: '验证码错误',
          //     showCancel: false,
          //     success: function (res) {
          //       if (res.confirm) {
          //         console.log('确定')
          //       }
          //     }
          //   });
          // }
        },
        // complete:function(res){
        //   console.info(res)
        // }
      })
    } else {
      wx.showModal({
        content: '请填写手机号码',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log('确定')
          }
        }
      });
    }
  },
})