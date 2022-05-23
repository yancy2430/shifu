// app.js
App({
  data: {
    // APP_ID: 'wx90e53081e03a547c',//输入小程序appid
    APP_ID: 'wxf0adf8708a4d89cd',//输入小程序appid
      APP_SECRET: '9acbe6e9daf96b53150f871d12b8f5e5',//输入小程序app_secret
      openId: '',
      OPEN_ID: '',
      SESSION_KEY: ''
  },
  onLaunch() {
    
  },
  globalData: {
    userInfo: wx.getStorageSync('userInfo')
  }
})
