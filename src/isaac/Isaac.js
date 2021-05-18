import t from '../plugins/locale/translateFunction';
import Colors from './enums/Colors'
import {ITMR_GAMEMODES} from './enums/Gamemodes'

import ITMRText from './models/ITMRText'

import {getRandomElementsFromArr, weightedRandom, randString} from './helperFuncs'

import streamers from './data/streamers'

import TwitchConnect from '../libs/twitchConnect'
import YoutubeConnect from '../libs/youtubeConnect'
import IsaacConnect from './isaacConnect'

import BasicPoll from './classes/Polls/Base/BasicPoll'
import ItemsPoll from './classes/Polls/Graphic/ItemsPoll'
import EventsPoll from './classes/Polls/Text/EventsPoll';
import TrinketsPoll from './classes/Polls/Graphic/TrinketsPoll';
import PocketsPoll from './classes/Polls/Bar/PocketsPoll';

import Message from './classes/Message'
import SpecialTriggers from './classes/SpecialTriggers';

import { DonateMessage, Subscriber, TextMessage } from '../libs/streamEvents';
import SpecialMessageHandler from './classes/SpecialMessageHandler';

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
    this.activeUsers = {};          // All user from chat, using for bossnames
    this.ticksCount = 0;            // Contains count of ticks

    /** Contains chat window @type {Window} */
    this.chatWindow = null;

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

    /** Contains special handlers for message events @type {SepcialTriggers} */
    this.specialMessageHandler = new SpecialMessageHandler(this);

    /** Game state @type {Boolean} */
    this.isPaused = false;

    // Bind events for Twitch
    if (this.services.twitch) {
      this.services.twitch.events.onMessage = this.onMessage.bind(this);
      this.services.twitch.events.onSub = this.onSubscriber.bind(this);
      this.services.twitch.events.onBits = this.onDonate.bind(this);
    }

    // Bind events for Youtube
    if (this.services.youtube) {
      this.services.youtube.events.onMessage = this.onMessage.bind(this);
      this.services.youtube.events.onSub = this.onSubscriber.bind(this);
      this.services.youtube.events.onSuperchat = this.onDonate.bind(this);
    }

    // Send settings on reconnect
    this.services.itmr.events.onReconnect = () => {
      this.sendSettings();
    }

    // Add output handlers
    this.services.itmr.addHandler('changeGameState', ({paused}) => {
      this.isPaused = paused;
    });

    this.services.itmr.addHandler('acceptPoll', () => {
      this.acceptPoll();
    });

    this.services.itmr.addHandler('skipPoll', () => {
      this.skipPoll();
    });

    this.services.itmr.addHandler('newRun', () => {
      this.start();
    });

    this.services.itmr.addHandler('toggleSpecialHandler', ({name, enable}) => {
      this.services.itmr._log(`Handler ${name} set to ${enable}`)
      this.specialMessageHandler.state[name] = enable;
    });
  }

  /**
   * Launch Isaac on Twitch
   */
  start () {
    if (this.timer) {
      clearInterval(this.timer);
      this.freezedActions = [];
      this.currentAction = null;
      this.nextAction = null;
      this.specialTriggers.stopAll();
      this.specialMessageHandler.disableAll();
    }

    // Clear all UI elements
    this.services.itmr.clearAll();

    this.timer = setInterval(() => this.tick(), 1000);

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

    // Give personal trinket
    streamers.forEach(streamer => {

      if (
        streamer.twitch === this.services?.twitch?.channel.toLowerCase()
        || streamer.youtube === this.services?.youtube?.channel
      ) {
        this.services.itmr.sendToGame({
          m: 'gift',
          d: {
            trinket: streamer.trinket
          }
        }, true);
      }

    })

  }

  /**
   * Timer loop, call every second
   */
  tick () {
    this.ticksCount ++;
    this.services.itmr.checkOutput();

    // Update user nicknames
    if (this.ticksCount % 10 == 0) {

      let users = Object.keys(this.activeUsers)

      this.services.itmr.sendToGame({
        m: 'randomNames',
        d: users.length > 20 ?
          getRandomElementsFromArr(users, 20)
          : users
      })
    }

    if (!this.services.itmr.isConnected) return;

    this.currentAction.update?.();
  }

  /**
   * Change poll position in game
   * @param {String} pos - Position direction
   */
  changeTextPos(pos) {

    console.log(this.settings.textpos)

    switch (pos) {
      case 'up':
        this.settings.textpos.l1.Y -= 5;
        this.settings.textpos.l2.Y -= 5;
        break;

      case 'down':
        this.settings.textpos.l1.Y += 5;
        this.settings.textpos.l2.Y += 5;
        break;

      case 'left':
        this.settings.textpos.l1.X -= 5;
        this.settings.textpos.l2.X -= 5;
        break;

      case 'right':
        this.settings.textpos.l1.X += 5;
        this.settings.textpos.l2.X += 5;
        break;

      case 'reset':
        this.settings.textpos = {
          l1: { X: 16, Y: 190 },
          l2: { X: 16, Y: 215 }
        }
        break;
    }

    this.services.itmr.sendToGame({
      m: 'textpos',
      d: this.settings.textpos
    }, true);

    console.log(this.settings.textpos)

    return this.settings.textpos;

  }

  /**
   * Call on new message in chat
   * @param {TextMessage} msg - Message from chat
   */
  onMessage (msg) {

    let showInChat = true;
    if (!this.activeUsers[msg.userName]) {
      this.activeUsers[msg.userName] = true
    }

    // Check poll in message
    if (this.currentAction?.handleMessaage) {
      let res = this.currentAction?.handleMessaage?.(msg);
      if (res === false) {
        showInChat = false;
      }
    }

    // Check special actions in message
    let res = this.specialMessageHandler.handleMessage(msg);
    if (res === false) {
      showInChat = false
    }


    // Send message data to chat
    if (this.chatWindow && !this.chatWindow.closed && showInChat) {
      console.log('Send message');
      this.chatWindow.postMessage?.({
        chatMessage: {
          type: 'basic',
          user: msg.userName,
          text: msg.text,
          source: msg.source
        }
      }, '*');
    }
  }

  /**
   * Call on new subscriber
   * @param {Subscriber} subscriber - Subscriber object
   */
  onSubscriber (subscriber) {

    if (!this.settings.subsAndBits.subs)
      return;

    this.immediateAction(new Message(this, new ITMRText(
      `sub_${randString(8)}`,
      `${t('newSub', this.lang)} - ${subscriber.userName}`,
      this.settings.textpos.l1,
      Colors.white,
      Colors.yellow
    ), null, 3));

    this.services.itmr.sendToGame({
      m: 'subscriberAction',
      d: {name: subscriber.userName, time: this.settings.subtime}
    });


    // Send subscribe data to chat
    if (this.chatWindow && !this.chatWindow.closed) {
      this.chatWindow.postMessage?.({
        chatMessage: {
          type: 'subscribe',
          user: subscriber.userName,
          source: subscriber.source
        }
      }, '*');
    }

  }

  /**
   * Call on new bits or superchat
   * @param {DonateMessage} donate - Subscriber object
   */
  onDonate(donate) {

    if (!this.settings.subsAndBits.bits && donate.source == 'tw')
      return;
    else if (!this.settings.subsAndBits.superchat && donate.source == 'yt')
      return;

    this.immediateAction(new Message(this, new ITMRText(
      `sub_${randString(8)}`,
      donate.source == 'tw' ? t('newBits', this.lang) : t('newSuperchat', this.lang),
      this.settings.textpos.l1,
      Colors.white,
      Colors.yellow
    ), null, 3));

    this.services.itmr.sendToGame({
      m: 'bitsAction',
      d: { amount: donate.amount, type: donate.type }
    });

  }

  /**
   * Launch action immediately, freeze preview action
   * @param {BasicPoll|Message} action - Action for calling immediately
   */
  immediateAction(action) {
    // Freeze current action
    this.currentAction.freeze?.();

    if(!(this.currentAction instanceof Message)) {
      this.freezedActions.push(this.currentAction);
    }

    this.currentAction = action;

  }

  /**
   * Prepare next action
   */
  prepareNextAction() {

    if (this.freezedActions.length > 0) {
      return;
    }

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

    this.nextAction.prepare?.();

  }

  runNextAction() {

    // If contains freezed action, launch it
    if (this.freezedActions.length > 0) {
      this.currentAction = this.freezedActions.pop();
      return;
    }

    this.currentAction = this.nextAction;
    this.nextAction = null;
    this.currentAction?.text?.firstline?.setPrefix?.(this.specialTriggers.getFirstlineModifier());
  }

  // Give gift for available streamers
  giveGift () {

  }

  // Skip current poll
  skipPoll () {

    this.currentAction?.freeze?.();
    this.currentAction = new Message(this, new ITMRText(
      'skipvote',
      t('skipCurrentPoll', this.lang),
      this.settings.textpos.l1,
      Colors.red,
      Colors.yellow
    ));

  }

  // Accept current poll
  acceptPoll() {

    if (this.currentAction && this.currentAction.pollTime)
      this.currentAction.pollTime = 0;

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