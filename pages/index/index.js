// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    foodData: {},
    restaurants: [],
    motto: 'Hello World',
    userInfo: {},
    shifuData: {},
    index: 0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  onLoad() {
    let that = this;
    if (wx.getStorageSync('userInfo')) {
      this.setData({
        canIUseGetUserProfile: true
      })
      wx.request({
        url: 'http://101.35.113.218:7116/restaurants/this',
        method: "POST",
        data: {
          user_id: getApp().globalData.userInfo.nickName,
        },
        success(res) {
          console.log("this", res.data)
          wx.request({
            url: 'http://101.35.113.218:7116/restaurants/getOneRestaurant',
            method: "POST",
            data: {
              user_id: getApp().globalData.userInfo.nickName,
              "id": res.data.this
            },
            success(result) {
              //获取所有食府
              wx.request({
                url: 'http://101.35.113.218:7116/restaurants/all',
                method: "POST",
                data: {
                  user_id: getApp().globalData.userInfo.nickName,
                },
                success(res) {
                  that.setData({
                    index: res.data.data.findIndex(function (item) {
                      return item.name === result.data.data.name
                    }),
                    restaurants: res.data.data
                  })
                }
              })
              that.setData({
                shifuData: res.data.data
              })
              that.onNext()
            }
          })
        }
      })
    }
    

  },
  onGoFood(item) {
    wx.showModal({
      title: '提示',
      cancelText: "自行前往",
      confirmText: "导航前往",
      content: '选中了吃:' + item.currentTarget.dataset.food.name,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.showToast({
            title: '功能暂未开放',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
        wx.request({
          url: 'http://101.35.113.218:7116/restaurants/go',
          method: "POST",
          data: {
            user_id: getApp().globalData.userInfo.nickName,
            id: item.currentTarget.dataset.food.id,
          },
          success(res){
            wx.showToast({
              title: res.data.message,
            })
          }
        })
      }
    })
  },
  bindPickerChange(value) {
    // console.log("bindPickerChange",value.detail.value)
    let index = Number(value.detail.value);
    let that = this;
    wx.request({
      url: 'http://101.35.113.218:7116/restaurants/changeThis',
      method: "POST",
      data: {
        user_id: getApp().globalData.userInfo.nickName,
        id: that.data.restaurants[index].id,
      },
      success(res){
        that.onLoad()
      }
    })
  },
  onNext() {
    let that = this;
    wx.request({
      url: 'http://101.35.113.218:7116/restaurants/next',
      method: "POST",
      data: {
        user_id: getApp().globalData.userInfo.nickName,
      },
      success(res) {
        console.log(res)
        that.setData({
          foodData: res.data
        })
      }
    })
  },
  getUserProfile(e) {
    let that = this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.setStorageSync('userInfo', res.userInfo)
        wx.setStorageSync('hasUserInfo', true)
        wx.request({
          url: 'http://101.35.113.218:7116/wx/isWxRegis',
          method:"POST",
          data:{
            "user_id": res.userInfo.nickName
          },
          success(res){
            that.onLoad()
          }
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})