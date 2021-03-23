<template>
  <div class="startScreen">
    <div class="waitSplash">
      <div class="img" :style="`background-image:url('${getImgUrl('hourglass')}')`" alt="hourglass"/>
      <div class="text">{{"connectingWait" | t($store.state.locale)}}</div>
    </div>
    <big-button @onClick="cancel">{{"cancel" | t($store.state.locale)}}</big-button>
  </div>
</template>

<script>
import IsaacConnect from '@/isaac/isaacConnect'
import BigButton from '../components/BigButton.vue';

export default {
  components: { BigButton },
  name: 'startScreen',

  mounted () {
    this.$services.itmr = new IsaacConnect(8666, this.$store.state.locale);
    this.$services.itmr.events.onConnect = () => {
      this.$router.push('/channels');
    }
  },

  methods: {
    cancel () {
      this.$services.itmr.stopSearch();
      this.$router.push('/');
    }
  }
}
</script>

<style lang="scss">

.waitSplash {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.7rem;
  margin-bottom: 21px;

  .img {
    height: 15vw;
    width: 15vw;

    max-width: 1024;
    max-height: 1024;

    margin: 4vh auto;

    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;

    animation: hourglassAnim 1s ease-in-out infinite;
  }
}

@keyframes hourglassAnim {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }

}
</style>
