'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
var fs = require('fs');

class ClearCache {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    await next()
    // for(let arquivo of response.cached){
    //   fs.unlinkSync(arquivo);
    // }
  }
}

module.exports = ClearCache
