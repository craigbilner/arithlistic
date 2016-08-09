/* eslint-ignore max-len */

'use strict';

module.exports.welcome = () =>
  'Welcome to Arithlistic, I will ask you as many maths quiz questions as you can answer within one minute, would you like to play?';

module.exports.welcomePrompt = () =>
  'Your only options are yes or no, there\'s no red or blue pill';

module.exports.welcomeFail = () =>
  'That\'s unfortunate, you\'re missing out....';

module.exports.howManyPlayers = () =>
  'How many players will there be?';

module.exports.maxPlayers = () =>
  'This game is for a maximum of four players, please choose between one and four players';

module.exports.numberPrompt = () =>
  'Try saying, one player, just me, or, two players, three players etc.';

module.exports.whatIsYourName = number =>
  `Player ${number}, what is your name?`;

module.exports.namePrompt = () =>
  'Try saying, my name is, then your name';

module.exports.askQuestion = (question, player) =>
  `${player.name}, what is ${question}?`;

module.exports.passAndAskQuestion = (question, player, opts) =>
  `I'll take that as a pass. The correct answer was ${opts.answer}. ${player.name}, what is ${question}?`;

module.exports.noRepeats = () =>
  'There are no repeats, this is a proper game, play on.';

module.exports.noHelp = () =>
  'Help is for the weak, you shall have none!';

module.exports.tryANumber = () =>
  'Try saying a number between 1 and infinity';

module.exports.keepPlaying = () =>
  'Would you like to keep playing?';

module.exports.goodbye = () =>
  'Ok, let\'s play again soon.';

module.exports.scoreAndAskQuestion = (question, player, result) => {
  const correctResponse = `Correct for ${result.points} points`;
  const incorrectResponse = `Incorrect, the answer was ${result.answer}, you score, ${result.points} points`;
  const response = result.isCorrect ? correctResponse : incorrectResponse;
  const questionPrefix = result.playerCount > 1 ? `${player.name}, what is` : 'What is';

  return `${response}. ${questionPrefix} ${question}?`;
};

const plurals = (amount, word) => `${word}${amount === 1 ? '' : 's'}`

const combinePlayerScores = (sentence, result) =>
  `${sentence} ${result.name} scored ${result.score} ${plurals(result.score, 'point')}.`;

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
    return `You scored ${players[0].score} ${plurals(players[0].score, 'point')}.`;
  } else {
    return `${getMaxScore(players).name} is the winner.${players.reduce(combinePlayerScores, '')}`;
  }
};

module.exports.gameOver = players =>
  `GAME OVER. ${getEndText(players)}`;
