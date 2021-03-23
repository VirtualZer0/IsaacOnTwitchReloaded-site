import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    locale: 'en',
    twitchName: '',

    settings: {

      timings: {
        vote: 45,
        delay: 15
      },

      chances: {
        events: 5,
        items: 5,
        trinkets: 1,
        other: 3,
        removeItems: 4
      },

      subsAndBits: {
        subs: true,
        bits: true,
        superchat: true,
        follows: false
      },

      hideVotes: false,

      textpos: {
        l1: {X: 16, Y: 190},
        l2: {X: 16, Y: 215}
      },

      subtime: 15*60*30

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
    },

    setTwitchName (state, payload) {
      state.twitchName = payload;
      localStorage.setItem('twitchName', state.twitchName);
    },

    setTextPos (state, payload) {
      state.settings.textpos = payload;
      localStorage.setItem('settings', JSON.stringify(state.settings));
    }

  },
  actions: {

    initLocale ({commit}) {

      switch (navigator?.language) {

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

      if (localStorage.getItem('twitchName')) {
        commit('setTwitchName', localStorage.getItem('twitchName'));
      }

    }

  },
  modules: {
  }
})
