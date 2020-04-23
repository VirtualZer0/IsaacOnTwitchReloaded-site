// Plugin for Vue to add services (like Twitch, Youtube, etc) globally into Vue object

let Services = {

  install (vue, options) {

    vue.prototype.$services = {
      twitch: null,
      youtube: null,
      itmr: null
    }
  
  }

}

export default Services;