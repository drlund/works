'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

const Env = use("Env");

const BACKEND_URL = Env.get("BACKEND_URL", "http://localhost:3333");
const IMAGE_PATH = `${BACKEND_URL}/get-image/encantar/`;
/**
 * BrindeImagensTransformer class
 *
 * @class BrindeImagensTransformer
 * @constructor
 */
class BrindeImagensTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    if (model.imagens) {
      model.imagens = model.imagens.map(reg => { 
        return {
          id: reg.id, 
          urlData: IMAGE_PATH+reg.etag
        }
      })
    }

    return { ...model }
  }
}

module.exports = BrindeImagensTransformer
