const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;
const handleUsersAnswer = require('../modules/handle-answer');

module.exports = Alexa.CreateStateHandler(GAME_STATES.PLAYING, {
  AnswerIntent() {
    handleUsersAnswer({
      intent: this.event.intent,
      hasPassed: false,
    });
  },
  PassIntent() {
    handleUsersAnswer({
      intent: this.event.intent,
      hasPassed: true,
    });
  },
  'AMAZON.StartOverIntent': function() {
    this.handler.state = GAME_STATES.START;
    this.emitWithState('StartGame', false);
  },
  'AMAZON.RepeatIntent': function() {
    this.emit(':ask', this.attributes.speechOutput, this.attributes.repromptText);
  },
  'AMAZON.HelpIntent': function() {
    this.handler.state = GAME_STATES.HELP;
    this.emitWithState('helpTheUser');
  },
  'AMAZON.StopIntent': function() {
    this.handler.state = GAME_STATES.HELP;
    this.emit(':ask', 'Would you like to keep playing?');
  },
  'AMAZON.CancelIntent': function() {
    this.emit(':tell', 'Ok, let\'s play again soon.');
  },
  Unhandled() {
    const speechOutput = 'Try saying a number between 1 and infinity';
    this.emit(':ask', speechOutput, speechOutput);
  },
  SessionEndedRequest() {
    console.log(`Session ended in ${GAME_STATES.PLAYING} state: ${this.event.request.reason}`);
  },
});
