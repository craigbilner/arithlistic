/* eslint-disable max-len */

const assert = require('assert');
const skill = require('../index');
const context = require('aws-lambda-mock-context');
const sessionStartIntent = require('./event-samples/new-session/session-start.intent');
const prestartYesIntent = require('./event-samples/prestart/yes.intent');
const prestartNoIntent = require('./event-samples/prestart/no.intent');
const invalidYesNoIntent = require('./event-samples/prestart/invalid-yesno.intent');
const onePlayerIntent = require('./event-samples/player-number/one-player.intent');
const threePlayerIntent = require('./event-samples/player-number/three-player.intent');
const nameIntent = require('./event-samples/player-name/name.intent');
const invalidNameIntent = require('./event-samples/player-name/invalid-name.intent');
const name1Intent = require('./event-samples/player-name/name1.intent');
const name2Intent = require('./event-samples/player-name/name2.intent');
const name3Intent = require('./event-samples/player-name/name3.intent');
const firstAnswerIntent = require('./event-samples/game/answer.intent');
const secondAnswerIntent = require('./event-samples/game/answer2.intent');
const thirdAnswerIntent = require('./event-samples/game/answer3.intent');
const multiFirstAnswerIntent = require('./event-samples/game/multip-answer.intent');
const multiSecondAnswerIntent = require('./event-samples/game/multip-answer2.intent');
const multiThirdAnswerIntent = require('./event-samples/game/multip-answer3.intent');
const multiFourthAnswerIntent = require('./event-samples/game/multip-answer4.intent');
const multiFifthAnswerIntent = require('./event-samples/game/multip-answer5.intent');
const invalidAnswer = require('./event-samples/game/blablabla.intent');
const pass = require('./event-samples/game/pass.intent');
const cancel = require('./event-samples/game/cancel.intent');
const help = require('./event-samples/game/help.intent');
const repeat = require('./event-samples/game/repeat.intent');
const startOver = require('./event-samples/game/start-over.intent');
const stop = require('./event-samples/game/stop.intent');
const {
  welcome,
  howManyPlayers,
  whatIsYourName,
  tryANumber,
  namePrompt,
  welcomeFail,
  welcomePrompt,
  goodbye,
  noHelp,
  noRepeats,
  keepPlaying,
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
        playerCount: getAttribute(obj, 'playerCount'),
        players: getAttribute(obj, 'players'),
        activePlayer: getAttribute(obj, 'activePlayer'),
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
          assert.deepEqual(gameState, GAME_STATES.PLAYER_NUMBER);
        }));

    describe('One player', () => {
      it('Sets the player count and asks the players name', () =>
        runIntent(onePlayerIntent)
          .then(({ outputSpeech, gameState, playerCount }) => {
            assert.deepEqual(outputSpeech, sanitise(whatIsYourName('one')));
            assert.deepEqual(gameState, GAME_STATES.PLAYER_NAME);
            assert.deepEqual(playerCount, 1);
          }));

      describe('My name is Inigo Montoya', () => {
        it('Save name, start the game and ask Inigo Montoya the first question', () =>
          runIntent(nameIntent)
            .then(({ outputSpeech, gameState, players, startTime, currentAnswer, activePlayer }) => {
              assert.deepEqual(outputSpeech, 'Inigo Montoya, what is dash dash dash dash dash in ' +
                'morse code, minus, the number of years, for a cotton wedding anniversary?');
              assert.deepEqual(gameState, GAME_STATES.PLAYING);
              assert.deepEqual(players[0].name, 'Inigo Montoya');
              assert.deepEqual(startTime, '2016-07-31T00:06:26Z');
              assert.deepEqual(currentAnswer, -1);
              assert.deepEqual(activePlayer, 0);
            }));

        describe('The answer is five', () => {
          it('Score game, say answer is wrong and ask the next question', () =>
            runIntent(firstAnswerIntent)
              .then(({ outputSpeech, gameState, players, activePlayer }) => {
                assert.deepEqual(outputSpeech, 'Incorrect, the answer was 6, you score, ' +
                  '46 points. What is the atomic number of, hydrogen, plus, ' +
                  'George Washington\'s presidency?');
                assert.deepEqual(gameState, GAME_STATES.PLAYING);
                assert.deepEqual(players[0].score, 46);
                assert.deepEqual(activePlayer, 0);
              }));

          describe('The answer is ten', () => {
            it('Score game, say answer is right and ask the next question', () =>
              runIntent(secondAnswerIntent)
                .then(({ outputSpeech, gameState, players, activePlayer }) => {
                  assert.deepEqual(outputSpeech, 'Correct for 286 points. What is the ' +
                    'atomic number of, hydrogen, plus, George Washington\'s presidency?');
                  assert.deepEqual(gameState, GAME_STATES.PLAYING);
                  assert.deepEqual(players[0].score, 332);
                  assert.deepEqual(activePlayer, 0);
                }));

            describe('The answer is seven', () => {
              it('End game after it has lasted more than a minute', () =>
                runIntent(thirdAnswerIntent)
                  .then(({ outputSpeech, gameState }) => {
                    assert.deepEqual(outputSpeech, 'GAME OVER. You scored 613 points.');
                    assert.deepEqual(gameState, GAME_STATES.GAME_OVER);
                  }));
            });
          });
        });

        describe('Cancel', () => {
          it('Cancels the game', () =>
            runIntent(cancel)
              .then(({ outputSpeech }) => {
                assert.deepEqual(outputSpeech, goodbye());
              }));
        });

        describe('Help me', () => {
          it('Informs the player there is no help', () =>
            runIntent(help)
              .then(({ outputSpeech }) => {
                assert.deepEqual(outputSpeech, noHelp());
              }));
        });

        describe('Pass', () => {
          it('Asks the next question without a score', () =>
            runIntent(pass)
              .then(({ outputSpeech, players }) => {
                assert.deepEqual(outputSpeech, 'dick, what is the number of years, for a ' +
                  'leather wedding anniversary, plus, the number of the herculean labour where he' +
                  ', captures the ceryneian hind?');
                assert.deepEqual(players[0].score, 0);
              }));
        });

        describe('Can you repeat that', () => {
          it('Inform the player there are no repeats', () =>
            runIntent(repeat)
              .then(({ outputSpeech }) => {
                assert.deepEqual(outputSpeech, noRepeats());
              }));
        });

        describe('Just start again', () => {
          it('Go back to the game intro', () =>
            runIntent(startOver)
              .then(({ outputSpeech }) => {
                assert.deepEqual(outputSpeech, welcome());
              }));
        });

        describe('Stop it!', () => {
          it('Ask if the player would like to keep playing', () =>
            runIntent(stop)
              .then(({ outputSpeech }) => {
                assert.deepEqual(outputSpeech, keepPlaying());
              }));
        });

        describe('Bla bla bla', () => {
          it('Tell the player how to answer a question', () =>
            runIntent(invalidAnswer)
              .then(({ outputSpeech }) => {
                assert.deepEqual(outputSpeech, tryANumber());
              }));
        });
      });

      describe('Inigo Montoya is my name', () => {
        it('Ask for the same players name again', () =>
          runIntent(invalidNameIntent)
            .then(({ outputSpeech, players }) => {
              assert.deepEqual(outputSpeech, namePrompt());
              assert.deepEqual(players, []);
            }));
      });

      describe('Bla bla bla', function() {
        it('Does something', () =>
          runIntent(invalidNameIntent)
            .then(({ outputSpeech }) => {
              assert.deepEqual(outputSpeech, namePrompt());
            }));
      });
    });

    describe('Three players', () => {
      it('Sets the player count and asks the first players name', () =>
        runIntent(threePlayerIntent)
          .then(({ outputSpeech, gameState, playerCount }) => {
            assert.deepEqual(outputSpeech, sanitise(whatIsYourName('one')));
            assert.deepEqual(gameState, GAME_STATES.PLAYER_NAME);
            assert.deepEqual(playerCount, 3);
          }));

      describe('My name is Inigo Montoya', () => {
        it('Set the player and asks the second players name', () =>
          runIntent(name1Intent)
            .then(({ outputSpeech, gameState, players }) => {
              assert.deepEqual(outputSpeech, sanitise(whatIsYourName('two')));
              assert.deepEqual(gameState, GAME_STATES.PLAYER_NAME);
              assert.deepEqual(players, [{ name: 'Inigo Montoya', score: 0 }]);
            }));

        describe('My name is Prince Humperdinck', () => {
          it('Sets the player and asks the third players name', () =>
            runIntent(name2Intent)
              .then(({ outputSpeech, gameState, players }) => {
                assert.deepEqual(outputSpeech, sanitise(whatIsYourName('three')));
                assert.deepEqual(gameState, GAME_STATES.PLAYER_NAME);

                const expectedPlayers = [
                  {
                    name: 'Inigo Montoya',
                    score: 0,
                  },
                  {
                    name: 'Prince Humperdinck',
                    score: 0,
                  },
                ];

                assert.deepEqual(players, expectedPlayers);
              }));

          describe('My name is Fezzik', () => {
            it('Sets the player, starts the game and asks the first player the ' +
              'first question', () =>
              runIntent(name3Intent)
                .then(({ outputSpeech, gameState, players, activePlayer }) => {
                  assert.deepEqual(outputSpeech, 'Inigo Montoya, what is dash dash dash dash dash' +
                    ' in morse code, minus, the number of years, ' +
                    'for a cotton wedding anniversary?');
                  assert.deepEqual(gameState, GAME_STATES.PLAYING);

                  const expectedPlayers = [
                    {
                      name: 'Inigo Montoya',
                      score: 0,
                    },
                    {
                      name: 'Prince Humperdinck',
                      score: 0,
                    },
                    {
                      name: 'Fezzik',
                      score: 0,
                    },
                  ];

                  assert.deepEqual(players, expectedPlayers);
                  assert.deepEqual(activePlayer, 0);
                }));

            describe('The answer is five', () => {
              it('Score game, say answer is wrong and ask the next question', () =>
                runIntent(multiFirstAnswerIntent)
                  .then(({ outputSpeech, gameState, players, activePlayer }) => {
                    assert.deepEqual(outputSpeech, 'Incorrect, the answer was 6, you score, 46 ' +
                      'points. Prince Humperdinck, what is the atomic number of, hydrogen, plus, ' +
                      'George Washington\'s presidency?');
                    assert.deepEqual(gameState, GAME_STATES.PLAYING);
                    assert.deepEqual(players[0].score, 46);
                    assert.deepEqual(activePlayer, 1);
                  }));

              describe('The answer is six', () => {
                it('Score game, say answer is correct and ask the next question', () =>
                  runIntent(multiSecondAnswerIntent)
                    .then(({ outputSpeech, gameState, players, activePlayer }) => {
                      assert.deepEqual(outputSpeech, 'Correct for 286 points. Fezzik, what is ' +
                        'the atomic number of, hydrogen, plus, George Washington\'s presidency?');
                      assert.deepEqual(gameState, GAME_STATES.PLAYING);
                      assert.deepEqual(players[1].score, 286);
                      assert.deepEqual(activePlayer, 2);
                    }));

                describe('The answer is eight', () => {
                  it('Score game, say answer is correct and ask the next question', () =>
                    runIntent(multiThirdAnswerIntent)
                      .then(({ outputSpeech, gameState, players, activePlayer }) => {
                        assert.deepEqual(outputSpeech, 'Incorrect, the answer was 6, you score, ' +
                          '46 points. Inigo Montoya, what is the atomic number of, hydrogen, plus, ' +
                          'George Washington\'s presidency?');
                        assert.deepEqual(gameState, GAME_STATES.PLAYING);
                        assert.deepEqual(players[2].score, 46);
                        assert.deepEqual(activePlayer, 0);
                      }));

                  describe('The answer is ten', () => {
                    it('Score game, say answer is correct and ask the next question', () =>
                      runIntent(multiFourthAnswerIntent)
                        .then(({ outputSpeech, gameState, players }) => {
                          assert.deepEqual(outputSpeech, 'Correct for 299 points. Prince ' +
                            'Humperdinck, what is the number of years, for a leather wedding ' +
                            'anniversary, minus, the atomic number of, lithium?');
                          assert.deepEqual(gameState, GAME_STATES.PLAYING);
                          assert.deepEqual(players[0].score, 345);
                        }));

                    describe('The answer is seven', () => {
                      it('End game after it has lasted more than a minute', () =>
                        runIntent(multiFifthAnswerIntent)
                          .then(({ outputSpeech, gameState }) => {
                            assert.deepEqual(outputSpeech, 'GAME OVER. Inigo Montoya is the ' +
                              'winner. Inigo Montoya scored 379 points. Prince Humperdinck ' +
                              'scored 286 points. Fezzik scored 46 points.');
                            assert.deepEqual(gameState, GAME_STATES.GAME_OVER);
                          }));
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });

  describe('No', () => {
    it('Give unfortunate speech', () =>
      runIntent(prestartNoIntent)
        .then(({ outputSpeech }) => {
          assert.deepEqual(outputSpeech, welcomeFail());
        }));
  });

  describe('Pass', () => {
    it('Suggests saying yes or no', () =>
      runIntent(invalidYesNoIntent)
        .then(({ outputSpeech }) => {
          assert.deepEqual(outputSpeech, welcomePrompt());
        }));
  });
});
