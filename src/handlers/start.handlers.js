const { GAME_STATES } = require('../enums');

module.exports = Alexa.CreateStateHandler(GAME_STATES.START, {
  StartGame({ isNewGame }) {
    const speechOutputPrefix = isNewGame ? 'Welcome to Arithlistic.' : '';
    const speechOutput = `${speechOutputPrefix} I will ask you as many questions as you can answer within one minute`;
    const repromptText = '';

    // GAME LOGIC HERE

    Object.assign(this.attributes, {
      speechOutput: repromptText,
      repromptText: repromptText,
    });

    this.handler.state = GAME_STATES.PLAYING;

    this.emit(':askWithCard', speechOutput, repromptText, 'Arithlistic', repromptText);
  }
});
