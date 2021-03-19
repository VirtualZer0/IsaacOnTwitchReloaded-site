<template>
  <div id="app">

    <header>
      <div class="logo" :style="`background-image: url('${getImgUrl('logo')}')`"></div>
    </header>

    <main>
      <transition name="screenAnim" mode="out-in">
          <router-view/>
      </transition>
    </main>

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
  font-size: calc(14px + (26 - 14) * ((100vmax - 300px) / (1600 - 300)));
  line-height: calc(1.3em + (1.5 - 1.2) * ((100vmax - 300px)/(1600 - 300)));
  padding-bottom: 40px;
}

#app {
  min-height: calc(100vh - 40px);
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

h1 {
  font-size: 42px;
  margin-bottom: 28px;
}

h2 {
  font-size: 28px;
}

.credits {
  flex-shrink: 0;
  font-size: .8em;
  margin-top: 48px;

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
  margin: 0 auto;
  margin-bottom: 16px;
  min-width: 320px;
  width: auto;
  height: 16vh;
  max-width: 40vw;
  min-height: 116px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
}

#app {
  text-align: center;
}

.panel-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-right: -3vw;
}

.panel {
  min-width: 300px;
  min-height: 300px;
  width: 22vw;
  height: 22vw;
  background: url("./assets/img/cardBg.png") no-repeat;
  background-size: contain;
  padding: calc(1vw + 24px);
  margin-right: 3vw;

  h2 {
    text-align: center;
  }

  p {
    font-size: .6em;
    height: 40%;
  }
}

.panel.hoverable {
  transition: .2s all ease-in-out;
  cursor: pointer;
}

.panel.hoverable:hover {
  transform: scale(1.05);
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
