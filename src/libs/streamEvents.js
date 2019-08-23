export class TextMessage {

  constructor(userId, userName, text) {
    this.userId = userId;
    this.userName = userName;
    this.text = text;
  }

}

export class DonateMessage {
  constructor (userId, userName, amount, source) {
    this.userId = userId;
    this.userName = userName;
    this.amount = amount;
    this.source = source;
  }
}

export class Subscriber {
  constructor (userId, userName, source) {
    this.userId = userId;
    this.userName = userName;
    this.source = source;
  }
}

export class Follower {
  constructor (userId, userName, source) {
    this.userId = userId;
    this.userName = userName;
    this.source = source;
  }
}