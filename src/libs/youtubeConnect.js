import {TextMessage, DonateMessage, Subscriber} from './streamEvents';

export default class YoutubeConnect {

  constructor (streamURL) {

    this.apikey = "";
    this.streamURL = new URL(streamURL);
    this.lastMessagesId = [];

    if (streamURL.hostname == "www.youtube.com" || streamURL.hostname == "youtube.com") {
      this.streamId = streamURL.searchParams.get('v');
    }
    else {
      this.streamId = streamURL.pathname.substr(1);
    }

    this.events = {
      onMessage: [],
      onSub: [],
      onFollow: [],
      onSuperchat: [],

      onConnect: [],
      onDisconnect: [],
      onError: []
    }
  }

  connect () {
    fetch({
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/videos?id=" + this.streamURL + "&part=snippet,liveStreamingDetails&key=" + this.apikey
    })
    .then(res => {
      return res.json()
    })
    .then (res => {
      this.chatId = res.items[0].liveStreamingDetails.activeLiveChatId;
    })
    .catch (err => {
      this._signal('onError', err);
    })

    this.updTimer = setInterval(this._updateChat, 6000, this);
  }

  _updateChat () {
    fetch({
      method: "GET",
      url: "https://www.googleapis.com/youtube/v3/videos?id=" + this.chatId + "&part=id,snippet,authorDetails&key=" + this.apikey
    })
    .then (res => {
      res.json();
    })
    .then (res => {
      res.items.forEach(msg => {
        if (this.lastMessagesId.includes(msg.id)) return;

        // Check if this is a basic message
        if (msg.snippet.type == 'textMessageEvent') {
          this._signal('onMessage', new TextMessage(
            msg.snippet.authorChannelId,
            msg.authorDetails.displayName,
            msg.displayMessage
          ));
          return;
        }

        // Check if message have superchat data (like bits for Twitch)
        if (msg.snippet.type == 'superChatEvent') {
          this._signal('onSuperchat', new DonateMessage(
            msg.snippet.authorChannelId,
            msg.authorDetails.displayName,
            msg.snippet.superChatDetails.amountMicros,
            'yt'
          ));
          return;
        }

        else if (msg.snippet.type == 'superStickerEvent') {
          this._signal('onSuperchat', new DonateMessage(
            msg.snippet.authorChannelId,
            msg.authorDetails.displayName,
            msg.snippet.superStickerDetails.amountMicros,
            'yt'
          ));
          return;
        }

        // Check if this is new subscriber
        if (msg.snippet.type == 'newSponsorEvent') {
          this._signal('onSub', new Subscriber(
            msg.snippet.authorChannelId,
            msg.authorDetails.displayName,
            'yt'
          ));
          return;
        }
      });
    })
  }

  _signal (name, data) {

    this.events[name].forEach(func => {
      func(data)
    });

  }

}