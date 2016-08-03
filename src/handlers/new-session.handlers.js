'use strict';

const GAME_STATES = require('../enums').GAME_STATES;

module.exports = {
  NewSession() {
    this.handler.state = GAME_STATES.PRESTART;
    this.emitWithState('GameIntro');
  },
  LaunchRequest() {
    this.handler.state = GAME_STATES.PRESTART;
    this.emitWithState('GameIntro');
  },
  Unhandled() {
    console.log('unhandled');
  },
  SessionEndedRequest() {
    console.log(`Session ended in the beginning state: ${this.event.request.reason}`);
  },
};
