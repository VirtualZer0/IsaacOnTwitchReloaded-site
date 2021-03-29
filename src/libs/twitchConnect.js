import {TextMessage, DonateMessage, Subscriber, Follower} from './streamEvents';

export default class TwitchConnect {

  /**
   * Create new chat object for Twitch
   * @param {String} channel - Streamer nickname
   */
  constructor (channel) {
    this.channel = channel;
    this.userId = null;
    this.viewersCount = 0;

    this.apikey = "vtr91vw1dzji7piypq7r13itr6is2i"; // API Key for Twitch API. Not very secret information
    this.botname = "justinfan666";
    this.server = "irc-ws.chat.twitch.tv";

    this.consoleStyle = 'background-color: #6441A4; color: #FFFFFF; border-radius: 100px;padding: 1px 4px;';

    this.lastFollowers = [];
    this.plannedDisconnect = false;

    this.events = {
      onMessage: () => {},
      onSub: () => {},
      onFollower: () => {},
      onBits: () => {},

      onConnect: () => {},
      onDisconnect: () => {},
      onError: () => {}
    }
  }

  /**
   * Connect to Twitch chat using websockets
   */
  connect () {
    if (window.location.protocol.includes('https')) {
      this.webSocket = new WebSocket('wss://' + this.server + ':443/', 'irc');
    }
    else {
      this.webSocket = new WebSocket('ws://' + this.server + ':80/', 'irc');
    }


    this.webSocket.onmessage = this.onMessage.bind(this);
    this.webSocket.onerror = this.onError.bind(this);
    this.webSocket.onclose = this.onClose.bind(this);
    this.webSocket.onopen = this.onOpen.bind(this);
  }

  /**
   * Lauching request for checking new followers.
   * Not working, because requires backend implementation
   */
  startCheckNewFollowers () {
    this.checkFollowersFrom = Date.now();

    let waitUserId = setInterval((() => {
      if (this.userId) {
        clearInterval(waitUserId);
        this._checkFollowers();
        this.updFollowersTimer = setInterval(this._checkFollowers.bind(this), 3*60*1000);
      }
    }).bind(this), 500);
  }

  /**
   * Disable followers checking
   */
  stopCheckNewFollowers () {
    clearInterval(this.updFollowersTimer);
  }

  updateViewers () {

    return fetch(`https://api.twitch.tv/helix/streams?user_login=${this.channel}`, {
      headers: { 'Client-ID': this.apikey },
    })
    .then(res => res.json())
    .then(res => {
      if (res.stream) {
        this.viewersCount = res.stream.viewers
      }
    })

  }

  /**
   * Calling whem new message received
   * @param {String} msg - Raw message from Twitch
   */
  onMessage(msg) {
    // Ignore incorrect messages
    if (msg == null) return;

    // Try to parse message
    let parsed = this._parseMessage(msg.data);

    //Ignore unparsed messages
    if (parsed == null) return;

    // Get PING, send PONG
    if (parsed.command === "PING") {
      this.webSocket.send("PONG :" + parsed.message);
      return;
    }

    // Get user id
    if (parsed.command === "ROOMSTATE") {
      this.userId = parsed.tags['room-id'];
      return;
    }

    // Handle subscribers
    if (parsed.command == "USERNOTICE" && (parsed.tags["msg-id"].includes('sub') || parsed.tags["msg-id"].includes('gift'))) {

      // Gifted subs
      if (parsed.tags.hasOwnProperty("msg-param-recipient-display-name")) {
        this._signal('onSub', new Subscriber(
          parsed.tags["msg-param-recipient-id"],
          parsed.tags["msg-param-recipient-display-name"],
          'tw'
        ));

        this._log("New gifted subscriber " + parsed.tags["msg-param-recipient-display-name"]);
      }

      // Basic subs
      else {
        this._signal('onSub', new Subscriber(
          parsed.tags["user-id"],
          parsed.tags["display-name"],
          'tw'
        ));
      }

      this._log("New subscriber " + parsed.tags["display-name"]);
    }

    // Handle bits
    else if (parsed.command == "PRIVMSG" && parsed.tags.hasOwnProperty('bits')) {

      let bits = parseFloat(parsed.tags["bits"]);
      let bitsType = 1;
      let bitsCount = bits > 10 ? 10 : bits;

      if (bits < 10) return;

      if (bits / 100 >= 1) {
        bitsType = 2;
        bitsCount = Math.round(bits / 100);
      }

      if (bits / 1000 >= 1) {
        bitsType = 3;
        bitsCount = Math.round(bits / 1000);
      }

      if (bits / 5000 >= 1) {
        bitsType = 4;
        bitsCount = Math.round(bits / 5000);
      }

      if (bits / 10000 >= 1) {
        bitsType = 5;
        bitsCount = Math.round(bits / 10000);
      }

      bitsCount = bitsCount > 10 ? 10 : bitsCount;

      this._signal('onBits', new DonateMessage(
        parsed.tags["user-id"],
        parsed.tags["display-name"],
        bitsCount,
        bitsType,
        'tw'
      ));

      this._log("Get donate from " + parsed.tags["display-name"] + " - " + parsed.tags["bits"]);
    }

    // Handle default message
    else if (parsed.command == "PRIVMSG") {
      this._signal('onMessage', new TextMessage(
        parsed.tags["user-id"],
        parsed.tags["display-name"],
        parsed.message,
        'tw'
      ));
    }
  }

  /**
   * Called on error with websocket
   * @param {String} msg
   */
  onError (msg) {
    this._signal('onError', msg);
    this._log("Error: ");
    console.log(msg);
  }

  /**
   * Called on disconnect from websocket
   */
  onClose () {
    if (this.plannedDisconnect) {
      this._signal('onDisconnect');
    }
    else {
      this.connect();
    }

    this._log("Disconnect from websocket");
  }

  /**
   * Called when connection with chat established
   */
  onOpen () {
    if (this.webSocket !== null && this.webSocket.readyState === 1) {
      this._log("Connected to websocket");

      this.webSocket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
      this.webSocket.send('NICK ' + this.botname);
      this.webSocket.send('JOIN #' + this.channel.toLowerCase());

      this._signal('onConnect');
    }
  }

  /**
   * Close current connection with Twitch chat
   */
  close () {
    this.plannedDisconnect = true;
    if(this.webSocket){
      this.webSocket.close();
    }
  }

  _signal (name, data) {
    this.events[name](data);
  }

  _checkFollowers () {
    fetch ("https://api.twitch.tv/helix/users/follows?first=100&to_id=" + this.userId, {
      headers: {
        'Client-ID': this.apikey
      }
    })
    .then (res => res.json())
    .then (res => {
      res.data.forEach(follower => {
        // If follower exists, skip it
        if (this.lastFollowers.includes(follower.from_id)) return;

        // Check array size and clear it if need
        if (this.lastFollowers > 1000)
          this.lastFollowers = this.lastFollowers.splice(100, 900);

        // Add new follower to readed
        this.lastFollowers.push(follower.from_id);

        if (new Date(follower.followed_at) < this.checkFollowersFrom) return;

        this._signal('onFollower', new Follower(
          follower.from_id,
          follower.from_name,
          'tw'
        ));

        this._log("New follower " + follower.from_name);
      })
    })
  }

  _log (msg) {
    console.log('%cTwitch%c ' + msg, this.consoleStyle, '');
  }

  _parseMessage(rawMessage) {
    let parsedMessage = {
        message: null,
        tags: null,
        command: null,
        original: rawMessage,
        channel: null,
        username: null
    };

    if(rawMessage[0] === '@') {
        let tagIndex = rawMessage.indexOf(' '),
        userIndex = rawMessage.indexOf(' ', tagIndex + 1),
        commandIndex = rawMessage.indexOf(' ', userIndex + 1),
        channelIndex = rawMessage.indexOf(' ', commandIndex + 1),
        messageIndex = rawMessage.indexOf(':', channelIndex + 1);

        // Parse tags to key-value dictionary
        let tags = rawMessage.slice(0, tagIndex) != null ? rawMessage.slice(0, tagIndex).substr(1).split(";") : [];
        let keyedTags = {};

        tags.forEach(val => {
          let splitted = val.split('=');
          keyedTags[splitted[0]] = splitted[1];
        });

        parsedMessage.tags = keyedTags;

        parsedMessage.username = rawMessage.slice(tagIndex + 2, rawMessage.indexOf('!'));
        parsedMessage.command = rawMessage.slice(userIndex + 1, commandIndex);
        parsedMessage.channel = rawMessage.slice(commandIndex + 1, channelIndex);
        parsedMessage.message = rawMessage.slice(messageIndex + 1);
    }
    else if (rawMessage.startsWith("PING")) {
        parsedMessage.command = "PING";
        parsedMessage.message = rawMessage.split(":")[1];
    }

    return parsedMessage;
  }
}