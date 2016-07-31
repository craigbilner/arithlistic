const questionLists = require('../lists');

const randomNumber = (min, max) => Math.floor(Math.random() * (max - min)) + min;

const difficultyCount = {
  0: 2,
  1: 2,
  2: 3,
  3: 4,
};

const difficultyLimit = {
  0: 5,
  1: 10,
  2: 20,
};

const generateLists = (listNames, count, lists = []) => {
  if (count === 0) {
    return lists;
  }

  const listIndx = randomNumber(0, listNames.length);

  return generateLists(listNames, count - 1, lists.concat(listNames[listIndx]));
};

const generateQuestions = (_questionLists, difficulty) => list => {
  const questions = Object.keys(_questionLists[list]);
  const maxIndx = Math.min(difficultyLimit[difficulty], questions.length);
  const randomQuestionIndx = randomNumber(0, maxIndx);
  const question = questions[randomQuestionIndx];

  return {
    list,
    question,
    answer: _questionLists[list][question],
  };
};

module.exports = (difficulty = 0) => {
  const lists = generateLists(Object.keys(questionLists), difficultyCount[difficulty]);
  const questions = lists.map(generateQuestions(questionLists, difficulty));

  console.log(questions);
};
