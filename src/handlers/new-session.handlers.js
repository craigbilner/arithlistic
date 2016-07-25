const { GAME_STATES } = require('../enums');

module.exports = {
  NewSession() {
    this.handler.state = GAME_STATES.START;
    this.emitWithState('StartGame', {
      isNewGame: true,
    });
  }
};
