import Isaac from '../Isaac'
import { TextMessage } from '../../libs/streamEvents';

import Colors from '../enums/Colors';
import ITMRText from '../models/ITMRText'

import { randString } from '../helperFuncs'

/**
 * Generic class for all polls
 * @property {Isaac} Isaac - Main game controller
 * @property {Object} text - Poll text storage
 * @property {Boolean} ready - If TRUE, poll ready to start
 * @property {Boolean} pollEnd - If TRUE, handleMessage stop working
 */
export default class BasicPoll {

  /**
   * Create new basic poll
   * @param {Isaac} Isaac - Main game controller
   */
  constructor (Isaac) {

    this.Isaac = Isaac;
    this.ready = true
    this.pollEnd = false;

    this.text = {
      firstline: new ITMRText(
        `p_${randString(8)}_f`,
        '',
        Isaac.settings.textpos.l1,
        Colors.yellow
      ),

      secondline: new ITMRText(
        `p_${randString(8)}_s`,
        '',
        Isaac.settings.textpos.l2,
      )
    }

  }

  /**
   * Receive current message from chat
   * @param {TextMessage} msg
   *
   */
  handleMessage(msg) {
    if (this.pollEnd) return;
  }

  /**
   * Some polls, like ItemsPoll, needs to get data from the game before starting
   */
  prepare() {

  }

  /**
   * Update current poll state
   */
  update() {

  }

}