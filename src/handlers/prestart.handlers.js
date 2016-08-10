'use strict';

const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

module.exports = Alexa.CreateStateHandler(GAME_STATES.PRESTART, {
  GameIntro() {
    this.emit(':ask', res.welcome());
  },
  'AMAZON.YesIntent': function() {
    // updates
    this.handler.state = GAME_STATES.PLAYER_NUMBER;
    this.attributes.players = [];

    // response
    this.emit(':ask', res.howManyPlayers());
  },
  'AMAZON.NoIntent': function() {
    this.emit(':tell', res.welcomeFail());
  },
  'AMAZON.HelpIntent': function() {
    this.emit(':ask', res.welcomeHelp(), res.welcomeHelp());
  },
  Unhandled() {
    this.emit(':ask', res.welcomePrompt(), res.welcomePrompt());
  },
  SessionEndedRequest() {
    console.log(`${GAME_STATES.PRESTART} ended: ${this.event.request.reason}`);
  },
});
