var util = require('../utils/timeutil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    futureList: [],
    city: "福州市"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      city: options.city
    })
    this.futureRequest()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.futureRequest(() => {
      wx.stopPullDownRefresh()
    })
  },

  futureRequest(callback) {
    let that = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/future',
      data: {
        city: this.data.city,
        time: util.timeStamp(new Date())
      },
      success(res) {
        let result = res.data.result
        var dateList = util.getDates(7, new Date())
        var weatherList = []
        for (let i = 0; i < result.length; i += 1) {
          weatherList.push({
            weekday: dateList[i].week,
            date: dateList[i].time,
            temp: result[i].minTemp + "° - " + result[i].maxTemp + "°",
            image: "/images/" + result[i].weather + "-icon.png",
          })
        }
        weatherList[0].weekday = "今天"
        that.setData({
          futureList: weatherList
        })
      },
      complete: () => {
        callback && callback()
      }
    })
  }
})