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

const nameIsValid = name => !!name;

module.exports = Alexa.CreateStateHandler(GAME_STATES.PLAYER_NAME, {
  PlayerNameIntent() {
    const name = this.event.request.intent.slots.Name.value;

    if (!nameIsValid(name)) {
      return this.emitWithState('Unhandled');
    }

    const player = {
      name,
      score: 0,
      correctAnswers: 0,
    };

    this.attributes.players = this.attributes.players.concat(player);

    if (this.attributes.players.length === this.attributes.playerCount) {
      this.attributes.activePlayer = 0;
      this.handler.state = GAME_STATES.PLAYING;
      this.emitWithState('AskQuestion');
    } else {
      this.emit(':ask', res.whatIsYourName(numberToWord[this.attributes.players.length + 1]));
    }
  },
  Unhandled() {
    this.emit(':ask', res.namePrompt(), res.namePrompt());
  },
  SessionEndedRequest() {
    console.log(`Session ended in ${GAME_STATES.PLAYER_NAME} state: ${this.event.request.reason}`);
  },
});
