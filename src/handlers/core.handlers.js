'use strict';

const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

module.exports = {
  'AMAZON.StopIntent': function() {
    // updates
    this.handler.state = GAME_STATES.STOPPED;

    // response
    this.emit(':ask', res.keepPlaying());
  },
  'AMAZON.CancelIntent': function() {
    this.emit(':tell', res.goodbye());
  },
};
