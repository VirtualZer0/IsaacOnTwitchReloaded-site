export function getRandomElementsFromArr (arr, n) {
  let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

export function weightedRandom(arr) {
  let i, sum = 0, r = Math.random();
  for (i in arr) {
    sum += arr[i].weight;
    if (r <= sum) return arr[i];
  }
}