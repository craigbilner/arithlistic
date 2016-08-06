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
    this.attributes.players = [];
    this.emit(':ask', res.howManyPlayers());
  },
  'AMAZON.NoIntent': function() {
    this.emit(':tell', res.welcomeFail());
  },
  Unhandled() {
    this.emit(':ask', res.welcomePrompt(), res.welcomePrompt());
  },
  SessionEndedRequest() {
    console.log(`Session ended in ${GAME_STATES.PRESTART} state: ${this.event.request.reason}`);
  },
});
