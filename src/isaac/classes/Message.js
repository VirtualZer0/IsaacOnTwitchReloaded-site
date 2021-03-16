import Isaac from '../Isaac'
import ITMRText from '../models/ITMRText';

import t from '../../plugins/locale/translateFunction';

export default class Message {

  /**
   * Create new Message for Isaac Twitch Mod
   * @param {Isaac} Isaac - Main game controller
   * @param {ITMRText} firstline - First text line
   * @param {ITMRText} secondline - Second text line
   * @param {Number} time - Time for message
   */
  constructor (Isaac, firstline, secondline, time) {

    this.Isaac = Isaac;
    this.firstline = firstline;
    this.secondline = secondline;
    this.time = time;

    // Instantly prepare next action, because Message duration is short
    this.Isaac.prepareNextAction()

  }

  /**
   * Update current message state
   */
  update() {
    this.firstline.setPostfix(` (${this.time}${t('s', this.Isaac.lang)})`);

    let texts = [];

    if (this.firstline)
      texts.push(this.firstline.prepare());

    if (this.secondline)
      texts.push(this.secondline.prepare());

    this.Isaac.services.itmr.sendToGame({
      m: 'addText',
      d: texts
    });

    if (this.time > 0)
      this.time --;
    else {

      if (this.firstline) {
        this.Isaac.services.itmr.sendToGame({
          m: 'removeText',
          d: {name: this.firstline.name}
        });
      }

      if (this.secondline) {
        this.Isaac.services.itmr.sendToGame({
          m: 'removeText',
          d: { name: this.secondline.name }
        });
      }

      this.Isaac.runNextAction();
    }

  }

}