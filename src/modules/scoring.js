module.exports.calcPointsForTime = duration => {
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

module.exports.calcPointsForAnswer = (expected, actual) => {
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

module.exports.compileScores = (names, scores) => {

};
