'use strict';

const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');
const getQuestion = require('../modules/get-question');
const handleUsersAnswer = require('../modules/handle-answer');

const getNextPlayer = (currentPlayer, totalPlayers) =>
  currentPlayer >= (totalPlayers - 1) ? 0 : (currentPlayer + 1);

const getDifficulty = player => Math.min(Math.floor((player.correctAnswers || 0) / 2), 3);

function getAndEmitQuestion(response, player, opts) {
  const currentTime = (new Date(this.event.request.timestamp)).getTime();
  const quizItem = getQuestion(currentTime, getDifficulty(player));

  // updates
  this.attributes.currentAnswer = quizItem.answer;
  this.attributes.timeOfLastQuestion = this.event.request.timestamp;

  // response
  this.emit(':ask', response(quizItem.question, player, opts));
}

const gameHasFinished = (start, end) => (new Date(end)) - (new Date(start)) > 120000;

module.exports = Alexa.CreateStateHandler(GAME_STATES.PLAYING, {
  AskQuestion() {
    // updates
    this.attributes.startTime = this.event.request.timestamp;

    // response
    getAndEmitQuestion.call(this, res.askQuestion, this.attributes.players[0]);
  },
  AnswerIntent() {
    const result = handleUsersAnswer((new Date(this.event.request.timestamp)).getTime(), {
      answer: this.event.request.intent.slots.Answer.value,
      correctAnswer: this.attributes.currentAnswer,
      timeOfLastQuestion: this.attributes.timeOfLastQuestion,
      timeOfAnswer: this.event.request.timestamp,
      hasPassed: false,
    });
    const activePlayerIndx = this.attributes.activePlayer;
    const isGameOver = gameHasFinished(this.attributes.startTime, this.event.request.timestamp);

    // updates
    this.attributes.players[activePlayerIndx].score =
      this.attributes.players[activePlayerIndx].score + result.points;

    if (result.isCorrect) {
      this.attributes.players[activePlayerIndx].correctAnswers += 1;
    }

    if (isGameOver) {
      this.handler.state = GAME_STATES.GAME_OVER;
    } else {
      const nextPlayerIndx = getNextPlayer(activePlayerIndx, this.attributes.playerCount);
      this.attributes.activePlayer = nextPlayerIndx;
      result.playerCount = this.attributes.playerCount;
    }

    // response
    if (isGameOver) {
      this.emit(':tell', res.gameOver(this.attributes.players));
    } else {
      const player = this.attributes.players[this.attributes.activePlayer];

      getAndEmitQuestion.call(this, res.scoreAndAskQuestion, player, result);
    }
  },
  PassIntent() {
    const activePlayerIndx = this.attributes.activePlayer;
    const nextPlayerIndx = getNextPlayer(activePlayerIndx, this.attributes.playerCount);
    const player = this.attributes.players[nextPlayerIndx];
    const opts = {
      answer: this.attributes.currentAnswer,
    };

    // updates
    this.attributes.activePlayer = nextPlayerIndx;


    // response
    getAndEmitQuestion.call(this, res.passAndAskQuestion, player, opts);
  },
  'AMAZON.StartOverIntent': function() {
    // updates
    this.handler.state = GAME_STATES.PRESTART;

    // response
    this.emitWithState('GameIntro');
  },
  'AMAZON.RepeatIntent': function() {
    this.emit(':ask', res.noRepeats());
  },
  'AMAZON.HelpIntent': function() {
    this.emit(':ask', res.noHelp());
  },
  'AMAZON.StopIntent': function() {
    this.emit(':ask', res.keepPlaying());
  },
  'AMAZON.CancelIntent': function() {
    this.emit(':tell', res.goodbye());
  },
  Unhandled() {
    this.emit(':ask', res.tryANumber());
  },
  SessionEndedRequest() {
    console.log(`${GAME_STATES.PLAYING} ended: ${this.event.request.reason}`);
  },
});
