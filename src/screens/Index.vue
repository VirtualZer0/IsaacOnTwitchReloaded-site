<template>
  <div class="indexScreen">
    <div class="mainMenu">

      <router-link :to="isMobile ? '/mobile' : '/start'">
        <MenuItem img="startImg" class="mainMenuItem">
          {{"start" | t($store.state.locale)}}
        </MenuItem>
      </router-link>

      <router-link to="/login">
        <MenuItem img="communityImg" class="mainMenuItem">
          {{"community" | t($store.state.locale)}}
        </MenuItem>
      </router-link>

      <router-link to="/">
        <MenuItem img="downloadImg" class="mainMenuItem">
          {{"download" | t($store.state.locale)}}
        </MenuItem>
      </router-link>
    </div>
  </div>
</template>

<script>
import MenuItem from '../components/MenuItem.vue';

export default {
  name: 'IndexScreen',
  components: {
    MenuItem
  },

  computed: {
    isMobile () {
      if( window.innerWidth <= 760 ) {
          return true;
      }
      else {
          return false;
      }
    }
  }
}
</script>

<style lang="scss">
  .mainMenu {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-content: center;
    height: inherit;
  }
</style>
