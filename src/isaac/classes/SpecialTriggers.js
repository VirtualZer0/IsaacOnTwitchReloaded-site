import { getRandomElementsFromArr } from '../helperFuncs'

export default class SpecialTriggers {

  constructor () {

    this.triggers = {

      russianHackers: {
        enabled: false,
        shuffle: [],
        modifier: '[H4CK3D] '
      }

    }

  }

  activate(name) {

    this.triggers[name].enabled = true;

    switch (name) {

      case 'russianHackers':
        this.triggers.russianHackers.shuffle = getRandomElementsFromArr([0,1,2], 3);
        break;

    }

  }

  stopAll() {
    for (const [key, value] of Object.entries(this.triggers)) {
      value.enabled = false;
    }
  }

  getFirstlineModifier() {
    let modifier = '';
    for (const [key, value] of Object.entries(this.triggers)) {
      modifier += value.enabled ? value.modifier : ''
    }

    return modifier;
  }

}