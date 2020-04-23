<template>
  <div class="bigButton" @click="onClick">
    <slot>Ok</slot>
  </div>
</template>

<script>
export default {
  name: "BigButton",

  methods: {
    getImgUrl(img) {
      var images = require.context('../assets/img/', false, /\.png$/)
      return images('./' + img + ".png")
    },

    onClick () {
      this.$emit('onClick');
    }
  }
}
</script>

<style lang="scss">
.bigButton {
  display: inline-block;
  margin: 0 auto;
  margin-top: 8px;

  background-image: url("../assets/img/buttonBg.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left;

  padding: 25px;
  min-width: 100px;
  min-height: 45px;
  font-size: 2rem;

  cursor: pointer;
  user-select: none;
  transition: .3s ease-out;
}

.bigButton:hover {
  transform: scale(1.1);
}
</style>

