<template>
  <div class="startScreen">
    <div class="mainMenu">
      <h1>{{"whoAreYou" | t(local)}}</h1>
    </div>
  </div>
</template>

<script>
import MenuItem from '../components/MenuItem.vue';

export default {
  name: 'startScreen',
  components: {
    MenuItem
  },
  
  computed: {
    local () {
      return this.$root.local;
    }
  }
}
</script>

<style lang="less">
  .mainMenu {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: center;
  }
</style>
