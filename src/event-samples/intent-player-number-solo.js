module.exports = {
  "session": {
    "new": false,
    "sessionId": "session1234",
    "attributes": {},
    "user": {
      "userId": null
    },
    "application": {
      "applicationId": "amzn1.echo-sdk-ams.app.[unique-value-here]"
    }
  },
  "version": "1.0",
  "request": {
    "intent": {
      "slots": {
        "Color": {
          "name": "Color",
          "value": "blue"
        }
      },
      "name": "MyColorIsIntent"
    },
    "type": "IntentRequest",
    "requestId": "request5678"
  }
};
