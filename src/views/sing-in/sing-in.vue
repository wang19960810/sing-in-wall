<template>
  <div class="sing-in-index">
    <!--<i class="iconfont icon-mn_shengyin_fill"></i>-->
    <div class="user-list-Box">
      <div class="row-user-Box" v-for="(list, index) in listArray" :key="index">
        <div ref="userBox" class="user-Box" v-for="(j, index) in list" :key="index">
          <p>
            <img v-if="j.portrait && j.portrait !== ''" :src="j.portrait" :alt="j.name">
            <span>{{j.name}}</span>
          </p>
        </div>
      </div>
      <div class="big-user-box"  v-show="bigImgState" ref="bigImgs">
        <div>
          <img class="big-user-logo" :src="user.portrait" alt="">
          <span>{{user.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let Interval = null // 筛选数据
let getDataInterval = null // 取出缓存数据
export default {
  name: 'singIn',
  data () {
    return {
      bigImgState: false, // 签到用户大图展示（false: 关闭）

      listSize: 6, // 一列显示人数
      rowSize: 15, // 一横排显示人数
      listArray: [], // 生成表格的数组

      userInfoArray: [], // 所有的签到用户
      showUserInfo: [], // 当前显示的所有用户
      codeData: {
        signInUrl: 'http://expo.iqnc.cn/meet/public/index.html#/sign',
        expoid: ''
      },
      // 当前签到用户
      user: {
        id: 0,
        name: '王小明',
        portrait: '' // 头像
      },
      saveUser: [
        {
          id: 1,
          name: '小红',
          portrait: '../../static/log1.jpg' // 头像
        }, {
          id: 2,
          name: '对象',
          portrait: '../../static/log2.jpg' // 头像
        }, {
          id: 3,
          name: '小儿',
          portrait: '../../static/log3.jpg' // 头像
        }, {
          id: 4,
          name: '黑衣人',
          portrait: '../../static/log4.jpg'// 头像
        }, {
          id: 5,
          name: '牛顿',
          portrait: '../../static/log5.jpg' // 头像
        }, {
          id: 6,
          name: '爱因斯坦',
          portrait: '../../static/log6.jpg' // 头像
        }, {
          id: 7,
          name: '中奖人',
          portrait: '../../static/log7.jpg' // 头像
        }, {
          id: 8,
          name: '随便',
          portrait: '../../static/log8.jpg' // 头像
        }, {
          id: 9,
          name: '哈喽',
          portrait: '../../static/log10.jpg' // 头像
        }, {
          id: 10,
          name: 'Boss',
          portrait: '../../static/log6.jpg' // 头像
        }, {
          id: 11,
          name: '小明',
          portrait: '../../static/log1.jpg' // 头像
        }
      ], // 保存开启socket之后传递的签到用户

      imgLeft: 0, // 大图距离左边的距离
      imgTop: 0, // 大图距离上边的距离

      imgSize: '', // 上一次选中的图片

      getUserListArguments: {
        type: 2, // 1展商，2个人
        expoid: '', // 展会id
        contact: '' // 模糊查询名字
      },

      pageSet: {}, // 页面设置
      IntelvalState: 'start', // 开启定时筛选
      animationStart: false // 开启动画
    }
  },
  async created () {
    await this.setFrom()
    await this.saveSingInData()
  },
  mounted () {
    this.upDataListArray()
  },
  updated () {
    let ss = document.styleSheets
    let cssRule
    for (let i = 0; i < ss.length; ++i) {
      for (let x = 0; x < ss[i].cssRules.length; ++x) {
        let rule = ss[i].cssRules[x]
        if (rule.name === 'leave' && rule.type === CSSRule.KEYFRAMES_RULE) {
          cssRule = rule
        }
      }
    }
    cssRule.appendRule(`100% {transform: scale(0.5); top:${this.imgTop - 25}px; left:${this.imgLeft - 25}px}`)
  },
  beforeDestroy () {
    clearInterval(getDataInterval)
    clearInterval(Interval)
  },
  methods: {
    // 设置页面的表格
    setFrom () {
      for (let i = 0; i < this.listSize; i++) {
        let list = []
        for (let j = 0; j < this.rowSize; j++) {
          list.push({})
        }
        this.listArray.push(list)
      }
    },
    // 存入已签到数据
    saveSingInData (data) {
      // this.animationStart = false
      // data.forEach(item => {
      //   this.userInfoArray.push(item)
      //   this.user = item
      //   this.randomData()
      // })
      this.animationStart = true
      this.saveSingInDataEnd()
    },
    // 拿取缓存的数据
    saveSingInDataEnd () {
      const _this = this
      getDataInterval = setInterval(() => {
        if (_this.saveUser.length !== 0) {
          _this.addUser(_this.saveUser[0])
          _this.saveUser.splice(0, 1)
        }
      }, 2500)
    },
    // 签到墙显示满之后，每隔一段时间进行筛选
    upDataListArray () {
      Interval = setInterval(() => {
        let showUserInfo = this.showUserInfo
        if (showUserInfo.length === this.listSize * this.rowSize && showUserInfo.length < this.userInfoArray.length) {
          const cutNum = Math.ceil(Math.random() * showUserInfo.length) // 随机改变个数
          for (let i = 0; i <= cutNum; i++) {
            const cutUser = Math.floor(Math.random() * this.userInfoArray.length) // 随机取出用于改变的数据
            let size = Math.floor(Math.random() * this.listSize * this.rowSize) // 随机改变的数据
            const remainder = size % this.rowSize // 计算随机在那一行上面的第几个
            const listSize = Math.floor(size / this.rowSize) // 计算随机在那一列上面
            /** 截取并替换掉原数据
             *  vue不能直接监听数组数据内部的变化, 但是官方提供了一些操作数组的方法,用于监听数组
             *  push()、pop()、shift()、unshift()、splice()、reverse()、sort()
             * */
            this.listArray[listSize].splice(remainder, 1, this.userInfoArray[cutUser])
          }
        }
      }, 1000 * 3)
    },

    // 添加一条数据
    addUser (data) {
      clearInterval(Interval)
      this.user = data
      this.randomData()
    },
    // 随机选择数据
    randomData () {
      let size = Math.floor(Math.random() * this.listSize * this.rowSize)
      let showUserInfo = this.showUserInfo

      // 判断用于显示的数组的数据是否已经存满
      if (showUserInfo.length !== this.listSize * this.rowSize) {
        // 判断重复数据的存在
        const showUserInfoNum = showUserInfo.filter(item => item === size)

        if (showUserInfoNum.length === 0) {
          showUserInfo.push(size) // 将当前随机生成的数据保存至用于记录页面显示的数组
          this.recentData(size)
        } else {
          this.randomData()
        }
      } else {
        this.recentData(size)
      }
    },

    // 计算动画所需数据
    async animationData (size) {
      const userBox = this.$refs.userBox // 放置用户信息的Dom
      const remainder = size % this.rowSize // 计算随机在那一行上面的第几个
      const listSize = Math.floor(size / this.rowSize) // 计算随机在那一列上面
      if (!this.animationStart) {
        this.listArray[listSize].splice(remainder, 1, this.user)
      } else if (this.animationStart) {
        this.imgLeft = userBox[size].offsetLeft // 向左移动的距离
        this.imgTop = userBox[size].offsetTop // 向上移动的距离
        this.bigImgState = true // 显示移动的Dom
        this.userInfoArray.push(this.user) // 填充至显示总数据的数组
        // 结束动画后, 替换数据并关闭移动的Dom
        await setTimeout(() => {
          this.listArray[listSize][remainder] = this.user // 替换原始数据
          this.bigImgState = false
          this.upDataListArray()
        }, 2400)
      }
    },
    // 判断最近一次生成的数据是否一样
    recentData (size) {
      if (this.imgSize === size) {
        this.randomData()
      } else {
        this.imgSize = size
        this.animationData(size)
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less">
  .sing-in-index{
    margin: 30vh auto 0;
    .iconfont {
      position: absolute;
      color: #b5b5b5;
      font-size: 30px;
      top: 10px;
      right: 180px;
    }
    >img{
      position: absolute;
      right: 50px;
      top: 50px;
      width: 150px;
      height: 150px;
    }
    .user-list-Box {
      position: relative;
      display: inline-block;
      display: flex;
      flex-direction: column;
      align-items: center;
      .row-user-Box {
        display: flex;
        .user-Box {
          width: 4vw;
          height: 4vw;
          margin: 3px;
          border-radius: 3px;
          background-color: rgba(0, 0, 0, 0.2);
          img{
            width: 100%;
            height: 100%;
          }
          span{
            position: absolute;
            display: none;
            bottom: 0;
            width: 100%;
            left: 0;
            font-size: 12px;
            color: #f1f1f1;
            background-color: rgba(74, 74, 74, 0.8);
          }
          p{
            position: relative;
            overflow: hidden;
            border-radius: 3px;
            width: 4vw;
            height: 4vw;
          }
          p:hover{
            transform: scale(2);
          }
          &:hover{
            z-index: 10;
          }
          &:hover span{
            display: block;
          }
        }
      }
      .big-user-box{
        position: absolute;
        width: 100px;
        height: 100px;
        left: 0;
        top: calc(50% - 50px);
        border: 3px solid #fff;
        border-radius: 3px;
        animation-name: enter, leave;
        animation-duration: 0.8s, 0.4s;
        animation-timing-function: linear, linear;
        animation-delay: 0s, 2s;
        animation-fill-mode: forwards, forwards;
        >div{
          position: relative;
          width: 100%;
          height: 100%;
          img{
            width: 100%;
            height: 100%;
          }
          span{
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 20px;
            line-height: 20px;
            color: #333;
            letter-spacing: 5px;
            font-size: 12px;
            font-weight: 600;
            background: rgba(255,255,255,0.9);
            font-family: "Microsoft YaHei";
          }
        }
      }
    }
    @keyframes enter {
      0% {
        left: -70px;
        top: calc(50% - 50px);
        transform: scale(1);
      }
      50%{
        left: calc(50% - 50px);
        transform: scale(3);
      }
      100% {
        left: calc(50% - 50px);
        transform: scale(2);
      }
    }

    @keyframes leave {
      0% {
        left: calc(50% - 50px);
        transform: scale(2);
      }
    }
  }

</style>
