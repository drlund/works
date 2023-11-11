class ExpectedAbstractError extends Error {
  /**
   * @param {string} message
   * @param {number} code
   */
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}

module.exports = {
  ExpectedAbstractError,
};
