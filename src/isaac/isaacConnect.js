export default class IsaacConnect {

  constructor (port = 666) {
    this.stats = {
      success: 0,
      errors: 0
    }

    this.msgManager = new MessageManager();
    this.msgManager.sendDataCallback = msg => this.sendToGame(msg)

    this.port = 666;
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
      body: `{{{"m":"ping"}}}\n`
    })
    .then (res => res.json())
    .then (res => {
      if (res.out == "pong") {
        this._log('Game server found')
        clearInterval(this.searchServerTimer);
        this.testConnect()
      }
    })
    .catch (err => {})
  }

  // Test requests
  testConnect () {
    setInterval(() => {
      fetch('http://localhost:666', {
        method: 'POST',
        body: `{{{"m":"ping"}}}\n`
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

  connect () {
    this.msgPool.add({
      m: 'connect'
    })
  }

  // Send data to game
  sendToGame (data) {
    fetch('http://localhost:666', {
      method: 'POST',
      body: `{{${JSON.stringify(data)}}}\n`
    })
    .then (res => res.json())
    .catch(this.msgManager.failed(data))
  }

  // Request output data from game
  checkOutput () {
    fetch('http://localhost:666', {
      method: 'POST',
      body: `{{{"m":"out"}}}\n`
    })
    .then (res => res.json())
    .then (res => {
      res.out.forEach(com => {
        this.handlers[com.c](com.d);
      });
    })
  }

  _log (msg) {
    console.log('%cITMR%c ' + msg, this.consoleStyle, '');
  }

}

// Retry request on fail
class MessageManager {

  constructor () {
    this.sendDataCallback = (msg) => {}
  }

  send (method, data) {
    let msg = {m: method, d: data};
    this.sendDataCallback(msg);
  }

  failed (msg) {
    this.sendDataCallback(msg);
  }

}