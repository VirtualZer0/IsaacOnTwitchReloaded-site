import Colors from '../../../enums/Colors';
import ITMRText from '../../../models/ITMRText'
import Isaac from '../../../Isaac'

import t from '../../../../plugins/locale/translateFunction';
import { getRandomElementsFromArr, weightedRandom } from '../../../helperFuncs'
import DefaultPoll from '../Base/DefaultPoll';

export default class EventsPoll extends DefaultPoll {
  /**
   * Create new poll for items
   * @param {Isaac} Isaac - Main game controller
   */
  constructor (Isaac, pollTime, delayTime) {

    super(Isaac, pollTime, delayTime);

    // Create events list based on gamemode
    let preparedEvents = this.Isaac.lists.events.map(event => {
      return {
        id: event.id,
        name: event.name,
        weight: event.weights[Isaac.gamemode],
        desc: event.desc,
        specialTrigger: event.specialTrigger,
        msgTrigger: event.msgTrigger
      }
    });

    // Select 3 random events
    for(let i = 0; i < 3; i++) {
      preparedEvents = preparedEvents.filter(event => !this.variants.some(selectedEvent => selectedEvent.id == event.id))
      this.variants.push(weightedRandom(preparedEvents));
    }

    this.text.firstline.setText(t('selectEvent', this.Isaac.lang));
    this.text.secondline.setText(this.getPollText());

  }

  update() {

    super.update();

    // Activate event special trigger
    if (this.delayTime == 0) {
      let winner = this.getWinner();
      if (winner.specialTrigger) {
        this.Isaac.specialTriggers.activate(winner.specialTrigger);
      }
    }

  }

  endPoll() {
    super.endPoll();
    let winner = this.getWinner();

    this.text.firstline.setText(`${t('selectedEvent', this.Isaac.lang)} ${winner.name}`);
    this.text.secondline.setText(winner.desc);
    this.text.secondline.setColor(Colors.lightGray);

    this.Isaac.services.itmr.sendToGame({
      m: 'eventAction',
      d: {
        id: winner.id
      }
    }, true);

  }

  freeze() {

    super.freeze();

    this.Isaac.services.itmr.sendToGame({
      m: 'removeText',
      d: [
        this.text.firstline.name,
        this.text.secondline.name
      ]
    })

  }

  unfreeze() {
    super.unfreeze();
  }


}