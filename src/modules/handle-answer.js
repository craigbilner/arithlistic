'use strict';

const randomNumber = require('./utils').randomNumber;

const calcPointsForTime = duration => {
  let points;

  if (duration < 1) {
    points = 100;
  } else if (duration < 5) {
    points = 50;
  } else if (duration < 10) {
    points = 25;
  } else if (duration < 15) {
    points = 10;
  } else {
    points = 5;
  }

  return points;
};

const calcPointsForAnswer = (expected, actual) => {
  let points;
  const diff = Math.abs(expected - actual);

  if (diff === 0) {
    points = 250;
  } else if (diff < 1) {
    points = 50;
  } else if (diff < 5) {
    points = 10;
  } else {
    points = 0;
  }

  return points;
};

module.exports = (opts) => {
  const isCorrect = opts.correctAnswer === parseInt(opts.answer, 10);
  const timeDiff = (new Date(opts.timeOfAnswer) - new Date(opts.timeOfLastQuestion)) / 1000;
  const pointsForTime = calcPointsForTime(timeDiff);
  const pointsForAnswer = calcPointsForAnswer(opts.correctAnswer, opts.answer);
  const randomPoints = randomNumber(-50, 50);

  return {
    isCorrect,
    points: pointsForTime + pointsForAnswer + randomPoints,
    answer: opts.correctAnswer,
  };
};
