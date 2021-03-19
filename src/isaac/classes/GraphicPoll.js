import Colors from '../enums/Colors';
import ITMRText from '../models/ITMRText'
import Isaac from '../Isaac'

import t from '../../plugins/locale/translateFunction';
import { TextMessage } from '../../libs/streamEvents';
import BasicPoll from './BasicPoll';

import { randString } from '../helperFuncs'

/**
 * Poll with images in variants
 */
export default class GraphicPoll extends BasicPoll {
  /**
   * Create new poll with 3 variants
   * @param {Isaac} Isaac - Main game controller
   * @param {Number} pollTime - Time for current poll
   * @param {Number} delayTime - Time for delay after poll result
   */
  constructor(Isaac, pollTime, delayTime) {
    super(Isaac);

    /** Contains votes per variant @type {Array<Number>} */
    this.votes = [0, 0, 0];

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

    /** Need for sending pollframes @type {Boolean} */
    this.isFirstUpdate = true;

    /** Split second line on 3 parts @override @type {Array<ITMRText>} */
    this.text.secondline = [
      new ITMRText(
        `p_${randString(8)}_s1`,
        '',
        Isaac.settings.textpos.l2,
      ),

      new ITMRText(
        `p_${randString(8)}_s2`,
        '',
        { X: Isaac.settings.textpos.l2.X + 90, Y: Isaac.settings.textpos.l2.Y }
      ),

      new ITMRText(
        `p_${randString(8)}_s3`,
        '',
        { X: Isaac.settings.textpos.l2.X + 180, Y: Isaac.settings.textpos.l2.Y }
      ),
    ]
  }

  /**
   * Update current poll state
   */
  update() {

    // Send pollframes data
    if (this.isFirstUpdate) {
      this.Isaac.services.itmr.sendToGame({
        m: 'addPollframes',
        d: {
          f1: this.variants[0].gfx,
          f2: this.variants[1].gfx,
          f3: this.variants[2].gfx,
        }
      });

      this.isFirstUpdate = false;
    }

    if (!this.pollEnd) {

      if (this.pollTime > 0) {
        this.pollTime--;
        this.text.firstline?.setPostfix(` (${this.pollTime}${t('s', this.Isaac.lang)})`);

        let pollTexts = this.getPollText();
        for (let i = 0; i < pollTexts.length; i ++) {
          this.text.secondline[i]?.setText(pollTexts[i]);
        }
      }
      else {
        this.pollEnd = true;
        this.endPoll();
        this.Isaac.prepareNextAction();
      }

    }
    else {
      if (this.delayTime > 0) {
        this.delayTime--;
        this.text.firstline?.setPostfix(` (${this.delayTime}${t('s', this.Isaac.lang)})`)
      }
      else {

        this.Isaac.services.itmr.sendToGame({
          m: 'removeText',
          d: [ this.text.firstline.name ]
        })

        this.text.firstline = null;
        this.text.secondline = null;

        this.Isaac.runNextAction();
      }
    }

    let texts = []

    if (!this.text.firstline != null) {
      texts.push(this.text.firstline.prepare())
    }

    if (!this.text.secondline != null) {
      console.log(this.text.secondline);
      this.text.secondline?.forEach(text => {
        texts.push(text.prepare())
      });
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
  endPoll() {

    // Requires custom implementation for every child class
    this.text.firstline.setBlink(Colors.white);

    this.Isaac.services.itmr.sendToGame({
      m: 'removePollframes'
    });

    this.Isaac.services.itmr.sendToGame({
      m: 'removeText',
      d: [
        this.text.secondline[0].name,
        this.text.secondline[1].name,
        this.text.secondline[2].name
      ]
    })

    this.text.secondline = null;

  }

  handleMessaage(msg) {
    if (this.pollEnd) return;

    // Check if this is vote for #1
    if (
      msg.text == "#1" ||
      msg.text == "1" ||
      msg.text.toUpperCase() == this.variants[0].name.toUpperCase()
    ) {
      this.voteFor(0, `${msg.source}${msg.userId}`);
    }

    // Or for #2
    else if (
      msg.text == "#2" ||
      msg.text == "2" ||
      msg.text.toUpperCase() == this.variants[1].name.toUpperCase()
    ) {
      this.voteFor(1, `${msg.source}${msg.userId}`);
    }

    // Maybe, for #3?
    else if (
      msg.text == "#3" ||
      msg.text == "3" ||
      msg.text.toUpperCase() == this.variants[2].name.toUpperCase()
    ) {
      this.voteFor(2, `${msg.source}${msg.userId}`);
    }
  }

  /**
   * Add vote for selected variant
   * @param {Number} num - Variant number
   * @param {Number|String} user - Unique user id
   */
  voteFor(num, user) {

    // If "Russian hackers" event is active
    if (this.Isaac.special.russinaHackers.enabled) {
      num = this.Isaac.special.russinaHackers.shuffle[num];
    }

    // If user already voted
    if (this.users[user] && num != this.users[user]) {
      console.log(`Already voted: ${this.votes[this.users[user]]}`);
      // Remove previous user vote
      this.votes[this.users[user]]--;

      // Add new vote
      this.votes[num]++;

      // Write new vote
      this.users[user] = num;

    }

    else if (!this.users[user]) {
      this.votes[num]++;
      this.users[user] = num;
      this.allVotesCount++;
    }
  }

  /**
   * Return winner from current poll
   * @returns {Object} Winner
   */
  getWinner() {
    return this.variants[this.votes.indexOf(Math.max(...this.votes))];
  }

  /**
   * Returns the percentage for the selected poll option
   * @param {Number} variant - Selected variant
   * @returns {Number} Percents on selected variant
   */
  getPercents(variant) {
    if (this.Isaac.settings.hideVotes) {
      return '-'
    }

    return this.allVotesCount == 0 ? 0 : Math.round(this.votes[variant] / this.allVotesCount * 100);
  }

  /**
   * Return poll text
   * @returns {Array<String>} Poll text
   */
  getPollText() {

    return [
      `#1            ${this.getPercents(0)}%`,
      `#2            ${this.getPercents(1)}%`,
      `#3            ${this.getPercents(2)}%`
    ]

  }


}