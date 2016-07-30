module.exports.welcome = (opts) => {
  const speechOutputPrefix = opts.isNewGame ? 'Welcome to Arithlistic. ' : '';

  return `${speechOutputPrefix}I will ask you as many questions as you can answer within one minute`;
};
