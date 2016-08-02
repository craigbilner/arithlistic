/* eslint-disable max-len */

const assert = require('assert');
const skill = require('../index');
const context = require('aws-lambda-mock-context');
const sessionStartIntent = require('./event-samples/new-session/session-start.intent');
const prestartYesIntent = require('./event-samples/prestart/yes.intent');
const onePlayerIntent = require('./event-samples/prestart/one-player.intent');
const threePlayerIntent = require('./event-samples/prestart/three-player.intent');
const nameIntent = require('./event-samples/prestart/name.intent');
const firstAnswerIntent = require('./event-samples/game/answer.intent');
const secondAnswerIntent = require('./event-samples/game/answer2.intent');
const thirdAnswerIntent = require('./event-samples/game/answer3.intent');
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
        players: getAttribute(obj, 'players'),
        startTime: getAttribute(obj, 'startTime'),
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

      describe('My name is Inigo Montoya', () => {
        it('Save name, start the game and ask Inigo Montoya the first question', () =>
          runIntent(nameIntent)
            .then(({ outputSpeech, gameState, players, startTime, currentAnswer }) => {
              assert.deepEqual(outputSpeech, 'Inigo Montoya, what is dash dash dash dash dash in ' +
                'morse code, minus, the number of years, for a cotton wedding anniversary?');
              assert.deepEqual(gameState, GAME_STATES.PLAYING);
              assert.deepEqual(players[0].name, 'Inigo Montoya');
              assert.deepEqual(startTime, '2016-07-31T00:06:26Z');
              assert.deepEqual(currentAnswer, -1);
            }));

        describe('The answer is five', () => {
          it('Score game, say answer is wrong and ask the next question', () =>
            runIntent(firstAnswerIntent)
              .then(({ outputSpeech, gameState, players }) => {
                assert.deepEqual(outputSpeech, 'Incorrect, the answer was 6, you score, ' +
                  '46 points. What is the atomic number of, hydrogen, plus, ' +
                  'George Washington\'s presidency?');
                assert.deepEqual(gameState, GAME_STATES.PLAYING);
                assert.deepEqual(players[0].score, 46);
              }));

          describe('The answer is ten', () => {
            it('Score game, say answer is right and ask the next question', () =>
              runIntent(secondAnswerIntent)
                .then(({ outputSpeech, gameState, players }) => {
                  assert.deepEqual(outputSpeech, 'Correct for 286 points. What is the ' +
                    'atomic number of, hydrogen, plus, George Washington\'s presidency?');
                  assert.deepEqual(gameState, GAME_STATES.PLAYING);
                  assert.deepEqual(players[0].score, 311);
                }));

            describe('The answer is seven', () => {
              it('End game after it has lasted more than a minute', () =>
                runIntent(thirdAnswerIntent)
                  .then(({ outputSpeech, gameState }) => {
                    assert.deepEqual(outputSpeech, 'GAME OVER. You scored 306 points.');
                    assert.deepEqual(gameState, GAME_STATES.GAME_OVER);
                  }));
            });
          });
        });
      });
    });

    describe('Three players', () => {
      it('Asks the first players name', () =>
        runIntent(threePlayerIntent)
          .then(({ outputSpeech, gameState }) => {
            assert.deepEqual(outputSpeech, sanitise(whatIsYourName('one')));
            assert.deepEqual(gameState, GAME_STATES.PRESTART);
          }));
    });
  });
});
