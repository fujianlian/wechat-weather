const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
};

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

var util = require('../utils/timeutil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    temp: '',
    weather: '',
    weatherBackGround: '',
    forecastDatas: [],
    todayDate: "",
    dayTemp: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.requestWeather()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.requestWeather(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  requestWeather(callback) {
    let that = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: '上海市'
      },
      success(res) {
        let result = res.data.result
        that.setNow(result.now)
        that.setToday(result.today)
        that.setForeCastList(result.forecast)
      },
      complete: () => {
        callback && callback()
      }
    })
  },

  /**
   * 设置当前天气
   */
  setNow(now) {
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[now.weather],
    })
    this.setData({
      temp: now.temp + "°",
      weather: weatherMap[now.weather],
      weatherBackGround: "/images/" + now.weather + "-bg.png",
    })
  },

  /**
   * 设置未来24小时天气
   */
  setForeCastList(forecast) {
    let forecastDatas = [];
    let nowHour = new Date().getHours()
    for (let i = 0; i < 8; i += 1) {
      if (i < forecast.length) {
        forecastDatas.push({
          time: (nowHour + i * 3) % 24 + "时",
          image: "/images/" + forecast[i].weather + "-icon.png",
          temp: forecast[i].temp + "°",
        })
      } else {
        forecastDatas.push({
          time: (nowHour + i * 3) % 24 + "时",
          image: "/images/sunny-icon.png",
          temp: "0°",
        })
      }
    }
    forecastDatas[0].time = "现在"
    this.setData({
      forecastDatas: forecastDatas
    })
  },

  /**
   * 设置当天最高/最低气温
   */
  setToday(today) {
    this.setData({
      todayDate: util.formatTime(new Date())+" 今天",
      dayTemp: today.minTemp + "° - " + today.maxTemp + "°",
    })
  },

  clickTap() {
    wx.navigateTo({
      url: '/pages/list/list'
    })
  }
})