'use strict';

const Alexa = require('alexa-sdk');
const GAME_STATES = require('../enums').GAME_STATES;

module.exports = Alexa.CreateStateHandler(GAME_STATES.STOPPED, {

});
