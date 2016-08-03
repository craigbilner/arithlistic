/* eslint-ignore max-len */

'use strict';

module.exports.welcome = () =>
  `Welcome to Arithlistic, I will ask you as many maths quiz questions as you can answer within one 
minute, would you like to play?`;

module.exports.howManyPlayers = () =>
  `How many players will there be?`;

module.exports.whatIsYourName = number =>
  `Player ${number}, what is your name?`;

module.exports.askQuestion = (question, player) =>
  `${player.name}, what is ${question}?`;

module.exports.scoreAndAskQuestion = (question, result) => {
  const correctResponse = `Correct for ${result.points} points`;
  const incorrectResponse = `Incorrect, the answer was ${result.answer}, you score, ${result.points} points`;
  const response = result.isCorrect ? correctResponse : incorrectResponse;
  const questionPrefix = result.playerCount > 1 ? `${result.nextPlayer.name}, what is` : 'What is';

  return `${response}. ${questionPrefix} ${question}?`;
};

const plurals = (amount, word) => `${word}${amount === 1 ? '' : 's'}`

const combinePlayerScores = (sentence, result) =>
  `${sentence}${result.name} scored ${result.score} ${plurals(result.score, 'point')}.`;

const getMaxScore = (players, winner) => {
  if (!players.length) {
    return winner;
  }

  const _winner = winner || { score: 0 };
  const _players = players.slice(0);
  const thisPlayer = _players.pop();
  const higherPlayer = thisPlayer.score > _winner.score ? thisPlayer : _winner;

  return getMaxScore(_players, higherPlayer);
};

const getEndText = players => {
  if (players.length === 1) {
    return `You scored ${players[0].score} ${plurals(players[0].score, 'point')}`;
  } else {
    return `${getMaxScore(players).name} is the winner. ${players.reduce(combinePlayerScores, '')}`;
  }
};

module.exports.gameOver = players =>
  `GAME OVER. ${getEndText(players)}.`;
