import Colors from '../../../enums/Colors';
import ITMRText from '../../../models/ITMRText'
import Isaac from '../../../Isaac'

import t from '../../../../plugins/locale/translateFunction';
import { TextMessage } from '../../../../libs/streamEvents';
import BasicPoll from '../Base/BasicPoll';

import { randString } from '../../../helperFuncs'
import ITMRVector from '../../../models/ITMRVector';

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
    super.update();

    // Send pollframes data
    if (this.isFirstUpdate) {
      this.Isaac.services.itmr.sendToGame({
        m: 'addPollframes',
        d: {
          f1: this.variants[0]?.gfx,
          f2: this.variants[1]?.gfx,
          f3: this.variants[2]?.gfx,
        }
      });

      this.isFirstUpdate = false;
    }

    if (!this.pollEnd) {

      if (this.pollTime > 0) {

        if (!this.Isaac.isPaused)
        this.pollTime--;

        this.text.firstline.setPostfix?.(` (${this.pollTime}${t('s', this.Isaac.lang)})`);

        let pollTexts = this.getPollText();
        for (let i = 0; i < pollTexts.length; i ++) {
          this.text.secondline[i].setText?.(pollTexts[i]);
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
        if (!this.Isaac.isPaused)
          this.delayTime--;

        this.text.firstline.setPostfix?.(` (${this.delayTime}${t('s', this.Isaac.lang)})`)
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

    if (this.text.firstline && this.text.firstline.prepare) {
      this.text.firstline?.setPos(this.Isaac.settings.textpos.l1);
      texts.push(this.text.firstline.prepare());
    }

    if (this.text.secondline) {
      this.text.secondline[0].setPos?.(this.Isaac.settings.textpos.l2);
      this.text.secondline[1].setPos?.({ X: this.Isaac.settings.textpos.l2.X + 90, Y: this.Isaac.settings.textpos.l2.Y });
      this.text.secondline[2].setPos?.({ X: this.Isaac.settings.textpos.l2.X + 180, Y: this.Isaac.settings.textpos.l2.Y });

      this.text.secondline.forEach?.(text => {
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

  /**
   *
   * @param {TextMessage} msg - Message from the chat
   * @returns {Boolean} Show this message in chat
   */
  handleMessaage(msg) {

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
  voteFor(num, user) {
    if (this.pollEnd) return;

    // If "Russian hackers" event is active
    if (this.Isaac.specialTriggers.triggers.russianHackers.enabled) {
      num = this.Isaac.specialTriggers.triggers.russianHackers.shuffle[num];
    }

    // If user already voted
    if (typeof this.users[user] !== 'undefined' && num != this.users[user]) {

      // Remove previous user vote
      this.votes[this.users[user]]--;

      // Add new vote
      this.votes[num]++;

      // Write new vote
      this.users[user] = num;

    }

    else if (typeof this.users[user] === 'undefined') {
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
    if ((this.votes[0] == this.votes[1] && this.votes[1] == this.votes[2]) || this.allVotesCount == 0) {
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

  freeze () {

    super.freeze();
    if (!this.pollEnd) {

      this.Isaac.services.itmr.sendToGame({
        m: 'removePollframes'
      });

      this.Isaac.services.itmr.sendToGame({
        m: 'removeText',
        d: [
          this.text.firstline.name,
          this.text.secondline[0].name,
          this.text.secondline[1].name,
          this.text.secondline[2].name
        ]
      })

    }
    else {

      this.Isaac.services.itmr.sendToGame({
        m: 'removeText',
        d: [this.text.firstline.name]
      })

    }

  }

  unfreeze () {
    super.unfreeze();

    if (!this.pollEnd) {

      this.Isaac.services.itmr.sendToGame({
        m: 'addPollframes',
        d: {
          f1: this.variants[0]?.gfx,
          f2: this.variants[1]?.gfx,
          f3: this.variants[2]?.gfx,
        }
      });

    }
  }


}