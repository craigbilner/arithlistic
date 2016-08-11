'use strict';

const Alexa = require('alexa-sdk');
const coreHandlers = require('./core.handlers');
const mixinHandlers = require('../modules/utils').mixinHandlers;
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

const numberToWord = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
};

module.exports = Alexa.CreateStateHandler(GAME_STATES.PLAYER_NUMBER, mixinHandlers(coreHandlers, {
  PlayerNumberSoloIntent() {
    // updates
    this.attributes.playerCount = 1;
    this.handler.state = GAME_STATES.PLAYER_NAME;

    // response
    res.ask.call(this, res.whatIsYourName(numberToWord[1]));
  },
  PlayerNumberIntent() {
    const requestedNumber = parseInt(this.event.request.intent.slots.Players.value, 10);
    const numberIsValid = requestedNumber >= 1 && requestedNumber <= 4;

    // updates
    if (numberIsValid) {
      this.attributes.playerCount = requestedNumber;
      this.handler.state = GAME_STATES.PLAYER_NAME;
    }

    // response
    if (numberIsValid) {
      res.ask.call(this, res.whatIsYourName(numberToWord[1]));
    } else {
      res.ask.call(this, res.maxPlayers());
    }
  },
  Unhandled() {
    res.ask.call(this, res.numberPrompt(), res.numberPrompt());
  },
}));
