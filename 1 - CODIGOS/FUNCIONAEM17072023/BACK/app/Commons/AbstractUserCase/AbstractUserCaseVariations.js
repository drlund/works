const { AbstractUserCase } = require('./AbstractUserCase');

/**
 * @abstract
 * @class
 * @template {import('./AbstractUserCase').AbcBase} AbcTypes
 * @extends {AbstractUserCase<AbcTypes>}
 */
class AbstractUserCaseNoPayload extends AbstractUserCase {
  /**
   * @param {import('./AbstractUserCase').AbstractConstructorProps<AbcTypes>} props
   */
  constructor(props) {
    super(props);

    if (this.constructor === AbstractUserCaseNoPayload) {
      // istanbul ignore next
      throw new Error("Abstract classes can't be instantiated.");
    }

    this._config({ usePayload: false });
  }
}

/**
 * @abstract
 * @class
 * @template {import('./AbstractUserCase').AbcBase} AbcTypes
 * @extends {AbstractUserCase<AbcTypes>}
 */
class AbstractUserCaseNoChecks extends AbstractUserCase {
  /**
   * @param {import('./AbstractUserCase').AbstractConstructorProps<AbcTypes>} props
   */
  constructor(props) {
    super(props);

    if (this.constructor === AbstractUserCaseNoChecks) {
      // istanbul ignore next
      throw new Error("Abstract classes can't be instantiated.");
    }

    this._config({ useChecks: false });
  }
}

/**
 * @abstract
 * @class
 * @template {import('./AbstractUserCase').AbcBase} AbcTypes
 * @extends {AbstractUserCase<AbcTypes>}
 */
class AbstractUserCaseNoChecksPayload extends AbstractUserCase {
  /**
   * @param {import('./AbstractUserCase').AbstractConstructorProps<AbcTypes>} props
   */
  constructor(props) {
    super(props);

    if (this.constructor === AbstractUserCaseNoChecksPayload) {
      // istanbul ignore next
      throw new Error("Abstract classes can't be instantiated.");
    }

    this._config({ useChecks: false, usePayload: false });
  }
}

module.exports = {
  AbstractUserCaseNoPayload,
  AbstractUserCaseNoChecks,
  AbstractUserCaseNoChecksPayload,
};
