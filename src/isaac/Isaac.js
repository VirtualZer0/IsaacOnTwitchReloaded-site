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
    this.currentText = ""

    this.poll = null;               // Current poll object
    this.special = {                // Special parameters
      russinaHackers: {             // Parameters for Russian hackers event
        enabled: false,
        shuffle: []
      }
    }
  }

  // Launch Isaac on Twitch
  start () {
    this.timer = setInterval(() => this.tick(), 1000);
    this.text = t('gameSetupDone', this.lang);

    this.services.itmr.sendToGame({
      m: 'removeText',
      d: {name: 'gameConnected'}
    });

    this.sendSettings()
    .then (() => {
      this.loadData();
    });
    
  }

  // Timer loop, call every second
  tick () {

    if (this.phase == "wait" || this.phase == "pause") return;

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

    this.services.itmr.sendToGame({
      m: 'addText',
      d: new ITMRText('firstLine', `${this.text} ${this.time}${t('s', this.lang)}`, this.settings.textpos.l1)
    });

    this.time--;

  }

  // When time is 0, switch to new phase, based on previously phase
  changePhase () {
    if (this.phase == "gameSetupDone" || this.phase == "delay") {

      this.services.itmr.sendToGame({
        m: 'removeText',
        d: {name: 'firstLine'}
      });

      this.services.itmr.sendToGame({
        m: 'removeText',
        d: {name: 'secondLine'}
      });

      this.time = this.settings.timings.vote;
      this.setRandomPolling();

    }
    else if (this.phase == "defaultPoll") {

      this.phase = "delay"
      this.time = this.settings.timings.delay;
      this.text = t('pollResult', this.lang);

    }
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
      console.log(playerItems);
      this.state = "defaultPoll";

      // Remove item with 28% chance and if player have more than 3 items
      if (Math.random() < .28 && playerItems.length > 3) {

        // Set poll state
        this.action = "removeItem";
        this.text = t('selectItemForRemove', this.lang);
        
        // Set firstline text
        this.services.itmr.sendToGame({
          m: 'addText',
          d: new ITMRText(
            'firstLine',
            `${this.text} ${this.time}${t('s', this.lang)}`, this.settings.textpos.l1
          )
        });

        // Select three items for removing and get names
        let itemsToRemove = getRandomElementsFromArr(this.lists.items, 3).map(itemId => {
          return this.getItemById(this.lists.items, itemId);
        });

        // Create new default poll
        this.poll = new DefaultPoll(this, itemsToRemove);

        // Set second line text
        this.services.itmr.sendToGame({
          m: 'addText',
          d: new ITMRText('secondLine', this.poll.getText(), this.settings.textpos.l2)
        });
  
      }

      // Give item with 72% chance
      else {

        this.text = t('selectItem', this.lang);

        // Set firstline text
        this.services.itmr.sendToGame({
          m: 'addText',
          d: new ITMRText(
            'firstLine',
            `${this.text} ${this.time}${t('s', this.lang)}`, this.settings.textpos.l1
          )
        });

        // Remove collected items from variants
        let currentItemPool = this.lists.items.filter(item => {
          return playerItems.findIndex(playerItem => playerItem == item.id)
        });

        // Create new default poll
        this.poll = new DefaultPoll(this, getRandomElementsFromArr(currentItemPool, 3));

        // Set second line text
        this.services.itmr.sendToGame({
          m: 'addText',
          d: new ITMRText('secondLine', this.poll.getText(), this.settings.textpos.l2)
        });

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
    });

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
    })
    .then (res => {
      
      this.lists.items.push(...res.out.active);
      this.lists.items.push(...res.out.passive);
      this.lists.items.push(...res.out.familiars);
      this.lists.trinkets.push(...res.out.trinkets);
      this.lists.events.push(...res.out.events);

    });
  }

}