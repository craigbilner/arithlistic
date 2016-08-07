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
  const quizItem = getQuestion((new Date(this.event.request.timestamp)).getTime(), getDifficulty(player));
  this.attributes.currentAnswer = quizItem.answer;
  this.attributes.timeOfLastQuestion = this.event.request.timestamp;

  this.emit(':ask', response(quizItem.question, player, opts));
}

const isGameOver = (start, end) => (new Date(end)) - (new Date(start)) > 120000;

module.exports = Alexa.CreateStateHandler(GAME_STATES.PLAYING, {
  AskQuestion() {
    this.attributes.startTime = this.event.request.timestamp;
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
    this.attributes.players[activePlayerIndx].score =
      this.attributes.players[activePlayerIndx].score + result.points;

    if (result.isCorrect) {
      this.attributes.players[activePlayerIndx].correctAnswers += 1;
    }

    if (isGameOver(this.attributes.startTime, this.event.request.timestamp)) {
      this.handler.state = GAME_STATES.GAME_OVER;
      this.emit(':tell', res.gameOver(this.attributes.players));
    } else {
      const nextPlayerIndx = getNextPlayer(activePlayerIndx, this.attributes.playerCount);
      const player = this.attributes.players[nextPlayerIndx];

      this.attributes.activePlayer = nextPlayerIndx;
      result.playerCount = this.attributes.playerCount;

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

    this.attributes.activePlayer = nextPlayerIndx;

    getAndEmitQuestion.call(this, res.passAndAskQuestion, player, opts);
  },
  'AMAZON.StartOverIntent': function() {
    this.handler.state = GAME_STATES.PRESTART;
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
    console.log(`Session ended in ${GAME_STATES.PLAYING} state: ${this.event.request.reason}`);
  },
});
