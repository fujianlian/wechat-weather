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

var QQMapWX = require('../../libs/qqmap-wx-jssdk.js');
var qqmapsdk;

const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

const UNPROMPTED_TIPS = "点击获取当前位置"
const UNAUTHORIZED_TIPS = "点击开启位置权限"
const AUTHORIZED_TIPS = ""

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: '福州市',
    locationTipsText: UNPROMPTED_TIPS,
    locationAuthType: UNPROMPTED,
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
    qqmapsdk = new QQMapWX({
      key: 'PTTBZ-GCMCQ-MBC5E-G5R2U-AU227-Y4BVM'
    });
    wx.getSetting({
      success: res => {
        let auth = res.authSetting["scope.userLocation"]
        this.setData({
          locationAuthType: auth ? AUTHORIZED : (auth === false) ? UNAUTHORIZED : UNPROMPTED,
          locationTipsText: auth ? AUTHORIZED_TIPS : (auth === false) ? UNAUTHORIZED_TIPS : UNPROMPTED_TIPS,
        })
        if (auth) {
          this.getCityAndWeather()
        } else {
          this.requestWeather()
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.requestWeather(() => {
      wx.stopPullDownRefresh()
    })
  },

  requestWeather(callback) {
    let that = this;
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
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
      todayDate: util.formatTime(new Date()) + " 今天",
      dayTemp: today.minTemp + "° - " + today.maxTemp + "°",
    })
  },

  clickTap() {
    wx.navigateTo({
      url: '/pages/list/list?city=' + this.data.city
    })
  },

  positionTap() {
    if (this.data.locationAuthType === UNAUTHORIZED) {
      wx.openSetting({
        success: res => {
          let auth = res.authSetting["scope.userLocation"]
          if (auth) {
            this.getCityAndWeather()
          }
        }
      })
    } else {
      this.getCityAndWeather()
    }
  },

  getCityAndWeather() {
    let that = this
    wx.getLocation({
      success: function(res) {
        that.setData({
          locationAuthType: AUTHORIZED,
          locationTipsText: AUTHORIZED_TIPS
        })
        var location = res.latitude + "," + res.longitude
        qqmapsdk.reverseGeocoder({
          location: location, //获取表单传入的位置坐标,不填默认当前位置,示例为string格式
          success: function(res) { //成功后的回调
            var res = res.result;
            that.changeCity(res.address_component.city)
          },
          fail: function(error) {
            console.error(error);
          },
        })
      },
      fail: () => {
        that.setData({
          locationAuthType: UNAUTHORIZED,
          locationTipsText: UNAUTHORIZED_TIPS
        })
      }
    })
  },

  changeCity(city) {
    this.setData({
      city: city,
      locationTip: ""
    })
    this.requestWeather()
  }
})