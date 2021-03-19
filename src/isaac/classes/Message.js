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

      let textsForRemove = []

      if (this.firstline) {
        textsForRemove.push(this.firstline.name)
      }

      if (this.secondline) {
        textsForRemove.push(this.secondline.name)
      }

      this.Isaac.services.itmr.sendToGame({
        m: 'removeText',
        d: textsForRemove
      });

      this.Isaac.runNextAction();
    }

  }

}