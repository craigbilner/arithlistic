const { GAME_STATES } = require('../enums');
const handleUsersAnswer = require('../modules/handle-answer');

modules.exports = Alexa.CreateStateHandler(GAME_STATES.PLAYING, {
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
  'AMAZON.StartOverIntent'() {
    this.handler.state = GAME_STATES.START;
    this.emitWithState('StartGame', false);
  },
  'AMAZON.RepeatIntent'() {
    this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptText']);
  },
  'AMAZON.HelpIntent'() {
    this.handler.state = GAME_STATES.HELP;
    this.emitWithState('helpTheUser');
  },
  'AMAZON.StopIntent'() {
    this.handler.state = GAME_STATES.HELP;
    this.emit(':ask', 'Would you like to keep playing?');
  },
  'AMAZON.CancelIntent'() {
    this.emit(':tell', `Ok, let's play again soon.`);
  },
  Unhandled() {
    var speechOutput = 'Try saying a number between 1 and infinity';
    this.emit(':ask', speechOutput, speechOutput);
  },
  SessionEndedRequest() {
    console.log(`Session ended in ${GAME_STATE.PLAYING} state: ${this.event.request.reason}`);
  },
});
