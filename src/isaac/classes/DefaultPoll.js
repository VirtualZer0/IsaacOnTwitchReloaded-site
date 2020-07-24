export default class DefaultPoll {

  constructor (Isaac, variants) {

    this.Isaac = Isaac;       // Parent
    this.variants = variants; // Variants
    this.votes = [0,0,0];     // Votes
    this.allVotesCount = 0;   // All votes count
    this.users = {};          // Voted users

  }

  voteFor (num, user) {

    // If "Russian hackers" event is active
    if (this.Isaac.special.russianHackers.enabled) {
      num = this.Isaac.special.russianHackers.shuffle[num-1];
    }

    if (this.users[user] && num != this.users[user]) {

      // Remove previous user vote
      this.votes[this.users[user]-1] --;

      // Add new vote
      this.votes[num-1] ++;

      // Write new vote
      this.users[user] = num;

    }
    else if (!this.users[user]) {
      this.votes[num-1] ++;
      this.users[user] = num;
      this.allVotesCount ++;
    }
  }

  getWinner () {
    return this.variants[this.votes.indexOf(Math.max(...this.votes))];
  }

  getText () {

    let text = `#1 ${this.variants[0].name} - ${Math.round(this.votes[0]/this.allVotesCount*100)} `;
    text += `#2 ${this.variants[1].name} - ${Math.round(this.votes[1]/this.allVotesCount*100)} `;
    text += `#3 ${this.variants[2].name} - ${Math.round(this.votes[2]/this.allVotesCount*100)} `;

    return text;

  }

  _weightedRandom(prob) {
    let i, sum = 0, r = Math.random();
    for (i in prob) {
      sum += prob[i].weight;
      if (r <= sum) return prob[i];
    }
  }

}