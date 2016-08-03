'use strict';

const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

module.exports = Alexa.CreateStateHandler(GAME_STATES.PRESTART, {
  GameIntro() {
    this.emit(':ask', res.welcome());
  },
  'AMAZON.YesIntent': function() {
    this.handler.state = GAME_STATES.PLAYER_NUMBER;
    this.emit(':ask', res.howManyPlayers());
  },
  Unhandled() {
    console.log('unhandled', GAME_STATES.PRESTART);
  },
});
