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

module.exports = Alexa.CreateStateHandler(GAME_STATES.PRESTART, {
  GameIntro() {
    this.emit(':ask', res.welcome());
  },
  'AMAZON.YesIntent': function() {
    this.emit(':ask', res.howManyPlayers());
  },
  PlayerNumberSoloIntent() {
    this.attributes.playerCount = 1;
    this.emit(':ask', res.whatIsYourName(numberToWord[1]));
  },
  PlayerNumberIntent() {
    this.attributes.playerCount = parseInt(this.event.request.intent.slots.Players.value, 10);
    this.emit(':ask', res.whatIsYourName('one'));
  },
  PlayerNameIntent() {
    const player = {
      name: this.event.request.intent.slots.Name.value,
      score: 0,
    };

    if (!this.attributes.players) {
      this.attributes.players = [player];
    } else {
      this.attributes.players = this.attributes.players.concat(player);
    }

    if (this.attributes.players.length === this.attributes.playerCount) {
      this.attributes.activePlayer = 0;
      this.handler.state = GAME_STATES.PLAYING;
      this.emitWithState('AskQuestion');
    } else {
      this.emit(':ask', res.whatIsYourName(numberToWord[this.attributes.players.length + 1]));
    }
  },
  Unhandled() {
    console.log('unhandled', GAME_STATES.PRESTART);
  },
});
