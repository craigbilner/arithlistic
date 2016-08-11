'use strict';

const Alexa = require('alexa-sdk');
const coreHandlers = require('./core.handlers');
const mixinHandlers = require('../modules/utils').mixinHandlers;
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
  const continuation =
    opts && opts.continuation && opts.continuation(quizItem.question, player, opts);
  res.ask.call(this, response(quizItem.question, player, opts), continuation);
}

const gameHasFinished = (start, end) => (new Date(end)) - (new Date(start)) > 120000;

module.exports = Alexa.CreateStateHandler(GAME_STATES.PLAYING, mixinHandlers(coreHandlers, {
  AskQuestion() {
    // updates
    this.attributes.startTime = this.event.request.timestamp;
    const opts = {
      continuation: res.askQuestion,
    };

    // response
    getAndEmitQuestion.call(this, res.askPlayerQuestion, this.attributes.players[0], opts);
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
      result.continuation = res.askQuestion;

      getAndEmitQuestion.call(this, res.scoreAndAskQuestion, player, result);
    }
  },
  PassIntent() {
    const activePlayerIndx = this.attributes.activePlayer;
    const nextPlayerIndx = getNextPlayer(activePlayerIndx, this.attributes.playerCount);
    const player = this.attributes.players[nextPlayerIndx];
    const opts = {
      answer: this.attributes.currentAnswer,
      continuation: res.askQuestion,
      playerCount: this.attributes.playerCount,
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
    res.ask.call(this, this.attributes.previousResponse);
  },
  'AMAZON.HelpIntent': function() {
    res.ask.call(this, res.noHelp());
  },
  Unhandled() {
    res.ask.call(this, res.tryANumber());
  },
}));
