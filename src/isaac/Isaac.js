import t from '../plugins/locale/translateFunction';
import Colors from './enums/Colors'
import {ITMR_GAMEMODES} from './enums/Gamemodes'

import ITMRText from './models/ITMRText'

import {getRandomElementsFromArr} from './helperFuncs'

import streamers from './data/streamers'

import TwitchConnect from '../libs/twitchConnect'
import YoutubeConnect from '../libs/youtubeConnect'
import IsaacConnect from './isaacConnect'

import BasicPoll from './classes/BasicPoll'
import ItemsPoll from './classes/ItemsPoll'
import EventsPoll from './classes/EventsPoll';
import Message from './classes/Message'

/**
 * Main game controller
 **/
export default class Isaac {

  /**
   * Create new Isaac controller
   * @param {Object} services - Twitch, Youtube and ITMR services
   * @param {TwitchConnect} services.twitch - Twitch service
   * @param {YoutubeConnect} services.youtube - Youtube service
   * @param {IsaacConnect} services.itmr - Isaac service
   * @param {Object} settings - Mod settings
   * @param {String} lang - Language code
   * @param {Number} gamemode - Selected gamemode
   */
  constructor (services, settings, lang = 'en', gamemode = ITMR_GAMEMODES.NORMAL) {

    this.services = services;       // Twitch, Youtube and Isaac connectors
    this.settings = settings;       // Current settings
    this.lang = lang;               // Current language
    this.gamemode = gamemode;       // Current gamemode

    this.lists = {};                // All items, trinkets, events, etc.

    this.streamEventsQueue = {      // Queue for stream events, like bits and subscribers
      bits: [],                     // Bits and superchat array
      subs: [],                     // Subscribers and followers array
    }

    /** Main setInterval id @type {Number} */
    this.timer = null;

    /** Active poll or text object @type {BasicPoll|Message} */
    this.currentAction = null;

    /** Next poll or text object @type {BasicPoll|Message} */
    this.nextAction = null;

    /** Interrupted poll or text object @type {BasicPoll|Message} */
    this.freezedAction = null;

    /** Game state @type {Boolean} */
    this.isPaused = false;


    /** Special conditions, like Russian Hacker event @type {Object} */
    this.special = {                // Special parameters
      russinaHackers: {             // Parameters for Russian hackers event
        enabled: false,             // Status of event
        shuffle: []                 // Voting order
      }
    }

    // Bind events for Twitch
    if (this.services.twitch) {
      this.services.twitch.events.onMessage = this.onMessage.bind(this);
    }

    // Bind events for Youtube
    if (this.services.youtube) {
      this.services.youtube.events.onMessage = this.onMessage.bind(this);
    }

    // Add game state handlers
    this.services.itmr.addHandler('changeGameState', ({paused}) => {
      this.isPaused = paused;
    });
  }

  // Launch Isaac on Twitch
  start () {
    this.timer = setInterval(() => this.tick(), 1000);

    // Remove previous text
    this.services.itmr.sendToGame({
      m: 'removeText',
      d: ['gameConnected']
    }, true);

    // Exchange startup data
    this.sendSettings()
    .then (() => {
      this.loadData()
      .then(() => {

        // Create message about starting poll
        this.currentAction = new Message(
          this,
          new ITMRText(
            'msg_firstline',
            `${t('gameSetupDone', this.lang)}`,
            this.settings.textpos.l1,
            Colors.yellow
          ), null, 5
        )

        console.log(this);
      });

    });

  }

  // Timer loop, call every second
  tick () {
    this.services.itmr.checkOutput();
    this.currentAction?.update();
  }

  // Call on message in chat
  onMessage (msg) {
    this.currentAction?.handleMessaage(msg);
  }

  prepareNextAction() {


    this.nextAction = new ItemsPoll(this, this.settings.timings.vote, this.settings.timings.delay, this.lists.items);

    this.nextAction?.prepare();

  }

  runNextAction() {
    this.currentAction = this.nextAction;
    this.nextAction = null;
  }

  // Give gift for available streamers
  giveGift () {

  }



  // Send settings to game
  sendSettings () {

    return this.services.itmr.sendToGame({
      m: 'settings',
      d: {
        textpos: this.settings.textpos,
        subtime: this.settings.subtime,
        lang: this.lang
      }
    }, true);

  }

  // Load all items, trinkets and events from game
  loadData () {

    this.lists = {                  // List of all polling types
      items: [],
      trinkets: [],
      events: [],

      pickups: [
        'money', 'bomb', 'key', 'battery', 'pill', 'card', 'rune', 'sack', 'bits'
      ],

      hearts: [
        {cost: 0, variants: [
          'nothing'
        ]},

        {cost: 20, variants: [
          'halfRed', 'halfSoul'
        ]},

        {cost: 40, variants: [
          'red', 'soul'
        ]},

        {cost: 60, variants: [
          'black', 'blended', 'eternal', 'doubleRed', 'twitch'
        ]},

        {cost: 80, variants: [
          'golden', 'container', 'bone'
        ]},

        {cost: 100, variants: [
          'rainbow'
        ]}
      ],

      companions: [
        {cost: 0, variants: [
          'redFlies'
        ]},

        {cost: 25, variants: [
          'redSpiders'
        ]},

        {cost: 50, variants: [
          'blueSpiders'
        ]},

        {cost: 75, variants: [
          'blueFlies'
        ]},

        {cost: 100, variants: [
          'prettyFly'
        ]}
      ],

      moneys: [
        {cost: 0, variants: [
          '-5'
        ]},

        {cost: 25, variants: [
          '-2'
        ]},

        {cost: 50, variants: [
          '0'
        ]},

        {cost: 75, variants: [
          '+2'
        ]},

        {cost: 100, variants: [
          '+5'
        ]},
      ],

      keys: [
        {cost: 0, variants: [
          '-3'
        ]},

        {cost: 25, variants: [
          '-1'
        ]},

        {cost: 50, variants: [
          '0'
        ]},

        {cost: 75, variants: [
          '+1'
        ]},

        {cost: 100, variants: [
          '+3'
        ]},
      ],

      bombs: [
        {cost: 0, variants: [
          '-3'
        ]},

        {cost: 25, variants: [
          '-1'
        ]},

        {cost: 50, variants: [
          '0'
        ]},

        {cost: 75, variants: [
          '+1'
        ]},

        {cost: 100, variants: [
          '+3'
        ]},
      ],


    }

    // Load items from mod
    return this.services.itmr.sendToGame({
      m: 'getItems'
    }, true)
    .then (res => {

      this.lists.items.push(...res.out.active);
      this.lists.items.push(...res.out.passive);
      this.lists.items.push(...res.out.familiars);
      this.lists.trinkets.push(...res.out.trinkets);
      this.lists.events.push(...res.out.events);

      console.log(this.lists.items);

    });
  }

}