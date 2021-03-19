import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: 'en',

    settings: {

      timings: {
        vote: 35,
        delay: 15
      },

      chances: {
        events: 7,
        items: 7,
        trinkets: 2,
        other: 1
      },

      subsAndBits: {
        subs: true,
        bits: true,
        superchat: true,
        follows: false
      },

      hideVotes: false,

      textpos: {
        l1: {X: 16, Y: 200},
        l2: {X: 16, Y: 225}
      },

      subtime: 10*60*30

    }
  },
  mutations: {

    setLocale (state, payload) {
      state.locale = payload;
      localStorage.setItem('locale', state.locale);
    },

    setSettings (state, payload) {
      state.settings = payload;
      localStorage.setItem('settings', JSON.stringify(payload));
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

    },

    init ({state, commit, dispatch}) {

      if (localStorage.getItem('locale')) {
        commit('setLocale', localStorage.getItem('locale'));
      }
      else {
        dispatch('initLocale');
        localStorage.setItem('locale', state.locale);
      }

      if (localStorage.getItem('settings')) {
        commit('setSettings', JSON.parse(localStorage.getItem('settings')));
      }
    }

  },
  modules: {
  }
})
