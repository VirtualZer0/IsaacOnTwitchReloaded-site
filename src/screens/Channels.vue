<template>
  <div class="channelScreen">
    <h1>{{"whoAreYou" | t($store.state.locale)}}</h1>
    <div class="channels-description">{{"channelsDesc" | t($store.state.locale)}}</div>
    <div class="fields">
      <div class="field">
        <div class="sign twitch">Twitch</div>
        <InputField v-model="twitchChannel" ref="twitchChannel" :placeholder="'channelName' | t($store.state.locale)"/>
      </div>
      <div class="field">
        <div class="sign youtube">YouTube</div>
        <InputField v-model="youtubeUrl" :placeholder="'streamURL' | t($store.state.locale)"/>
      </div>
    </div>
    <div>
      <BigButton @onClick="connect">{{"play" | t($store.state.locale)}} ></BigButton>
    </div>
  </div>
</template>

<script>
import InputField from '../components/InputField.vue';
import BigButton from '../components/BigButton.vue';

import TwitchConnect from '../libs/twitchConnect.js';
import YoutubeConnect from '../libs/youtubeConnect.js'

export default {
  name: 'channelScreen',
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

    connect () {

      if (this.twitchChannel == '' && this.youtubeUrl == '') return;

      if (this.twitchChannel != '') {
        this.$services.twitch = new TwitchConnect(this.twitchChannel);
        this.$services.twitch.connect();
        this.$store.commit('setTwitchName', this.twitchChannel);
        //this.$services.twitch.startCheckNewFollowers();
      }

      if (this.youtubeUrl != '') {
        this.$services.youtube = new YoutubeConnect(this.youtubeUrl);
        this.$services.youtube.connect();
      }

      this.$router.push('/settings');
    }
  },

  mounted () {
    this.$refs.twitchChannel.$refs.inputField.value = this.$store.state.twitchName;
    this.twitchChannel = this.$store.state.twitchName;
  }
}
</script>

<style lang="scss">

.channels-description {
  font-size: 16px;
  margin-top: -12px;
  margin-bottom: 20px;
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
