import {ITMR_GAMEMODES} from './data/enums'

import ITMRText from './models/ITMRText'

import mod_activeItems from './data/mod/activeItems'
import mod_passiveItems from './data/mod/passiveItems'
import mod_familiars from './data/mod/familiars'
import mod_trinkets from './data/mod/trinkets'
import mod_events from './data/mod/events'

import vanilla_activeItems from './data/vanilla/activeItems'
import vanilla_passiveItems from './data/vanilla/passiveItems'
import vanilla_familiars from './data/vanilla/familiars'
import vanilla_trinkets from './data/vanilla/trinkets'

import streamers from './data/streamers'

import t from '../plugins/locale/translateFunction';

export default class Isaac {

  constructor (services, lang = 'en', gamemode = ITMR_GAMEMODES.NORMAL) {

    this.services = services;
    this.lang = lang;
    this.gamemode = gamemode;

    this.lists = {
      items: [
        ...mod_activeItems, ...mod_passiveItems, ...mod_familiars,
        ...vanilla_activeItems, ...vanilla_passiveItems, ...vanilla_familiars
      ],

      trinkets: [
        ...mod_trinkets, ...vanilla_trinkets
      ],

      events: [
        ...mod_events
      ],

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

    this.timer = null;
    this.time = 5;
    this.phase = 'gameSetupDone';
  }

  // Launch Isaac on Twitch
  start () {
    this.timer = setInterval(() => this.tick(), 1000);

    this.services.itmr.sendToGame({
      m: 'removeText',
      d: {name: 'gameConnected'}
    });

    this.services.itmr.sendToGame({
      m: 'addText',
      d: new ITMRText('gameSetupDone', `${t('gameSetupDone', this.lang)} ${this.time}${t('s', this.lang)}`)
    });
  }

  // Timer loop, call every second
  tick () {

    if (this.time < 0) {
      this.changePhase();
      return;
    }

    switch (this.phase) {

      case 'gameSetupDone':
        this.services.itmr.sendToGame({
          m: 'addText',
          d: new ITMRText('gameSetupDone', `${t('gameSetupDone', this.lang)} ${this.time}${t('s', this.lang)}`)
        });
        break;

    }

    this.time--;

  }

  // When time is 0, switch to new phase, based on previously phase
  changePhase () {

  }

  // Select random polling
  setRandomPolling () {

  }

  // Give gift for available streamers
  giveGift () {

  }

}