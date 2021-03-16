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
  constructor (userId, userName, amount, source) {
    this.userId = userId;
    this.userName = userName;
    this.amount = amount;
    this.source = source;
  }
}

/**
 * New subscriber on Twitch
 * New sponsor on YouTube
 */
export class Subscriber {
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