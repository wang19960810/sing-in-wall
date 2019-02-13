import Vue from 'vue'
import Router from 'vue-router'
import SingIn from '@/views/sing-in/sing-in'
import SingIndex from '@/views/sing-index/sing-index'
import LuckyDraw from '@/views/lucky-draw/lucky-draw'

Vue.use(Router)
const router = new Router({
  routes: [
    {
      path: '/',
      name: 'SingIndex',
      redirect: '/index/singIn',
      component: SingIndex,
      children: [
        {
          path: '/index/singIn',
          name: 'singIn',
          component: SingIn,
          meta: {
            title: '签到'
          }
        }, {
          path: '/luckyDraw',
          name: 'luckyDraw',
          component: LuckyDraw,
          meta: {
            title: '抽奖'
          }
        }
      ]
    }
  ]
})

export default router
router.beforeEach(async (to, from, next) => {
  if (to.meta.title) document.title = to.meta.title
  next()
})
