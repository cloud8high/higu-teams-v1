import Vue from 'vue'
import VueRouter from 'vue-router'
import { Auth } from 'aws-amplify'
import store from '@/store/index'
import { SET_USER } from '@/store/mutation-types'

Vue.use(VueRouter)

const routes = [
  {
    path: '/signin',
    name: 'Signin',
    component: () => import(/* webpackChunkName: "signin" */ '@/views/Signin.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/theme',
    name: 'Theme',
    component: () => import(/* webpackChunkName: "signin" */ '@/views/Theme.vue'),
  },
  {
    path: '/theme/:themeId',
    name: 'Topiclist',
    component: () => import(/* webpackChunkName: "topiclist" */ '@/views/TopicList.vue'),
    props: true,
  },
  {
    path: '/landing',
    name: 'Landing',
    component: () => import(/* webpackChunkName: "landing" */ '@/views/Landing.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/edittheme',
    name: 'EditTheme',
    component: () => import(/* webpackChunkName: "addtheme" */ '@/views/EditTheme.vue'),
  },
  {
    path: '/',
    name: 'Top',
    redirect: '/theme',
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// Vue Router のグローバルナビゲーションガード / ルート遷移時に権限判定処理を差し込む
// ログインをしていなければログインページに強制遷移をするナビゲーション
router.beforeEach(async (to, from, next) => {
  const user = await Auth.currentUserInfo()
  store.dispatch(SET_USER, user)
  if (to.matched.some(record => !record.meta.isPublic) && user === null) {
    next({ path: '/landing' })
  } else {
    next()
  }
})

export default router
