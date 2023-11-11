'use strict'

class GetSb00 {
  register (Model, options) {
    Model.queryMacro('sb00', function () {
      this.where('cd_subord', '00');
      return this;
    })

  }
}

module.exports = GetSb00;
