export default class TwitchConnect {

  constructor (channel) {
    this.channel = channel;

    this.botname = "justinfan569";
    this.server = "irc-ws.chat.twitch.tv";
    this.port = 80;

    this.webSocket = new WebSocket('ws://' + this.server + ':' + this.port + '/', 'irc');

    this.webSocket.onmessage = this.onMessage.bind(this);
    this.webSocket.onerror = this.onError.bind(this);
    this.webSocket.onclose = this.onClose.bind(this);
    this.webSocket.onopen = this.onOpen.bind(this);

    this.callbacks = {
      onMessage: [],

    }
  }

  onMessage(msg) {
    if (msg !== null) {
      let parsed = this.parseMessage(msg.data);
      if (parsed !== null) {

        if(parsed.command === "PING") {
          this.webSocket.send("PONG :" + parsed.message);
          return;
        }
        else {
          console.log(parsed.username + ":" + parsed.message + " [" + parsed.tags + "]");
        }
      }
    }
  }

  onError (msg) {
    console.log('Error: ' + msg);
  }

  onClose () {
    console.log('Closed');
  }

  onOpen () {
    if (this.webSocket !== null && this.webSocket.readyState === 1) {
      console.log('Connecting and authenticating to Twitch');

      this.webSocket.send('CAP REQ :twitch.tv/tags twitch.tv/commands twitch.tv/membership');
      this.webSocket.send('NICK ' + this.botname);
      this.webSocket.send('JOIN #' + this.channel.toLowerCase());
    }
  }

  close () {
    if(this.webSocket){
      this.webSocket.close();
    }
  }

  parseMessage(rawMessage) {
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

        parsedMessage.tags = rawMessage.slice(0, tagIndex);
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