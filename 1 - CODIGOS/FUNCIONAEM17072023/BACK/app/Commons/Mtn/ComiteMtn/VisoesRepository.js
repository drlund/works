"use strict";

const MtnVisoesModel = use("App/Models/Postgres/MtnVisao");
const MtnVisoesLinhaTempo = use("App/Models/Postgres/MtnVisoesLinhaTempo");
const exception = use("App/Exceptions/Handler");
const { STATUS_PARAMETROS, PREFIXO_SUPERADM, COD_COMITE_ADM } = use(
  "App/Commons/Mtn/ComiteMtn/Constants"
);

const { getComposicaoComite } = use("App/Commons/Arh");

const STATUS_PARA_VOTACAO = [
  STATUS_PARAMETROS.PENDENTE_VOTACAO,
  STATUS_PARAMETROS.EM_VOTACAO,
  STATUS_PARAMETROS.ALTERACAO_PENDENTE,
];

class VisoesRepository {
  async filtrarVisoesPorStatus(status) {
    const visoes = await MtnVisoesModel.query()
      .whereIn("status_id", status)
      .with("status")
      .fetch();
    return visoes.toJSON();
  }

  async getDadosMonitoramento(idVisao) {
    const visao = await MtnVisoesModel.query()
      .where("id", idVisao)
      .with("status")
      .with("linhaTempo")
      .with("versaoAtual", (builder) => {
        builder.with("documento");
        builder.with("status");
        builder.with("comite", (builder) => {
          builder.with("tipoVoto");
          builder.with("anexos");
        });
      })
      .with("versoes", (builder) => {
        builder.with("documento");
        builder.with("status");
      })
      .first();

    return visao.toJSON();
  }

  async atualizarVersaoAtual(idVisao, versaoId, trx) {
    const visao = await MtnVisoesModel.find(idVisao);
    visao.versao_atual_id = versaoId;
    await visao.save(trx);
  }

  async atualizarStatusVisao(idVisao, novoStatus, trx) {
    const visao = await MtnVisoesModel.find(idVisao);
    visao.status_id = novoStatus;
    await visao.save(trx);
  }

  async existeMonitoramento(idVisao) {
    const monitoramento = await MtnVisoesModel.find(idVisao);
    return monitoramento ? true : false;
  }

  async salvarMonitoramento(dadosMonitoramento, dadosTimeline, trx) {
    const novoMonitoramento = await MtnVisoesModel.create(
      dadosMonitoramento,
      trx
    );

    await novoMonitoramento.linhaTempo().create(
      {
        matricula_funci_acao: dadosTimeline.matricula,
        descricao: dadosTimeline.descricao,
      },
      trx
    );
  }

  async incluirLinhaTempo(idVisao, matricula, descricao, trx) {
    await MtnVisoesLinhaTempo.create(
      { visao_id: idVisao, matricula_funci_acao: matricula, descricao },
      trx
    );
  }

  /**
   *
   *  Verifica se um determinado funcionário tem acesso para visualizar as votações. A regra para poder visualizar
   *  as votações é ser ou ter sido membro de votação de parâmetros do MTN.
   *
   * @param {*} matricula Matrícula do funcionário que se deseja verificar se pode visualizar as votações
   * @returns
   */

  async podeVisualizarVotacoes(matricula) {
    const comite = await getComposicaoComite(PREFIXO_SUPERADM, COD_COMITE_ADM);

    const isFunciMembroComite =
      comite.filter((membroComite) => {
        return membroComite.CD_FUN === matricula;
      }).length > 0;

    return isFunciMembroComite;
  }

  async existeVisao(idVisao) {
    const visao = await MtnVisoesModel.find(idVisao);

    return visao ? true : false;
  }

  async getIdVersaoAtual(idVisao) {
    const visao = await MtnVisoesModel.find(idVisao);
    return visao.versao_atual_id;
  }

  async getVersaoAtual(idVisao) {
    const visao = await MtnVisoesModel.find(idVisao);
    await visao.load("versaoAtual");
    if (visao.versaoAtual) {
      throw new exception(
        `VisoesRepository:getVersaoAtual - A visão de id ${idVisao} não tem versao atual registrado `,
        500
      );
    }
    return visao.versaoAtual;
  }

  async getMonitoramentosParaVotacao(matricula) {
    const monitoramentos = await MtnVisoesModel.query()
      .whereHas("versaoAtual", (builder) => {
        builder.whereIn("status_versao_id", STATUS_PARA_VOTACAO);
      })
      .with("linhaTempo")
      .with("status")
      .with("versaoAtual", (builder) => {
        builder.with("status");
      })
      .fetch();
    return monitoramentos.toJSON();
  }
}

module.exports = VisoesRepository;
