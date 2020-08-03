<template>
  <div class="gameScreen">
    
    <div class="panel-container">
      <div class="panel">
        <h2>{{"status" | t($store.state.locale)}}</h2>
        <div class="textline">{{"disconnected" | t($store.state.locale)}}</div>
        <div>{{gameTime}}</div>
      </div>

      <div class="panel">
        <h2>{{"viewers" | t($store.state.locale)}}</h2>
        <div class="textline">0 {{"total" | t($store.state.locale)}}</div>
        <div class="textline">0 {{"active" | t($store.state.locale)}}</div>
      </div>

      <div class="panel">
        <h2>{{"services" | t($store.state.locale)}}</h2>
        <div class="textline youtube">YouTube: {{(youtube ? 'yes' : 'no') | t($store.state.locale)}}</div>
        <div class="textline twitch">Twitch: {{(twitch ? 'yes' : 'no') | t($store.state.locale)}}</div>
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

  data: () => ({

    gameTime: '00:00:00',
    startTime: null,
    gameTimeTimer: null,
    twitch: false,
    youtube: false

  }),

  mounted () {
    this.startTime = Date.now();
    this.gameTimeTimer = setInterval(this.updGameTime, 900);

    this.twitch = !!this.$services.twitch;
    this.youtube = !!this.$services.youtube;
  },

  methods: {
    updGameTime () {
      let time = new Date(Date.now() - this.startTime);
      this.gameTime = (time.getUTCHours() <= 9 ? `0${time.getUTCHours()}` : time.getUTCHours()).toString() + ':' +
        (time.getUTCMinutes() <= 9 ? `0${time.getUTCMinutes()}` : time.getUTCMinutes()).toString() + ':' +
        (time.getUTCSeconds() <= 9 ? `0${time.getUTCSeconds()}` : time.getUTCSeconds()).toString()
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
