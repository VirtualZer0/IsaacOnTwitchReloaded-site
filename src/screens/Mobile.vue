<template>
  <div class="mobileScreen">
    <h1>{{"waitWhat" | t($store.state.locale)}}</h1>
    <p class="text">
      {{"visitFromMobileDevice" | t($store.state.locale)}}
    </p>
    <big-button @onClick="$router.push('/')">{{"back" | t($store.state.locale)}}</big-button>
  </div>
</template>

<script>
import BigButton from '../components/BigButton'

export default {
  name: 'MobileScreen',
  components: { BigButton }
}
</script>

<style lang="scss">
  .mobileScreen {

    padding: 10px;

  }
</style>
