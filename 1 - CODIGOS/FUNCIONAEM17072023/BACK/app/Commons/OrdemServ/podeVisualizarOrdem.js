const ordemModel = use("App/Models/Mysql/OrdemServ/Ordem");
const insNormativaModel = use("App/Models/Mysql/OrdemServ/InstrucaoNormativa");

const participanteExpandidoModel = use(
  "App/Models/Mysql/OrdemServ/ParticipanteExpandido"
);
const participanteEdicaoModel = use('App/Models/Mysql/OrdemServ/ParticipanteEdicao');
const colaboradorModel = use("App/Models/Mysql/OrdemServ/Colaborador");
const { findINCRequiredPermissions } = use("App/Commons/BaseIncUtils");
const { getOneFunci, isComissaoNivelGerencial } = use("App/Commons/Arh");
const autorizacaoConsultaModel = use('App/Models/Mysql/OrdemServ/AutorizacaoConsulta');

/**
 * Metodo utilitario que verifica se o usuario pode editar a ordem solicitada.
 */
async function podeVisualizarOrdem(idOrdem, matricula, prefixo, verifyRoles = false, userRoles = []) {
  let ordem = await ordemModel.findBy("id", idOrdem);

  let dadosDesignante = await participanteExpandidoModel
    .query()
    .whereHas("participanteEdicao.ordem", builder => {
      builder.where("id", idOrdem);
      builder.where("tipo_participacao", "Designante");
    })
    .where("matricula", matricula)
    .first();

  //se for designante, verifica os papeis de acesso
  if (dadosDesignante && verifyRoles) {
    //verifica a lista de INS x papel de acesso do usuario
    let listaInstrucoes = await insNormativaModel.query()
      .distinct(['numero', 'cod_tipo_normativo'])
      .setVisible(['numero', 'cod_tipo_normativo'])
      .where('id_ordem', idOrdem)
      .fetch();

    let papeisNecessariosINC = [];

    for (let instrucao of listaInstrucoes.rows) {
      //obtem os papeis de acesso necessarios para visualizar esta instrucao
      let requiredPermissions = await findINCRequiredPermissions(instrucao.numero, instrucao.cod_tipo_normativo);
      let papeisTmp = [];

      for (let permissao of requiredPermissions) {
        let role = permissao.CD_TRAN_ACSS_CTU;
        papeisTmp.push(role);
      }

      //coleta todos os codigos dos papeis de acesso que o item da IN possui      
      papeisNecessariosINC.push(papeisTmp);
    }

    let papeisNecessariosUsuario = [];
    
    for (let roles of papeisNecessariosINC) {
      let possuiAlgum = false;

      for (let role of roles) {
        //uma IN pode ter varios papeis - cada diretoria pode ter um papel especifico
        //então, basta o usuario possuir apenas 01 papel da lista para poder acessar a IN        
        if (userRoles.includes(role)) {
          possuiAlgum = true;
          break;
        }
      }

      if (!possuiAlgum) {
        let infoPapeis = "[" + roles.join(' ou ') + "]";
        if (!papeisNecessariosUsuario.includes(infoPapeis)) {
          papeisNecessariosUsuario.push(infoPapeis);
        }
      }      
    }

    if (papeisNecessariosUsuario.length) {
      //Usuario nao possui as permissoes necessarias para qualquer a instrucao atual.
      return {result: false, motivo: `Esta ordem possui Instruções Normativas restritas aos quais o usuário não possui acesso! Papel(is) Necessário(s): ${papeisNecessariosUsuario.join(', ')} - [SISBB-ACESSO]`};
    }  
  }

  //verifica se o usuario eh designante ou designado.
  let dadosParticipante = await participanteExpandidoModel
    .query()
    .whereHas("participanteEdicao.ordem", builder => {
      builder.where("id", idOrdem);
    })
    .where("matricula", matricula)
    .first();

  if (dadosParticipante) {
    //pode visualizar se for participante
    return { result: true };
  }

  //verifica se eh colaborador
  let dadosColaborador = await colaboradorModel
    .query()
    .where("id_ordem", idOrdem)
    .where("matricula", matricula)
    .first();

  if (dadosColaborador) {
    return { result: true };
  }

  //verifica se o usuario possui autorizacao para consulta cadastrada na ordem
  let possuiAutorizacaoConsulta = await autorizacaoConsultaModel.query()
    .where("id_ordem", idOrdem)
    .where("matricula", matricula)
    .first();

  if (possuiAutorizacaoConsulta) {
    return { result: true }
  }

  //verifica se o prefixo do usuario esta entre os prefixos dos designantes / designados
  //e se a ordem não eh confidencial (neste ponto, o usuario, 
  //não eh participante da ordem em nenhum dos 3 papeis acima e nem tem autorizacao de consulta)
  let prefixosOrdem = await participanteEdicaoModel.query()
    .distinct(['prefixo'])
    .where('id_ordem', idOrdem)
    .fetch();

  let prefixoUsuarioInOrdem = false;

  for (let registro of prefixosOrdem.rows) {
    if (registro.prefixo === prefixo) {
      prefixoUsuarioInOrdem = true;
      break;
    }
  }

  if (prefixoUsuarioInOrdem || ordem.prefixo_autor === prefixo) {
    if (ordem.confidencial) {
      return { result: false, motivo: "Você não pode visualizar esta ordem pois a mesma foi marcada como confidencial!"}
    } else {
      let dadosFunci = await getOneFunci(matricula);
      let possuiNivelGerencial = await isComissaoNivelGerencial(dadosFunci.comissao);
      
      //so permite visualizar se tiver comissao de nivel gerencial.
      if (possuiNivelGerencial) {
        return { result: true };
      } else {
        return { result: false, motivo: "Apenas funcionários com nível gerencial podem visualizar esta ordem!" };
      }
    }
  }

  return { result: false };
}

module.exports = podeVisualizarOrdem;
