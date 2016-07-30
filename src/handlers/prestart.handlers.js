const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;
const welcome = require('../responses').welcome;

module.exports = Alexa.CreateStateHandler(GAME_STATES.PRESTART, {
  GameIntro() {
    this.emit(':ask', welcome());
  },
});
