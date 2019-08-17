<template>
  <div class="inputField">
    <input v-model="val" type="text" :placeholder="placeholder" @change="onChange"/>
  </div>
</template>

<script>
export default {
  name: "InputField",

  props: {
    placeholder: String
  },

  data () {
    return {
      val: ""
    }
  },

  methods: {
    getImgUrl(img) {
      var images = require.context('../assets/img/', false, /\.png$/)
      return images('./' + img + ".png")
    },

    onChange () {
      this.$emit('onChange', this.val);
    }
  }
}
</script>

<style lang="less">
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

