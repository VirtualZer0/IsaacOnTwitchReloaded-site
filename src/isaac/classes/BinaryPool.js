export default class DefaultPoll {

  constructor (Isaac, variants) {

    this.Isaac = Isaac;       // Parent
    this.variants = variants; // Variants
    this.positiveVotes = 0;   // Votes
    this.allVotesCount = 0;   // All votes count
    this.users = {};          // Voted users

  }

  voteFor (isPositive, user) {

    // If "Russian hackers" event is active
    if (this.Isaac.special.russianHackers.enabled) {
      isPositive = math.random() >= .5 ? true : false;
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

  getWinner () {
    return this.variants[this.votes.indexOf(Math.max(...this.votes))];
  }

  getProgressBar () {

    return {
      min: 0,
      max: this.allVotesCount,
      value: this.positiveVotes
    }

  }

}