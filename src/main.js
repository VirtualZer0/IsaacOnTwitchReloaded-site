import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import './plugins/locale/localePlugin'
import ServicesPlugin from './plugins/services/servicesPlugin';
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    getImgUrl: img => require.context('./assets/img/', false, /\.png$/)('./' + img + ".png")
  }
})

new Vue({
  router,
  store,

  beforeMount () {
    this.$store.dispatch('initLocale');
  },

  render: h => h(App)
}).$mount('#app')

Vue.use(ServicesPlugin);