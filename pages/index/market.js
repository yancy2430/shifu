// pages/index/market.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    market:[],
    activeNames:1
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
        this.onSearch({detail:""})
  },
  onSearch(value){
      let that = this;
    wx.request({
        url: 'http://101.35.113.218:7116/market/GetMarketForSearch',
        method:"POST",
        data:{
          user_id: getApp().globalData.userInfo.nickName,
          "key": value.detail
        },
        success(res){
            console.log(res.data.market)
            that.setData({
                market:res.data.market
            })
        }
      })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})