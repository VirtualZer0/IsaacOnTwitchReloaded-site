import TextMessage from '../../libs/streamEvents'
import Isaac from '../Isaac';

export default class SpecialMessageHandler {

  /**
   *
   * @param {Isaac} Isaac - Main game controller
   */
  constructor (Isaac) {

    this.Isaac = Isaac;

    this.state = {
      movePlayer: false,
      viewersAttack: false,
      heavyRain: false,
    }

    this.sended = 0;

  }

  /**
   * Handle current message and check special handlers
   * @param {TextMessage} message - Chat message
   * @returns {Boolean} Show Message in chat or not
   */
  handleMessage (message) {

    let showInChat = true;

    if (this.state.movePlayer) {
      let res = this.movePlayer(message);
      if (!res) {
        showInChat = false
      }
    }

    if (this.state.viewersAttack) {
      let res = this.viewersAttack(message);
      if (!res) {
        showInChat = false
      }
    }

    if (this.state.heavyRain) {
      let res = this.heavyRain(message);
      if (!res) {
        showInChat = false
      }
    }

    return showInChat;

  }

  resetSended () {
    this.sended = 0;
  }

  disableAll () {
    this.state.movePlayer = false;
    this.state.viewersAttack = false;
    this.state.heavyRain = false;
  }

  /**
   * Handle viewersAttack
   * @param {TextMessage} message - Chat message
   * @returns {Boolean} Show Message in chat or not
   */
  viewersAttack(message) {

    let text = message.text.toUpperCase();

    if (text == 'PLAYER' || text == 'ИГРОК') {
      this.sendToGame({ m: 'viewersAttack', d: 'p' })
      return false;
    }
    else if (text == 'ENEMY' || text == 'ВРАГ') {
      this.sendToGame({ m: 'viewersAttack', d: 'e' })
      return false;
    }

    return true;

  }

  /**
   * Handle movePlayer
   * @param {TextMessage} message - Chat message
   * @returns {Boolean} Show Message in chat or not
   */
  movePlayer(message) {

    let text = message.text.toUpperCase();

    if (text == 'LEFT' || text == 'ВЛЕВО') {
      this.sendToGame({ m: 'movePlayer', d: 'l' })
      return false;
    }
    else if (text == 'RIGHT' || text == 'ВПРАВО') {
      this.sendToGame({ m: 'movePlayer', d: 'r' })
      return false;
    }
    else if (text == 'UP' || text == 'ВВЕРХ') {
      this.sendToGame({ m: 'movePlayer', d: 'u' })
      return false;
    }
    else if (text == 'DOWN' || text == 'ВНИЗ') {
      this.sendToGame({ m: 'movePlayer', d: 'd' })
      return false;
    }

    return true;

  }

  heavyRain(message) {
    let text = message.text.toUpperCase();

    if (text == 'X' || text == 'Х') {
      this.sendToGame({ m: 'jason'})
      return false;
    }
  }

  sendToGame (object) {

    // Restrict to 30 messages per second
    if (this.sended > 30)
      return;

    this.Isaac.services.itmr.sendToGame(object, false, 10)

  }


}