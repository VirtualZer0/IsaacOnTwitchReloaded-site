<template>
  <div id="app">
    
    <header>
      <router-link to="/">
        <div class="logo" :style="`background-image: url('${getImgUrl('logo')}')`"></div>
      </router-link>
    </header>

    <main>
      <transition name="screenAnim" mode="out-in">
          <router-view/>
      </transition>
    </main>

    <footer>
      <p>{{"madeBy" | t($store.state.locale)}}</p>
      <a href="https://github.com/VirtualZer0/IsaacTwitchModReloaded" target="_blank">{{"checkOnGithub" | t($store.state.locale)}}</a>
    </footer>

  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>


<style lang="scss">

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
  font-size: calc(14px + (26 - 14) * ((100vw - 300px) / (1600 - 300)));
  line-height: calc(1.3em + (1.5 - 1.2) * ((100vw - 300px)/(1600 - 300)));
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  height: 10vh;
  margin-bottom: 10vh;
}

main {
  flex: 1 0 auto;
}

footer {
  flex-shrink: 0;
  font-size: .8em;
  padding-bottom: 36px;

  p {
    margin-bottom: 8px;
  }

  a {
    border-bottom: 2px solid #333;
  }
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
