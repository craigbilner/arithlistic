const questions = require('../lists');

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const difficultyCount = {
  0: 2,
  1: 2,
  2: 3,
  3: 4
};

const generateLists = (listNames, count, lists = []) => {
  if (count === 0) {
    return lists;
  }

  const listIndx = randomNumber(0, listNames.length);

  return generateLists(listNames, count - 1, lists.concat(listNames[listIndx]));
};

module.exports = (difficulty = 0) => {
  const lists = generateLists(Object.keys(questions), difficultyCount[difficulty]);

  console.log(lists);
};
