/**
 *
 *  Recebe um prefixo no formato int e o transforma em string, colocando os zeros à esquerda se for necessário
 *  
 *  @param {number} prefixo 
 * 
 *  @return {string}
 * 
 */

const prefixoIntToString = (prefixo) => {
  return prefixo.toString().padStart(4, "0");
};

module.exports = prefixoIntToString;
