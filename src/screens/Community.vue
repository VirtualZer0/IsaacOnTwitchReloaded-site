<template>
  <div class="communityScreen">
    <h1>{{"community" | t($store.state.locale)}}</h1>
    
    <div class="two-container">

      <div class="left">
        <div class="title">Github</div>

        <div class="block">
          <div>Mod:</div>
          <a href="https://github.com/VirtualZer0/IsaacTwitchModReloaded" target="_blank">Repository</a>
          <span> | </span>
          <a href="https://github.com/VirtualZer0/IsaacTwitchModReloaded/issues/new/choose" target="_blank">Bug report</a>
        </div>

        <div class="block">
          <div>Site:</div>
          <a href="https://github.com/VirtualZer0/IsaacTwitchModReloaded-site" target="_blank">Repository</a>
          <span> | </span>
          <a href="https://github.com/VirtualZer0/IsaacTwitchModReloaded-site/issues/new/choose" target="_blank">Bug report</a>
        </div>
      </div>

      <div class="right">
        <div class="title">Discord</div>
        <iframe class="discord-widget" src="https://discordapp.com/widget?id=738348582557581376&theme=dark" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
      </div>

    </div>

    <big-button style="margin-top: 24px;" @onClick="$router.push('/')">{{"back" | t($store.state.locale)}}</big-button>

  </div>
</template>

<script>
import BigButton from '../components/BigButton.vue';

export default {
  name: 'communityScreen',
  components: {
    BigButton
  }
}
</script>

<style lang="scss">

.two-container {
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;

  .left, .right {
    width: 35vw;
    display: flex;
    justify-content: center;
    flex-direction: column;

    .title {
      margin-bottom: 30px;
    }
  }

  .block {
    font-size: 1rem;
    display: flex;
    margin: 0 auto;
    justify-content: space-evenly;
    width: 60%;
  }

  a {
    text-decoration: underline;
  }
}

.discord-widget {
  width: 75%;
  min-height: 40vh;
  margin: 0 auto;
}


</style>
