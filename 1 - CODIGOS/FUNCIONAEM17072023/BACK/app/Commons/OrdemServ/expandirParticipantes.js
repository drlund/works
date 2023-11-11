const { OrdemServConsts } = use('Constants')
const { TIPO_PARTICIPACAO, TIPO_VINCULO } = OrdemServConsts;
const ordemModel = use('App/Models/Mysql/OrdemServ/Ordem');
const participanteExpandidoModel = use('App/Models/Mysql/OrdemServ/ParticipanteExpandido');
const naoPassivelAssinatura = use('App/Commons/OrdemServ/naoPassivelAssinatura');
const { registrarAtividadeAplicacao, removeRegistroAtividadeAplicacao } = use('App/Commons/OrdemServ/OrdemServUtils');
const exception = use('App/Exceptions/Handler');
const { getOneFunci, getFuncisByPrefixo,
        getComposicaoComite, getFuncisByNomeCargo } = use("App/Commons/Arh");
const _ = require('lodash');


/**
 * Metodo principal que realiza a expansao inicial dos designantes ou designandos de
 * uma ordem de serviço.
 * 
 * @param {*} idOrdem 
 * @param {*} tipoPartExpandir - designante | designado
 */
async function expandirParticipantes(idOrdem, tipoPartExpandir = TIPO_PARTICIPACAO.DESIGNANTE, mantemVinculosAnteriores = false) {

  let idAtividadeApp = null;

  try {

    //inclui log da atividade na tabela de utilizacao
    idAtividadeApp = await registrarAtividadeAplicacao(`expandirParticipantes - ${tipoPartExpandir}`, idOrdem);
    
    //obtem os dados da ordem com os participantes edicao do tipo a expandir solicitado
    let ordemAtual = await ordemModel.findBy('id', idOrdem);

    if (!ordemAtual) {
      throw new exception("Ordem de serviço não encontrada!", 400);
    }

    let listaParticEdicao = await ordemAtual
      .participantesEdicao()
      .where('ativo', 1)
      .where('tipo_participacao', tipoPartExpandir)
      .fetch();

    listaParticEdicao = listaParticEdicao.toJSON();

    for (const vinculoEdicao of listaParticEdicao) {
      let { id,
            id_tipo_vinculo, 
            matricula,
            prefixo,
            cargo_comissao,
            codigo_comite          
          } = vinculoEdicao;

      let qtdPartAnteriores = await participanteExpandidoModel.query().where('id_part_edicao', id).getCount();

      if (qtdPartAnteriores && mantemVinculosAnteriores) {
        //se ja houver participantes expandidos e deseja manter os vinculos anteriores
        //passa para o proximo vinculo a expandir.
        continue;
      }

      //remove possiveis vinculos anteriores para o id de edicao
      await participanteExpandidoModel.query().where('id_part_edicao', id).delete();

      //verifica o tipo de vinculo e faz a expansao correspondente
      switch (id_tipo_vinculo) {
        case TIPO_VINCULO.MATRICULA_INDIVIDUAL:
          await incluirParticipateExpandido(id, matricula);
          break;

        case TIPO_VINCULO.PREFIXO:
          await incluirFuncisPrefixo(idOrdem, id, prefixo);
          break;

        case TIPO_VINCULO.CARGO_COMISSAO:
          await incluirFuncisPorCargo(idOrdem, id, prefixo, cargo_comissao);
          break;

        case TIPO_VINCULO.COMITE:
          await incluirMembrosComite(id, prefixo, codigo_comite);
          break;
      }

    }

  } finally {
    //remove registro de utilizacao da tabela
    await removeRegistroAtividadeAplicacao(idAtividadeApp);
  }

}

/**
 * Inclui um participante na tabela participante expandido.
 * @param {*} id_part_edicao - id da tabela participante edicao. 
 * @param {*} matricula - matricula do novo funci
 * @param {*} cod_tipo_votacao - tipo de votacao do participante no comite
 */
async function incluirParticipateExpandido(id_part_edicao, matricula, cod_tipo_votacao = 0) {
  try {
    const funci = await getOneFunci(matricula);
    const assinaturaNaoPossivel = await naoPassivelAssinatura(funci.codSituacao, matricula);

    let dadosFunci = {
      id_part_edicao,
      prefixo: funci.dependencia.prefixo,
      matricula,
      nome: funci.nome,
      uor_participante: parseInt(funci.dependencia.uor),
      assinou: 0,
      cod_tipo_votacao,
      nao_passivel_assinatura: assinaturaNaoPossivel
    }

    //verificando se o funci já esta na tabela com o mesmo id_part_edicao
    //nao permite duplicar o participante
    const wasInserted = await participanteExpandidoModel.query()
      .where('id_part_edicao', id_part_edicao)
      .where('matricula', matricula)
      .first();

    if (wasInserted) {
      return null
    }

    const insertedPartic = await participanteExpandidoModel.create(dadosFunci);
    //retorna o id do novo participante criado
    return { id: insertedPartic.id, nao_passivel_assinatura: insertedPartic.nao_passivel_assinatura };
  } catch (err) {
    //nothing to do...
    //se nao achou o funci na base - simplesmente ignora
    //acontece em casos onde a composicao do comite está desatualizada,
    //e algum dos membros aposentou, por exemplo.
    return null
  }
}

/**
 * Obtem os membros do comite e os insere na tabela participante expandido.
 * @param {*} id 
 * @param {*} prefixo 
 * @param {*} codigoComite - codigo do comite retornado do db2
 */
async function incluirMembrosComite(id, prefixo, codigoComite) {
  let membros = await getComposicaoComite(prefixo, codigoComite);

  if (membros) {
    for (const membro of membros) {
      let matricula = membro.CD_FUN;
      let codTipoVotacao = membro.CD_TIP_VOT;
      await incluirParticipateExpandido(id, matricula, codTipoVotacao);
    }
  }
}

/**
 * Metodo que inclui todos os funcionarios de um prefixo na tabela participante expandido.
 * 
 * @param {*} idOrdem 
 * @param {*} idPartEdicao 
 * @param {*} prefixo 
 */
async function incluirFuncisPrefixo(idOrdem, idPartEdicao, prefixo) {
  let listaDesignantes = await getMatriculasDesignantes(idOrdem);
  let funcis = await getFuncisByPrefixo(prefixo);
  
  for (const funci of funcis) {
    if (!listaDesignantes.includes(funci.matricula)) {
      await incluirParticipateExpandido(idPartEdicao, funci.matricula);
    }
  }
}

/**
 * Metodo que inclui todos os funcionarios de um prefixo que possuem o cargo especificado
 * na tabela participante expandido.
 * 
 * @param {*} idOrdem 
 * @param {*} idPartEdicao 
 * @param {*} prefixo 
 * @param {*} nomeCargo 
 */
async function incluirFuncisPorCargo(idOrdem, idPartEdicao, prefixo, nomeCargo) {
  //obtem as matriculas dos designantes
  let listaDesignantes = await getMatriculasDesignantes(idOrdem);
  let funcis = await getFuncisByNomeCargo(prefixo, [nomeCargo]);
  
  for (const funci of funcis) {
    if (!listaDesignantes.includes(funci.matricula)) {
      await incluirParticipateExpandido(idPartEdicao, funci.matricula);
    }
  }
}

/**
 * Metodo utilitario que obtem um array com as matriculas dos designantes de uma ordem.
 * @param {Integer} - id da ordem
 */
async function getMatriculasDesignantes(idOrdem) {
  let ordemAtual = await ordemModel.findBy('id', idOrdem);

  if (!ordemAtual) {
    throw new exception("Ordem de serviço não encontrada!", 400);
  }

  //obtem os ids de todos os designantes da ordem edicao
  let idsDesignantes = await ordemAtual
    .participantesEdicao()
    .where('tipo_participacao', "Designante")    
    .fetch();

  idsDesignantes = idsDesignantes.toJSON();
  idsDesignantes = _.map(idsDesignantes, 'id');

  //obtem as matriculas dos desginantes na participante expandido
  let listaDesignantes = await participanteExpandidoModel
    .query()
    .setVisible(['matricula'])
    .whereIn('id_part_edicao', idsDesignantes)
    .fetch();

  listaDesignantes = listaDesignantes.toJSON();
  listaDesignantes = _.map(listaDesignantes, 'matricula');

  return listaDesignantes;
}

module.exports = {
  expandirParticipantes,
  incluirParticipateExpandido,
  getMatriculasDesignantes
};