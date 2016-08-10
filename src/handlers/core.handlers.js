const res = require('../responses');

module.exports = {
  'AMAZON.StopIntent': function() {
    this.emit(':ask', res.keepPlaying());
  },
  'AMAZON.CancelIntent': function() {
    this.emit(':tell', res.goodbye());
  },
};
