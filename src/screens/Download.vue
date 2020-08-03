<template>
  <div class="downloadScreen">
    <h1>{{"download" | t($store.state.locale)}}</h1>
    
    <div class="panel-container">
      <div class="panel hoverable">
        <h2>Steam</h2>
        <p>{{"useSteam" | t($store.state.locale)}}</p>
      </div>

      <div class="panel hoverable">
        <h2>Modding Of Isaac</h2>
        <p>{{"useMOI" | t($store.state.locale)}}</p>
      </div>

      <div class="panel hoverable">
        <h2>{{"direct" | t($store.state.locale)}}</h2>
        <p>{{"useDirect" | t($store.state.locale)}}</p>
      </div>

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
