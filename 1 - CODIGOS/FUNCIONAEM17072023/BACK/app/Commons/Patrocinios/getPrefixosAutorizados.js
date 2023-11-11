const isEquipeComunicacao = use('App/Commons/Patrocinios/isEquipeComunicacao.js');
const getFuncisPlataforma = use('App/Commons/Arh/getFuncisPlataforma');
const Dependencia = use('App/Models/Mysql/Dependencia.js');

// Prefixos
const PREFIXOS_UNIDADES_DIVAR = ['8592','9220','9270'];

// Tipo de dependência
const TIP_DEP_SUPER = 4;

/**
 * Método utilitário que retorna um array de prefixos que o usuário logado pode consultar
 * @param {Object} dadosUsuario
 */
async function getPrefixosAutorizados(dadosUsuario) {
  const prefixosAutorizados = [dadosUsuario.pref_super];

  // Verifica se usuário é da Equipe de Comunicação da Super Adm
  if (await isEquipeComunicacao(dadosUsuario)) {
    // Retorna um array com o prefixo e nome das Super's Estaduais
    return await Dependencia.query()
      .select('prefixo', 'nome')
      .whereIn('cd_diretor_juris', PREFIXOS_UNIDADES_DIVAR)
      .where('tip_dep', TIP_DEP_SUPER)
      .where('dt_encerramento', '>', new Date())
      .fetch();
  } else {
    const funciPlat = await getFuncisPlataforma(dadosUsuario.matricula);

    if (funciPlat) {
      const prefixos = funciPlat.super;
      return prefixos.split(',');
    }
  }

  return prefixosAutorizados;
}

module.exports = getPrefixosAutorizados;