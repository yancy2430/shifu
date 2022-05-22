// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    foodData:{},
    restaurants:[],
    motto: 'Hello World',
    userInfo: {},
    shifuData:{},
    index:0,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  onLoad() {
    let that = this;
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
    this.onNext()
    wx.request({
      url: 'http://101.35.113.218:7116/restaurants/this',
      method:"POST",
      data:{
        user_id:"string",
      },
      success(res){
        wx.request({
          url: 'http://101.35.113.218:7116/restaurants/getOneRestaurant',
          method:"POST",
          data:{
            "user_id": "string",
            "id":res.data.this
          },
          success(res){
            console.log(res.data.data)
            that.setData({
              shifuData:res.data.data
            })
          }
        })
      }
    })
    //获取所有食府
    wx.request({
      url: 'http://101.35.113.218:7116/restaurants/all',
      method:"POST",
      data:{
        user_id:"string",
      },
      success(res){
        console.log(res.data.data)
        that.setData({
          index:res.data.data.findIndex(function(item){
            return item.name==='asdasw'
          })
        })
          that.setData({
            restaurants:res.data.data
          })
      }
    })
  },
  onSelect(){
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success (res) {
        console.log(res.tapIndex)
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
    
  },
  onGoFood(item){
    console.log(item)
    wx.showModal({
      title: '提示',
      cancelText:"自行前往",
      confirmText:"导航前往",
      content: '选中了吃:'+item.currentTarget.dataset.food.name,
      success (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  bindPickerChange(value){
    // console.log("bindPickerChange",value.detail.value)
    let index = Number(value.detail.value);
    let that = this;
    wx.request({
      url: 'http://101.35.113.218:7116/restaurants/changeThis',
      method:"POST",
      data:{
        user_id:"string",
        id:that.data.restaurants[index].id,
      },
    })
  },
  onNext(){
    let that = this;
    wx.request({
      url: 'http://101.35.113.218:7116/restaurants/next',
      method:"POST",
      data:{
        user_id:"string",
      },
      success(res){
          console.log(res)
          that.setData({
            foodData:res.data
          })
      }
    })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
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
