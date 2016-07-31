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

const questionPrefixes = {
  'beaufort scale': questionPart => questionPart === 'calm' ? '' : 'a ',
  'mohs scale': () => '',
  'herculean labour': () => 'the number of the herculean labour where he ',
  'morse code': () => '',
  'wedding gift': () => 'the number of years for a ',
  presidents: () => '',
  'periodic table': () => 'the atomic number of ',
};

const questionSuffixes = {
  'beaufort scale': () => ' on the beaufort scale',
  'mohs scale': () => ' on the mohs scale',
  'herculean labour': () => '',
  'morse code': () => ' in morse code',
  'wedding gift': () => ' wedding anniversary',
  presidents: () => '\'s presidency',
  'periodic table': () => '',
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
  const questionPart = questions[randomQuestionIndx];
  const prefix = questionPrefixes[list](questionPart);
  const suffix = questionSuffixes[list](questionPart);
  const question = `${prefix}${questionPart}${suffix}`;

  return {
    list,
    question,
    answer: _questionLists[list][questionPart],
  };
};

module.exports = (difficulty = 0) => {
  const lists = generateLists(Object.keys(questionLists), difficultyCount[difficulty]);
  const questions = lists.map(generateQuestions(questionLists, difficulty));

  console.log(questions);
};
