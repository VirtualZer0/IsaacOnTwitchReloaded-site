<template>
  <div class="communityScreen">
    <h1>{{"community" | t($store.state.locale)}}</h1>

    <div class="two-container">

      <div class="left">
        <div class="title">Github</div>

        <div class="block">
          <div>{{"mod" | t($store.state.locale)}}:</div>
          <a href="https://github.com/VirtualZer0/IsaacTwitchModReloaded" target="_blank">{{"repo" | t($store.state.locale)}}</a>
          <span> | </span>
          <a href="https://github.com/VirtualZer0/IsaacTwitchModReloaded/issues/new/choose" target="_blank">{{"bugReport" | t($store.state.locale)}}</a>
        </div>

        <div class="block">
          <div>{{"site" | t($store.state.locale)}}:</div>
          <a href="https://github.com/VirtualZer0/IsaacTwitchModReloaded-site" target="_blank">{{"repo" | t($store.state.locale)}}</a>
          <span> | </span>
          <a href="https://github.com/VirtualZer0/IsaacTwitchModReloaded-site/issues/new/choose" target="_blank">{{"bugReport" | t($store.state.locale)}}</a>
        </div>
      </div>

      <div class="right">
        <div class="title">Discord</div>
        <iframe style="margin: 0 auto" src="https://discord.com/widget?id=738348582557581376&theme=dark" width="320" height="400" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
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
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;

  .left, .right {
    width: 35vw;
    min-width: 320px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 20px;

    .title {
      font-size: 24px;
      margin-bottom: 30px;
    }
  }

  .block {
    font-size: 1rem;
    display: flex;
    flex-wrap: wrap;
    margin: 0 auto;
    justify-content: space-evenly;
    width: 60%;
    margin-bottom: 10px;
  }

  a {
    text-decoration: underline;
  }
}

.discord-widget {

  margin: 0 auto;
}


</style>
