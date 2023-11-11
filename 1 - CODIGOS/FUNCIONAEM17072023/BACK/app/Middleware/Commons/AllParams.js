'use strict'

class AllParams {
  async handle ({ request }, next) {
    request.allParams = () => { return {...request.params, ...request.all()} };
    await next()
  }
}

module.exports = AllParams
