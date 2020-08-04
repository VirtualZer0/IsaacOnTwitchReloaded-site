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
    if (this.Isaac.special.russinaHackers.enabled) {
      num = this.Isaac.special.russinaHackers.shuffle[num];
    }

    // If user already voted
    if (this.users[user] && num != this.users[user]) {

      // Remove previous user vote
      this.votes[this.users[user]] --;

      // Add new vote
      this.votes[num] ++;

      // Write new vote
      this.users[user] = num;

    }

    else if (!this.users[user]) {
      this.votes[num] ++;
      this.users[user] = num;
      this.allVotesCount ++;
    }
  }

  getWinner () {
    return this.variants[this.votes.indexOf(Math.max(...this.votes))];
  }

  getPercents (variant) {
    return this.allVotesCount == 0 ? 0 : Math.round(this.votes[variant]/this.allVotesCount*100);
  }

  getText () {

    let text = `#1 ${this.variants[0].name} - ${this.getPercents(0)}%  `;
    text += `#2 ${this.variants[1].name} - ${this.getPercents(1)}%  `;
    text += `#3 ${this.variants[2].name} - ${this.getPercents(2)}%`;

    return text;

  }


}