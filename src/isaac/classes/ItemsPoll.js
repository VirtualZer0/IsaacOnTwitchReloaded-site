import Colors from '../enums/Colors';
import ITMRText from '../models/ITMRText'
import Isaac from '../Isaac'

import t from '../../plugins/locale/translateFunction';
import { getRandomElementsFromArr } from '../helperFuncs'
import GraphicPoll from './GraphicPoll';

export default class ItemsPoll extends GraphicPoll {
  /**
   * Create new poll for items
   * @param {Isaac} Isaac - Main game controller
   * @param {Array} allItems - All game items
   */
  constructor (Isaac, pollTime, delayTime, allItems) {

    super(Isaac, pollTime, delayTime);

    /** Contains all items in game @type {Array<Object>} */
    this.items = allItems;

    /** Contains poll type - give item or remove it @type {String} */
    this.action = '';

    // This poll needs to get data before launching
    this.ready = false;

  }

  prepare () {
    this.Isaac.services.itmr.sendToGame({
      m: 'getPlayerItems'
    })
    .then(res => this.setReady(res.out));
  }

  setReady (playerItems) {

    // Remove item with 28% chance and if player have more than 3 items
    if (Math.random() < .28 && playerItems.length > 3) {

      // Set poll state
      this.action = "removeItem";

      // Set firstline text
      this.text.firstline.setText(`${t('selectItemForRemove', this.Isaac.lang)}`);

      // Select three items for removing and getting names
      let itemsToRemove = getRandomElementsFromArr(playerItems, 3)
        .map(itemId => {
          return this.items.find(item => item.id == itemId);
        });

      // Set poll variants
      this.variants = itemsToRemove;

    }

    // Give item with 72% chance
    else {

      // Set poll state
      this.action = "giveItem";

      // Set firstline text
      this.text.firstline.setText(`${t('selectItem', this.Isaac.lang)}`);

      // Remove collected items from variants
      let currentItemPool = this.items.filter(item => {
        return playerItems.findIndex(playerItem => playerItem == item.id)
      });

      // Set poll variants
      this.variants = getRandomElementsFromArr(currentItemPool, 3)

    }

    this.ready = true;

  }

  endPoll() {
    super.endPoll();

    let winner = this.getWinner();

    switch (this.action) {

      case "giveItem":
        this.text.firstline.setText(`${t('pollGiveResult', this.Isaac.lang)} ${winner.name}`);
        this.Isaac.services.itmr.sendToGame({
          m: 'itemAction',
          d: {
            remove: false,
            item: winner.id
          }
        }, true);
        break;

      case "removeItem":
        this.text.firstline.setText(`${t('pollRemoveResult', this.Isaac.lang)} ${winner.name}`);
        this.Isaac.services.itmr.sendToGame({
          m: 'itemAction',
          d: {
            remove: true,
            item: winner.id
          }
        }, true);
        break;
    }

  }


}