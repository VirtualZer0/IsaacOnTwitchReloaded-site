import Colors from '../../../enums/Colors';
import ITMRText from '../../../models/ITMRText'
import Isaac from '../../../Isaac'

import t from '../../../../plugins/locale/translateFunction';
import { TextMessage } from '../../../../libs/streamEvents';
import BasicPoll from '../Base/BasicPoll';

/**
 * Default poll with 3 variants
 */
export default class DefaultPoll extends BasicPoll {
  /**
   * Create new poll with 3 variants
   * @param {Isaac} Isaac - Main game controller
   * @param {Number} pollTime - Time for current poll
   * @param {Number} delayTime - Time for delay after poll result
   */
  constructor (Isaac, pollTime, delayTime) {
    super(Isaac);

    /** Contains votes per variant @type {Array<Number>} */
    this.votes = [0,0,0];

    /** Contains all votes @type {Number} */
    this.allVotesCount = 0;

    /** Contains voted users @type {Array<Number|String>} */
    this.users = {};

    /** Contains variants for poll @type {Array<Object>} */
    this.variants = [];

    /** Time for polling @type {Number} */
    this.pollTime = pollTime;

    /** Time for delay fter polling ends @type {Number} */
    this.delayTime = delayTime;
  }

  /**
   * Update current poll state
   */
  update () {
    super.update();

    if (!this.pollEnd) {

      if (this.pollTime > 0) {
        this.text.firstline.setPostfix?.(` (${this.pollTime}${t('s', this.Isaac.lang)})`);
        this.text.secondline.setText?.(this.getPollText());

        if (!this.Isaac.isPaused)
          this.pollTime--;
      }
      else {
        this.pollEnd = true;
        this.endPoll();
        this.Isaac.prepareNextAction();
      }

    }
    else {
      if (this.delayTime > 0) {
        if (!this.Isaac.isPaused)
          this.delayTime--;

        this.text.firstline.setPostfix?.(` (${this.delayTime}${t('s', this.Isaac.lang)})`)
      }
      else {

        this.Isaac.services.itmr.sendToGame({
          m: 'removeText',
          d: [
            this.text.firstline.name,
            this.text.secondline.name
          ]
        })

        this.text.firstline = null;
        this.text.secondline = null;

        this.Isaac.runNextAction();
      }
    }

    let texts = []

    if (this.text.firstline && this.text.firstline.prepare) {
      texts.push(this.text.firstline.prepare())
    }

    if (this.text.secondline && this.text.secondline.prepare) {
      texts.push(this.text.secondline.prepare())
    }

    if (texts.length > 0) {
      this.Isaac.services.itmr.sendToGame({
        m: 'addText',
        d: texts
      });
    }
  }

  /**
   * Called when poll end
   */
  endPoll () {

    // Requires custom implementation for every child class
    this.text.firstline.setBlink(Colors.white);
    this.text.firstline.setPostfix?.(` (${this.delayTime}${t('s', this.Isaac.lang)})`)

  }

  /**
   *
   * @param {TextMessage} msg - Message from the chat
   * @returns {Boolean} Show this message in chat
   */
  handleMessaage (msg) {
    if (this.pollEnd) return;

    // Check if this is vote for #1
    if (
      msg.text == "#1" ||
      msg.text == "1" ||
      msg.text.toUpperCase() == this.variants[0].name.toUpperCase()
    ) {
      this.voteFor(0, `${msg.source}${msg.userId}`);
      return false;
    }

    // Or for #2
    else if (
      msg.text == "#2" ||
      msg.text == "2" ||
      msg.text.toUpperCase() == this.variants[1].name.toUpperCase()
    ) {
      this.voteFor(1, `${msg.source}${msg.userId}`);
      return false;
    }

    // Maybe, for #3?
    else if (
      msg.text == "#3" ||
      msg.text == "3" ||
      msg.text.toUpperCase() == this.variants[2].name.toUpperCase()
    ) {
      this.voteFor(2, `${msg.source}${msg.userId}`);
      return false;
    }

    return true;
  }

  /**
   * Add vote for selected variant
   * @param {Number} num - Variant number
   * @param {Number|String} user - Unique user id
   */
  voteFor (num, user) {
    if (this.pollEnd) return;

    // If "Russian hackers" event is active
    if (this.Isaac.specialTriggers.triggers.russianHackers.enabled) {
      num = this.Isaac.specialTriggers.triggers.russianHackers.shuffle[num];
    }

    // If user already voted
    if (typeof this.users[user] !== 'undefined' && num != this.users[user]) {

      // Remove previous user vote
      this.votes[this.users[user]] --;

      // Add new vote
      this.votes[num] ++;

      // Write new vote
      this.users[user] = num;

    }

    else if (typeof this.users[user] === 'undefined') {
      this.votes[num] ++;
      this.users[user] = num;
      this.allVotesCount ++;
    }
  }

  /**
   * Return winner from current poll
   * @returns {Object} Winner
   */
  getWinner () {

    if (this.votes[0] == this.votes[1] == this.votes[2] || this.allVotesCount == 0) {
      return this.variants[Math.floor(Math.random() * this.variants.length)];
    }

    else if (this.votes[0] == this.votes[1] && this.votes[2] < this.votes[0]) {
      return Math.random() > .5 ? this.variants[1] : this.variants[0]
    }

    else if (this.votes[1] == this.votes[2] && this.votes[0] < this.votes[1]) {
      return Math.random() > .5 ? this.variants[2] : this.variants[1]
    }

    else if (this.votes[0] == this.votes[2] && this.votes[1] < this.votes[0]) {
      return Math.random() > .5 ? this.variants[2] : this.variants[0]
    }

    return this.variants[this.votes.indexOf(Math.max(...this.votes))];
  }

  /**
   * Returns the percentage for the selected poll option
   * @param {Number} variant - Selected variant
   * @returns {Number} Percents on selected variant
   */
  getPercents (variant) {
    if (this.Isaac.settings.hideVotes) {
      return '-'
    }

    return this.allVotesCount == 0 ? 0 : Math.round(this.votes[variant]/this.allVotesCount*100);
  }

  /**
   * Return poll text
   * @returns {String} Poll text
   */
  getPollText () {

    let text = `#1 ${this.variants[0].name} - ${this.getPercents(0)}%  `;
    text += `#2 ${this.variants[1].name} - ${this.getPercents(1)}%  `;
    text += `#3 ${this.variants[2].name} - ${this.getPercents(2)}%`;

    return text;

  }

  freeze() {
    super.freeze();
  }

  unfreeze() {
    super.unfreeze();
  }


}