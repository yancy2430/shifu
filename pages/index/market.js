// pages/index/market.js
import {url} from '../../utils/url.js'
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
  },
  onSearch(value){
      let that = this;
      wx.showLoading({
        title: '加载中',
      })
    wx.request({
        url: url + '/market/GetMarketForSearch',
        method:"POST",
        data:{
          user_id: wx.getStorageSync('openid'),
          "key": value.detail
        },
        success(res){
          wx.stopPullDownRefresh()
          wx.hideLoading()
            that.setData({
                market:res.data.market
            })
        }
      })
  },
  onShow(){
    this.onSearch({detail:""})
  },
  onPullDownRefresh(){
    this.onSearch({detail:""})
  },
  getShifu(data){
    console.log(data)
    wx.request({
      url: 'http://101.35.113.218:7116/market/UpdateRestaurantFroMarketId',
      method:'POST',
      data:{
        user_id: wx.getStorageSync('openid'),
        id: data.currentTarget.dataset.id
      },
      success(res){
        wx.showToast({
          title: '下载市场成功',
          icon: 'success',
          duration: 2000
        })
        
      }
    })
  }
})