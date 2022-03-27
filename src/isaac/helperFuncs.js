/**
 * Return N random elements from array
 * @param {Array} arr - Array for random selection
 * @param {Number} n - Count of random elements
 */
export function getRandomElementsFromArr (arr, n) {
  let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
  if (n > len)
      throw new RangeError("getRandomElementsFromArr: more elements taken than available");
  while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

/**
 * Return random element from array based on weight
 * @param {Array} options - Array of objects with weight field
 */
export function weightedRandom(options) {
  let i;

  let weights = [];

  for (i = 0; i < options.length; i++)
    weights[i] = options[i].weight + (weights[i - 1] || 0);

  let random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++)
    if (weights[i] > random)
      break;

  return options[i];
}

/**
 * Generate random string
 * @param {Number} length - Length of generated string
 * @returns {String} - Random string
 */
export function randString(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Converts #ITEM_NAME to Item Name
 * @param {String} name - Original name
 * @returns - Normalized name
 */
export function getNormalName(name) {
  return titleCase(name.replace(/^#/, '').replace('_NAME', '').replace('_', ' ').replace('MOMS ', 'Mom\'s ').replace('DADS ', 'Dad\'s '));
}

/**
 * Capitalize first letter of each word
 * @param {String} str - Original string
 * @returns - Capitalized string
 */
export function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}