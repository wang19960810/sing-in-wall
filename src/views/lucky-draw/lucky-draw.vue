<template>
  <div class="lucky-draw">
    <div ref="luckyDrawContent" :style="{height: 'calc(' + listSize * 4 + 'vw' + ')'}">
      <div class="lucky-draw-left">
        <p>当前抽奖&nbsp;&nbsp;:</p>
        <div v-if="awardData.toString()">
          <h6>{{awardData.prizeName}} <span style="fontSize: 24px; color: #00ff80">{{awardData.singleNumber}}名</span></h6>
          <!--<img :src="imgURL + awardData.goodsImgName" alt="">-->
          <img :src="awardData.goodsImgName" alt="">
        </div>
      </div>
      <div class="user-list-Box">
        <div class="row-user-Box" v-for="(list, index) in listArray" :key="index">
          <p ref="userBox"
          :class="j.class? 'user-Box ' + j.class : 'user-Box'"
             v-for="(j, index) in list" :key="index">
            <img v-if="j.portrait && j.portrait !== ''" :src="j.portrait" :alt="j.name">
          </p>
        </div>
      </div>
      <div  class="lucky-draw-right">
        <p>中奖名单&nbsp;&nbsp;:</p>
        <div ref="luckyDrawRight">
          <div  ref="awardUserBox">
            <div v-for="(i, index) in awardUserData" :key="index" class="award-user-list">
              <img :src="i.portrait" alt="">
              <p class="award-user-message"><span>{{i.prizeName || awardData.prizeName}}</span><span>{{i.userName || i.contacts}}</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div  class="lucky-draw-button-box">
      <button @click="luckyDrawStart()" :disabled="disabled" v-if="startButton"  class="lucky-draw-button lucky-draw-start-button">开始抽奖</button>
      <button @click="stop()" v-else  class="lucky-draw-button lucky-draw-stop-button">停止</button>
    </div>
    <audio id="indexAudio" src="../../../static/music/pd-5b768d9f8dc16585.mp3" loop="loop">你的浏览器不支持播放音乐</audio>
    <audio id="indexAudio1" src="../../../static/music/60877b522f3362cb7f3b4d74ec381813.mp3" loop="loop">你的浏览器不支持播放音乐</audio>
    <el-dialog v-if="awardData.toString()" :title="dialogTitle" :visible.sync="dialogTableVisible" :before-close = "closeDialog" center>
      <div class="select-user-box">
        <div v-for="(i, index) in selectUser" :key="index">
          <img :src="i.portrait" alt="">
          <span>{{i.contacts}}</span>
        </div>
      </div>
      <button @click="clearDialog()" class="confirm-button">确定</button>
    </el-dialog>
  </div>
</template>

<script>
let Interval
let selectInterval
export default {
  name: 'lucky-draw',
  data () {
    return {
      dialogTitle: '',
      close: false,
      dialogTableVisible: false, // 弹框

      listSize: 5, // 一列显示人数
      rowSize: 16, // 一横排显示人数
      listArray: [], // 生成表格的数组

      userInfoArray: [], // 所有的签到用户
      showUserInfo: [], // 当前显示的所有用户

      awardData: {
        prizeName: '一等奖',
        goodsImgName: '../../static/奖品.jpg',
        singleNumber: 2
      }, // 当前抽取奖品的数据
      awardUserData: [
        {
          id: 1,
          userName: '小红',
          portrait: '../../static/log1.jpg' // 头像
        }, {
          id: 2,
          userName: '对象',
          portrait: '../../static/log2.jpg' // 头像
        }, {
          id: 3,
          userName: '小儿',
          portrait: '../../static/log3.jpg' // 头像
        }, {
          id: 4,
          userName: '黑衣人',
          portrait: '../../static/log4.jpg'// 头像
        }, {
          id: 5,
          userName: '牛顿',
          portrait: '../../static/log5.jpg' // 头像
        }, {
          id: 6,
          userName: '爱因斯坦',
          portrait: '../../static/log6.jpg' // 头像
        }, {
          id: 7,
          name: '中奖人',
          portrait: '../../static/log7.jpg' // 头像
        },
      ], // 已中奖用户列表
      notAwardUserData: [], // 未中奖用户列表
      imgSize: '', // 上一次选中的图片
      selectedSize: 0,

      selectNum: 2, // 抽取奖品人数
      selectUser: [], // 选中的中奖用户
      selectUserIds: [], // 选中的中奖用户的id
      pageSet: {}, // 页面设置
      startButton: true, // 按钮
      disabled: false,
      music: '',

      order: 1
    }
  },
  async created () {
    await this.setFrom()
    await this.saveSingInData()
  },
  mounted () {
    this.getStyle()
    window.onresize = () => {
      let awardUserBoxHg = this.$refs.awardUserBox.offsetHeight
      let luckyDrawRightHg = this.$refs.luckyDrawRight.offsetHeight
      if (awardUserBoxHg > luckyDrawRightHg) {
        this.getStyle()
      }
    }
  },
  updated () {
    let luckyDrawRightHg = this.$refs.luckyDrawRight.offsetHeight
    let awardUserBoxHg = this.$refs.awardUserBox.offsetHeight
    if (awardUserBoxHg > luckyDrawRightHg) {
      this.getStyle()
    }
  },
  beforeDestroy () {
    clearInterval(Interval)
    clearInterval(selectInterval)
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
      data = [
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
        }]
      data.forEach(item => {
        this.userInfoArray.push(item)
        this.user = item
        this.randomData()
      })
    },

    // 随机选择切换数据
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

    // 替换显示所需数据
    addData (size) {
      const remainder = size % this.rowSize // 计算随机在那一行上面的第几个
      const listSize = Math.floor(size / this.rowSize) // 计算随机在那一列上面
      this.listArray[listSize].splice(remainder, 1, this.user)
    },
    // 判断最近一次生成的数据是否一样
    recentData (size) {
      if (this.rowSize > 1 && this.imgSize === size) {
        this.randomData()
      } else {
        this.imgSize = size
        this.addData(size)
      }
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

    // 随机选择进行 动画 的数据
    selectedData () {
      selectInterval = setInterval(() => {
        this.listArray.map(item => {
          item.map(o => {
            if (o.class && o.class !== '') {
              delete o.class
            }
          })
        })
        this.excludeData()
      }, 80)
    },
    // 动画跳过没数据的表格
    excludeData () {
      let selectedSize = 0 // 记录数据的length
      let size = Math.floor(Math.random() * this.userInfoArray.length) // 随机改变的数据
      if (this.selectedSize === size) {
        if (size >= this.userInfoArray.length - 1) {
          size = 0
        } else {
          size++
        }
      }
      this.selectedSize = size
      this.listArray.forEach((item, index) => {
        item.forEach((k, j) => {
          if (k.id) {
            if (selectedSize === size) {
              let selectedUser = k
              selectedUser.class = 'selectedUser'
              this.listArray[index].splice(j, 1, selectedUser)
            }
            selectedSize++
          }
        })
      })
    },

    // 生成中奖数据
    produceData () {
      let awardUserData = this.awardUserData
      this.notAwardUserData = []
      this.userInfoArray.forEach(item => {
        let state = false
        awardUserData.forEach(key => {
          if (key.ownerid === String(item.id)) {
            state = true
          }
        })
        if (!state) {
          this.notAwardUserData.push(item)
        }
      })
      if (this.notAwardUserData.length > this.selectNum) {
        for (let i = 0; i < this.selectNum; i++) {
          this.removeDuplicationData()
        }
      } else {
        this.selectUser = [...this.notAwardUserData]
        this.notAwardUserData.forEach(item => {
          this.selectUserIds.push(item.id)
        })
      }
    },
    // 去除重复中奖的数据
    removeDuplicationData () {
      let awardUserDataIds = []
      let size = Math.floor(Math.random() * this.userInfoArray.length) // 随机改变的数据
      let selectUserIds = this.selectUserIds
      let userInfoArray = this.userInfoArray
      this.awardUserData.forEach(item => {
        awardUserDataIds.push(item.ownerid)
      })
      if (userInfoArray[size].id) {
        if (selectUserIds.indexOf(userInfoArray[size].id) !== -1 || awardUserDataIds.indexOf(String(userInfoArray[size].id)) !== -1) {
          this.removeDuplicationData()
        } else {
          this.selectUser.push(userInfoArray[size])
          this.selectUserIds.push(userInfoArray[size].id)
        }
      } else {
        this.removeDuplicationData()
      }
    },
    // 开启音乐
    audioPlay (audio) {
      if (audio.paused) {
        audio.play()
      } else {
        audio.pause()
      }
    },
    // 开启抽奖
    async luckyDrawStart () {
      this.startButton = false
      this.selectUser = []
      this.selectUserIds = []
      let audio = document.getElementById('indexAudio')
      this.audioPlay(audio)
      await this.selectedData()
      this.upDataListArray()
    },
    // 发起提交请求
    startReqData () {
      this.dialogTitle = this.awardData.prizeName
      this.dialogTableVisible = true
    },
    // 停止抽奖
    async stop () {
      this.produceData()
      let audio = document.getElementById('indexAudio')
      let audio1 = document.getElementById('indexAudio1')
      this.audioPlay(audio)
      this.audioPlay(audio1)
      clearInterval(selectInterval)
      this.startButton = true
      if (this.selectUserIds.length === 0) {
        this.$message.error('全部人员已中奖')
        return false
      }
      this.startReqData()
    },
    // 关闭弹窗
    closeDialog () {
      let audio1 = document.getElementById('indexAudio1')
      this.audioPlay(audio1)
      this.dialogTableVisible = false
    },
    clearDialog () {
      this.dialogTableVisible = false
      window.location.reload()
    },
    // 修改动画
    getStyle () {
      let ss = document.styleSheets
      let cssRule
      for (let i = 0; i < ss.length; ++i) {
        for (let x = 0; x < ss[i].cssRules.length; ++x) {
          let rule = ss[i].cssRules[x]
          if (rule.name === 'rowup' && rule.type === CSSRule.KEYFRAMES_RULE) {
            cssRule = rule
          }
        }
      }
      let awardUserBoxHg = this.$refs.awardUserBox.offsetHeight
      let luckyDrawRightHg = this.$refs.luckyDrawRight.offsetHeight
      let Top = awardUserBoxHg - luckyDrawRightHg
      let animationDate = Math.round(Top / 70) * 1000
      this.$refs.awardUserBox.style.animation = `${animationDate}ms rowup linear infinite normal`
      cssRule.appendRule('100%{top:  -' + Top + 'px}')
    }
  }
}
</script>

<style lang="less">
  .lucky-draw {
    margin: 30vh auto 0;
    >div{
      display: flex;
      width: 100%;
      justify-content: space-around;
    }
    .lucky-draw-left{
      color: #fff;
      padding: 0 2vw;
      font-size: 18px;
      min-width: 210px;
      p{
        text-align: left;
      }
      div{
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0;
        h6{
          font-size: 18px;
          margin-right: 10px;
        }
        img{
          width: var(--imgWd);
          height: var(--imgHg);
        }
      }
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
          width: var(--width);
          height: var(--width);
          margin: 0.2vw;
          border-radius: 3px;
          background-color: rgba(0, 0, 0, 0.2);
          overflow: hidden;
          &.selectedUser {
            transform: scale(1.2);
            /*box-shadow: 0px 1px 11px 4px #fff;*/
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      .big-user-box {
        position: absolute;
        width: 100px;
        height: 100px;
        left: 0;
        top: calc(50% - 50px);
        border: 3px solid #fff;
        border-radius: 3px;
        > div {
          position: relative;
          width: 100%;
          height: 100%;
          img {
            width: 100%;
            height: 100%;
          }
          span {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 100%;
            height: 40px;
            line-height: 40px;
            color: #333;
            letter-spacing: 5px;
            font-size: 12px;
            font-weight: 600;
            background: rgba(255, 255, 255, 0.9);
            font-family: "Microsoft YaHei";
          }
        }
      }
    }

    .lucky-draw-right{
      color: #fff;
      padding: 0 2vw;
      font-size: 18px;
      display: flex;
      flex-direction: column;
      >p{
        text-align: left;
      }
      >div{
        position: relative;
        overflow: hidden;
        margin-top: 10px;
        div{
          position: relative;
          width: 100%;
          /*animation: 5s rowup linear infinite normal;*/
        }
      }
      .award-user-list{
        display: flex;
        padding: 10px 0;
        img{
          width: 50px;
          height: 50px;
        }
        .award-user-message{
          display: flex;
          flex-direction: column;
          justify-content: center;
          letter-spacing: 2px;
          width: 150px;
          font-size: 18px;
          background-color: rgba(255, 255, 255, 0.5);
          span:nth-child(1) {
            font-size: 16px;
          }
        }
      }
    }
    .lucky-draw-button-box{
      padding-top: 50px;
      justify-content: center;
      .lucky-draw-button{
        background-size: 100% 100%;
        width: 150px;
        height: 70px;
        border: none;
        color: #fff;
        font-size: 18px;
        outline: none;
      }
      .lucky-draw-start-button{
        background: url("../../../static/image/start.png")no-repeat;
        background-size:100% 100% ;
      }
      .lucky-draw-stop-button{
        background: url("../../../static/image/stop.png")no-repeat;
        background-size:100% 100% ;
      }
    }
    // 弹框
    .el-dialog{
      position: relative;
      min-width: 50vw;
      max-height: 50vh;
      padding: 0 5vw;
      background:url("../../../static/image/获奖背景.png");
      background-size:100% 100%;
      .el-dialog__title{
        color: #fff;
        letter-spacing: 3px;
        font-size: 22px;
      }
      .el-table::before{
        left: 0;
        bottom: 0;
        width: 100%;
        height: 0;
      }
      .select-user-box{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        div{
          display: flex;
          flex-direction: column;
          color: #fff;
          align-items: center;
          padding: 5px;
          img{
            height: 75px;
            width: 75px;
            box-shadow: 0 0 12px 0 #000;
            border-radius: 5px;
          }
          h6{
            font-size: 22px;
          }
          span{
            font-size: 18px;
          }
        }
      }
      .confirm-button{
        position: absolute;
        width: 160px;
        height: 50px;
        padding-left: 20px;
        bottom: 50px;
        left: calc(50% - 80px);
        outline: none;
        border: none;
        color: #fff;
        font-size: 20px;
        letter-spacing: 20px;
        background:url("../../../static/image/ok.png")no-repeat;
        background-size:100% 100%;
      }
    }
    @keyframes rowup {
      0% {
        top: 0;
        /*transform: translate3d(0, 0, 0)*/
      }
    }
  }
</style>
