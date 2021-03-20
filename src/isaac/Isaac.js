import t from '../plugins/locale/translateFunction';
import Colors from './enums/Colors'
import {ITMR_GAMEMODES} from './enums/Gamemodes'

import ITMRText from './models/ITMRText'

import {getRandomElementsFromArr, weightedRandom} from './helperFuncs'

import streamers from './data/streamers'

import TwitchConnect from '../libs/twitchConnect'
import YoutubeConnect from '../libs/youtubeConnect'
import IsaacConnect from './isaacConnect'

import BasicPoll from './classes/BasicPoll'
import ItemsPoll from './classes/ItemsPoll'
import EventsPoll from './classes/EventsPoll';
import TrinketsPoll from './classes/TrinketsPoll';
import Message from './classes/Message'
import SpecialTriggers from './classes/SpecialTriggers';
import PocketsPoll from './classes/PocketsPoll';

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

    // ------------ Actions seciotn ------------ //

    /** Active poll or text object @type {BasicPoll|Message} */
    this.currentAction = null;

    /** Next poll or text object @type {BasicPoll|Message} */
    this.nextAction = null;

    /** Interrupted poll or text object @type {Array<BasicPoll|Message>} */
    this.freezedActions = [];

    /** Contains special handlers for polling modification @type {SepcialTriggers} */
    this.specialTriggers = new SpecialTriggers();

    /** Game state @type {Boolean} */
    this.isPaused = false;

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
    this.specialTriggers.stopAll();

    // Select poll based on weights
    let selectedPoll = weightedRandom([
      { name: 'event', weight: this.settings.chances.events },
      { name: 'item', weight: this.settings.chances.items },
      { name: 'trinket', weight: this.settings.chances.trinkets },
      { name: 'other', weight: this.settings.chances.other },
    ]);


    switch (selectedPoll.name) {
      case 'event':
        this.nextAction = new EventsPoll(this, this.settings.timings.vote, this.settings.timings.delay);
        break;

      case 'item':
        this.nextAction = new ItemsPoll(this, this.settings.timings.vote, this.settings.timings.delay);
        break;

      case 'trinket':
        this.nextAction = new TrinketsPoll(this, this.settings.timings.vote, this.settings.timings.delay);
        break;

      case 'other':
        this.nextAction = new PocketsPoll(this, this.settings.timings.vote, this.settings.timings.delay);
        break;
    }

    this.nextAction?.prepare();

  }

  runNextAction() {
    this.currentAction = this.nextAction;
    this.nextAction = null;
    this.currentAction.text.firstline?.setPrefix(this.specialTriggers.getFirstlineModifier());
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

      console.log(res.out);

    });
  }

}