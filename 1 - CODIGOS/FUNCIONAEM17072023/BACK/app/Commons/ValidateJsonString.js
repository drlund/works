module.exports = (stringToTest) => {
  if (typeof stringToTest !== "string") {
    return false;
  }

  try {
    JSON.parse(stringToTest);
  } catch (e) {
    return false;
  }
  return true;
};
