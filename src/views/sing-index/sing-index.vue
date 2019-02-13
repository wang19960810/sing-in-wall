<template>
  <div class="sing-index" :style="{backgroundImage: 'url(' + pageSet.spotName + ')'}">
    <router-view/>
    <div class="sing-index-bottom">
      <p @click="cutPage(key)" v-for="(i, key) in singInFooterBnt"
         :style="{backgroundImage: i.select? 'url(' + i.images[1] + ')' : 'url(' + i.images[0] + ')'}"
         :key="key" class="button1-defult">
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'sing-index',
  data () {
    return {
      singInFooterBnt: [
        {
          select: true,
          url: '/index/singIn',
          images: [require('../../../static/image/sign-in-img/qiandaoqiang.png'), require('../../../static/image/sign-in-img/qiandaoqiang1.png')]
        }, {
          select: false,
          url: '/luckyDraw',
          images: [require('../../../static/image/sign-in-img/choujiang.png'), require('../../../static/image/sign-in-img/choujiang1.png')]
        }
      ],
      expoid: '',

      pageSet: {
        spotName: 'require(../../../static/image/sign-in-img/bg.jpg)'
      }
    }
  },
  created () {
    this.singInFooterBnt.map(item => {
      if (item.url === this.$route.path) {
        item.select = true
      } else {
        item.select = false
      }
      return false
    })
  },
  methods: {
    cutPage (key) {
      this.singInFooterBnt.map((item, index) => {
        if (index === key) {
          item.select = true
        } else {
          item.select = false
        }
      })
      this.$router.push({path: this.singInFooterBnt[key].url})
    }
  }
}
</script>

<style lang="less" scoped>
  .sing-index{
    width: 100%;
    height: 100vh;
    background: url("../../../static/image/sign-in-img/bg.jpg")no-repeat 100%;
    background-size: 100% 100%;
    overflow: auto;
    .sing-index-bottom{
      display: flex;
      position: absolute;
      height: 50px;
      width: 100%;
      bottom: 0;
      padding: 10px 20vw;
      box-sizing: border-box;
      .button1-defult{
        flex-grow: 2;
        height: 100%;
        background-position: center;
        background-repeat: no-repeat;
        /*background-size: 50%;*/
      }
    }
  }
</style>
