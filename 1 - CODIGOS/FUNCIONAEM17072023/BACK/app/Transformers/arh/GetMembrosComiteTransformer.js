'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const { getOneFunci } = use("App/Commons/Arh");

/**
 * GetMembrosComiteTransformer class
 *
 * @class GetMembrosComiteTransformer
 * @constructor
 */
class GetMembrosComiteTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  async transform (model) {
    let register = {
     prefixo: model.CD_PRF_DEPE,
     codTipoComite: model.CD_ETR_DCS,
     matricula: model.CD_FUN
    }

    try {
      let funci = await getOneFunci(register.matricula);
      register.nome = funci.nome;
      register.dependencia = funci.dependencia.nome;
    } catch (err) {
      //nao acho o funci - comite desatualizado
      register.nome = "FUNCIONARIO NAO ENCONTRADO. VERIFIQUE O COMITE.";
      register.dependencia = "!!!ATENCAO!!!";
    }

    return register;
  }
}

module.exports = GetMembrosComiteTransformer
