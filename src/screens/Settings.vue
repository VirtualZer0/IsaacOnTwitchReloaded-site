<template>
  <div class="settingsScreen">
    <h1>{{"settings" | t($store.state.locale)}}</h1>

    <div class="panel-container">
      <div class="panel">
        <h2>{{"timings" | t($store.state.locale)}}</h2>
        <div class="field">
          {{"vote" | t($store.state.locale)}} <input class="simple-input" type="text" v-model="settings.timings.vote"/>{{"s" | t($store.state.locale)}}
        </div>
        <div class="field">
          {{"delay" | t($store.state.locale)}} <input class="simple-input" type="text" v-model="settings.timings.delay"/>{{"s" | t($store.state.locale)}}
        </div>
        <div class="field">
          {{"subtime" | t($store.state.locale)}} <input class="simple-input" type="text" v-model="convertedSubtime"/>{{"m" | t($store.state.locale)}}
        </div>
      </div>

      <div class="panel">
        <h2>{{"chances" | t($store.state.locale)}}</h2>

        <input-switcher v-model="settings.chances.events">{{"events" | t($store.state.locale)}}</input-switcher>
        <input-switcher v-model="settings.chances.items">{{"items" | t($store.state.locale)}}</input-switcher>
        <input-switcher v-model="settings.chances.trinkets">{{"trinkets" | t($store.state.locale)}}</input-switcher>
        <input-switcher v-model="settings.chances.other">{{"other" | t($store.state.locale)}}</input-switcher>
        <br>
        <input-switcher v-model="settings.chances.removeItems">{{"removeItems" | t($store.state.locale)}}</input-switcher>
        <div class="remove-item-desc">({{"removeItemsDesc" | t($store.state.locale)}})</div>

      </div>

      <div class="panel">
        <h2>{{"other" | t($store.state.locale)}}</h2>

        <input-switcher v-model="settings.subsAndBits.subs" :isBool="true">{{"subs" | t($store.state.locale)}}</input-switcher>
        <input-switcher v-model="settings.subsAndBits.bits" :isBool="true">{{"bits" | t($store.state.locale)}}</input-switcher>
        <input-switcher v-model="settings.subsAndBits.superchat" :isBool="true">{{"superchat" | t($store.state.locale)}}</input-switcher>
        <input-switcher v-model="settings.hideVotes" :isBool="true">{{"hideVotes" | t($store.state.locale)}}</input-switcher>

      </div>

    </div>

    <big-button @onClick="save(); $router.go(-1);">{{"back" | t($store.state.locale)}}</big-button>
    <big-button @onClick="save(); $router.push('/gamemode');">{{"next" | t($store.state.locale)}}</big-button>

  </div>
</template>

<script>
import BigButton from '../components/BigButton.vue';
import InputSwitcher from '../components/InputSwitcher.vue';

export default {
  name: 'settingsScreen',
  components: {
    BigButton, InputSwitcher
  },

  data () {
    return {
      settings: {
        timings: {
          vote: 45,
          delay: 15
        },

        chances: {
          events: 5,
          items: 5,
          trinkets: 1,
          other: 3,
          removeItems: 4
        },

        subsAndBits: {
          subs: true,
          bits: true,
          superchat: true,
          follows: false
        },

        hideVotes: false,

        textpos: {
          l1: {X: 16, Y: 190},
          l2: {X: 16, Y: 215}
        },

        subtime: 10*60*30
      },

      convertedSubtime: 10
    }
  },

  methods: {
    save () {
      this.settings.subtime = this.convertedSubtime*30*60;
      this.$store.commit('setSettings', this.settings);
    }
  },

  mounted () {
    if (!this.$services.itmr) {
      this.$router.push('/');
      return;
    }
    this.settings = JSON.parse(JSON.stringify(this.$store.state.settings));
    this.convertedSubtime = this.settings.subtime/60/30
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

.remove-item-desc {
  font-size: 16px;
  margin-top: -8px;
}


</style>
