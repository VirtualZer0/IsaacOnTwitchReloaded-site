<template>
  <div id="app">
    <router-link to="/">
      <div class="logo" :style="'background-image: url('+getImgUrl('logo')+')'"></div>
    </router-link>
    <transition name="screenAnim" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      local: "en"
    }
  },

  methods: {
    getImgUrl(img) {
      var images = require.context('./assets/img/', false, /\.png$/)
      return images('./' + img + ".png")
    }
  },

  mounted () {
    this.$root.local = "en"
    this.local = this.$root.local;
  }
}
</script>


<style lang="less">
@font-face {
  font-family: "Upheaval";
  src: url("./assets/fonts/Upheaval/Upheaval.woff") format("woff"),
  url("./assets/fonts/Upheaval/Upheaval.otf") format("opentype"),
  url("./assets/fonts/Upheaval/Upheaval.ttf") format("truetype");
}

@font-face {
  font-family: "TeamMeat";
  src: url("./assets/fonts/TeamMeat/TeamMeat.woff") format("woff"),
  url("./assets/fonts/TeamMeat/TeamMeat.otf") format("opentype"),
  url("./assets/fonts/TeamMeat/TeamMeat.ttf") format("truetype");
}

body {
  background: #CCBEBB;
  color: #333;
  font-family: "TeamMeat";
  margin: 0;
  padding: 0;
  text-decoration: none;
  image-rendering: pixelated;
  overflow-x: hidden;
  font-size: 1.5rem;
}

a {
  text-decoration: none;
  color: inherit;
}

:visited {
  color: inherit;
}

.logo {
  margin-bottom: 16px;
  width: auto;
  height: 16vh;
  min-height: 116px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

#app {
  text-align: center;
}

h1, h2, h3, h4, h5, h6 {
  font-family: "Upheaval";
  margin-top: 0;
}

.screenAnim-leave-active,
.screenAnim-enter-active {
  transition: all .3s ease-in-out;
}

.screenAnim-enter {
  transform: translate(100%, 0);
}

.screenAnim-leave-to {
  transform: translate(-100%, 0);
}

.twitch {
  color: #6441a5;
}

.youtube {
  color: #c4302b;
}
</style>
