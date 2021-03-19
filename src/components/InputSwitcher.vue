<template>
  <div class="input-switcher" v-bind:value="value">
    <div  class="sign">
      <slot></slot>
    </div>
    <div class="switcher">
      <div class="arrow-left" @click="isBool ? toggle() : down()"></div>
      <div class="switcher-value">{{displayValue}}</div>
      <div class="arrow-right" @click="isBool ? toggle() : up()"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputSwitcher",
  props: {
    min: {type: Number, default: 0},
    value: { default: 0},
    isBool: {type: Boolean, default: false},
    max: {type: Number, default: 10}
  },

  methods: {

    up () {
      if (this.value < this.max) {
        this.$emit('input', this.value + 1)
      }
    },

    down () {
      if (this.value > this.min) {
        this.$emit('input', this.value - 1)
      }
    },

    toggle () {
      this.$emit('input', !this.value)
    }
  },

  computed: {
    displayValue () {
      if (this.isBool) {
        return this.value ? 'On' : 'Off'
      }
      else {
        return this.value
      }
    }
  }
}
</script>

<style lang="scss">
.input-switcher {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  text-align: left;

  .sign {
    min-width: 160px;
  }

  .switcher {
    display: flex;
    align-items: center;
    margin-left: 24px;

    .arrow-left {
      width: 0;
      height: 0;
      border-top: .4em solid transparent;
      border-bottom: .4em solid transparent;
      cursor: pointer;
      border-right: .4em solid #343434;
      margin-right: 12px;
    }

    .switcher-value {
      min-width: 60px;
      text-align: center;
    }

    .arrow-right {
      width: 0;
      height: 0;
      border-top: .4em solid transparent;
      border-bottom: .4em solid transparent;
      cursor: pointer;
      border-left: .4em solid #343434;
      margin-left: 12px;
    }
  }
}
</style>
