'use strict';

process.env.PATH = `${process.env.PATH}:${process.env.LAMBDA_TASK_ROOT}`;

const Alexa = require('alexa-sdk');
const newSessionHandlers = require('./handlers/new-session.handlers');
const prestartHandlers = require('./handlers/prestart.handlers');
const playerNumberHandlers = require('./handlers/player-number.handlers');
const playerNameHandlers = require('./handlers/player-name.handlers');
const gameHandlers = require('./handlers/game.handlers');
const helpHandlers = require('./handlers/help.handlers');

module.exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.appId = event.session.application.applicationId;

  alexa.registerHandlers(
    newSessionHandlers,
    prestartHandlers,
    playerNumberHandlers,
    playerNameHandlers,
    gameHandlers,
    helpHandlers
  );
  alexa.execute();
};
