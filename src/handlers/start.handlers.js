const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;
const { welcome } = require('../responses');

module.exports = Alexa.CreateStateHandler(GAME_STATES.START, {
  StartGame(opts) {
    const response = welcome(opts);
    this.handler.state = GAME_STATES.PLAYING;

    this.emit(':askWithCard', response, response, 'Arithlistic', response);
  },
});
