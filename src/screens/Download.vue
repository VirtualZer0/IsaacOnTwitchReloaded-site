<template>
  <div class="downloadScreen">
    <h1>{{"download" | t($store.state.locale)}}</h1>

    <div class="panel-container">
      <a class="panel hoverable" href="https://steamcommunity.com/sharedfiles/filedetails/?id=2433361645" target="_blank">
        <h2>Steam</h2>
        <p>{{"useSteam" | t($store.state.locale)}}</p>
        <div>{{"download" | t($store.state.locale)}}</div>
      </a>

      <a class="panel hoverable" href="https://moddingofisaac.com/mod/3649/isaac-on-twitch-reloaded" target="_blank">
        <h2>Modding Of Isaac</h2>
        <p>{{"useMOI" | t($store.state.locale)}}</p>
        <div>{{"download" | t($store.state.locale)}}</div>
      </a>

      <a class="panel hoverable" href="https://github.com/VirtualZer0/IsaacOnTwitchReloaded/archive/refs/heads/master.zip" target="_blank">
        <h2>{{"direct" | t($store.state.locale)}}</h2>
        <p>{{"useDirect" | t($store.state.locale)}}</p>
        <div>{{"download" | t($store.state.locale)}}</div>
      </a>

    </div>

    <big-button @onClick="$router.push('/')">{{"back" | t($store.state.locale)}}</big-button>

  </div>
</template>

<script>
import BigButton from '../components/BigButton.vue';

export default {
  name: 'downloadScreen',
  components: {
    BigButton
  }
}
</script>

<style lang="scss">

.downloadScreen {
  p {
    font-size: 1.1rem;
  }
}

</style>
