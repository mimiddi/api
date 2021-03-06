const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    imgs: [], //本地图片地址数组
    message: '',
    submitTime: 1,
    tempFilePaths: {}, //本地图片地址对象
    canChoose: true, //是否可选图片
    imgString: '', //图片拼接后的字符串
    studentId: 0,
    type: 1,
    orgAuthorId: 0,
    orgAuthorType: 1,
    recordId: 0,
    name: "",

    downloadUrl:'',
    pictureUrls:[],
  },
  charChange: function(e) {
    this.setData({
      text: e.detail.value
    })
  },
  submit: function() {

    if (this.data.text == undefined || this.data.tempFilePaths == {}) {
      wx.showToast({
        title: '您还没输入内容呢',
        icon: 'loading',
        image: '',
        duration: 1000,
        mask: true,
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return
    }
    // console.log(this.data.imgs)
    var that = this;
    var gData = app.globalData;
    console.info(that.data);
    // console.info(gData.userId)
    var uploadImgNumber = that.data.imgs.length
    var q;
    for (q = 0; q < uploadImgNumber; q++) {
      // 图片上传七牛云
      that.getTokenAndImgUrl(q, function(res) {
        var token = res.data.data.cdn.token
        var key = res.data.data.cdn.key
        var downloadUrl = res.data.data.cdn.downloadUrl
        that.data.downloadUrl = downloadUrl
        console.info(res)
        console.info('-----------')
        var imgn = downloadUrl.substring(downloadUrl.lastIndexOf('.') - 1, downloadUrl.lastIndexOf('.'))
        // console.info(imgn)
        console.info(token)
        console.info(key)
        console.info(that.data.imgs)
        console.info(uploadImgNumber)

        wx.uploadFile({
          url: "https://up-z2.qiniup.com",
          filePath: that.data.imgs[imgn],
          name: 'file',
          header: 'Content-Type: multipart/form-data;',
          method: 'post',
          formData: {
            token: token,
            key: key,
          },
          success: function(res) {
            // console.info(res)
          },
          complete: function(res) {
            console.info(res)
          }
        })
      })
      console.info(that.data.downloadUrl)
      that.data.pictureUrls[q] = that.data.downloadUrl
      that.setData({
        pictureUrls: that.data.pictureUrls
      })
    }
    that.addRecard()
  },

  addRecard() {
    var gData = app.globalData;
    var that = this
    var pictureUrls = that.data.pictureUrls
    console.info(pictureUrls)
    console.info('------------')
    wx.request({
      url: 'http://api.minidope.com/api/v1.0/put_new_record',
      data: {
        "unionid": gData.unionid,
        "openid": gData.openid,
        "authorType": gData.userType, //1 teacher, 2 parent
        "text": that.data.text,
        "authorId": gData.teacherInfo.teacherId,
        "studentId": that.data.studentId, //如果是评论的话, 则此项可以不用填,
        "pictureUrls": pictureUrls,
        "recordType": that.data.type, //1:record,2:append",
        "parentRecordId": that.data.recordId, //如果是全新的一条记录, 则此项可以不用填,
        "orgAuthorId": that.data.orgAuthorId == 0 ? gData.userId : that.data.orgAuthorId, //原作者的id, 如果这是一条全新的, 那么就填自己
        "orgAuthorType": that.data.orgAuthorId == 0 ? gData.userType : that.data.orgAuthorType, //原作者的type
      },
      header: {},
      method: 'post',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res);
        wx.showToast({
          title: '上传成功',
          icon: 'success',
          image: '',
          duration: 1000,
          mask: true,
          success: function(res) {
            wx.navigateBack({
              delta: 1,
            })
          },
          fail: function(res) {},
          complete: function(res) {},
        })

      },
      fail: function(res) {
        console.log(res)
      },
      complete: function(res) {},
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.type == "append") {
      wx.setNavigationBarTitle({
        title: '评论'
      });
      this.data.type = 2;
    }
    this.data.studentId = parseInt(options.studentId);
    this.data.recordId = parseInt(options.recordId);
    console.info("pull");
    console.info(this.data);
    var contact = app.globalData.contact;
    for (var i in contact) {
      if (contact[i].studentId == this.data.studentId) {
        this.data.name = (contact[i].nickname == "" ? contact[i].name : contact[i].nickname);
        this.data.name = contact[i].name;
        console.info(contact[i]);
        console.info("find!!!!" + this.data.name);
        this.setData(this.data);
        break;
      }
    }

    if (options.name && options.studentId) {
      this.setData({
        name: options.name
      })
    }
  },

  getTokenAndImgUrl(imgNum, callback) {
    var imgNumber = imgNum
    var that = this
    that.getUploadImgFile(imgNumber, function(res) {
      var fileName = res;
      wx.request({
        url: 'http://api.minidope.com/api/v1.0/get_cdn_token',
        method: 'post',
        data: {
          appid: app.globalData.appId,
          fileName: fileName,
          action: 'z2'
        },
        success: function(res) {
          return callback(res)
        }
      })
    })
  },

  getUploadImgFile(imgNumber, callback) {
    var userId = app.globalData.userId

    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()

    const formatNumber = n => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }
    var timeArr = [year, month, day, hour, minute, second].map(formatNumber)
    var time = '';

    for (var t = 0; t < timeArr.length; t++) {
      time += timeArr[t]
    }
    console.info(time)
    var fileName = 't_' + userId + '_' + time + '_' + imgNumber + '.jpg '
    return callback(fileName)
  },

  //删除上传图片
  reom(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let imgs = that.data.imgs
    for (var i = 0; i < imgs.length; i++) {
      if (index == i) {
        imgs.splice(i, 1);
        i--;
      }
    }
    that.setData({
      imgs: imgs,
    });
  },
  //添加上传图片
  chooseImageTap: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#00000",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            that.chooseWxImage('album')
            // wx.chooseImage({
            //   sourceType: 'album',
            //   success: function(res) {
            //     var tempFilePaths = res.tempFilePaths[0]

            //   }
            // })
          } else if (res.tapIndex == 1) {
            that.chooseWxImage('camera')
          }
        }
      }
    })
  },
  noChoose: function() {
    var that = this;
    that.alert("最多只能上传6张哦~")
  },
  // 选取图片
  chooseWxImage: function(type) {
    var that = this;
    var imgsPaths = that.data.imgs;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        console.log(res);
        var imgsLimit = [];
        var tempFilePaths = that.data.tempFilePaths;
        var imgs = that.data.imgs;
        console.log(res.tempFilePaths);
        for (var i = 0; i < res.tempFilePaths.length; i++) {
          tempFilePaths[res.tempFilePaths[i]] = '';
          console.log(res.tempFilePaths[i])
          imgs.push(res.tempFilePaths[i]);
        };
        if (imgs.length > 3) {
          for (var i = 0; i < 3; i++) {
            imgsLimit.push(imgs[i]);
          }
          that.setData({
            imgs: imgsLimit,
            tempFilePaths: tempFilePaths,
          });
        } else {
          that.setData({
            imgs: imgs,
            tempFilePaths: tempFilePaths,
          });
        }
        if (imgsPaths.length >= 6) {
          that.setData({
            canChoose: false,
          });
        } else {
          that.setData({
            canChoose: true,
          });
        };
      },
    })
  },
})