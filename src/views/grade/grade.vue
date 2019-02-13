<template>
  <div class="program-box">
    <div ref="programboxlist" class="program-box-list">
      <div>
        <div ref="programboxcontent" class="program-box-content">
          <div class="program" v-for="(item, index) in programsData" :key="index">
            <div class="img-box bor-r5" :class="item.posterName?'':'noimg'">
              <img class="bor-r5" :src="imgURL+item.posterName" alt>
            </div>
            <div class="program-name">
              <span class="name">{{item.name}}</span>
              <span class="totalTicket">{{item.totalTicket}}票</span>
            </div>
          </div>
        </div>
      </div>
      <div class="QRCode" v-if="showButton">
        <div class="picture">
          <img :src="imgURL+QRCode" alt>
        </div>
        <span>微信扫码投票</span>
      </div>
    </div>
    <div class="program-box-foot">
      <button class="foot-button start" v-if="!showButton && voteState" @click="haveToVote">开始投票</button>
      <button class="foot-button stop" v-if="showButton" @click="VotingEnd">停止投票</button>
    </div>
  </div>
</template>

<script>
import { program, imgURL } from "../../config/servers-url";
import { getQueryString } from "../../config/public";
import { Message } from "element-ui";
export default {
  name: "grade",
  data() {
    return {
      imgURL: imgURL,
      showButton: false,
      voteState: true,
      QRCode: "",
      expoid: "",
      voteUrl: "http://expo.iqnc.cn/meet/public/index.html?#/vote",
      programsData: []
    };
  },
  created() {
    this.expoid = getQueryString("expoid");
  },
  async mounted() {
    await this.getPrograms(1);
    window.onresize = () => {
      let boxContentHeight = this.$refs.programboxcontent.offsetHeight;
      let boxListHeight = this.$refs.programboxlist.offsetHeight;
      if (boxContentHeight > boxListHeight) {
        this.getStyle();
      }
    };
  },
  // 数据加载完之后执行,解决火狐获取自适应div高度为0的问题
  updated() {
    let boxContentHeight = this.$refs.programboxcontent.offsetHeight;
    let boxListHeight = this.$refs.programboxlist.offsetHeight;
    if (boxContentHeight > boxListHeight) {
      this.getStyle();
    }
  },
  methods: {
    // 修改动画
    getStyle() {
      let ss = document.styleSheets;
      let cssRule;
      for (let i = 0; i < ss.length; ++i) {
        for (let x = 0; x < ss[i].cssRules.length; ++x) {
          let rule = ss[i].cssRules[x];
          let ruleName = rule.name;
          if (ruleName === "rollup" && rule.type === CSSRule.KEYFRAMES_RULE) {
            cssRule = rule;
          }
        }
      }
      let boxListHeight = this.$refs.programboxlist.offsetHeight;
      let boxContentHeight = this.$refs.programboxcontent.offsetHeight;
      let Top = boxContentHeight - boxListHeight + 100;
      let duration = (Top / boxListHeight) * 15;
      this.$refs.programboxcontent.style.animation = `${duration}s rollup linear infinite normal`;
      if (cssRule) {
        cssRule.appendRule(`100% {top:-${Top}px}`);
      }
    },
    async getPrograms(type) {
      const res = await this.$http.get(
        program.programList + "?expoid=" + this.expoid + "&type=" + type
      );
      if (res.code === "204" || res === "201") {
        this.programsData = res.data;
        this.voteState = true;
      } else if (res.code === "200" || res.code === "300") {
        this.programsData = res.data;
        this.voteState = false;
      }
      return res;
    },
    async haveToVote() {
      const res = await this.$http.post(program.QRCode, {
        expoid: this.expoid,
        voteUrl: this.voteUrl + "?expoid=" + this.expoid
      });
      if (res.success) {
        this.QRCode = res.data.qrcode;
        this.showButton = !this.showButton;
      } else {
        Message.error(res.msg);
      }
    },
    async VotingEnd() {
      const res = await this.getPrograms(0);
      if (res.success) {
        this.showButton = !this.showButton;
        const res = await this.$http.post(program.updatePhoneState, {
          expoid: this.expoid
        });
        if (res.success) {
          this.voteState = false;
        }
      }
    }
  }
};
</script>

<style lang="less">
.program-box {
  position: relative;
  top: 25%;
  height: 60vh;
  width: 75vw;
  margin: auto;
  .program-box-list {
    height: 55vh;
    overflow-y: hidden;
    .program-box-content {
      position: relative;
      animation: 15s init linear infinite normal;
      // height: 100%;
      .program {
        position: relative;
        display: inline-block;
        padding: 15px 35px;
        .img-box {
          // position: relative;
          // width: 100%;
          // height: 85%;
          img {
            width: 12.8rem;
            height: 8rem;
          }
        }
        .noimg {
          background-color: rgba(255, 255, 255, 0.5);
        }
        .bor-r5 {
          border-radius: 5px;
        }
        .program-name {
          margin-top: 7px;
          font-size: 1rem;
          .name {
            position: absolute;
            width: 50%;
            left: 2px;
            margin-left: 2.1rem;
          }
          .totalTicket {
            width: 96%;
            // margin-left: 50%;
            text-align: right;
          }
          span {
            display: inline-block;
            text-align: left;
            // font-size: 16px;
            overflow: hidden;
            color: #ffffff;
          }
        }
      }
    }
    .QRCode {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding-top: 200px;
      background-color: rgba(0, 0, 0, 0.5);
      .picture {
        margin: 144px auto 30px;
        width: 255px;
        height: 255px;
        img {
          width: 100%;
        }
      }
      span {
        position: relative;
        font-size: 48px;
        color: #fff;
      }
    }
  }
  .program-box-foot {
    margin-top: 50px;
    width: 100%;
    height: 20%;
    .foot-button {
      width: 180px;
      height: 85px;
      font-size: 1.5rem;
      border: none;
      outline: none;
      color: #fff;
    }
    .start {
      background: url("../../assets/image/sing-in/start.png") no-repeat;
    }
    .stop {
      position: relative;
      background: url("../../assets/image/sing-in/stop.png") no-repeat;
    }
  }
  @keyframes init {
    0% {
      top: 0;
    }
  }
  @keyframes rollup {
    0% {
      top: 100px;
    }
  }
}
</style>
