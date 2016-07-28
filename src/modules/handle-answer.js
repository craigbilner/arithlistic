function isAnswerSlotValid(intent) {
  const answer = intent.slots.answer;
  const answerSlotFilled = answer && !!answer.value;
  const answerSlotIsInt = answerSlotFilled && !isNaN(parseInt(answer.value, 10));

  return answerSlotIsInt && parseInt(answer.value, 10) > 0;
}

module.exports = function handleUserGuess(opts) {
  const answerSlotIsValid = isAnswerSlotValid(opts.intent);

  // FETCH GAME DATA HERE

  // PERFORM SOME SORT OF SCORING HERE

  // CHECK IF THE USER GAME UP OR THE GAME HAS ENDED
};
