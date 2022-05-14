// pages/index/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    markers:[],
    stores:[],
    longitude:0,
    latitude:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
        wx.request({
          url: 'https://apis.map.qq.com/ws/place/v1/suggestion?location='+that.data.latitude+','+that.data.longitude+'&keyword=美食&key=S4TBZ-6S6RO-XNJWW-SL4J6-LA2AK-4JF45',
          success (res) {
            for(let key in res.data.data){
              that.data.markers.push({
                id:res.data.data[key].id,
                latitude:res.data.data[key].location.lat,
                longitude:res.data.data[key].location.lng,
                title:res.data.data[key].title,
                iconPath:'/img/marker.png'
              })
            }
            that.setData({
              markers:that.data.markers,
              stores:res.data.data
            })
            console.log(res.data.data)
          }
        })
      }
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  onClick(item){
    console.log(item)
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