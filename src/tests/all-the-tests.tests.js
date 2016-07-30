const assert = require('assert');
const skill = require('../index');
const context = require('aws-lambda-mock-context')();
const sessionStartIntent = require('./event-samples/new-session/session-start.intent');
const {
  welcome,
} = require('../responses');
const { GAME_STATES } = require('../enums');

const sanitise = text => text.replace(/\n/g, '');

const getOutputSpeech = ({ response: { outputSpeech: { ssml } } }) =>
  sanitise(ssml).match(/<speak>(.*)<\/speak>/i)[1].trim();
const getGameState = ({ sessionAttributes: { STATE } }) => STATE;

describe('Alexa,', () => {
  it('start game', () => {
    skill.handler(sessionStartIntent, context);

    return context.Promise
      .then((obj) => {
        assert.deepEqual(getOutputSpeech(obj), sanitise(welcome()));
        assert.deepEqual(getGameState(obj), GAME_STATES.PRESTART);
      })
      .catch(err => {
        throw new Error(err);
      });
  });
});
