// pages/shifu/shifuList.js
import {url} from '../../utils/url'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    addText: "",
    restaurants: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.setNavigationBarTitle({
      title: '食府管理',
    })
    this.getList()
  },
  getList() {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: url + '/restaurants/all',
      method: "POST",
      data: {
        user_id: wx.getStorageSync('openid'),
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data.data)
        that.setData({
          restaurants: res.data.data
        })
      }
    })
  },
  uploadItem(data){
    wx.request({
        url: url + '/market/AddMarketForRestaurantId',
        method: "POST",
        data: {
          id: data.target.dataset.id,
          user_id: wx.getStorageSync('openid'),
        },
        success(res){
            wx.showToast({
              title: res.data.message,
            })
        }
    })
  },
  updateItem(data) { //修改食府名
    let that = this;
    wx.showModal({
      title: '输入食府名称',
      content: data.target.dataset.name,
      editable: true,
      success(res) {
        if (res.confirm) {
          wx.request({
            url: url + '/restaurants/changeRestaurantName',
            method: "POST",
            data: {
              name: res.content,
              id: data.target.dataset.id,
              user_id: wx.getStorageSync('openid'),
            },
            success(res) {
              that.getList()
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 2000
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  delItem(data) { //删除食府
    let that = this;
    wx.request({
      url: 'http://101.35.113.218:7116/restaurants/Delete',
      method:'POST',
      data: {
        id: data.target.dataset.id,
        user_id: wx.getStorageSync('openid'),
      },
      success(){
        that.getList()
      }
    })
  },
  onShifu(data) {
    wx.navigateTo({
      url: '/pages/shifu/shifu?id='+data.currentTarget.dataset.id,
    })
  },
  onAdd() {
    let that = this;
  },
  showPopup() {
    let that = this;
    wx.showModal({
      title: '输入食府名称',
      content: "",
      editable: true,
      success(res) {
        if (res.confirm) {
          wx.request({
            url: url + '/restaurants/newRestaurant',
            method: "POST",
            data: {
              name: res.content,
              user_id: wx.getStorageSync('openid'),
            },
            success(res) {
              wx.showToast({
                title: res.data.message,
                icon: 'success',
                duration: 2000
              })
              that.getList()
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onClose() {
    this.setData({
      show: false
    });
  },
})