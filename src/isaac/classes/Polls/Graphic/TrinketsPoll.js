import Colors from '../../../enums/Colors';
import ITMRText from '../../../models/ITMRText'
import Isaac from '../../../Isaac'
import { getNormalName } from '../../../helperFuncs';

import t from '../../../../plugins/locale/translateFunction';
import { getRandomElementsFromArr } from '../../../helperFuncs'
import GraphicPoll from '../Base/GraphicPoll';

export default class TrinketsPoll extends GraphicPoll {
  /**
   * Create new poll for trinkets
   * @param {Isaac} Isaac - Main game controller
   */
  constructor (Isaac, pollTime, delayTime) {

    super(Isaac, pollTime, delayTime);

    /** Contains all trinkets in game @type {Array<Object>} */
    this.trinkets = Isaac.lists.trinkets;

    // Set firstline text
    this.text.firstline.setText(t('selectTrinket', this.Isaac.lang));

    // Select three trinkets
    this.variants = getRandomElementsFromArr(this.trinkets, 3);

  }

  endPoll() {
    super.endPoll();

    let winner = this.getWinner();

    this.text.firstline.setText(`${t('pollGiveResult', this.Isaac.lang)} ${getNormalName(winner.name)}`);
    this.Isaac.services.itmr.sendToGame({
      m: 'trinketAction',
      d: {
        trinket: winner.id
      }
    }, true);

  }


}