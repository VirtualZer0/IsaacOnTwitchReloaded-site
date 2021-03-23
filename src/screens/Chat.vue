<template>
  <div class="chatScreen">
    <h2>{{'chat' | t($store.state.locale)}}</h2>
    <div class="chat-container">
      <div class="chat-container-item" v-for="msg in chat" :key="msg.id">
        <div class="chat-message-basic" v-if="msg.type=='basic'">
          <b class="chat-message-nickname" :class="msg.source == 'tw' ? 'twitch' : 'youtube'">{{msg.user}}: </b>
          <span class="chat-message-nickname">{{msg.text}}</span>
        </div>

        <div class="chat-message-subscribe" v-if="msg.type=='subscribe'" :class="msg.source == 'tw' ? 'twitch' : 'youtube'">
          <span class="chat-message-nickname">{{'newSub' | t($store.state.locale)}} - {{msg.user}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint no-unused-labels: 0*/
export default {
  name: 'chatScreen',
  components: {

  },

  data: () => ({
    chat: [],
    lastId: 1
  }),

  methods: {
    addMsg (message) {

      this.chat.push({
        id: this.lastId++,
        user: message.user,
        text: message?.text,
        source: message.source,
        type: message.type
      });

      if (this.chat.length > 500) {
        this.chat.shift();
      }

      this.$nextTick(() => {
        if (document.body.offsetHeight-window.innerHeight < window.scrollY + 500)
          window.scrollTo(0,document.body.scrollHeight);
      })

    }
  },

  mounted() {
    window.addEventListener('message', (event) => {
      if (event.data?.chatMessage) {
        this.addMsg(event.data.chatMessage)
      }
    }, false);
  }
}
</script>

<style lang="scss">

.chatScreen {
  padding-top: 24px;
}

.chat-container {
  width: calc(100% - 48px);
  padding-left: 24px;
  padding-right: 24px;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  &-item {

    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: inherit;
    text-align: left;
    padding-bottom: 14px;
    line-height: 26px;
    width: 100%;

    .chat-message-subscribe {
      text-align: center;
    }
  }
}

</style>