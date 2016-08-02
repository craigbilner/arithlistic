/* eslint-ignore max-len */

'use strict';

module.exports.welcome = () =>
  `Welcome to Arithlistic, I will ask you as many maths quiz questions as you can answer within one 
minute, would you like to play?`;

module.exports.howManyPlayers = () =>
  `How many players will there be?`;

module.exports.whatIsYourName = number =>
  `Player ${number}, what is your name?`;

module.exports.askQuestion = (name, question) =>
  `${name}, what is ${question}?`;

module.exports.scoreAndAskQuestion = (name, question, result) => {
  const correctResponse = `Correct for ${result.points} points`;
  const incorrectResponse = `Incorrect, the answer was ${result.answer}, you score, ${result.points} points`;
  const response = result.isCorrect ? correctResponse : incorrectResponse;

  return `${response}. What is ${question}?`;
};

const plurals = (amount, word) => `${word}${amount === 1 ? '' : 's'}`

const combinePlayerScores = (sentence, { name, score }) =>
  `${sentence}${name} scored ${score} ${plurals(score, 'point')}.`;

module.exports.gameOver = players => `GAME OVER. ${players.reduce(combinePlayerScores, '')}`;