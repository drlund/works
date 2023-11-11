const Database = use("Database");

const {
  ACOES,
  SITUACOES,
  ESCALOES_INT,
  STATUS,
  ETAPAS,
  LOCALIZACOES,
  PARECER_STRING,
  DISPENSA_DEVIDO,
  // @ts-ignore
} = require("../Constants");
const Manifestacao = require("../Entidades/Manifestacao");

const SolicitacoesModel = use("App/Models/Mysql/FlexCriterios/Solicitacoes");
const ManifestacoesModel = use("App/Models/Mysql/FlexCriterios/Manifestacoes");
const ManifestacoesDispensa = use("App/Models/Mysql/FlexCriterios/Dispensas");

class Manifestacoes {
  async getManifestacoes() {
    const consulta = await ManifestacoesModel.all();

    return consulta?.toJSON() ?? null;
  }

  // @ts-ignore
  async getOrdemManif(id_solicitacao, trx = null) {
    const consulta = await ManifestacoesModel.query()
      .where("id_solicitacao", id_solicitacao)
      .transacting(trx)
      .max("ordemManifestacao as max");

    // @ts-ignore
    const maxOrdemManifestacao = parseInt(consulta[0].max);

    return maxOrdemManifestacao;
  }

  // @ts-ignore
  async getManifestacoesPendentesByIdSolicitacao(id_solicitacao, trx) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        id_situacao: SITUACOES.PENDENTE,
      })
      .whereIn("id_acao", [ACOES.MANIFESTACAO, ACOES.DEFERIMENTO])
      .transacting(trx)
      .fetch();

    return consulta?.toJSON() ?? null;
  }

  // @ts-ignore
  async getManifestacoesPendentesByPrefixo(id_solicitacao, prefixo, trx) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        prefixo,
        id_situacao: SITUACOES.PENDENTE,
      })
      .whereIn("id_acao", [ACOES.MANIFESTACAO, ACOES.DEFERIMENTO])
      .transacting(trx)
      .fetch();

    return consulta?.toJSON() ?? null;
  }

  // @ts-ignore
  async novaManifestacao(dados, trx = null) {
    const dadosInsercao = Manifestacao.transformNovaManifestacao(dados);
    const manifestacao = await ManifestacoesModel.create(dadosInsercao, trx);

    return manifestacao;
  }

  // @ts-ignore
  async novaManifestacaoCancelamento(dados, trx = null) {
    const dadosInsercao =
      Manifestacao.transformNovaManifestacaoDesfavoravel(dados);
    const manifestacao = await ManifestacoesModel.create(dadosInsercao, trx);

    return manifestacao;
  }

  async getCompAnalisePend(idSolicitacao, trx) {
    const manifestacao = await ManifestacoesModel.query()
      .where({
        id_solicitacao: idSolicitacao,
        prefixo: "0000",

        id_acao: 9,
        id_situacao: 1,
      })
      .transacting(trx)
      .first();

    return manifestacao ?? null;
  }

  async findManifestacao(
    // @ts-ignore
    dadosManifestacao,
    // @ts-ignore
    usuario,
    // @ts-ignore
    trx,
    id_acao = ACOES.MANIFESTACAO,
    id_situacao = SITUACOES.PENDENTE
  ) {
    const manifestacao = await ManifestacoesModel.query()
      .where({
        id_solicitacao: dadosManifestacao.id_solicitacao,
        /* prefixo: usuario.prefixo, */
        funcao: String(usuario.cod_funcao).padStart(5, "0"),
        id_acao,
        id_situacao,
      })
      .whereIn("prefixo", [usuario.prefixo, usuario?.pref_regional])
      .transacting(trx)
      .first();

    return manifestacao ?? null;
  }

  // @ts-ignore
  async findManifestacaoById(idManifestação) {
    const manifestacao = await ManifestacoesModel.query()
      .where({
        id: idManifestação,
      })
      .first();

    return manifestacao ?? null;
  }

  async atualizarComplementoPendente(
    // @ts-ignore
    idComplemento,
    // @ts-ignore
    dadosManifestacao,
    // @ts-ignore
    trx = null
  ) {
    const manifestacao = await this.findManifestacaoById(idComplemento);

    // @ts-ignore
    if (!manifestacao || manifestacao.id_situacao != SITUACOES.PENDENTE) {
      return null;
    }
    // @ts-ignore
    manifestacao.merge(dadosManifestacao);

    // @ts-ignore
    await manifestacao.save(trx);

    // @ts-ignore
    return manifestacao.id;
  }

  // @ts-ignore
  async atualizarManifestacaoFavoravel(dadosManifestacao, usuario, trx = null) {
    const manifestacao = await this.findManifestacao(
      dadosManifestacao,
      usuario,
      trx
    );
    //Manifestação será nula se não estiver cadastrado na db.manifestações,
    //se tiver ele recupera, precisa testar se ja foi registrada
    // @ts-ignore
    if (!manifestacao || manifestacao.id_situacao != SITUACOES.PENDENTE) {
      return null;
    }

    // @ts-ignore
    manifestacao.merge(dadosManifestacao);

    // @ts-ignore
    await manifestacao.save(trx);

    // @ts-ignore
    return manifestacao.id;
  }

  async atualizarManifestacaoDesfavoravel(
    // @ts-ignore
    dadosManifestacao,
    // @ts-ignore
    usuario,
    // @ts-ignore
    trx = null
  ) {
    const manifestacaoCanceladora = await this.findManifestacao(
      dadosManifestacao,
      usuario,
      trx
    );

    if (!manifestacaoCanceladora) {
      return null;
    }

    const manifestacoesPendentes =
      await this.getManifestacoesPendentesByIdSolicitacao(
        dadosManifestacao.id_solicitacao,
        trx
      );
    // @ts-ignore
    if (manifestacoesPendentes.length) {
      // @ts-ignore
      const justificativaVotoDesfavoravel = await ManifestacoesDispensa.findBy({
        id: SITUACOES.DISPENSADA,
      });

      // @ts-ignore
      manifestacoesPendentes.forEach(async (manifestacao) => {
        // @ts-ignore
        if (manifestacao.id != manifestacaoCanceladora.id) {
          await ManifestacoesModel.query().where("id", manifestacao.id).update({
            id_acao: 8 /* (dispensado) */,
            id_situacao: 3 /* (dispensado) */,
            // @ts-ignore
            texto: justificativaVotoDesfavoravel.descricao,
            matricula: usuario.matricula,
            nome: usuario.nome_usuario,
          });
        } else {
          await ManifestacoesModel.query().where("id", manifestacao.id).update({
            id_acao: 2 /* (dispensado) */,
            id_situacao: 2 /* (dispensado) */,
            texto: dadosManifestacao.texto,
            parecer: PARECER_STRING.DESFAVORAVEL,
            matricula: usuario.matricula,
            nome: usuario.nome_usuario,
          });
        }
      });
    }

    // @ts-ignore
    return manifestacaoCanceladora.id;
  }

  // @ts-ignore
  async temManifestacaoPendente(id_solicitacao, trx = null) {
    const consulta = await ManifestacoesModel.query()
      // @ts-ignore
      .select(Database.raw("COUNT (id) as pendentes"))
      .where({
        id_solicitacao,
        /*   id_acao: ACOES.MANIFESTACAO, */
        id_situacao: SITUACOES.PENDENTE,
      })
      .whereIn("id_acao", [ACOES.MANIFESTACAO, ACOES.COMPLEMENTO])
      .whereNotIn("prefixo", ["0000"])
      .transacting(trx)
      .first();

    const resposta = consulta?.toJSON() ?? null;
    if (resposta) {
      // @ts-ignore
      return !!resposta.pendentes;
    }

    return false;
  }

  // @ts-ignore
  async novaAnalise(dados, trx = null) {
    const analise = await ManifestacoesModel.create(dados, trx);

    return analise;
  }

  // @ts-ignore
  async inserirDespachos(dados, trx = null) {
    const despachoBase = {
      id_solicitacao: dados.id_solicitacao,
      id_acao: ACOES.DEFERIMENTO,
      id_situacao: SITUACOES.PENDENTE,
      prefixo: dados.prefixo,
      nomePrefixo: dados.nomePrefixo,
    };

    const funcao = {
      // Comitê UE
      // @ts-ignore
      1: (despacho) => {
        const lista = new Array(dados.quorum).fill({
          ...despacho,
          id_escalao: ESCALOES_INT.COMITE,
        });

        if (despacho.coordenador) {
          lista.push({
            ...despacho,
            id_escalao: ESCALOES_INT.COMITE,
            ordemManifestacao: 1,
          });
        }
      },
      // Administrador UE
      // @ts-ignore
      2: (despacho) => {
        return {
          ...despacho,
          id_escalao: ESCALOES_INT.ADMINISTRADOR,
        };
      },
      // Membro do Comitê UE
      // @ts-ignore
      3: (despacho) => {
        return {
          ...despacho,
          id_escalao: ESCALOES_INT.MEMBRO_COMITE,
        };
      },
      // Matrícula
      // @ts-ignore
      4: (despacho) => {
        return {
          ...despacho,
          id_escalao: ESCALOES_INT.MATRICULA,
          matricula: dados.matricula,
          nome: dados.nome,
          funcao: dados.funcao,
          nomeFuncao: dados.nomeFuncao,
        };
      },
    };

    // @ts-ignore
    const dadosDespacho = funcao[dados.idEscalao](despachoBase);
    // @ts-ignore
    const despacho = await ManifestacoesModel.create(dadosDespacho, trx);
  }

  // @ts-ignore
  async qtdeDespachoPendentes(id_solicitacao, trx = null) {
    const consulta = await ManifestacoesModel.query()
      // @ts-ignore
      .select(Database.raw("COUNT (id) as pendentes"))
      .where({
        id_solicitacao,
        id_acao: ACOES.DESPACHO,
        id_situacao: SITUACOES.PENDENTE,
      })
      .transacting(trx)
      .first();

    const resposta = consulta?.toJSON() ?? null;
    if (resposta) {
      // @ts-ignore
      return resposta.pendentes;
    }

    return 0;
  }

  async getManifestacoesDeferimento(
    // @ts-ignore
    id_solicitacao,
    // @ts-ignore
    listaDiretorias = [],
    // @ts-ignore
    trx = null,
    id_situacao = [SITUACOES.REGISTRADA, SITUACOES.DISPENSADA]
  ) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        id_acao: ACOES.DEFERIMENTO,
        /*  id_situacao, */
      })
      .whereIn("prefixo", listaDiretorias)
      .whereIn("id_situacao", id_situacao)
      .transacting(trx)
      .fetch();
    return consulta?.toJSON() ?? null;
  }

  // @ts-ignore
  async atualizarDeferimentoFavoravel(dadosManifestacao, usuario, trx = null) {
    const manifestacao = await this.findManifestacao(
      dadosManifestacao,
      usuario,
      trx
    );
    //Manifestação será nula se não estiver cadastrado na db.manifestações,
    //se tiver ele recupera, precisa testar se ja foi registrada
    // @ts-ignore
    if (!manifestacao || manifestacao.id_situacao != SITUACOES.PENDENTE) {
      return null;
    }

    // @ts-ignore
    manifestacao.merge(dadosManifestacao);

    // @ts-ignore
    await manifestacao.save(trx);

    return manifestacao.id;
  }

  async getDeferimentoByMatricula(
    id_solicitacao,
    matricula,
    id_acao = ACOES.DEFERIMENTO,
    id_situacao = SITUACOES.PENDENTE,
    trx
  ) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        matricula,
        id_acao,
        id_situacao,
      })
      .transacting(trx)
      .first();
    return consulta ?? null;
  }

  async getDeferimentoByFuncaoEPrefixo(
    // @ts-ignore
    id_solicitacao,
    // @ts-ignore
    funcao,
    // @ts-ignore
    prefixo,
    id_acao = ACOES.DEFERIMENTO,
    id_situacao = SITUACOES.PENDENTE,
    // @ts-ignore
    trx
  ) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_acao,
        id_solicitacao,
        prefixo,
        id_situacao,
        funcao: String(funcao).padStart(5, "0"),
      })
      .transacting(trx)
      .first();

    return consulta ?? null;
  }

  // @ts-ignore
  async algumTipoSolicitacaoTemOperador(id, trx) {
    const consulta = await SolicitacoesModel.query()
      .where({
        id,
      })
      .with("tipos")
      .transacting(trx)
      .first();

    const toJSON = consulta.toJSON() ?? null;

    // @ts-ignore
    let operadorCadastrado = toJSON.tipos.find(
      // @ts-ignore
      (elemento) => elemento.possuiOperacional == 1
    )
      ? true
      : false;

    return operadorCadastrado;
  }

  async atualizaManifestacaoDeferidor(
    // @ts-ignore
    deferimentoPendenteByMatricula,
    // @ts-ignore
    dadosAnalise,
    // @ts-ignore
    trx = null
  ) {
    deferimentoPendenteByMatricula.merge(dadosAnalise);

    const temDeferimentoPendente = await this.temDeferimentoPendente(
      dadosAnalise.id_solicitacao,
      trx
    );

    // @ts-ignore
    if (temDeferimentoPendente?.length == 1) {
      let novaEtapa = {};
      const tiposSolicitacoes = await this.algumTipoSolicitacaoTemOperador(
        dadosAnalise.id_solicitacao,
        trx
      );

      if (tiposSolicitacoes) {
        novaEtapa = {
          id_status: STATUS.FINALIZANDO,
          id_localizacao: LOCALIZACOES.GEPES,
          id_etapa: ETAPAS.FINALIZANDO,
        };
      } else {
        novaEtapa = {
          id_status: STATUS.ENCERRADO,
          id_localizacao: LOCALIZACOES.DIRETORIA,
          id_etapa: ETAPAS.ENCERRADO,
        };
      }

      const solicitacao = await SolicitacoesModel.find(
        dadosAnalise.id_solicitacao
      );
      solicitacao.merge(novaEtapa);

      await solicitacao.save(trx);
    }

    return await deferimentoPendenteByMatricula.save(trx);
  }

  // @ts-ignore
  async dispensaManifestacaoDeferidor(dispensa, trx = null) {
    return await ManifestacoesModel.create(dispensa, trx);
  }

  async getFirstDeferimentoPendenteSemMatriculaEFuncaoVinculada(
    // @ts-ignore
    id_solicitacao,
    // @ts-ignore
    prefixo,
    // @ts-ignore
    trx = null
  ) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        prefixo,
        matricula: null,
        funcao: null,
        id_acao: ACOES.DEFERIMENTO,
        id_situacao: SITUACOES.PENDENTE,
      })
      .transacting(trx)
      .first();
    return consulta ?? null;
  }

  // @ts-ignore
  async temDeferimentoPendente(id_solicitacao, trx) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        id_acao: ACOES.DEFERIMENTO,
        id_situacao: SITUACOES.PENDENTE,
      })
      .transacting(trx)
      .fetch();
    return consulta.toJSON() ?? null;
  }

  async findDeferimentoByDiretoriaQualquerSituacao(
    // @ts-ignore
    id_solicitacao,
    // @ts-ignore
    diretoria,
    // @ts-ignore
    trx = null
  ) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        id_acao: ACOES.DEFERIMENTO,
        prefixo: diretoria,
      })
      .transacting(trx)
      .first();

    return consulta ?? null;
  }

  async encerraSolicitacaoAntecipadamente(
    // @ts-ignore
    idsolicitacao,
    // @ts-ignore
    idDispensa,
    // @ts-ignore
    usuario,
    // @ts-ignore
    trx = null
  ) {
    const manifestacoesPendentes =
      await this.getManifestacoesPendentesByIdSolicitacao(idsolicitacao, trx);

    // @ts-ignore
    if (manifestacoesPendentes.length) {
      // @ts-ignore
      const justificativaVotoDesfavoravel = await ManifestacoesDispensa.findBy({
        id: idDispensa,
      });

      // @ts-ignore
      manifestacoesPendentes.forEach(async (manifestacao) => {
        await ManifestacoesModel.query()
          .where("id", manifestacao.id)
          .update({
            id_acao: 6 /* (cancelamento) */,
            id_situacao: 3 /* (dispensado) */,
            // @ts-ignore
            texto: justificativaVotoDesfavoravel.descricao,
            matricula: usuario.matricula,
            nome: usuario.nome_usuario,
            parecer: PARECER_STRING.DESFAVORAVEL,
          })
          // @ts-ignore
          .transacting(trx);
      });
    }
  }

  async deleteDeferimentosPendentes(id) {
    console.log("ta entrando no repository");
    console.log(id);
    await ManifestacoesModel.query()
      .where({
        id_solicitacao: id,
        id_situacao: SITUACOES.PENDENTE,
        id_acao: ACOES.DEFERIMENTO,
      })
      .delete();
  }

  async deleteDeferimentosByDiretoriaESolicitacao(id, prefixo) {
    console.log("ta entrando no repository");
    console.log(id);
    await ManifestacoesModel.query()
      .where({
        id_solicitacao: id,
        prefixo: prefixo,
        id_acao: ACOES.DEFERIMENTO,
      })
      .delete();
  }

  // @ts-ignore
  async avocarSolicitacao(idsolicitacao, idDispensa, usuario, trx = null) {
    const manifestacoesPendentes =
      await this.getManifestacoesPendentesByIdSolicitacao(idsolicitacao, trx);

    // @ts-ignore
    if (manifestacoesPendentes.length) {
      // @ts-ignore
      const justificativaVotoDesfavoravel = await ManifestacoesDispensa.findBy({
        id: idDispensa,
      });

      // @ts-ignore
      manifestacoesPendentes.forEach(async (manifestacao) => {
        if (manifestacao.id_acao == 5 && manifestacao.id_situacao == 1) {
          await ManifestacoesModel.query()
            .where("id", manifestacao.id)
            .delete();
        } else {
          await ManifestacoesModel.query()
            .where("id", manifestacao.id)
            .update({
              id_acao: 10 /* (cancelamento) */,
              id_situacao: 3 /* (dispensado) */,
              // @ts-ignore
              texto: justificativaVotoDesfavoravel.descricao,
              matricula: usuario.matricula,
              nome: usuario.nome_usuario,
              parecer: PARECER_STRING.FAVORAVEL,
            })
            // @ts-ignore
            .transacting(trx);
        }
      });
    }
  }

  async dispensarPendentesPorComplementar(
    // @ts-ignore
    idsolicitacao,
    // @ts-ignore
    prefixo,
    // @ts-ignore
    usuario,
    // @ts-ignore
    trx = null
  ) {
    const manifestacoesPendentes =
      await this.getManifestacoesPendentesByPrefixo(
        idsolicitacao,
        prefixo,
        trx
      );

    // @ts-ignore
    if (manifestacoesPendentes.length) {
      // @ts-ignore
      const justificativaVotoDesfavoravel = await ManifestacoesDispensa.findBy({
        id: DISPENSA_DEVIDO.COMPLEMENTO_SOLICITADO,
      });

      // @ts-ignore
      manifestacoesPendentes.forEach(async (manifestacao) => {
        await ManifestacoesModel.query()
          .where("id", manifestacao.id)
          .update({
            id_acao: ACOES.DISPENSADO /* (dispensado) */,
            id_situacao: SITUACOES.DISPENSADA /* (dispensado) */,
            // @ts-ignore
            texto: justificativaVotoDesfavoravel.descricao,
            matricula: usuario.matricula,
            nome: usuario.nome_usuario,
            parecer: PARECER_STRING.FAVORAVEL,
          })
          // @ts-ignore
          .transacting(trx);
      });
    }
  }

  async getComplementoPendenteBySolicitacaoEPrefixo(
    id_solicitacao,
    prefixo,
    trx,
    id_acao = ACOES.COMPLEMENTO,
    id_situacao = SITUACOES.PENDENTE
  ) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        prefixo,
        id_acao,
        id_situacao,
      })
      .transacting(trx)
      .first();
    return consulta ?? null;
  }

  async deferimentoComplementarPendente(
    id_solicitacao,
    prefixo,
    trx,
    id_acao = ACOES.DEFERIMENTO,
    id_situacao = SITUACOES.PENDENTE
  ) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        prefixo,
        id_acao,
        id_situacao,
        isComplemento: "1",
      })
      .transacting(trx)
      .first();
    return consulta ?? null;
  }

  async getTodosComplementoPendenteBySolicitacaoEPrefixo(
    id_solicitacao,
    prefixo,
    trx,
    id_acao = ACOES.COMPLEMENTO,
    id_situacao = SITUACOES.PENDENTE
  ) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        prefixo,
        id_acao,
        id_situacao,
      })
      .transacting(trx)
      .fetch();
    return consulta.toJSON() ?? null;
  }

  async getLastManifestacaoByPrefixo(
    // @ts-ignore
    id_solicitacao,
    // @ts-ignore
    prefixo,
    id_situacao = SITUACOES.REGISTRADA
  ) {
    const consulta = await ManifestacoesModel.query()
      .where({
        id_solicitacao,
        prefixo,
        id_situacao,
      })
      .last();
    return consulta ?? null;
  }
}

module.exports = Manifestacoes;
