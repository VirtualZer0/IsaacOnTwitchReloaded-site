<template>
  <div class="bigButton" @click="onClick">
    <slot>Ok</slot>
  </div>
</template>

<script>
export default {
  name: "BigButton",

  methods: {

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
  background-position: center;

  padding: 25px;
  min-width: 100px;
  min-height: 30px;
  font-size: 2rem;

  cursor: pointer;
  user-select: none;
  transition: .3s ease-out;
}

.bigButton:hover {
  transform: scale(1.1);
}
</style>
