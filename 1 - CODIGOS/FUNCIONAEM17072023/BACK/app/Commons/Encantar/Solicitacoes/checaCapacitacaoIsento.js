//CONSTANTES
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const capacitacaoIsentos = use(
  `${CAMINHO_MODELS}/SolicitacoesCapacitacaoIsentos`
);

/**
 *
 *  Função que checa se um funcionário é isento de realizar a capacitação para utilizar a ferramenta
 *
 *  @param {string} matricula
 *  @returns {Boolean}
 *
 */

const checaCapacitacaoIsento = async (matricula) => {
  const isento = await capacitacaoIsentos.findBy("matricula", matricula);
  return isento ? true : false;
};

module.exports = checaCapacitacaoIsento;
