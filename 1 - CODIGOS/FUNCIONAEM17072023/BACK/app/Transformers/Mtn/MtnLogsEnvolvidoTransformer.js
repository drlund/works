"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");

/**
 * MtnLogsEnvolvidoTransformer class
 *
 * @class MtnLogsEnvolvidoTransformer
 * @constructor
 */
class MtnLogsEnvolvidoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  async transform(model) {
    return model;
  }
}

module.exports = MtnLogsEnvolvidoTransformer;
