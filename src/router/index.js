import Vue from 'vue';
import VueRouter from 'vue-router';
import Index from '../screens/Index.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Index
  },
  {
    path: '/start',
    name: 'start',
    component: () => import('../screens/Start.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../screens/Login.vue')
  },
  {
    path: '/mobile',
    name: 'mobile',
    component: () => import('../screens/Mobile.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
