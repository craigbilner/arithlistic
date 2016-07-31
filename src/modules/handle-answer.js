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

module.exports = (opts) => {
  console.log(opts);

  const isCorrect = opts.correctAnswer === parseInt(opts.answer, 10);
  const timeDiff = (new Date(opts.timeOfAnswer) - new Date(opts.timeOfLastQuestion)) / 1000;
  const pointsForTime = calcPointsForTime(timeDiff);
  const pointsForAnswer = isCorrect ? 250 : 0;
  const randomPoints = randomNumber(-50, 50);

  return {
    isCorrect,
    points: pointsForTime + pointsForAnswer + randomPoints,
    answer: opts.correctAnswer,
  };
};
