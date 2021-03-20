import Colors from '../enums/Colors';
import ITMRText from '../models/ITMRText'
import Isaac from '../Isaac'

import t from '../../plugins/locale/translateFunction';
import { TextMessage } from '../../libs/streamEvents';
import BasicPoll from './BasicPoll';

/**
 * Poll with progress bar
 */
export default class PocketsPoll extends BasicPoll {
  /**
   * Create new progress bar poll
   * @param {Isaac} Isaac - Main game controller
   * @param {Number} pollTime - Time for current poll
   * @param {Number} delayTime - Time for delay after poll result
   */
  constructor(Isaac, pollTime, delayTime) {
    super(Isaac);

    /** Contains positive votes count @type {Number} */
    this.positiveVotes = 1;

    /** Contains all votes @type {Number} */
    this.allVotesCount = 2;

    /** Contains current poll type @type {Object} */
    this.pollType = null;

    /** Contains voted users @type {Object} */
    this.users = {};

    /** Time for polling @type {Number} */
    this.pollTime = pollTime;

    /** Time for delay fter polling ends @type {Number} */
    this.delayTime = delayTime;

    /** Need for sending progressbar @type {Boolean} */
    this.isFirstUpdate = true;

    /** This poll needs request player type */
    this.ready = false;

    // This poll do not have lines until the end
    this.text.secondline = null;
  }

  prepare() {
    this.Isaac.services.itmr.sendToGame({
      m: 'getPlayerType'
    })
    .then(res => this.setReady(res.out));
  }

  setReady(playerType) {

    // Prepare array with all progress bar types
    let types = [
      {
        name: "Pockets",
        title: t('selectPockets', this.Isaac.lang),
        sectors: ['none', 'pill', 'card', 'redcard', 'momcard', 'humanitycard', 'rune', 'blackrune', 'holycard', 'diceshard', 'creditcard']
      },
      {
        name: "Keys",
        title: t('selectKeys', this.Isaac.lang),
        sectors: [-3, -2, -1, 0, 1, 2, 3, 'gold']
      },
      {
        name: "Bombs",
        title: t('selectBombs', this.Isaac.lang),
        sectors: [-3, -2, -1, 0, 1, 2, 3, 'gold']
      },

      {
        name: "Coins",
        title: t('selectCoins', this.Isaac.lang),
        sectors: [-5, -2, -1, 0, 1, 2, 5, 10]
      }
    ];

    // If player is not Lost or Keeper, add hearts polling
    if (playerType != 10 && playerType != 14) {
      types.push({
        name: "Hearts",
        title: t('selectHearts', this.Isaac.lang),
        sectors: ['none', 'halfred', 'halfsoul', 'red', 'soul', 'gold', 'black', 'twitch', 'bone', 'container', 'rainbow']
      });
    }

    // Select poll type
    this.pollType = types[Math.floor(Math.random() * types.length)];

    this.ready = true;

  }

  /**
   * Update current poll state
   */
  update() {

    // Show progress bar
    if (this.isFirstUpdate) {
      this.Isaac.services.itmr.sendToGame({
        m: 'addProgressBar',
        d: {
          barType: this.pollType.name,
          title: `${this.Isaac.specialTriggers.getFirstlineModifier()} ${this.pollType.title} (${this.pollTime}${t('s', this.Isaac.lang)})`,
          min: 0,
          value: 1,
          max: 2,
          sectors: this.pollType.sectors.length
        }
      })

      this.isFirstUpdate = false;
    }

    if (!this.pollEnd) {

      if (this.pollTime > 0) {
        this.Isaac.services.itmr.sendToGame({
          m: 'setProgressBar',
          d: {
            title: `${this.Isaac.specialTriggers.getFirstlineModifier()} ${this.pollType.title} (${this.pollTime}${t('s', this.Isaac.lang)})`,
            min: 0,
            value: this.positiveVotes,
            max: this.allVotesCount
          }
        })

        this.pollTime--;
      }
      else {
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
          d: [
            this.text.firstline.name
          ]
        })

        this.text.firstline = null;

        this.Isaac.runNextAction();
      }
    }

    let texts = []

    if (this.text.firstline && this.text.firstline.prepare && this.pollEnd) {
      texts.push(this.text.firstline.prepare())
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

    this.pollEnd = true;
    this.Isaac.services.itmr.sendToGame({ m: 'removeProgressBar' });

    this.text.firstline.setBlink(Colors.white);
    this.text.firstline?.setPostfix(` (${this.delayTime}${t('s', this.Isaac.lang)})`);

    let winner = this.getWinner();

    this.Isaac.services.itmr.sendToGame({
      m: 'pocketsAction',
      d: {
        pickupType: this.pollType.name,
        value: winner
      }
    })

    // Create messages for Pockets and Hearts pollType
    if (this.pollType.name == "Pockets" || this.pollType.name == "Hearts") {

      // If winner is none, send basic message
      if (winner == 'none') {
        this.text.firstline?.setText(t('pollNoneResult', this.Isaac.lang));
      }
      else {

        // Set text for Hearts and Pockets poll
        this.text.firstline?.setText(
          `${t('pollGiveResult', this.Isaac.lang)}: ${t(winner, this.Isaac.lang)} ${

            // If this is heaerts poll, add "heart" word at the end
            this.pollType.name == "Hearts" ?
            t('heart', this.Isaac.lang)
            : ''
          }`
        );

      }
    }

    // Create message for all other pollType's
    else {
      // If winner is 0, send basic message
      if (winner == 0) {
        this.text.firstline?.setText(t('pollNoneResult', this.Isaac.lang));
      }
      else {

        // If winner is equal 'gold', set special message
        if (winner == 'gold') {
          if (this.pollType.name == "Keys")
            this.text.firstline?.setText(`${t('pollGiveResult', this.Isaac.lang)}: ${t('goldenkey', this.Isaac.lang)}`);
          else
            this.text.firstline?.setText(`${t('pollGiveResult', this.Isaac.lang)}: ${t('goldenbomb', this.Isaac.lang)}`);
        }

        // If winner more than zero, set message from "pollGiveResult" string
        else if (winner > 0) {
          this.text.firstline?.setText(
            `${t('pollGiveResult', this.Isaac.lang)}: ${winner} ${
              t(
                winner == 1 || winner == -1 ? this.pollType.name.toLowerCase().substr(0, this.pollType.name.length - 1) : this.pollType.name.toLowerCase(),
                this.Isaac.lang
              )
            }`
          )
        }
        // If winner smaller than zero, set message from "pollRemoveResult" string
        else {
          this.text.firstline?.setText(
            `${t('pollRemoveResult', this.Isaac.lang)}: ${-1 * winner} ${t(this.pollType.name.toLowerCase(), this.Isaac.lang)}`
          )
        }

      }
    }



  }

  handleMessaage(msg) {
    if (this.pollEnd) return;

    // Check if this is positive
    if (
      msg.text.toUpperCase() == "MORE" ||
      msg.text.toUpperCase() == "БОЛЬШЕ"
    ) {
      this.voteFor(true, `${msg.source}${msg.userId}`);
    }

    // Or negative
    else if (
      msg.text.toUpperCase() == "LESS" ||
      msg.text.toUpperCase() == "МЕНЬШЕ"
    ) {
      this.voteFor(false, `${msg.source}${msg.userId}`);
    }
  }

  /**
   * Add vote for selected variant
   * @param {Boolen} positive - Variant number
   * @param {Number|String} user - Unique user id
   */
  voteFor(positive, user) {

    // If "Russian hackers" event is active, swap votes
    if (this.Isaac.specialTriggers.triggers.russianHackers.enabled) {
      positive = !positive;
    }

    // If user already voted
    if (typeof this.users[user] !== 'undefined' && positive != this.users[user]) {

      if (positive) {
        this.positiveVotes ++;
      }
      else {
        this.positiveVotes --;
      }

      // Write new vote
      this.users[user] = positive;

    }

    else if (typeof this.users[user] === 'undefined') {
      if (positive) {
        this.positiveVotes ++;
      }

      this.users[user] = positive;
      this.allVotesCount++;
    }
  }

  /**
   * Return winner from current poll
   * @returns {String|Number} Winner
   */
  getWinner() {
    return this.pollType.sectors[Math.ceil(this.positiveVotes / this.allVotesCount * this.pollType.sectors.length) - 1];
  }


}