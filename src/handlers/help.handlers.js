const { GAME_STATES } = require('../enums');
const Alexa = require('alexa-sdk');

module.exports = Alexa.CreateStateHandler(GAME_STATES.HELP, {
  helpTheUser() {
    const speechOutput = `I will ask you as many questions as you can answer within one minute. To each question respond 
    with the number of the answer. "For example, say one, two, three, or four. The difficulty will increase every three 
    questions. To quit the game at any time, just say quit. To repeat the last question, say, repeat. You also have the 
    option of two passes, just say pass to pass a question and exclude it from the increase in difficulty. Points will be
    awarded for speed and correctness, the closer and faster you are the more points you earn and equally be penalised for
    slower incorrect answers. Would you like to keep playing?`;
    const repromptText = `To give an answer to a question, respond with the number of the answer or say pass. Would you 
    like to keep playing?`;

    this.emit(':ask', speechOutput, repromptText);
  },
  'AMAZON.RepeatIntent'() {
    this.emitWithState('helpTheUser');
  },
  'AMAZON.HelpIntent'() {
    this.emitWithState('helpTheUser');
  },
  'AMAZON.YesIntent'() {
    this.handler.state = GAME_STATES.PLAYING;
    this.emitWithState('Start');
  },
  'AMAZON.NoIntent'() {
    this.emit(':tell', 'Fair enough, ciao!');
  },
  'AMAZON.StopIntent'() {
    this.emit(':ask', 'Would you like to keep playing?')
  },
  'AMAZON.CancelIntent'() {
    this.handler.state = GAME_STATES.PLAYING;
    this.emitWithState('AMAZON.Continue');
  },
  Unhandled() {
    const speechOutput = 'Say yes to continue, or no to end the game.';
    this.emit(':ask', speechOutput, speechOutput);
  },
  SessionEndedRequest() {
    console.log(`Session ended in help state: ${this.event.request.reason}`);
  }
});
