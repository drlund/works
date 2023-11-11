//CONSTANTES
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const brindesReponsavelModel = use(
  `${CAMINHO_MODELS}/BrindesResponsavelEntrega`
);

/**
 *
 *  Retorna prefixos onde o usuário é responsável pela entrega de brindes
 *
 *  @param {string} matricula Matrícula do usuário desejado
 *
 *  @return {string[]} Array de prefixos onde o usuário é responsável pela entrega de brindes
 *
 */

const getPrefixosUsuarioResponsavelBrindes = async (matricula) => {
  const prefixosResponsavel = await brindesReponsavelModel
    .query()
    .where("matricula", matricula)
    .fetch();

  return prefixosResponsavel.toJSON().map((registro) => registro.prefixo);
};

module.exports = getPrefixosUsuarioResponsavelBrindes;
