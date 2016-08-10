'use strict';

const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

module.exports = Alexa.CreateStateHandler(GAME_STATES.STOPPED, {
  'AMAZON.YesIntent': function() {
    // updates
    this.handler.state = this.attributes.previousState;

    // response
    this.emit(':ask', this.attributes.previousResponse);
  },
  'AMAZON.NoIntent': function() {
    this.emit(':tell', res.goodbye());
  },
});
