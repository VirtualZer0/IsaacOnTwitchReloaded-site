import ITMRText from './models/ITMRText'
import t from '../plugins/locale/translateFunction'

export default class IsaacConnect {

  constructor (port = 8666, lang = "en") {
    // Requests count
    this.stats = {
      success: 0, // Success requests (including successful attempts)
      errors: 0   // Failed requests
    }

    // Event handlers
    this.events = {
      onConnect: () => {}
    }

    // Game channel
    this.msgManager = new MessageManager();
    this.msgManager.sendDataCallback = (msg, repeat) => this.sendToGame(msg, repeat)

    this.port = port; // Game port
    this.lang = lang; // Localization

    // Game to site handlers
    this.handlers = {};

    // Timers
    this.checkOutputTimer = null;
    this.searchServerTimer = setInterval(this.search.bind(this), 1000);

    this.consoleStyle = 'background-color: #EFD8CD; color: #473A3C; border-radius: 100px;padding: 1px 4px;';

    this._log('Search game server...')
  }

  /**
   * Search active game server
   */
  search () {
    fetch(`http://localhost:${this.port}`, {
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

  /**
   * Test requests
   */
  testConnect () {
    setInterval(() => {
      fetch(`http://localhost:${this.port}`, {
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

  /**
   * Send connect request to game server
   */
  connect () {
    this.sendToGame({
      m: 'connect'
    })
    .then (res => {
      if (res.out == 'success') {
        this._log('Game connected');

        // Launch checking game output for two-way connection
        this.checkOutputTimer = setInterval(() => this.checkOutput(), 850);

        // Show text for player
        this.sendToGame({
          m: 'addText',
          d: [new ITMRText('gameConnected', t('gameConnected', this.lang)).prepare()]
        })

      }
    })
  }


  /**
   * Send data to game server
   * @param {Object} data - Data for sending to game
   * @param {Boolean} high - If high = true, resend data more times if request failed
   * @param {Number} repeat - Current attempt number
   */
  sendToGame (data, high = false, repeat = 0) {

    return new Promise((resolve, reject) => {
      fetch(`http://localhost:${this.port}`, {
        method: 'POST',
        body: `||${JSON.stringify(data)}||\n`
      })
      .then (res => res.json())
      .then(res => resolve(res))
      .catch(err => {

        if (repeat < 3 && !high) {
          this.msgManager.failed(data, repeat, false);
        }
        else if (repeat < 10 && high) {
          this.msgManager.failed(data, 0, true);
        }
        else if (repeat >= 10 & high) {
          this._log('Connection to Isaac is broken', 'error');
          this._log(err, 'error');
        }
        else if (repeat >= 3 && !high) {
          this._log('Connection to Isaac possible broken', 'warn')
          this._log(err, 'warn');
        }

        reject (err);
      });
    });

  }

  /**
   * Request output data from game
   */
  checkOutput () {
    fetch(`http://localhost:${this.port}`, {
      method: 'POST',
      body: `||{"m":"out"}||\n`
    })
    .then (res => res.json())
    .then (res => {
      console.log(res);
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

  /**
   * Add handler for request
   * @param {String} name - Value from field output.c in checkOutput method
   * @param {Function} func - Function that is triggered when a command is received
   */
  addHandler (name, func) {
    this.handlers[name] = func;
  }

 /**
 * Remove existing handler
 * @param {String} name - Value from field output.c in checkOutput method
 */
  removeHandler (name) {
    delete this.handlers[name];
  }

  /**
   * Using inside this class for calling callbacks for events
   * @param {String} name - Event name
   * @param {Object} data - Data from event
   */
  _signal(name, data = null) {
    if (this.events[name]) {
      this.events[name](data);
    }
  }

  /**
   * Log to console with style
   * @param {String} msg - Message for console
   * @param {String} type - Log function: log, warning or error
   */
  _log (msg, type = 'log') {
    console[type]('%cITMR%c ' + msg, this.consoleStyle, '');
  }

}

/**
 * Helps retry requests on failure
 */
class MessageManager {

  constructor () {
    this.sendDataCallback = (msg, high = false, repeat = 0) => {}
  }

  /**
   * Send message again after small timeout
   * @param {*} msg - Original message
   * @param {*} repeat - Current attempt
   * @param {*} high - Priority
   */
  failed (msg, repeat, high) {
    setTimeout(() => {
      this.sendDataCallback(msg, high, repeat ++);
    }, 500 + (repeat * 100));
  }

}