<template>
  <div id="app">
    <div class="logo" :style="'background-image: url('+getImgUrl('logo')+')'"></div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      "local": "en"
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
}

a {
  text-decoration: none;
}

:visited {
  color: inherit;
}

.logo {
  margin-bottom: 16px;
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
</style>
