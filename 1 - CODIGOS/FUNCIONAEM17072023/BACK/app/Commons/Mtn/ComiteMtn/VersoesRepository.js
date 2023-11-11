"use strict";

const { create } = require("lodash");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const VersoesModel = use("App/Models/Postgres/MtnVisoesVersoes");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const VersaoDocumentoModel = use(
  "App/Models/Postgres/MtnVisoesVersoesDocumentos"
);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ComiteModel = use("App/Models/Postgres/MtnVisoesVersoesVotacoesComite");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const ComiteAnexoModel = use(
  "App/Models/Postgres/MtnVisoesVersoesVotacoesComiteAnexos"
);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const anexoModel = use("App/Models/Postgres/MtnAnexo");

const BASE_PATH_MODULE = "App/Commons/Mtn/ComiteMtn";

const constants = use(`${BASE_PATH_MODULE}/Constants`);

const { TIPOS_VOTOS } = constants;

const requestFileToAnexoMtn = use("App/Commons/Mtn/requestFileToAnexoMtn");
const moment = require("moment");
class VersaoRepository {
  async salvarVersao(dadosVersao, trx) {
    const createdVersao = await VersoesModel.create(dadosVersao, trx);

    return createdVersao;
  }

  async getIdVisao(idVersao) {
    const versao = await VersoesModel.find(idVersao);
    return versao.toJSON().visao_id;
  }

  async getDadosVersao(idVersao) {
    const versao = await VersoesModel.find(idVersao);
    await versao.load("documento");
    await versao.load("visao", (builder) => {
      builder.with("status");
    });
    await versao.load("status");
    await versao.load("comite", (builder) => {
      builder.with("anexos", (builder) => {
        {
          builder.select([
            "id",
            "nome_arquivo",
            "extensao",
            "mime_type",
            "nome_original",
          ]);
        }
      });
    });

    return versao.toJSON();
  }

  async atualizarStatusVersaoByVisao(idVisao, idStatusVersao, trx) {
    await VersoesModel.query()
      .where("visao_id", idVisao)
      .transacting(trx)
      .update({ status_versao_id: idStatusVersao });
  }

  async atualizarStatusVersao(idVersao, idStatusVersao, trx) {
    const versao = await VersoesModel.find(idVersao);
    versao.status_versao_id = idStatusVersao;
    await versao.save(trx);
  }

  async salvarDocumento(dadosDocumento, trx) {
    const createdDocumento = await VersaoDocumentoModel.create(
      dadosDocumento,
      trx
    );
    return createdDocumento;
  }

  async salvarComite(membrosComite, trx) {
    const createdComites = await ComiteModel.createMany(membrosComite, trx);
    return createdComites;
  }

  async getComiteVotacao(versaoId, trx) {
    const comite = await ComiteModel.query()
      .transacting(trx)
      .where("versao_id", versaoId)
      .fetch();

    return comite.toJSON();
  }

  async finalizarVotacoesPendentes(versaoId, trx) {
    await ComiteModel.query()
      .transacting(trx)
      .where("versao_id", versaoId)
      .whereNull("votado_em")
      .whereNull("tipo_voto_id")
      .update({
        tipo_voto_id: TIPOS_VOTOS.ENCERRADA,
        votado_em: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
  }

  async excluirVotacoes(versaoId, trx) {
    await ComiteModel.query()
      .transacting(trx)
      .where("versao_id", versaoId)
      .update({
        tipo_voto_id: TIPOS_VOTOS.CANCELADA,
        votado_em: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
  }

  async filtrarVersoes(filtros) {
    const filtrosAceitos = ["status_versao_id", "visao_id", "incluido_por"];
    const query = VersoesModel.query();
    for (const nomeFiltro of Object.keys(filtros)) {
      if (filtrosAceitos.includes(nomeFiltro)) {
        query.where(nomeFiltro, filtros[nomeFiltro]);
      }
    }

    const versoes = await query.with("visao").with("status").fetch();

    return versoes.toJSON();
  }

  async limparVotoVersao({ idVersao, matriculaVotante, trx }) {
    await ComiteModel.query()
      .where("versao_id", idVersao)
      .where("matricula", matriculaVotante)
      .update(
        { votado_em: null, tipo_voto_id: null, justificativa: null },
        trx
      );
  }

  async getVotoParaAlteracao(idVersao) {
    const voto = await ComiteModel.query()
      .where("versao_id", idVersao)
      .where("tipo_voto_id", TIPOS_VOTOS.ALTERAR)
      .first();

    return voto;
  }

  async registrarVoto(dadosVoto, trx) {
    const comite = await ComiteModel.query()
      .where("versao_id", dadosVoto.versao_id)
      .where("matricula", dadosVoto.matriculaVotante)
      .first();

    comite.tipo_voto_id = dadosVoto.tipo_voto;
    comite.justificativa = dadosVoto.justificativa;
    comite.votado_em = moment().format("YYYY-MM-DD HH:mm:ss");

    await comite.save(trx);

    for (const anexo of dadosVoto.anexos) {
      const dadosAnexo = requestFileToAnexoMtn(anexo);
      const novoAnexo = await anexoModel.create(dadosAnexo, trx);
      await ComiteAnexoModel.create(
        {
          id_anexo: novoAnexo.id,
          id_versao_votacoes_comite: comite.id,
        },
        trx
      );
    }
  }
}

module.exports = VersaoRepository;
