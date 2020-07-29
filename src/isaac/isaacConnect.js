import ITMRText from './models/ITMRText'
import t from '../plugins/locale/translateFunction'

export default class IsaacConnect {

  constructor (port = 666, lang = "en") {
    this.stats = {
      success: 0,
      errors: 0
    }

    this.events = {
      onConnect: () => {}
    }

    this.msgManager = new MessageManager();
    this.msgManager.sendDataCallback = (msg, repeat) => this.sendToGame(msg, repeat)

    this.port = 666;
    this.lang = lang;
    this.handlers = {};

    this.checkOutputTimer = null;
    this.searchServerTimer = setInterval(this.search.bind(this), 1000);

    this.consoleStyle = 'background-color: #EFD8CD; color: #473A3C; border-radius: 100px;padding: 1px 4px;';

    this._log('Search game server...')
  }

  // Search active game server
  search () {
    fetch('http://localhost:666', {
      method: 'POST',
      body: `||{"m":"ping"}||\n`
    })
    .then (res => res.json())
    .then (res => {
      if (res.out == "pong") {
        this._log('Game server found')
        clearInterval(this.searchServerTimer);
        this.connect()
      }
    })
    .catch (err => {})
  }

  // Test requests
  testConnect () {
    setInterval(() => {
      fetch('http://localhost:666', {
        method: 'POST',
        body: `||{"m":"ping"}||\n`
      })
      .then (res => res.json())
      .then (res => {
        if (res.out == "pong") {
          this.stats.success ++;
        }
      })
      .catch (err => {this.stats.errors ++;})

      this._log(`${this.stats.success}|${this.stats.errors} / ${Math.round(this.stats.errors/(this.stats.success + this.stats.errors)*100, 2)}%`);
    }, 250)
  }

  // Connect method
  connect () {
    this.sendToGame({
      m: 'connect'
    })
    .then (res => {
      if (res.out == 'success') {
        this._log('Game connected');
        // Launch checking game output for two-way connection
        this.checkOutputTimer = setInterval(this.checkOutput, 750);

        // Show text for player
        this.sendToGame({
          m: 'addText',
          d: new ITMRText('gameConnected', t('gameConnected', this.lang))
        })

        this._signal('onConnect');
      }
    })
  }

  // Send data to game
  sendToGame (data, repeat = false) {

    return new Promise((resolve, reject) => {
      fetch('http://localhost:666', {
        method: 'POST',
        body: `||${JSON.stringify(data)}||\n`
      })
      .then (res => res.json())
      .then(res => resolve(res))
      .catch(err => {
        if (!repeat) {
          this.msgManager.failed(data);
          reject(err);
        }
      })
    });
    
  }

  // Request output data from game
  checkOutput () {
    fetch('http://localhost:666', {
      method: 'POST',
      body: `||{"m":"out"}||\n`
    })
    .then (res => res.json())
    .then (res => {
      res.out.forEach(com => {
        if (this.handlers[com.c]) {
          this.handlers[com.c](com.d);
        }
        else {
          this._log(`Not found handler for ${com.c}`);
        }
      });
    })
  }

  // Add handler
  addHandler (name, func) {
    this.handlers[name] = func;
  }

  // Remove handler
  removeHandler (name) {
    delete this.handlers[name];
  } 

  _signal (name, data = null) {
    if (this.events[name]) {
      this.events[name](data);
    }
  }

  // Log to console with style
  _log (msg, type = 'log') {
    console[type]('%cITMR%c ' + msg, this.consoleStyle, '');
  }

}

// Retry requests on fail (only one time)
class MessageManager {

  constructor () {
    this.sendDataCallback = (msg, repeat) => {}
  }

  send (method, data) {
    let msg = {m: method, d: data};
    this.sendDataCallback(msg);
  }

  failed (msg) {
    setTimeout(() => {
      this.sendDataCallback(msg, true);
    }, 500);
  }

}