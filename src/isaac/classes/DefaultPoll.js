export default class DefaultPoll {

  constructor (settings) {

    

  }

  _weightedRandom(prob) {
    let i, sum = 0, r = Math.random();
    for (i in prob) {
      sum += prob[i].weight;
      if (r <= sum) return i;
    }
  }

}