const GAME_STATES = require('../enums').GAME_STATES;

module.exports = {
  NewSession() {
    this.handler.state = GAME_STATES.START;
    this.emitWithState('StartGame', {
      isNewGame: true,
    });
  },
  LaunchRequest() {
    this.handler.state = GAME_STATES.START;
    this.emitWithState('StartGame', {
      isNewGame: true,
    });
  },
  Unhandled() {
    console.log('unhandled', arguments);
  }
};
