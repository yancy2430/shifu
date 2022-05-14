// pages/shifu/shifuList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '食府管理',
    })
  },
  onShifu(){
    wx.navigateTo({
      url: '/pages/shifu/shifu',
    })
  },


  showPopup() {
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },
})