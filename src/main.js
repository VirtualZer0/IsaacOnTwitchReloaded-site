import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './local/localFilter'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  data () {
    return {
      services: {
        twitch: null,
        youtube: null
      }
    }
  },
  router,
  render: h => h(App)
}).$mount('#app')
