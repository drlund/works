/**
 *
 * Arquivos contendo métodos utilitários para Objetos
 *
 */

const removeEmptyProperties = (objeto) => {
  return Object.fromEntries(Object.entries(objeto).filter(([_, v]) => [null, undefined, ''].includes(v)));;
};

module.exports = {
  removeEmptyProperties
};
