export default class IsaacConnect {

  constructor (port = 666) {
    this.port = 666;
    this.handlers = {};

    this.checkOutputTimer = null;
    this.searchServerTimer = setInterval(this.search.bind(this), 1000);

    this.consoleStyle = 'background-color: #EFD8CD; color: #473A3C; border-radius: 100px;padding: 1px 4px;';

    this._log('Search game server...')
  }

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
        this.connect()
      }
    })
    .catch (err => {})
  }

  connect () {
    
  }

  snedToGame (method, data = null) {
    return fetch('http://localhost:666', {
      method: 'POST',
      body: `{{${JSON.stringify({m: method, d: data})}}}\n`
    })
    .then (res => res.json())
  }

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