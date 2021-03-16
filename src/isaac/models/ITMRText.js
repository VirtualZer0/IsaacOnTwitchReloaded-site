import ITMRColor from "./ITMRColor";
import ITMRVector from "./ITMRVector";

export default class ITMRText {

  /**
   * Create new Text for Isaac On Twitch Mod
   * @param {String} name - Text id
   * @param {String} value - Text value
   * @param {ITMRVector} pos - Text position
   * @param {ITMRColor} color - Text color
   * @param {ITMRColor} blink - Text blink color
   * @param {Number} size - Text size
   * @param {Boolean} isCenter - Set text to center
   * @param {String} postfix - Text postfix, added to the end of text
   */
  constructor (name, value, pos = null, color = null, blink = null, size = null, isCenter = null, postfix = null) {

    this.name = name;
    this.value = value;
    this.pos = pos;
    this.color = color;
    this.blink = blink;
    this.size = size;
    this.isCenter = isCenter;
    this.postfix = postfix;

  }

  /**
   * Change text position
   * @param {ITMRVector} vector - Vector with new position
   */
  setPos (vector) {
    this.pos = vector
  }

  /**
   * Change text value
   * @param {String} text - New text value
   */
  setText (text) {
    this.value = text;
  }

  /**
   * Change text postfix
   * @param {String} postfix - New text postfix
   */
  setPostfix (postfix) {
    this.postfix = postfix;
  }

  /**
   * Change text color
   * @param {ITMRColor|null} color - Text color
   */
  setColor (color) {
    this.color = color
  }

  /**
   * Change text blink color
   * @param {ITMRColor|null} color - Blink color
   */
  setBlink (color) {
    this.blink = color
  }

  /**
   * Remove text blinking
   */
  removeBlink () {
    this.blink = null;
  }

  /**
   * Change text size
   * @param {Number} size - New text size
   */
  setSize (size) {
    this.size = size;
  }

  /**
   * Change text centering
   * @param {Boolean} center - Set text to center
   */
  setCenter (center) {
    this.isCenter = center;
  }

  /**
   * Return only not null fields for decreasing data size
   * @returns {Object}
   */
  prepare () {

    let obj = {};
    obj['name'] = this.name;
    obj['value'] = this.postfix ? `${this.value} ${this.postfix}` : this.value;
    if (this.pos) obj['pos'] = this.pos;
    if (this.color) obj['color'] = this.color;
    if (this.blink) obj['blink'] = this.blink;
    if (this.size) obj['size'] = this.size;
    if (this.isCenter) obj['isCenter'] = this.isCenter;

    return obj;
  }

  /**
   * Check if two texts is equals
   * @param {ITMRText} text - Text for checking
   * @returns {Boolean}
   */
  equals (text) {

    if (text == null) return false;
    let curText = this.prepare();

    return curText?.name == text?.name &&
      curText?.value == text?.value &&
      curText?.pos == text?.pos &&
      curText?.color == text?.color &&
      curText?.blink == text?.blink &&
      curText?.size == text?.size &&
      curText?.postfix == text?.postfix &&
      curText?.isCenter == text?.isCenter;

  }

}