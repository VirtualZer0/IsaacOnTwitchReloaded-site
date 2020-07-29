export default class ITMRText {

  constructor (name, value, pos = null, color = null, size = null, isCenter = null) {

    this.name = name;
    this.value = value;
    this.pos = pos;
    this.color = color;
    this.size = size;
    this.isCenter = isCenter;

  }

  setPos (x, y) {
    this.pos = {X: x, Y: y}
  }

  setColor (r, g, b, a = 1) {
    this.color = {
      r: r/255,
      g: g/255,
      b: b/255,
      a
    }
  }

  setSize (size) {
    this.size = size;
  }

  setCenter (center) {
    this.center = center;
  }

  prepare () {
    return {
      name: this.name,
      value: this.value,
      pos: this.pos,
      color: this.color,
      size: this.size,
      sCenter: this.isCenter
    }
  }

}