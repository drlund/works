"use strict";

const exception = use("App/Exceptions/Handler");
const visao = use("App/Commons/Mtn/ComiteMtn/Constants");
const Database = use("Database");

class UcIncluirMonitoramento {
  constructor(monitoramentoRepository) {
    this.monitoramentoRepository = monitoramentoRepository;
  }

  async validate(dadosMonitoramento, dadosUsuario) {
    const camposObrigatorios = [
      "ativa",
      "descricao",
      "nomeReduzido",
      "nomeVisao",
    ];

    for (const campoObrigatorio of camposObrigatorios) {
      if (dadosMonitoramento[campoObrigatorio] === undefined) {
        throw new exception("Campos obrigatórios não foram informados!", 400);
      }
    }

    this.dadosMonitoramento = {
      ativa: dadosMonitoramento.ativa,
      origem_visao: dadosMonitoramento.nomeVisao,
      desc_visao: dadosMonitoramento.descricao,
      nome_reduzido: dadosMonitoramento.nomeReduzido,
    };
    this.dadosUsuario = dadosUsuario;
  }

  async run() {
    const trx = await Database.connection("pgMtn").beginTransaction();

    try {
      await this.monitoramentoRepository.salvarMonitoramento(
        {
          ...this.dadosMonitoramento,
          status_id: visao.STATUS.PENDENTE_INCLUSAO_PARAMETROS,
        },
        {
          matricula: this.dadosUsuario.chave,
          descricao: visao.ACOES_TIMELINE.CRIAR_MONITORAMENTO,
        },
        trx
      );
      await trx.commit();
    } catch (error) {
      await trx.rollback();
      throw new exception(error, 500);
    }
  }
}

module.exports = UcIncluirMonitoramento;
