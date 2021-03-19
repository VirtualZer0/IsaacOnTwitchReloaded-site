import Colors from '../enums/Colors';
import ITMRText from '../models/ITMRText'
import Isaac from '../Isaac'

import t from '../../plugins/locale/translateFunction';
import { getRandomElementsFromArr } from '../helperFuncs'
import GraphicPoll from './GraphicPoll';

export default class TrinketsPoll extends GraphicPoll {
  /**
   * Create new poll for trinkets
   * @param {Isaac} Isaac - Main game controller
   * @param {Array} allTrinkets - All game trinkets
   */
  constructor (Isaac, pollTime, delayTime, allTrinkets) {

    super(Isaac, pollTime, delayTime);

    /** Contains all trinkets in game @type {Array<Object>} */
    this.trinkets = allTrinkets;

    // Set firstline text
    this.text.firstline.setText(`${t('selectTrinket', this.Isaac.lang)}`);

    // Select three trinkets
    this.variants = getRandomElementsFromArr(this.trinkets, 3);

  }

  endPoll() {
    super.endPoll();

    let winner = this.getWinner();

    this.text.firstline.setText(`${t('pollGiveResult', this.Isaac.lang)} ${winner.name}`);
    this.Isaac.services.itmr.sendToGame({
      m: 'trinketAction',
      d: {
        trinket: winner.id
      }
    }, true);

  }


}