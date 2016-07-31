module.exports.welcome = () =>
  `Welcome to Arithlistic, I will ask you as many maths quiz questions as you can answer within one 
minute, would you like to play?`;

module.exports.howManyPlayers = () =>
  `How many players will there be?`;

module.exports.whatIsYourName = number =>
  `Player ${number}, what is your name?`;

module.exports.askQuestion = (name, question) =>
  `${name}, what is ${question}?`;

module.exports.scoreAndAskQuestion = (result, name, question) => {
  const correctResponse = `Correct for ${result.points}`;
  const incorrectResponse = `Incorrect, the answer was ${result.answer}, you score ${result.points}`;
  const response = result.isCorrect ? correctResponse : incorrectResponse;

  return `${response}. What is ${question}?`;
};