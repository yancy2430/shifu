// pages/history/history.js
import {
  url
} from '../../utils/url.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historys:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '吃啥记录',
    })
    let that = this;
    wx.request({
      url: 'http://101.35.113.218:7116/history/getHistory',
      method:"POST",
      data:{
        user_id: wx.getStorageSync('openid'),
      },
      success(res){
        that.setData({
          historys:res.data.history
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