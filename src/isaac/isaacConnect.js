import ITMRText from './models/ITMRText'
import t from '../plugins/locale/translateFunction'

export default class IsaacConnect {

  constructor (port = 8666, lang = "en") {
    // Requests count
    this.stats = {
      success: 0, // Success requests (including successful attempts)
      errors: 0   // Failed requests
    };

    this.isConnected = false;

    // Event handlers
    this.events = {
      onConnect: () => {},
      onReconnect: () => {}
    };

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
   * Stop current game server searching
   */
  stopSearch() {
    clearInterval(this.searchServerTimer);
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
        //this.checkOutputTimer = setInterval(() => this.checkOutput(), 1000);

        this.isConnected = true;


        this.clearAll().then(() => {
          // Show text for player
          this.sendToGame({
            m: 'addText',
            d: [new ITMRText('gameConnected', t('gameConnected', this.lang)).prepare()]
          })

          // Call event onConnect
          this._signal('onConnect');
        });

      }
    });
  }


  /**
   * Clear all UI elements from mod in game
   */
  clearAll() {

    return Promise.all([
      // Remove pollframes
      this.sendToGame({ m: 'removePollframes' }, true),

      // Remove progress bar
      this.sendToGame({ m: 'removeProgressBar' }, true),

      // Clear text
      this.sendToGame({
        m: 'clearText'
      }, true)
    ]);

  }


  /**
   * Send data to game server
   * @param {Object} data - Data for sending to game
   * @param {Boolean} high - If high = true, resend data more times if request failed
   * @param {Number} repeat - Current attempt number
   */
  sendToGame (data, high = false, repeat = 0) {

    return new Promise((resolve, reject) => {
      this._send(data, repeat, high)
      .then (res => res.json())
      .catch(err => {
        console.error(err);
        reject(err);
      })
      .then(
        res => {
          this.isConnected = true;
          resolve(res);
        }
      )
      .catch(err => {
        console.error(err);
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
      if (!this.isConnected) {

        console.log("send reconnect");

        this.sendToGame({
          m: 'removeText',
          d: ['siteMessage']
        })

        this._signal('onReconnect');
      }


      this.isConnected = true;
      res.out.forEach(com => {
        if (this.handlers[com.c]) {
          this.handlers[com.c](com.d);
        }
        else {
          this._log(`Not found handler for ${com.c}`);
        }
      });
    })
    .catch(err => {
      this.isConnected = false;
      this._log('Connection to Isaac skip request', 'warn');
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

  /**
   *
   * @param {Object} data - Data for sending
   * @param {Number} repeat - Current attempt
   * @param {Boolean} high - TRUE, if data has high priority
   */
  _send (data, repeat = 1, high = false) {
    return fetch(`http://localhost:${this.port}`, {
      method: 'POST',
      body: `||${JSON.stringify(data)}||\n`
    }).catch(function (error) {

      this.isConnected = false;
      this._log('Connection to Isaac is broken', 'error');

      if (repeat > 3 && !high) {
        throw error;
      }
      if (repeat > 6 && high) {
        throw error;
      }
      return this._send(data, repeat + 1, high);
    }.bind(this));
  }

}