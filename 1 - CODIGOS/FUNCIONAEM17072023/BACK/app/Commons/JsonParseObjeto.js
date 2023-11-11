/**
 *
 * Documente sua função!!!
 *
 */

const JsonParseObjeto = (campos, objeto) => {
  const novoObjeto = {};

  for (const campo of campos) {
    if (objeto[campo]) {
      novoObjeto[campo] = JSON.parse(objeto[campo]);
    }
  }
  return novoObjeto;
};

module.exports = JsonParseObjeto;
