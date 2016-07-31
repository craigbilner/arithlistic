const assert = require('assert');
const skill = require('../index');
const context = require('aws-lambda-mock-context');
const sessionStartIntent = require('./event-samples/new-session/session-start.intent');
const prestartYesIntent = require('./event-samples/prestart/yes.intent');
const onePlayerIntent = require('./event-samples/prestart/one-player.intent');
const nameIntent = require('./event-samples/prestart/name.intent');
const {
  welcome,
  howManyPlayers,
  whatIsYourName,
} = require('../responses');
const { GAME_STATES } = require('../enums');

const sanitise = text => text.replace(/\n/g, '');

const getOutputSpeech = ({ response: { outputSpeech: { ssml } } }) =>
  sanitise(ssml).match(/<speak>(.*)<\/speak>/i)[1].trim();
const getAttribute = ({ sessionAttributes }, attr) => sessionAttributes[attr];
const runIntent = intent => new Promise(res => {
  const ctx = context();
  skill.handler(intent, ctx);

  ctx
    .Promise
    .then(obj => {
      // console.log(obj);
      res({
        outputSpeech: getOutputSpeech(obj),
        gameState: getAttribute(obj, 'STATE'),
        names: getAttribute(obj, 'names'),
        currentAnswer: getAttribute(obj, 'currentAnswer'),
      });
    })
    .catch(err => {
      throw new Error(err);
    });
});

describe('Alexa, start game', () => {
  it('Welcomes players, asks if they\'d like to play and prestarts game', () =>
    runIntent(sessionStartIntent)
      .then(({ outputSpeech, gameState }) => {
        assert.deepEqual(outputSpeech, sanitise(welcome()));
        assert.deepEqual(gameState, GAME_STATES.PRESTART);
      }));

  describe('Yes', () => {
    it('Asks how many players are playing', () =>
      runIntent(prestartYesIntent)
        .then(({ outputSpeech, gameState }) => {
          assert.deepEqual(outputSpeech, sanitise(howManyPlayers()));
          assert.deepEqual(gameState, GAME_STATES.PRESTART);
        }));

    describe('One player', () => {
      it('Asks the players name', () =>
        runIntent(onePlayerIntent)
          .then(({ outputSpeech, gameState }) => {
            assert.deepEqual(outputSpeech, sanitise(whatIsYourName('one')));
            assert.deepEqual(gameState, GAME_STATES.PRESTART);
          }));

      describe('My name is Craig', () => {
        it('Save name, start the game and ask Craig the first question', () =>
          runIntent(nameIntent)
            .then(({ outputSpeech, gameState, names, currentAnswer }) => {
              assert.deepEqual(outputSpeech.split(',')[0], 'Craig');
              assert.deepEqual(gameState, GAME_STATES.PLAYING);
              assert.deepEqual(names[0], 'Craig');
              assert(currentAnswer !== undefined);
            }));
      });
    });
  });
});
