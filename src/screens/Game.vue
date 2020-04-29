<template>
  <div class="gameScreen">
    
    <div class="panel-container">
      <div class="panel">
        <h2>{{"status" | t($store.state.locale)}}</h2>
        <div class="textline">{{"connected" | t($store.state.locale)}}</div>
        <div>00:00</div>
      </div>

      <div class="panel">
        <h2>{{"viewers" | t($store.state.locale)}}</h2>
        <div class="textline">0 {{"total" | t($store.state.locale)}}</div>
        <div class="textline">0 {{"active" | t($store.state.locale)}}</div>
      </div>

      <div class="panel">
        <h2>{{"services" | t($store.state.locale)}}</h2>
        <div class="textline youtube">YouTube: {{"no" | t($store.state.locale)}}</div>
        <div class="textline twitch">Twitch: {{"no" | t($store.state.locale)}}</div>
      </div>

    </div>

  </div>
</template>

<script>
import BigButton from '../components/BigButton.vue';

export default {
  name: 'gameScreen',
  components: {
    BigButton
  },

  methods: {
    start () {
      
    }
  }
}
</script>

<style lang="scss">

.simple-input {
  background: none;
  outline: none;
  border: none;
  border-bottom: 3px solid #343434;
  font-size: inherit;
  font-family: inherit;
  color: #343434;
  text-align: center;
  max-width: 90px;
  margin-bottom: 20px;
}

.textline {
  margin-bottom: 20px;
}


</style>
