export default class ITMRText {

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

  setPos (x, y) {
    this.pos = {X: x, Y: y}
  }

  setText (text) {
    this.value = text;
  }

  setPostfix (postfix) {
    this.postfix = postfix;
  }

  setColor (r, g, b, a = 1) {
    this.color = {
      r: r/255,
      g: g/255,
      b: b/255,
      a
    }
  }

  setBlink (r, g, b, a = 1) {
    this.blink = {
      r: r/255,
      g: g/255,
      b: b/255,
      a
    }
  }

  removeBlink () {
    this.blink = null;
  }

  setSize (size) {
    this.size = size;
  }

  setCenter (center) {
    this.center = center;
  }

  // Return only not null fields for decreasing data size
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

  equals (text) {

    if (text == null) return false;
    let curText = this.prepare();

    return curText?.name == text?.name &&
      curText?.value == text?.value &&
      curText?.pos == text?.pos &&
      curText?.color == text?.color &&
      curText?.blink == text?.blink &&
      curText?.size == text?.size &&
      curText?.isCenter == text?.isCenter;

  }

}