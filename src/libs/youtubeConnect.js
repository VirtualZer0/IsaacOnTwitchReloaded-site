import {TextMessage, DonateMessage, Subscriber} from './streamEvents';

export default class YoutubeConnect {

  /**
   * Create new chat object for Youtube
   * @param {String} streamURLString - URL for YouTube stream
   */
  constructor (streamURLString) {
    this.apikey = "wgnn-wBx-_VT5Nu996o8ylc-t786swbRBySazIA".split('').reverse().join('');
    this.streamURL = new URL(streamURLString);
    this.lastMessagesId = [];
    this.vuewersCount = 0;
    this.channel = null;
    this.nextPageToken = null;

    this.consoleStyle = 'background-color: #FF0000; color: #FFFFFF; border-radius: 100px;padding: 1px 4px;';

    if (this.streamURL.hostname == "www.youtube.com" || this.streamURL.hostname == "youtube.com") {
      this.streamId = this.streamURL.searchParams.get('v');
    }
    else {
      this.streamId = this.streamURL.pathname.substr(1);
    }

    this.events = {
      onMessage: () => {},
      onSub: () => {},
      onFollower: () => {},
      onSuperchat: () => {},

      onConnect: () => {},
      onDisconnect: () => {},
      onError:  () => {}
    }
  }

  connect () {
    fetch(
      "https://www.googleapis.com/youtube/v3/videos?id=" + this.streamId + "&part=snippet,liveStreamingDetails&key=" + this.apikey
    )
    .then(res => {
      return res.json()
    })
    .then (res => {
      this.chatId = res.items[0].liveStreamingDetails.activeLiveChatId;
      this.channel = res.items[0].snippet.channelId;
      this._updateChat();
      this.updTimer = setInterval(this._updateChat.bind(this), 6500);

      this._log("Connected to " + this.chatId);
      this._log("Channel id: " + this.channel);
    })
    .catch (err => {
      this._signal('onError', err);
    })
  }

  disconnect () {

    clearInterval(this.updTimer);
    this._signal('onDisconnect', null);

  }

  updateViewers() {

    return fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=liveStreamingDetails&id=${this.streamId}&fields=items%2FliveStreamingDetails&key=${this.apikey}`
      )
      .then(res => res.json())
      .then(res => {
        if (res.items?.length > 0) {
          this.viewersCount = res.items[0].liveStreamingDetails.concurrentViewers
        }
      })

  }

  _updateChat () {
    fetch(
      "https://www.googleapis.com/youtube/v3/liveChat/messages?liveChatId=" + this.chatId + "&part=id,snippet,authorDetails&maxResults=100&key=" + this.apikey +
      (this.nextPageToken ? '&nextPageToken=' + this.nextPageToken : '')
    )
    .then (res => {
      return res.json();
    })
    .then (res => {
      res.items.forEach(msg => {
        if (res?.nextPageToken) {
          this.nextPageToken = res.nextPageToken;
        }

        // If message exists, just skip it
        if (this.lastMessagesId.includes(msg.id)) return;

        // Check array size and clear it if need
        if (this.lastMessagesId.length > 1000)
          this.lastMessagesId = this.lastMessagesId.splice(100, 900);

        // Add new message to readed
        this.lastMessagesId.push(msg.id);

        // Check if this is a basic message
        if (msg.snippet.type == 'textMessageEvent') {

          this._signal('onMessage', new TextMessage(
            msg.snippet.authorChannelId,
            msg.authorDetails.displayName,
            msg.snippet.displayMessage,
            'yt'
          ));
          return;
        }

        // Check if message have superchat data (like bits for Twitch)
        if (msg.snippet.type == 'superChatEvent') {
          this._signal('onSuperchat', new DonateMessage(
            msg.snippet.authorChannelId,
            msg.authorDetails.displayName,
            msg.snippet.superChatDetails.tier > 5 ? 5 : msg.snippet.superChatDetails.tier,
            1,
            'yt'
          ));

          this._log("Get donate from " + msg.authorDetails.displayName + " - " + msg.snippet.superChatDetails.amountMicros);
          return;
        }

        else if (msg.snippet.type == 'superStickerEvent') {
          this._signal('onSuperchat', new DonateMessage(
            msg.snippet.authorChannelId,
            msg.authorDetails.displayName,
            msg.snippet.superStickerDetails.tier > 5 ? 5 : msg.snippet.superStickerDetails.tier,
            1,
            'yt'
          ));

          this._log("Get donate from " + msg.authorDetails.displayName + " - " + msg.snippet.superChatDetails.amountMicros);
          return;
        }

        // Check if this is new subscriber
        if (msg.snippet.type == 'newSponsorEvent') {
          this._signal('onSub', new Subscriber(
            msg.snippet.authorChannelId,
            msg.authorDetails.displayName,
            'yt'
          ));

          this._log("New subscriber " + msg.authorDetails.displayName);
          return;
        }
      });
    })
  }

  _log (msg) {
    console.log('%cYoutube%c ' + msg, this.consoleStyle, '');
  }

  _signal (name, data) {

    this.events[name](data);

  }

}