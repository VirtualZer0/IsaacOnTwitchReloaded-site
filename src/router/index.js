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
    component: () => import(/* webpackChunkName: "start-screen" */'../screens/Start.vue')
  },
  {
    path: '/community',
    name: 'community',
    component: () => import(/* webpackChunkName: "community-screen" */'../screens/Community.vue')
  },
  {
    path: '/download',
    name: 'download',
    component: () => import(/* webpackChunkName: "download-screen" */'../screens/Download.vue')
  },
  {
    path: '/luadebug',
    name: 'laudebug',
    component: () => import(/* webpackChunkName: "luadebug-screen" */'../screens/EnableLuadebug.vue')
  },
  {
    path: '/channels',
    name: 'channels',
    component: () => import(/* webpackChunkName: "channels-screen" */'../screens/Channels.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import(/* webpackChunkName: "settings-screen" */'../screens/Settings.vue')
  },
  {
    path: '/gamemode',
    name: 'gamemode',
    component: () => import(/* webpackChunkName: "gamemode-screen" */'../screens/Gamemode.vue')
  },
  {
    path: '/game',
    name: 'game',
    component: () => import(/* webpackChunkName: "game-screen" */'../screens/Game.vue')
  },
  {
    path: '/mobile',
    name: 'mobile',
    component: () => import(/* webpackChunkName: "mobile-screen" */'../screens/Mobile.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import(/* webpackChunkName: "chat-screen" */'../screens/Chat.vue')
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
