import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import Amplify from 'aws-amplify'
import '@aws-amplify/ui-vue'
import aws_exports from './aws-exports'

Amplify.configure(aws_exports)
Vue.config.productionTip = false

// 共通で使うフィルター
Vue.filter('localTime', function(value) {
  const date = new Date(value)
  return date.toLocaleString()
})
Vue.filter('avatarName', function(value) {
  return value.substr(0, 2)
})
Vue.filter('avatarColor', function(value) {
  const colorList = {
    'A': '#708090',
    'B': '#696969',
    'C': '#a0522d',
    'D': '#d2691e',
    'E': '#daa520',
    'F': '#f4a460',
    'G': '#4b0082',
    'H': '#6a5acd',
    'I': '#800080',
    'J': '#9400d3',
    'K': '#8a2be2',
    'L': '#ff00ff',
    'M': '#40e0d0',
    'N': '#7fffd4',
    'O': '#008080',
    'P': '#808000',
    'Q': '#6b8e23',
    'R': '#228b22',
    'S': '#32cd32',
    'T': '#ffa500',
    'U': '#ff7f50',
    'V': '#db7093',
    'W': '#ff69b4',
    'X': '#dc143c',
    'Y': '#b22222',
    'Z': '#f08080',
  }
  return colorList[value.substr(0, 1).toUpperCase()]
})

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
