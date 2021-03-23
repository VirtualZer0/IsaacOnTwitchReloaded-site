/**
 * Basic text message from Twitch or Youtube chat
 */
export class TextMessage {

  /**
   *
   * @param {Number|String} userId - Unique user id
   * @param {String} userName - Displayed user name
   * @param {String} text - Message text
   * @param {String} source - Source of message, "yt" for YouTube, "tw" fro Twitch
   */
  constructor(userId, userName, text, source) {
    this.userId = userId;
    this.userName = userName;
    this.text = text.trim();
    this.source = source;
  }

}

/**
 * Bits message for Twitch
 * Superchat message for Youtube
 */
export class DonateMessage {

  /**
   *
   * @param {Number|String} userId - Unique user id
   * @param {String} userName - Displayed user name
   * @param {Number} amount - Amount of bits
   * @param {Number} type - Type of bits
   * @param {String} source - Source of message, "yt" for YouTube, "tw" fro Twitch
   */
  constructor (userId, userName, amount, type, source) {
    this.userId = userId;
    this.userName = userName;
    this.amount = amount;
    this.type = type;
    this.source = source;
  }
}

/**
 * New subscriber on Twitch
 * New sponsor on YouTube
 */
export class Subscriber {

  /**
   *
   * @param {Number|String} userId - Unique user id
   * @param {String} userName - Displayed user name
   * @param {String} source - Source of message, "yt" for YouTube, "tw" fro Twitch
   */
  constructor (userId, userName, source) {
    this.userId = userId;
    this.userName = userName;
    this.source = source;
  }
}

/**
 * New followers
 * Currently not using
 */
export class Follower {
  constructor (userId, userName, source) {
    this.userId = userId;
    this.userName = userName;
    this.source = source;
  }
}