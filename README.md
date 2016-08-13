# Arithlistic

> What is gypsum on the mohs scale, plus, the atomic number of, helium?

> The answer is five

> Incorrect, the answer was 4, you score, -22 points. What is dot dot dot dash dash in morse code, minus, fluorite on the mohs scale?

An alexa skill game involving quiz, lists and maths...could anything be better?

So because the Amazon docs and samples are all a bit...old skool...and aren't aimed at a fully working skill implementation, this is my offering - let me know what you think in the Issues/PR section(s). I'm almost happy with the code now but the magical `this` is still quite upsetting.

## Features:

* ES2015 (node 4.3.2 compatible 🙄)
* Airbnb eslint config
* Modular
* TDD with tests taking form of; describe:user intent, it:response and actions
* Gulp pipeline for easy deployment to AWS Lambda (borrowed heavily from [ThoughtWorks](https://github.com/ThoughtWorksStudios/node-aws-lambda))
* Functional Programming style (where possible due to OO and use of `this` in SDK)

## Todo:

* Write tutorial
* Join up the utterances a bit better as they're sort of in three places, possibly using [alexa-utterances](https://github.com/mreinstein/alexa-utterances)

## Lessons learnt so far...

* Alexa very rarely understands what I'm saying, two and four appear to be particularly tricky for her
* Can't find any docs on `emitWithState` but what it actually means is, "call an internal intent"
* Keep the handlers granular to make the failure intents much easier to capture and manage, and especially with more ambiguous intents such as "yes" and "no"
* Be careful with one words intents; for example my "Pass" intent was getting triggered whether you say "pass", "bla" or "blub"
* If you like to use ES2015 proper (virtue of node 6.x) and you write your tests with it (like I perhaps foolishly have), use [nvm](https://github.com/creationix/nvm) to be able to swap back to 4.3.2 in order to smoke test the skill code with [lambda-local](https://www.npmjs.com/package/lambda-local)

### Certification...

...can be frustrating/slash I'm a bit rogue and they're sticklers for the rules. tl;dr - implement every intent, even if it doesn't make sense...and don't make "jokes".

* `<sigh`>They're quite strict on the help, cancel and stop intents. I've gone for a mixin approach so I don't need to write them out for every handler and refactored my responses so they store last known state to pick up from after "pausing" the game with a stop intent. So, even though my first question was an easy "yes" or "no", they still wanted "cancel" to do the same thing as "no"`</sigh>`
* `<grumble>`I failed the Invocation Name criteria with "quizzy maths list" which AFAICT should pass...but they don't tell you why or suggest alternatives`</grumble>`
* `<grrrr>`I wanted the game to be hard so didn't allow questions to be repeated, with some whimsical thing saying it's a proper game and you don't get repeats...turns out...repeats are a requirement...`</grrrr>`

It went live 12 August, and according to my metrics, one user played it in the first 24 hours making ~12.4 utterances, I have no idea what that means, but it sounds marvellous.

## Tips:

### General

* Put all responses in a central place to make testing and refactoring easier...and possibly i18n further down the line...
* The code can get a little messy - keep every intent as clean and clear as possible by splitting up "session updates" and "responses"

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
