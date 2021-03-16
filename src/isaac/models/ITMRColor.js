export default class ITMRColor {

  /**
   * Create new color from RGBA data
   * @param {Number} r - Red from 0 to 255
   * @param {Number} g - Green from 0 to 255
   * @param {Number} b - Blue from 0 to 255
   * @param {Number} a - Alpha from 0 to 1
   */
  constructor(r,g,b,a) {
    this.r = r/255;
    this.g = g/255;
    this.b = b/255;
    this.a = a
  }

}