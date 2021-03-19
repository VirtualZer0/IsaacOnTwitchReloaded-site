<template>
  <div class="menuItem">
    <div class="img" :style="'background-image:url(' + getImgUrl(img) + ')'" :alt="img"/>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "MenuItem",

  props: {
    img: String,
    name: String
  },

  methods: {
    getImgUrl(img) {
      var images = require.context('../assets/img/', false, /\.png$/)
      return images('./' + img + ".png")
    }
  }
}
</script>

<style lang="scss">
  .menuItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 250px;
    min-height: 250px;
    width: 20vw;
    height: 20vw;

    background: url("../assets/img/cardBg.png");
    background-size: contain;
    background-repeat: no-repeat;

    font-size: 1.2em;
    cursor: pointer;
    transition: all .3s ease-out;

    .img {
      margin-top: -2vw;
      width: 9vw;
      height: 9vw;
      min-width: 115px;
      min-height: 115px;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  .menuItem:hover {
    transform: scale(1.1);
  }
</style>
