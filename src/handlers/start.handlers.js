const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;

module.exports = Alexa.CreateStateHandler(GAME_STATES.START, {
  StartGame(opts) {
    const speechOutputPrefix = opts.isNewGame ? 'Welcome to Arithlistic.' : '';
    const speechOutput = `${speechOutputPrefix} I will ask you as many questions as you can answer 
    within one minute!`;
    const repromptText = '';

    // GAME LOGIC HERE

    Object.assign(this.attributes, {
      speechOutput: repromptText,
      repromptText,
    });

    this.handler.state = GAME_STATES.PLAYING;

    this.emit(':askWithCard', speechOutput, repromptText, 'Arithlistic', repromptText);
  },
});
