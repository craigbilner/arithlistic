# Arithlistic

> What is gypsum on the mohs scale, plus, the atomic number of, helium?

> The answer is five

> Incorrect, the answer was 4, you score, -22 points. What is dot dot dot dash dash in morse code, minus, fluorite on the mohs scale?

An alexa skill game involving quiz, lists and maths...could anything be better?

So because the Amazon docs and samples are all a bit...old skool...and aren't aimed at a fully working skill implementation, this is my offering - let me know what you think in the Issues/PR section(s).

## Features:

* ES2015 (node 4.3.2 compatible 🙄)
* Airbnb eslint config
* Modular
* TDD with tests taking form of; describe:user intent, it:response and actions
* Gulp pipeline for easy deployment to AWS Lambda (borrowed heavily from [ThoughtWorks](https://github.com/ThoughtWorksStudios/node-aws-lambda))
* Functional Programming style (where possible due to OO and use of `this` in SDK)

## Todo:

* Get the thing published
* Write tutorial
* Join up the utterances a bit better as they're sort of in three places, possibly using [alexa-utterances](https://github.com/mreinstein/alexa-utterances)

## Lessons learnt so far...

* Alexa very rarely understands what I'm saying, two and four appear to be particularly tricky for her
* Can't find any docs on `emitWithState` but what it actually means is, "call an internal intent"
* Keep the handlers granular to make the failure intents much easier to capture and manage, and especially with more ambiguous intents such as "yes" and "no"
* Be careful with one words intents; for example my "Pass" intent was getting triggered whether you say "pass", "bla" or "blub"

## Tips:

### Testing:

Use the [Alexa dev console](https://developer.amazon.com) to test (after the TDD tests *ahem* #obvs). I found this a much easier way to test because Alexa can never understand what I'm saying.

Generally say (type) the opposite thing or rubbish, capture the JSON call, stick it in your event-samples folder and write a test for it. This was useful to quickly pick up the intent Alexa wants to surface and the slot value, which you can't guess from just TDD.

Use this cheeky hack so you can nicely scroll into view and see the JSON, because the boxes are a little on the small side...

```javascript
document.head.getElementsByTagName('style')[0].sheet.insertRule('.AppManagementViewContainer { overflow: visible !important; }', 0);
document.head.getElementsByTagName('style')[0].sheet.insertRule('.Simulator-tab { display: flex; flex-flow: column; }', 1);
document.head.getElementsByTagName('style')[0].sheet.insertRule('.CodeMirror { width: 1500px !important; }', 2);
```

After making sure it's all working "for real", give it a spin on [Echoism](https://echosim.io/)
