import {ITMR_GAMEMODES} from './data/enums'

import ITMRText from './models/ITMRText'

import BinaryPoll from './classes/BinaryPoll'
import DefaultPoll from './classes/DefaultPoll'

import {getRandomElementsFromArr} from './helperFuncs'

import streamers from './data/streamers'

import t from '../plugins/locale/translateFunction';

export default class Isaac {

  constructor (services, settings, lang = 'en', gamemode = ITMR_GAMEMODES.NORMAL) {

    this.services = services;       // Twitch, Youtube and Isaac connectors
    this.settings = settings;       // Current settings
    this.lang = lang;               // Current language
    this.gamemode = gamemode;       // Current gamemode

    this.lists = {};                // All items, trinkets, events, etc.

    this.timer = null;              // Main setInterval id
    this.time = 5;                  // Current time in seconds
    this.phase = 'gameSetupDone';   // Current phase
    this.action = null;             // Current polling action (removeItem, giveTrinket, etc.)

    this.text = {                   // Current text lines
      firstline: null,
      secondline: null
    }

    this.previousText = {           // Previous text lines. Needed for optimize requests count
      firstline: null,
      secondline: null
    }

    this.isPaused = false;

    this.poll = null;               // Current poll object
    this.special = {                // Special parameters
      russinaHackers: {             // Parameters for Russian hackers event
        enabled: false,
        shuffle: []
      }
    }

    this.colors = {                 // Colors storage
      yellow: {r: 1, g: 215/255, b: 0, a: 1}
    }

    // Bind events for Twitch
    if (this.services.twitch) {
      this.services.twitch.events.onMessage = this.onMessage.bind(this);
    }

    // Bind events for Youtube
    if (this.services.youtube) {
      this.services.youtube.events.onMessage = this.onMessage.bind(this);
    }
  }

  // Launch Isaac on Twitch
  start () {
    this.timer = setInterval(() => this.tick(), 1000);

    // Create text lines
    this.text['firstline'] = new ITMRText(
      'firstLine',
      `${t('gameSetupDone', this.lang)}`,
      this.settings.textpos.l1,
      this.colors.yellow
    );

    this.text['secondline'] = new ITMRText(
      'secondLine',
      '',
      this.settings.textpos.l2,
    );
    
    this.text['firstline'].setPostfix(`(${this.time}${t('s', this.lang)})`);

    // Remove previous text
    this.services.itmr.sendToGame({
      m: 'removeText',
      d: {name: 'gameConnected'}
    }, true);

    this.sendSettings()
    .then (() => {
      this.loadData();
    });
    
  }

  // Timer loop, call every second
  tick () {

    if (this.phase == "wait" || this.isPaused) return;

    if (this.time < 0) {

      this.services.itmr.sendToGame({
        m: 'removeText',
        d: {name: 'firstLine'}
      });

      this.services.itmr.sendToGame({
        m: 'removeText',
        d: {name: 'secondLine'}
      });

      this.changePhase();
      return;
    }

    if (this.phase == "defaultPoll")
      this.text.secondline.setText(this.poll.getText());

    this.updateText();

    this.time--;

  }

  // Call on message in chat
  onMessage (msg) {
    if (this.phase == "defaultPoll") {

      // Check if this is vote for #1
      if (
        msg.text == "#1" ||
        msg.text == "1" ||
        msg.text.toUpperCase() == this.poll.variants[0].name.toUpperCase()
      ) {
        this.poll.voteFor(0, `${msg.source}${msg.userId}`);
      }

      // Or for #2
      else if (
        msg.text == "#2" ||
        msg.text == "2" ||
        msg.text.toUpperCase() == this.poll.variants[1].name.toUpperCase()
      ) {
        this.poll.voteFor(1, `${msg.source}${msg.userId}`);
      }

      // Maybe, for #3?
      else if (
        msg.text == "#3" ||
        msg.text == "3" ||
        msg.text.toUpperCase() == this.poll.variants[2].name.toUpperCase()
      ) {
        this.poll.voteFor(2, `${msg.source}${msg.userId}`);
      }

    }

  }

  // When time is 0, switch to new phase, based on previously phase
  changePhase () {
    if (this.phase == "gameSetupDone" || this.phase == "delay") {

      this.time = this.settings.timings.vote;
      this.text.firstline.removeBlink();
      this.setRandomPolling();

    }
    else if (this.phase == "defaultPoll") {

      this.phase = "delay"
      this.time = this.settings.timings.delay;
      this.text.firstline.setBlink(255,255,255);

      let winner = this.poll.getWinner();

      switch (this.action) {

        case "giveItem":
          this.text.firstline.setText(`${t('pollGiveResult', this.lang)} ${winner.name}`);
          this.services.itmr.sendToGame({
            m: 'itemAction',
            d: {
              remove: false,
              item: winner.id
            }
          }, true);
          break;

        case "removeItem":
          this.text.firstline.setText(`${t('pollRemoveResult', this.lang)} ${winner.name}`);
          this.services.itmr.sendToGame({
            m: 'itemAction',
            d: {
              remove: true,
              item: winner.id
            }
          }, true);
          break;

      }

    }

    //this.updateText();
  }

  // Select random polling
  setRandomPolling () {

    this.setItemPolling();

  }

  // Decide, give or remove item
  setItemPolling () {

    let playerItems = [];
    this.phase = "wait";

    // Get player items
    this.services.itmr.sendToGame({
      m: 'getPlayerItems'
    })
    .then (res => {
      playerItems = res.out;
      this.phase = "defaultPoll";

      // Remove item with 28% chance and if player have more than 3 items
      if (Math.random() < .28 && playerItems.length > 3) {

        // Set poll state
        this.action = "removeItem";
        
        // Set firstline text
        this.text.firstline.setText(`${t('selectItemForRemove', this.lang)}`);

        // Select three items for removing and getting names
        let itemsToRemove = getRandomElementsFromArr(playerItems, 3)
          .map(itemId => {
            return this.getItemById(this.lists.items, itemId);
          });

        // Create new default poll
        this.poll = new DefaultPoll(this, itemsToRemove);

        // Set secondline text
        this.text['secondline'].setText(this.poll.getText());
  
      }

      // Give item with 72% chance
      else {

        // Set poll state
        this.action = "giveItem";

        // Set firstline text
        this.text.firstline.setText(`${t('selectItem', this.lang)}`);

        // Remove collected items from variants
        let currentItemPool = this.lists.items.filter(item => {
          return playerItems.findIndex(playerItem => playerItem == item.id)
        });

        // Create new default poll
        this.poll = new DefaultPoll(this, getRandomElementsFromArr(currentItemPool, 3));

        // Set second line text
        this.text['secondline'].setText(this.poll.getText());

      }
    })
    

  }

  // Give gift for available streamers
  giveGift () {

  }

  // Get item name by id
  getItemById (list, id) {

    return list.find(item => item.id == id);

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

  // Send textlines to game
  updateText () {

    let textForUpdate = [];
    
    // Update firstline text
    if (this.text.firstline)
      this.text['firstline'].setPostfix(`(${this.time}${t('s', this.lang)})`);

    if (!this.text.firstline.equals(this.previousText.firstline)) {

      let prepared = this.text.firstline.prepare();
      this.previousText.firstline = prepared;

      textForUpdate.push(prepared);

    }


    // Update secondline text
    if (!this.text.secondline.equals(this.previousText.secondline)) {

      let prepared = this.text.secondline.prepare();
      this.previousText.secondline = prepared;

      textForUpdate.push(prepared);

    }

    if (textForUpdate.length > 0) {
      this.services.itmr.sendToGame({
        m: 'addText',
        d: textForUpdate
      });
    }

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
    this.services.itmr.sendToGame({
      m: 'getItems'
    }, true)
    .then (res => {
      
      this.lists.items.push(...res.out.active);
      this.lists.items.push(...res.out.passive);
      this.lists.items.push(...res.out.familiars);
      this.lists.trinkets.push(...res.out.trinkets);
      this.lists.events.push(...res.out.events);

    });
  }

}