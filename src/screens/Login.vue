<template>
  <div class="loginScreen">
    <h1>{{"whoAreYou" | t(local)}}</h1>
    <div class="fields">
      <div class="field">
        <div class="sign twitch">Twitch</div>
        <InputField @onChange="setTwitch" placeholder="Channel name"/>
      </div>
      <div class="field">
        <div class="sign youtube">YouTube</div>
        <InputField @onChange="setYouTube" placeholder="Stream URL"/>
      </div>
    </div>
    <div>
      <BigButton @onClick="login">{{"play" | t(local)}} ></BigButton>
    </div>
  </div>
</template>

<script>
import InputField from '../components/InputField.vue';
import BigButton from '../components/BigButton.vue';

import TwitchConnect from '../libs/twitchConnect.js';

export default {
  name: 'loginScreen',
  components: {
    InputField, BigButton
  },

  data () {
    return {
      twitchChannel: "",
      youtubeUrl: ""
    }
  },
  
  computed: {
    local () {
      return this.$root.local;
    }
  },

  methods: {
    setTwitch (val) {
      this.twitchChannel = val;
    },

    setYouTube (val) {
      this.youtubeUrl = val;
    },

    login () {
      this.$root.twitchConnect = new TwitchConnect(this.twitchChannel);
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

.fields {
  display: inline-block;
  margin: 0 auto;

  .sign {
    font-size: 1.8rem;
    margin-right: 15px;
  }

  .field {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-wrap: wrap;
  }
}
</style>
