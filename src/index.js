const Alexa = require('alexa-sdk');
const newSessionHandlers = require('./handlers/new-session.handlers');
const startHandlers = require('./handlers/start.handlers');
const gameHandlers = require('./handlers/game.handlers');
const helpHandlers = require('./handlers/new-session.handlers');

module.exports.handler = function (event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(newSessionHandlers, startHandlers, gameHandlers, helpHandlers);
  alexa.execute();
};
