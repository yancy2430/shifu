// app.js
App({
  onLaunch() {
    
  },
  globalData: {
    userInfo: wx.getStorageSync('userInfo')
  }
})
