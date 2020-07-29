// Plugin for Vue to add services (like Twitch, Youtube, etc) and root Isaac object globally into Vue object

let Services = {

  install (vue, options) {

    vue.prototype.$services = {
      twitch: null,
      youtube: null,
      itmr: null
    }

    vue.prototype.$isaac = null;
  
  }

}

export default Services;