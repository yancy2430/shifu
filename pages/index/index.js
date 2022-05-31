// index.js
// 获取应用实例
import {
  url
} from '../../utils/url.js'

const app = getApp()

Page({
  data: {
    code: '',
    foodData: {},
    restaurants: [],
    motto: 'Hello World',
    userInfo: {},
    shifuData: {},
    notSelect: false,
    index: 0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  onLoad() {
    let that = this;
    console.log(wx.getStorageSync('openid'))
    wx.showLoading({
      title: '加载中',
    })
    if (!wx.getStorageSync('openid')) {
      wx.login({
        success(res) {
          that.setData({
            code: res.code
          });
          wx.request({
            url: url + '/wx/getOpenId',
            method: "POST",
            data: {
              params: {
                appid: app.data.APP_ID,
                secret: app.data.APP_SECRET,
                js_code: res.code,
                grant_type: 'authorization_code'
              }
            },
            success(res) {
              wx.setStorageSync('openid', res.data.openid)
            },
            fail(res) {
              that.onLoad()
            }
          })
        },
        fail(res) {
          that.onLoad()
        }
      })
    }
    wx.request({
      url: url + '/wx/isWxRegis',
      method: "POST",
      data: {
        user_id: wx.getStorageSync('openid'),
      },
      success(res) {
        if (wx.getStorageSync('userInfo')) {
          that.setData({
            canIUseGetUserProfile: true
          })
          that.onGetRestaurantInfo()
        }
      }
    })

  },
  onGetRestaurantInfo() {
    let that = this
    //获取所有食府
    wx.request({
      url: url + '/restaurants/all',
      method: "POST",
      data: {
        user_id: wx.getStorageSync('openid'),
      },
      success(res) {
        that.setData({
          restaurants: res.data.data
        })
      }
    })
    wx.request({
      url: url + '/restaurants/this',
      method: "POST",
      data: {
        user_id: wx.getStorageSync('openid'),
      },
      success(res) {
        wx.hideLoading()
        console.log(res.data.this == null)
        if (res.data.this == null) {
          that.setData({
            notSelect: true
          })
          console.log(that.data.notSelect)
          return;
        }
        wx.request({
          url: url + '/restaurants/getOneRestaurant',
          method: "POST",
          data: {
            user_id: wx.getStorageSync('openid'),
            "id": res.data.this
          },
          success(result) {
            that.setData({
              shifu: result.data.data,
              shifuData: res.data.data,
              index: that.data.restaurants.findIndex(function (item) {
                return item.name === result.data.data.name
              }),
            })
            that.onNext()
          }
        })
      }
    })
  },
  onGoFood(item) {
    console.log(item)
    wx.request({
      url: url + '/restaurants/go',
      method: "POST",
      data: {
        user_id: wx.getStorageSync('openid'),
        id: item.currentTarget.dataset.id,
      },
      success(res) {
        console.log(res)
        wx.showModal({
          title: '提示',
          cancelText: "自行前往",
          confirmText: "导航前往",
          content: res.data.message,
          success(resd) {
            if (resd.confirm) {
              console.log('用户点击确定')
              wx.showToast({
                title: '功能暂未开放',
              })
            } else if (resd.cancel) {
              wx.showToast({
                title: res.data.message,
              })
            }
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
      url: url + '/restaurants/changeThis',
      method: "POST",
      data: {
        user_id: wx.getStorageSync('openid'),
        id: that.data.restaurants[index].id,
      },
      success(res) {
        that.onLoad()
      }
    })
  },
  onNext() {
    let that = this;
    wx.showLoading({
      title: '正在选择食物',
    })
    wx.request({
      url: url + '/restaurants/next',
      method: "POST",
      data: {
        user_id: wx.getStorageSync('openid'),
      },
      success(res) {
        let i = 0;
        console.log(res)
        let dsq = setInterval(function () {
          console.log(that.data.shifu.foods[i])
          that.setData({
            foodData: that.data.shifu.foods[i]
          })
          console.log(i)
          if(i<that.data.shifu.foods.length){
            i++;
          }else{
            i=0;
          }
        }, 200)
        that.setData({
          foodData: res.data
        })
        setTimeout(function () {
          wx.hideLoading()
          console.log("停止")
          clearInterval(dsq)
          // clearInterval(dsq)
        }, 2000)

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
          url: url + '/wx/isWxRegis',
          method: "POST",
          data: {
            "user_id": res.userInfo.nickName
          },
          success(res) {
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
  },
  onShow() {
    let that = this
    wx.request({
      url: url + '/restaurants/this',
      method: "POST",
      data: {
        user_id: wx.getStorageSync('openid'),
      },
      success(res) {
        let user_this = res.data.this
        if (that.data.index != user_this) {
          that.onGetRestaurantInfo()
        }
      }
    })
  }
})