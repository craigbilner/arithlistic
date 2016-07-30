const assert = require('assert');
const skill = require('../index');
const context = require('aws-lambda-mock-context');
const sessionStartIntent = require('./event-samples/new-session/session-start.intent');
const prestartYesIntent = require('./event-samples/prestart/yes.intent');
const onePlayerIntent = require('./event-samples/prestart/one-player.intent');
const {
  welcome,
  howManyPlayers,
} = require('../responses');
const { GAME_STATES } = require('../enums');

const sanitise = text => text.replace(/\n/g, '');

const getOutputSpeech = ({ response: { outputSpeech: { ssml } } }) =>
  sanitise(ssml).match(/<speak>(.*)<\/speak>/i)[1].trim();
const getGameState = ({ sessionAttributes: { STATE } }) => STATE;
const runIntent = intent => new Promise(res => {
  const ctx = context();
  skill.handler(intent, ctx);

  ctx
    .Promise
    .then(obj => res({
      outputSpeech: getOutputSpeech(obj),
      gameState: getGameState(obj),
    }))
    .catch(err => {
      throw new Error(err);
    });
});

describe('Alexa, start game', () => {
  it('Welcomes players and prestarts game', () =>
    runIntent(sessionStartIntent)
      .then(({ outputSpeech, gameState }) => {
        assert.deepEqual(outputSpeech, sanitise(welcome()));
        assert.deepEqual(gameState, GAME_STATES.PRESTART);
      }));

  describe('Yes', () => {
    it('asks how many players are playing', () =>
      runIntent(prestartYesIntent)
        .then(({ outputSpeech, gameState }) => {
          assert.deepEqual(outputSpeech, sanitise(howManyPlayers()));
          assert.deepEqual(gameState, GAME_STATES.PRESTART);
        }));

    describe('one player', () =>
      runIntent(onePlayerIntent)
        .then(({ outputSpeech, gameState }) => {
          assert.deepEqual(outputSpeech, sanitise(howManyPlayers()));
          assert.deepEqual(gameState, GAME_STATES.PRESTART);
        }));
  });
});
