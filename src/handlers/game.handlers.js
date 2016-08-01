const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');
const getQuestion = require('../modules/get-question');
const handleUsersAnswer = require('../modules/handle-answer');

const getAndEmitQuestion = (handler, response, opts) => {
  const quizItem = getQuestion();
  handler.attributes.currentAnswer = quizItem.answer;
  handler.attributes.timeOfLastQuestion = handler.event.request.timestamp;

  handler.emit(':ask', response(handler.attributes.names[0], quizItem.question, opts));
};

module.exports = Alexa.CreateStateHandler(GAME_STATES.PLAYING, {
  AskQuestion() {
    this.attributes.startTime = this.event.request.timestamp;
    getAndEmitQuestion(this, res.askQuestion);
  },
  AnswerIntent() {
    const result = handleUsersAnswer({
      answer: this.event.request.intent.slots.Answer.value,
      correctAnswer: this.attributes.currentAnswer,
      timeOfLastQuestion: this.attributes.timeOfLastQuestion,
      timeOfAnswer: this.event.request.timestamp,
      hasPassed: false,
    });

    const scores = this.attributes.playerScores || [];
    this.attributes.playerScores = [(scores[0] || 0) + result.points];

    getAndEmitQuestion(this, res.scoreAndAskQuestion, result);
  },
  PassIntent() {
    // move to next question here
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
