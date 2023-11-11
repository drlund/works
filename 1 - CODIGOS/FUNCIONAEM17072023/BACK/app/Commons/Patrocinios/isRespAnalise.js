const isEquipeComunicacao = use('App/Commons/Patrocinios/isEquipeComunicacao.js');
const getRespAnalise = use('App/Commons/Patrocinios/getRespAnalise.js');

/**
 * Metodo utilitário que verifica se o usuário é responsável pela análise da solicitação
 * @param {Object} dadosUsuario
 * @param {Object} solicitacao 
 */
async function isRespAnalise(dadosUsuario, solicitacao) {
  if (solicitacao) {
    const { id } = solicitacao;
    
    if (id) {
      const respAnalise = await getRespAnalise(id);

      if (respAnalise && respAnalise.length) {
        // Retorna se o usuário está no array de responsáveis
        return respAnalise.some(resp => resp.matricula === dadosUsuario.matricula);
      }
    }

    return await isEquipeComunicacao(dadosUsuario);
  }

  return false;
}

module.exports = isRespAnalise;