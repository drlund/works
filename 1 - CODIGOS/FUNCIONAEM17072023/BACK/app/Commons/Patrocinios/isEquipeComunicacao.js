const EquipeComunicacao = use('App/Models/Mysql/Patrocinios/EquipeComunicacao');

/**
 * Metodo utilitário que verifica se o usuário é membro da equipe de comunicação
 * @param {Object} dadosUsuario
 */
async function isEquipeComunicacao(dadosUsuario) {
  const equipeComunicacao = await EquipeComunicacao.query().pluck('matricula').where('ativo', 1);
  return equipeComunicacao.includes(dadosUsuario.matricula);
}

module.exports = isEquipeComunicacao;