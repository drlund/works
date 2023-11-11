const codigosAfastamentoModel = use('App/Models/Mysql/OrdemServ/CodigosAfastamentoParticipante');
const ausentesHojeModel = use('App/Models/Mysql/OrdemServ/AusentesHoje');

/**
 * Verifica na tabela de codigos de afastamento se a situacao do funci permite a assinatura da ordem.
 */
async function naoPassivelAssinatura(situacaoFunci, matricula) {
  try {
    let registro = await codigosAfastamentoModel.query()
      .where('codigo', situacaoFunci)
      .first();

    if (registro) {
      return 1;
    }
    
    let ausenteHoje = await ausentesHojeModel.query()
      .where('matricula', matricula)
      .first();

    if (ausenteHoje) {
      return 1;
    }

    return 0;
  } catch (error) {
    return 0
  }
}

module.exports = naoPassivelAssinatura;