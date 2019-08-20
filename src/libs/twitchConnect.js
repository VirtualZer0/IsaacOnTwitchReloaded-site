import {TextMessage, DonateMessage, Subscriber} from './streamEvents';

export default class TwitchConnect {

  constructor (channel) {
    this.channel = channel;

    this.botname = "justinfan666";
    this.server = "irc-ws.chat.twitch.tv";
    this.port = 80;

    this.webSocket = new WebSocket('ws://' + this.server + ':' + this.port + '/', 'irc');

    this.webSocket.onmessage = this.onMessage.bind(this);
    this.webSocket.onerror = this.onError.bind(this);
    this.webSocket.onclose = this.onClose.bind(this);
    this.webSocket.onopen = this.onOpen.bind(this);

    this.events = {
      onMessage: [],
      onSub: [],
      onFollow: [],
      onBits: [],

      onConnect: [],
      onDisconnect: [],
      onError: []
    }
  }

  onMessage(msg) {

    // Ignore incorrect messages
    if (msg == null) return;

    // Try to parse message
    let parsed = this._parseMessage(msg.data);

    //Ignore unparsed messages
    if (parsed == null) return null;

    // Get PING, send PONG
    if (parsed.command === "PING") {
      this.webSocket.send("PONG :" + parsed.message);
      return;
    }

    // Handle subscribers
    if (parsed.command == "USERNOTICE" && (parsed.tags["msg-id"].includes('sub') || parsed.tags["msg-id"].includes('gift'))) {

      // Gifted subs
      if (parsed.tags.hasOwnProperty("msg-param-recipient-display-name")) {
        console.log("Подарочная подписка для " + parsed.tags["msg-param-recipient-display-name"]);
        this._signal('onSub', new Subscriber(
          parsed.tags["msg-param-recipient-id"],
          parsed.tags["msg-param-recipient-display-name"],
          'tw'
        ));
      }

      // Basic subs
      else {
        console.log("Подписка от " + parsed.tags["display-name"]);
        this._signal('onSub', new Subscriber(
          parsed.tags["user-id"],
          parsed.tags["display-name"],
          'tw'
        ));
      }
      console.log(parsed.tags);
    }

    // Handle bits
    else if (parsed.command == "PRIVMSG" && parsed.tags.hasOwnProperty('bits')) {
      this._signal('onBits', new DonateMessage(
        parsed.tags["user-id"],
        parsed.tags["display-name"],
        parsed.tags["bits"],
        'tw'
      ));

      console.log("Битсы от " + parsed.tags["display-name"]);
      console.log(parsed.tags);
    }

    // Handle default message
    else if (parsed.command == "PRIVMSG") {
      this._signal('onMessage', new TextMessage(
        parsed.tags["user-id"],
        parsed.tags["display-name"],
        parsed.message
      ));
    }
  }

  onError (msg) {
    this._signal('onError', msg);
    console.log('Error: ' + msg);
  }

  onClose () {
    this._signal('onDisconnect');
    console.log('Closed');
  }

  onOpen () {
    if (this.webSocket !== null && this.webSocket.readyState === 1) {
      console.log('Connecting and authenticating to Twitch');

      this.webSocket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
      this.webSocket.send('NICK ' + this.botname);
      this.webSocket.send('JOIN #' + this.channel.toLowerCase());

      this._signal('onConnect');
    }
  }

  close () {
    if(this.webSocket){
      this.webSocket.close();
    }
  }

  _signal (name, data) {

    this.events[name].forEach(func => {
      func(data)
    });

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