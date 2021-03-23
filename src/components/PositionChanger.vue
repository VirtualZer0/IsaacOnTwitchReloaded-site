<template>
  <div class="position-changer">
    <div class="arrow arrow-left" @click="change('left')"></div>
    <div class="vertical-arrows">
      <div class="arrow arrow-up" @click="change('up')"></div>
      <div class="reset" :title="'resetTextPosition' | t($store.state.locale)" @click="change('reset')">R</div>
      <div class="arrow arrow-down" @click="change('down')"></div>
    </div>
    <div class="arrow arrow-right" @click="change('right')"></div>
  </div>
</template>

<script>
export default {
  name: "PositionChanger",

  methods: {

    change (pos) {
      this.$emit('change', pos)
    }
  },

  computed: {
  }
}
</script>

<style lang="scss">
.position-changer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;

  .arrow {
    transform: scale(2);
    width: 0;
    height: 0;
    cursor: pointer;
    transition: all .15s ease-in-out;
  }

  .reset {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    background: #343434;
    color: #fff;
    cursor: pointer;
    transition: all .15s ease-in-out;
    user-select: none;
  }

  .reset:hover {
    transform: scale(1.1);
  }

  .reset:active {
    background: #c4302b;
  }

  .vertical-arrows {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .arrow:hover {
    transform: scale(3);
  }

  .arrow-left:active {
    border-right-color: #c4302b;
  }

  .arrow-up:active {
    border-bottom-color: #c4302b;
  }

  .arrow-down:active {
    border-top-color: #c4302b;
  }

  .arrow-right:active {
    border-left-color: #c4302b;
  }

  .arrow-left {
    border-top: .4em solid transparent;
    border-bottom: .4em solid transparent;
    border-right: .4em solid #343434;
    margin-right: 14px;
  }

  .arrow-up {
    border-left: .4em solid transparent;
    border-right: .4em solid transparent;
    border-bottom: .4em solid #343434;
    margin-bottom: 14px;
  }

  .arrow-down {
    border-left: .4em solid transparent;
    border-right: .4em solid transparent;
    border-top: .4em solid #343434;
    margin-top: 14px;
  }

  .arrow-right {
    border-top: .4em solid transparent;
    border-bottom: .4em solid transparent;
    border-left: .4em solid #343434;
    margin-left: 14px;
  }

}
</style>
