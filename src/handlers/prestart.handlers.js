const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

module.exports = Alexa.CreateStateHandler(GAME_STATES.PRESTART, {
  GameIntro() {
    this.emit(':ask', res.welcome());
  },
  'AMAZON.YesIntent': function() {
    this.emit(':ask', res.howManyPlayers());
  },
  PlayerNumberSoloIntent() {
    this.emit(':ask', res.whatIsYourName('one'));
  },
  PlayerNameIntent() {
    this.attributes.names = [this.event.request.intent.slots.Name.value];
    this.handler.state = GAME_STATES.PLAYING;
    this.emitWithState('AskQuestion');
  },
  Unhandled() {
    console.log('unhandled', GAME_STATES.PRESTART);
  },
});
