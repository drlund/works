"use strict";

const { STATUS } = require("../ComiteMtn/Constants");

const BASE_PATH_MODULE = "App/Commons/Mtn/ComiteMtn";

const constants = use(`${BASE_PATH_MODULE}/Constants`);
const exception = use("App/Exceptions/Handler");
const Database = use(`Database`);
const EntityComite = use(`${BASE_PATH_MODULE}/EntityComite`);
const { TIPOS_VOTOS, STATUS_PARAMETROS, ACOES_PARA_VOTACAO } = constants;
class UcVotar {
  constructor(versoesRepository, visoesRepository) {
    this.versoesRepository = versoesRepository;
    this.visoesRepository = visoesRepository;

    this.entityComite = new EntityComite();
  }

  /**
   *
   *  Valida os dados para o registro de um novo voto. São verificadas as seguintes propriedades:
   *
   *  tipoVoto
   *  justificativa
   *  anexos (Opcional)
   *  idVisao
   *
   *  Além disso verifica-se as seguintes regras:
   *
   *  1 - Se a visão indicada pelo parâmetro 'idVisao' existe.
   *  2 - Se a visão indicada pelo parâmetro 'idVisao' possui um parametro atual.
   *
   * @param {*} dadosVoto
   */
  async validate({ tipoVoto, justificativa, anexos, idVisao }, dadosUsuario) {
    if (!idVisao) {
      throw new exception("O id do monitoramento é obrigatório.", 400);
    }

    if (!tipoVoto) {
      throw new exception("É obrigatório o tipo do voto.", 400);
    }

    if (tipoVoto !== TIPOS_VOTOS.ALTERAR && tipoVoto !== TIPOS_VOTOS.APROVAR) {
      throw new exception("Tipo de voto inválido.", 400);
    }

    if (tipoVoto === TIPOS_VOTOS.ALTERAR && !justificativa) {
      throw new exception(
        "A justificativa é obrigatória para alteração dos parâmetros.",
        400
      );
    }

    const existeVisao = await this.visoesRepository.existeVisao(idVisao);

    if (!existeVisao) {
      throw new exception(`O monitoramento de id ${idVisao} não existe. `, 400);
    }

    const visao = await this.visoesRepository.getDadosMonitoramento(idVisao);

    if (!visao.versao_atual_id) {
      throw new exception(
        `Versão da visão de id ${this.idVisao} não existe. `,
        400
      );
    }

    if (
      visao.versaoAtual.status_visao_id === STATUS_PARAMETROS.ALTERACAO_PENDENTE
    ) {
      throw new exception(
        `Este parâmetro está com alteração em análise, não pode ser votado no momento. `,
        400
      );
    }

    const votoParaAlteracao = await this.versoesRepository.getVotoParaAlteracao(
      visao.versao_atual_id
    );

    if (votoParaAlteracao) {
      throw new exception(
        `Existe uma proposta de alteração nos parâmetros pendente de tratamento `,
        400
      );
    }

    this.visao = visao;
    this.dadosUsuario = dadosUsuario;
    this.idVisao = idVisao;
    this.tipoVoto = tipoVoto;
    this.justificativa = justificativa;
    this.anexos = anexos;
  }

  async run() {
    const trx = await Database.connection("pgMtn").beginTransaction();

    try {
      await this.versoesRepository.registrarVoto(
        {
          matriculaVotante: this.dadosUsuario.chave,
          versao_id: this.visao.versao_atual_id,
          tipo_voto: this.tipoVoto,
          justificativa: this.justificativa,
          anexos: this.anexos,
        },
        trx
      );

      const msgTimeline = this._getMsgTimeline();
      await this.visoesRepository.incluirLinhaTempo(
        this.idVisao,
        this.dadosUsuario.chave,
        msgTimeline,
        trx
      );

      await this._realizarAtualizacoesPorVoto(trx);

      await trx.commit();
    } catch (error) {
      await trx.rollback();
      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception(error, 500);
      }
    }
  }

  _getMsgTimeline() {
    switch (this.tipoVoto) {
      case TIPOS_VOTOS.ALTERAR:
        return `${this.dadosUsuario.chave} - ${this.dadosUsuario.nome_usuario} sugeriu alterações nos parâmetros.`;
      case TIPOS_VOTOS.APROVAR:
        return `${this.dadosUsuario.chave} - ${this.dadosUsuario.nome_usuario} aprovou os parâmetros propostos.`;
    }
  }

  async _realizarAtualizacoesPorVoto(trx) {
    switch (this.tipoVoto) {
      case TIPOS_VOTOS.ALTERAR:
        await this.versoesRepository.atualizarStatusVersao(
          this.visao.versao_atual_id,
          STATUS_PARAMETROS.ALTERACAO_PENDENTE,
          trx
        );
        break;

      case TIPOS_VOTOS.APROVAR:
        const isVotacaoFinalizadaComoAprovada =
          await this._isVotacaoFinalizadaComoAprovada(trx);

        if (isVotacaoFinalizadaComoAprovada) {
          const visao = await this.visoesRepository.getDadosMonitoramento(
            this.idVisao
          );

          const newStatusVisao = this._mapAcaoVersaoToStatus(
            visao.versaoAtual.tipo_versao
          );

          await this.visoesRepository.atualizarStatusVisao(
            this.idVisao,
            newStatusVisao,
            trx
          );

          await this.versoesRepository.atualizarStatusVersao(
            this.visao.versao_atual_id,
            STATUS_PARAMETROS.APROVADO,
            trx
          );

          await this.versoesRepository.finalizarVotacoesPendentes(
            this.visao.versao_atual_id,
            trx
          );
        }
        break;
    }
  }

  _mapAcaoVersaoToStatus(acao) {
    const { ALTERAR_PARAMETRO, SUSPENDER, RECUSAR, INATIVAR, ATIVAR } =
      ACOES_PARA_VOTACAO;

    switch (acao) {
      case ALTERAR_PARAMETRO:
        return STATUS.COM_PARAMETROS_APROVADOS;

      case SUSPENDER:
        return STATUS.SUSPENSO;

      case RECUSAR:
        return STATUS.RECUSADO;

      case INATIVAR:
        return STATUS.INATIVO;
    }
  }

  async _isVotacaoFinalizadaComoAprovada(trx) {
    const comite = await this.versoesRepository.getComiteVotacao(
      this.visao.versao_atual_id,
      trx
    );
    const isEncerrado = await this.entityComite.isVotacaoFinalizadaComoAprovada(
      comite
    );
    return isEncerrado;
  }
}

module.exports = UcVotar;
