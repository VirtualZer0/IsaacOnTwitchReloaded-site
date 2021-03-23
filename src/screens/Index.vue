<template>
  <div class="indexScreen">
    <div class="mainMenu">

      <router-link :to="isMobile ? '/mobile' : '/start'">
        <MenuItem img="startImg" class="mainMenuItem">
          {{"start" | t($store.state.locale)}}
        </MenuItem>
      </router-link>

      <router-link to="/community">
        <MenuItem img="communityImg" class="mainMenuItem">
          {{"community" | t($store.state.locale)}}
        </MenuItem>
      </router-link>

      <router-link to="/download">
        <MenuItem img="downloadImg" class="mainMenuItem">
          {{"download" | t($store.state.locale)}}
        </MenuItem>
      </router-link>
    </div>

    <div class="language-selector">
      <div class="language-selector-desc">{{$store.state.locale == 'en' ? 'Изменить язык на' : 'Change language to'}}</div>
      <big-button @onClick="changeLanguage">{{$store.state.locale == 'en' ? 'Русский' : 'English'}}</big-button>
    </div>

    <div class="credits">
      <p>{{"madeBy" | t($store.state.locale)}}</p>
      <div>
        <router-link to="/luadebug">{{"enableLuadebug" | t($store.state.locale)}}</router-link>
        <span> | </span>
        <a href="https://github.com/VirtualZer0/IsaacTwitchModReloaded" target="_blank">{{"checkOnGithub" | t($store.state.locale)}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import MenuItem from '../components/MenuItem.vue';
import mobile from 'is-mobile';
import BigButton from '../components/BigButton.vue';

export default {
  name: 'IndexScreen',
  components: {
    MenuItem,
    BigButton
  },

  computed: {
    isMobile () {
      return mobile()
    }
  },

  methods: {
    changeLanguage () {
      this.$store.commit('setLocale', this.$store.state.locale == 'en' ? 'ru' : 'en');
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

  .language-selector {
    display: flex;
    justify-content: center;
    align-items: center;

    &-desc {
      margin-right: 12px;
    }
  }
</style>
