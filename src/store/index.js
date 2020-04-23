import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: 'en'
  },
  mutations: {

    setLocale (state, payload) {
      state.locale = payload;
    }

  },
  actions: {

    initLocale ({commit}) {

      switch (navigator.language) {

        case 'ru-RU':
          commit('setLocale', 'ru');
          break;

        default:
          commit('setLocale', 'en');
          break;

      }

    }

  },
  modules: {
  }
})
