<template>
  <div class="gameScreen">
    <h2>{{"keepTabActive" | t($store.state.locale)}}</h2>
    <div class="panel-container">
      <div class="panel">
        <h2>{{"status" | t($store.state.locale)}}</h2>
        <div class="textline">{{isaacState | t($store.state.locale)}}</div>
        <div>{{gameTime}}</div>
      </div>

      <div class="panel">
        <h2>{{"viewers" | t($store.state.locale)}}</h2>
        <div class="textline">{{viewersInPoll}} {{"onCurrentPoll" | t($store.state.locale)}}</div>
        <h2>{{"textPosition" | t($store.state.locale)}}</h2>
        <position-changer @change="changeTextPos"/>
      </div>

      <div class="panel">
        <h2>{{"services" | t($store.state.locale)}}</h2>
        <div class="textline youtube">YouTube: {{(youtube ? 'yes' : 'no') | t($store.state.locale)}}</div>
        <div class="textline twitch">Twitch: {{(twitch ? 'yes' : 'no') | t($store.state.locale)}}</div>
      </div>

    </div>

    <big-button @onClick="openChatWindow()">{{"chat" | t($store.state.locale)}}</big-button>
    <div class="chat-open-description">{{"chatDesc" | t($store.state.locale)}}</div>

  </div>
</template>

<script>
import BigButton from '../components/BigButton.vue';
import PositionChanger from '../components/PositionChanger.vue';
import { DonateMessage, Subscriber } from '../libs/streamEvents';

export default {
  name: 'gameScreen',
  components: {
    BigButton,
    PositionChanger
  },

  data: () => ({

    gameTime: '00:00:00',
    viewersInPoll: 0,
    startTime: null,
    gameTimeTimer: null,
    infoTimer: null,
    twitch: false,
    youtube: false,

    isaacState: 'gameStateDisconnected'

  }),

  mounted () {

    if (!this.$root.isaac) {
      this.$router.push('/');
      return;
    }

    this.startTime = Date.now();
    this.gameTimeTimer = setInterval(this.updGameTime, 900);
    this.infoTimer = setInterval(this.updInfo, 1000);

    this.twitch = !!this.$services.twitch;
    this.youtube = !!this.$services.youtube;

    this.updInfo();
  },

  methods: {
    changeTextPos(event) {
      this.$store.commit('setTextPos', this.$root.isaac.changeTextPos(event));
    },

    updGameTime () {
      let time = new Date(Date.now() - this.startTime);
      this.gameTime = (time.getUTCHours() <= 9 ? `0${time.getUTCHours()}` : time.getUTCHours()).toString() + ':' +
        (time.getUTCMinutes() <= 9 ? `0${time.getUTCMinutes()}` : time.getUTCMinutes()).toString() + ':' +
        (time.getUTCSeconds() <= 9 ? `0${time.getUTCSeconds()}` : time.getUTCSeconds()).toString()
    },

    updInfo () {
      if (this.$root?.isaac?.currentAction?.allVotesCount)
      {
        this.viewersInPoll = this.$root?.isaac?.currentAction?.allVotesCount
      }

      if (this.$root.isaac.services.itmr.isConnected) {

        this.isaacState = this.$root.isaac.isPaused ? 'gameStatePaused' : 'gameStateConnected';

      }
      else {
        this.isaacState = 'gameStateDisconnected';
      }

      if (this.youtube) {
        this.youtubeViewers = this.$services.youtube.viewersCount;
      }

      if (this.twitch) {
        this.twitchViewers = this.$services.twitch.viewersCount;
      }
    },

    openChatWindow () {
      this.$root.isaac.chatWindow = window.open('/#chat', 'IsaacOnTwitchChat', 'resizable,scrollbars,width=600,height=800');
    },

    fakeSub () {
      this.$root.isaac.onSubscriber(new Subscriber('mmm fedfef flvkfl', 'mmm fedfef flvkfl', 'tw'))
    }
  }
}
</script>

<style lang="scss">

.simple-input {
  background: none;
  outline: none;
  border: none;
  border-bottom: 3px solid #343434;
  font-size: inherit;
  font-family: inherit;
  color: #343434;
  text-align: center;
  max-width: 90px;
  margin-bottom: 20px;
}

.textline {
  margin-bottom: 24px;
}

.chat-open-description {
  font-size: 16px;
}


</style>
