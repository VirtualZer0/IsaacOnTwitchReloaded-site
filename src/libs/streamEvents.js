/**
 * Basic text message from Twitch or Youtube chat
 */
export class TextMessage {

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