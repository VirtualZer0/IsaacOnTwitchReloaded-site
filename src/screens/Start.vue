<template>
  <div class="startScreen">
    <div class="waitSplash">
      <div class="img" :style="'background-image:url(' + getImgUrl('hourglass') + ')'" alt="hourglass"/>
      <div class="text">{{"connectingWait" | t(local)}}</div>
    </div>
  </div>
</template>

<script>
import IsaacConnect from '@/isaac/isaacConnect'

export default {
  name: 'startScreen',
  
  computed: {
    local () {
      return this.$root.local;
    }
  },

  methods: {
    getImgUrl(img) {
      var images = require.context('../assets/img/', false, /\.png$/)
      return images('./' + img + ".png")
    }
  },

  mounted () {
    this.$root.services.itmr = new IsaacConnect();
  }
}
</script>

<style lang="less">
.waitSplash {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.7rem;

  .img {
    height: 15vw;
    width: 15vw;
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
