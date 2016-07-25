const Alexa = require('alexa-sdk');
const {
  newSessionHandlers,
  startStateHandlers,
  triviaStateHandlers,
  helpStateHandlers,
} = require('./handlers/index.handlers');

module.exports.handler = function(event, context) {
  const alexa = Alexa.handler(event, context);
  alexa.registerHandlers(newSessionHandlers, startStateHandlers, triviaStateHandlers, helpStateHandlers);
  alexa.execute();
};
