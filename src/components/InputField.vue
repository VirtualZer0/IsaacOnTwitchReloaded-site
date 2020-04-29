<template>
  <div class="inputField">
    <input v-bind:value="val" v-on:input="$emit('input', $event.target.value)" type="text" :placeholder="placeholder"/>
  </div>
</template>

<script>
export default {
  name: "InputField",

  props: {
    placeholder: String,
    val: String
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
.inputField {
  background-image: url("../assets/img/inputBg.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: left;

  height: 100px;
  padding: 5px;

  display: flex;
  justify-content: left;
  align-items: center;
  padding-left: 25px;
  
  input {
    max-width: 500px;
    width: 95%;
    outline: none;
    border: none;
    background: none;
    font: 1.5rem TeamMeat;
    border-bottom: 3px solid #333;
    margin-bottom: 3.8%;
  }
}
</style>

