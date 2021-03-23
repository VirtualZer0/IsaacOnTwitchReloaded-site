// Plugin for Vue to add services (like Twitch, Youtube, etc) and root Isaac object globally into Vue object

let Services = {

  install (Vue, options) {

    Vue.prototype.$services = {
      twitch: null,
      youtube: null,
      itmr: null
    }

    Vue.prototype.$isaac = null;

  }

}

export default Services;