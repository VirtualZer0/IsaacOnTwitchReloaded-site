<template>
  <div class="gamemodeScreen">
    <h1>{{"gamemode" | t($store.state.locale)}}</h1>

    <div class="panel-container">
      <div class="panel hoverable" @click="start(0)">
        <h2>{{"easy" | t($store.state.locale)}}</h2>
        <p>{{"easyDesc" | t($store.state.locale)}}</p>
        <img :src="getImgUrl('easyImg')"/>
      </div>

      <div class="panel hoverable" @click="start(1)">
        <h2>{{"default" | t($store.state.locale)}}</h2>
        <p>{{"defaultDesc" | t($store.state.locale)}}</p>
        <img :src="getImgUrl('defaultImg')"/>
      </div>

      <div class="panel hoverable" @click="start(2)">
        <h2>{{"crazy" | t($store.state.locale)}}</h2>
        <p>{{"crazyDesc" | t($store.state.locale)}}</p>
        <img :src="getImgUrl('crazyImg')"/>
      </div>

    </div>

  </div>
</template>

<script>
import BigButton from '../components/BigButton.vue';
import Isaac from '../isaac/Isaac'

export default {
  name: 'gamemodeScreen',
  components: {
    BigButton
  },

  mounted () {

    if (!this.$services.itmr) {
      this.$router.push('/');
      return;
    }

  },

  methods: {
    start (gamemode) {
      this.$root.isaac = new Isaac(this.$services, this.$store.state.settings, this.$store.state.locale, gamemode);
      this.$root.isaac.start();
      this.$router.push('/game');

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


</style>
