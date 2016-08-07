'use strict';

const questionLists = require('../lists');
const randomNumber = require('./utils').randomNumber;

const difficultyCount = {
  0: 2,
  1: 2,
  2: 3,
  3: 4,
};

const difficultyLimit = {
  0: 5,
  1: 10,
  2: 15,
  3: 20,
};

const beaufortScalePlurals = {
  calm: true,
  'light air': true,
};


const questionPrefixes = {
  'beaufort scale': questionPart => beaufortScalePlurals[questionPart] ? '' : 'a ',
  'mohs scale': () => '',
  'herculean labour': () => 'the number of the herculean labour where he, ',
  'morse code': () => '',
  'wedding gift': () => 'the number of years, for a ',
  presidents: () => '',
  'periodic table': () => 'the atomic number of, ',
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

const generateLists = (seed, listNames, count, lists) => {
  if (count === 0) {
    return {
      lists,
      seed,
    };
  }

  const rn = randomNumber(seed, 0, listNames.length);

  return generateLists(rn.seed, listNames, count - 1, (lists || []).concat(listNames[rn.value]));
};

const generateQuestions = (seed, _questionLists, difficulty) => list => {
  const questions = Object.keys(_questionLists[list]);
  const maxIndx = Math.min(difficultyLimit[difficulty], questions.length);
  const rn = randomNumber(seed, 0, maxIndx);
  const questionPart = questions[rn.value];
  const prefix = questionPrefixes[list](questionPart);
  const suffix = questionSuffixes[list](questionPart);
  const question = `${prefix}${questionPart}${suffix}`;

  return {
    seed: rn.seed,
    list,
    question,
    answer: _questionLists[list][questionPart],
  };
};

const add = {
  text: 'plus',
  invoke: (a, b) => a + b,
};

const minus = {
  text: 'minus',
  invoke: (a, b) => a - b,
};

const multiply = {
  text: 'multiplied by',
  invoke: (a, b) => a * b,
};

const divide = {
  text: 'divided by',
  invoke: (a, b) => a / b,
};

const pickOperations = (seed, operations, count, pickedOperations) => {
  if (count === 0) {
    return pickedOperations;
  }

  const rn = randomNumber(seed, 0, operations.length);
  const newOperations = (pickedOperations || []).concat(operations[rn.value]);

  return pickOperations(rn.seed, operations, count - 1, newOperations);
};

const generateOperations = (seed, difficulty) => {
  const operationCount = difficultyCount[difficulty] - 1;
  const operations = [add, minus];

  if (difficulty > 1) {
    operations.push(multiply, divide);
  }

  return pickOperations(seed, operations, operationCount);
};

const calculateQuestions = (operations, questions, question) => {
  if (operations.length === 0) {
    return question;
  }

  const _operations = operations.slice(0);
  const thisOperation = _operations.pop();
  const _questions = questions.slice(0);
  const _question = question || {};

  if (!_question.question) {
    const fstQ = _questions.pop();
    const sndQ = _questions.pop();

    _question.question = `${fstQ.question}, ${thisOperation.text}, ${sndQ.question}`;
    _question.answer = thisOperation.invoke(fstQ.answer, sndQ.answer);
  } else {
    const nextQuestion = _questions.pop();
    _question.question = `${_question.question}, ${thisOperation.text}, ${nextQuestion.question}`;
    _question.answer = thisOperation.invoke(_question.answer, nextQuestion.answer);
  }

  return calculateQuestions(_operations, _questions, _question);
};

module.exports = (seed, difficulty) => {
  const _difficulty = difficulty || 0;
  const randomLists = generateLists(seed, Object.keys(questionLists), difficultyCount[_difficulty]);
  const mapFunc = generateQuestions(randomLists.seed, questionLists, _difficulty);
  const questions = randomLists.lists.map(mapFunc);
  const operations = generateOperations(questions[0].seed, _difficulty);

  return calculateQuestions(operations, questions);
};
