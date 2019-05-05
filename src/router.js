import Vue from 'vue'
import Router from 'vue-router'
import Index from './screens/Index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index
    },
    {
      path: '/start',
      name: 'start',
      component: () => import('./screens/Start.vue')
    }
  ]
})
