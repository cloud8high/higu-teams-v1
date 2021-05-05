import Vue from 'vue'
import Vuex from 'vuex'
import { SET_USER, GET_USER } from './mutation-types'

Vue.use(Vuex)

export default new Vuex.Store({
  // state ... vuex で保存するデータ
  state: {
    user: null,
  },
  // getters ... state の取得メソッド
  getters: {
    [GET_USER]: function(state) {
      return state.user
    },
  },
  // mutations ... 非同期処理を伴わない state の操作
  mutations: {
    [SET_USER]: function(state, user) {
      state.user = user
    },
  },
  // actions ... 非同期処理を伴う state の操作 / mutations を同名のアクションでラッピング 
  actions: {
    [SET_USER]: function(context, payload) {
      context.commit(SET_USER, payload)
    },
  },
})
