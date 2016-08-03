'use strict';

const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;
const res = require('../responses');

const numberToWord = {
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
};

module.exports = Alexa.CreateStateHandler(GAME_STATES.PLAYER_NUMBER, {
  PlayerNumberSoloIntent() {
    this.attributes.playerCount = 1;
    this.emit(':ask', res.whatIsYourName(numberToWord[1]));
  },
  PlayerNumberIntent() {
    this.attributes.playerCount = parseInt(this.event.request.intent.slots.Players.value, 10);
    this.handler.state = GAME_STATES.PLAYER_NAME;
    this.emit(':ask', res.whatIsYourName('one'));
  },
  Unhandled() {
    this.emit(':ask', res.numberPrompt, res.numberPrompt);
  },
  SessionEndedRequest() {
    console.log(`Session ended in ${GAME_STATES.PLAYER_NUMBER} state: ${this.event.request.reason}`);
  },
});
