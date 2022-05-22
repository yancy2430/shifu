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
    restaurant_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude
        })
        that.onSearch({value:{detail:"美食"}})
      }
     })
     wx.request({
        url: 'http://101.35.113.218:7116/restaurants/this',
        method: "POST",
        data: {
          user_id: getApp().globalData.userInfo.nickName,
        },
        success(res){
            console.log("res.data.this",res.data.this)
            that.setData({
                restaurant_id:res.data.this
            })
        }
     })
  },
  onSearch(value){
      let key = value.detail || "美食"
      let that = this;
      console.log(key)
    wx.request({
        url: 'https://apis.map.qq.com/ws/place/v1/suggestion?location='+that.data.latitude+','+that.data.longitude+'&keyword='+key+'&key=S4TBZ-6S6RO-XNJWW-SL4J6-LA2AK-4JF45',
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
  },
  onAddShifu(data){
      console.log(data.currentTarget.dataset.name)
    let that = this;
      wx.request({
        url: 'http://101.35.113.218:7116/restaurants/newFoods',
        method: "POST",
        data: {
          restaurant_id: that.restaurant_id,
          food_list:[{
            "address": data.currentTarget.dataset.address,
            "name": data.currentTarget.dataset.name
          }],
          user_id: getApp().globalData.userInfo.nickName,
        },
        success(res) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
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