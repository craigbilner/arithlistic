'use strict';

const GAME_STATES = require('../enums').GAME_STATES;

module.exports = {
  NewSession() {
    // updates
    this.handler.state = GAME_STATES.PRESTART;

    // response
    this.emitWithState('GameIntro');
  },
  LaunchRequest() {
    // updates
    this.handler.state = GAME_STATES.PRESTART;

    // response
    this.emitWithState('GameIntro');
  },
  Unhandled() {
    console.log('unhandled');
  },
};
