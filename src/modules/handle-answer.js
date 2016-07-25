function isAnswerSlotValid({ slots: { Answer } }) {
  const answerSlotFilled = Answer && !!Answer.value;
  const answerSlotIsInt = answerSlotFilled && !isNaN(parseInt(Answer.value, 10));

  return answerSlotIsInt && parseInt(Answer.value, 10) > 0;
}

module.exports = function handleUserGuess({ hasPassed, intent }) {
  const answerSlotIsValid = isAnswerSlotValid(intent);

  // FETCH GAME DATA HERE

  // PERFORM SOME SORT OF SCORING HERE

  // CHECK IF THE USER GAME UP OR THE GAME HAS ENDED
};
