// pages/shifu/shifu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shifuData:{},
    restaurant_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.restaurant_id = options.id
    this.getList()
  },
  getList(){//获取食物列表
    let that = this;
    wx.request({
      url: 'http://101.35.113.218:7116/restaurants/getOneRestaurant',
      method:"POST",
      data:{
        user_id: getApp().globalData.userInfo.nickName,
        "id":that.restaurant_id
      },
      success(res){
        wx.setNavigationBarTitle({
          title: res.data.data.name,
        })
        that.setData({
          shifuData:res.data.data
        })
      }
    })
  },
  delFood(){
    wx.showModal({
      title: '提示',
      content: '确定删除此食物？',
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  addFood(){
    let that = this;
    wx.showModal({
      title: '输入食物名称',
      content: "",
      editable: true,
      success(res) {
        if (res.confirm) {
          wx.request({
            url: 'http://101.35.113.218:7116/restaurants/newFoods',
            method: "POST",
            data: {
              restaurant_id: that.restaurant_id,
              food_list:[{
                "address": "",
                "name": res.content
              }],
              user_id: getApp().globalData.userInfo.nickName,
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
  }
})