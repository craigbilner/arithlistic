'use strict';

const Alexa = require('alexa-sdk');
const coreHandlers = require('./core.handlers');
const mixinHandlers = require('../modules/utils').mixinHandlers;
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

module.exports = Alexa.CreateStateHandler(GAME_STATES.PRESTART, mixinHandlers(coreHandlers, {
  GameIntro() {
    res.ask.call(this, res.welcome());
  },
  'AMAZON.YesIntent': function() {
    // updates
    this.handler.state = GAME_STATES.PLAYER_NUMBER;
    this.attributes.players = [];

    // response
    res.ask.call(this, res.howManyPlayers());
  },
  'AMAZON.NoIntent': function() {
    this.emit(':tell', res.welcomeFail());
  },
  'AMAZON.HelpIntent': function() {
    res.ask.call(this, res.welcomeHelp(), res.welcomeHelp());
  },
  Unhandled() {
    res.ask.call(this, res.welcomePrompt(), res.welcomePrompt());
  },
  SessionEndedRequest() {
    console.log(`${GAME_STATES.PRESTART} ended: ${this.event.request.reason}`);
  },
}));
