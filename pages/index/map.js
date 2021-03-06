// pages/index/map.js
import {url} from '../../utils/url.js'
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
        url: url + '/restaurants/this',
        method: "POST",
        data: {
          user_id: wx.getStorageSync('openid'),
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
      wx.showLoading({
        title: '加载中',
      })
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
          wx.hideLoading()        
        }
      })
  },
  onAddShifu(data){
      console.log(data.currentTarget.dataset.name)
    let that = this;
      wx.request({
        url: url + '/restaurants/newFoods',
        method: "POST",
        data: {
          restaurant_id: that.restaurant_id,
          food_list:[{
            "address": data.currentTarget.dataset.address,
            "name": data.currentTarget.dataset.name
          }],
          user_id: wx.getStorageSync('openid'),
        },
        success(res) {
          wx.showToast({
            title: res.data.message,
            icon: 'success',
            duration: 2000
          })
        }
      })
  }
})