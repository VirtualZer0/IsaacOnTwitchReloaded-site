import Isaac from "../Isaac";

/**
 * Class for binary poll with two variants
 */
export default class DefaultPoll {

  /**
   *
   * @param {Isaac} Isaac - Main Isaac class
   * @param {Array} variants - Array with poll variants
   */
  constructor (Isaac, variants) {

    this.Isaac = Isaac;       // Parent
    this.variants = variants; // Variants
    this.positiveVotes = 0;   // Votes
    this.allVotesCount = 0;   // All votes count
    this.users = {};          // Voted users

  }

  /**
   * Vote for variant
   * @param {Boolean} isPositive - Vote for positive variant
   * @param {String} user - Unique user id
   */
  voteFor (isPositive, user) {

    // If "Russian hackers" event is active, select random variant
    if (this.Isaac.special.russianHackers.enabled) {
      isPositive = Math.random() >= .5 ? true : false;
    }

    if (this.users[user] && isPositive != this.users[user]) {

      this.users[user] = isPositive;

      if (isPositive) {
        this.positiveVotes ++;
      }
      else {
        this.positiveVotes --;
      }

    }

    else if (!this.users[user]) {

      this.users[user] = isPositive;
      this.allVotesCount ++;

      if (isPositive) {
        this.positiveVotes ++;
      }
      else {
        this.positiveVotes --;
      }

    }
  }

  /**
   * Return winning variant
   */
  getWinner () {
    let negativeVotes = this.allVotesCount - this.positiveVotes;
    return negativeVotes > this.positiveVotes ? this.variants[0] : this.variants[1];
  }

  /**
   * Return data for Isaac progresss bar
   */
  getProgressBar () {

    return {
      min: 0,
      max: this.allVotesCount,
      value: this.positiveVotes
    }

  }

}