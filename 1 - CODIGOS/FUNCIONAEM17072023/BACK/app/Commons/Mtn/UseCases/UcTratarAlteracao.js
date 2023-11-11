"use strict";

const { STATUS_PARAMETROS } = require("../ComiteMtn/Constants");

const exception = use("App/Exceptions/Handler");
const Database = use("Database");
const { ACOES_TRATAR_ALTERACAO, ACOES_PARA_VOTACAO } = use(
  "App/Commons/Mtn/ComiteMtn/Constants"
);
const UcIncluirVotacaoVersao = use(
  "App/Commons/Mtn/UseCases/UcIncluirVotacaoVersao"
);

const ACOES_ACEITAS = [
  ACOES_TRATAR_ALTERACAO.ACEITAR,
  ACOES_TRATAR_ALTERACAO.RECUSAR,
];

class UcTratarAlteracao {
  constructor(
    versoesRepository,
    visoesRepository,
    getComposicaoComite,
    getOneFunci,
    comiteVotacaoRepository
  ) {
    this.versoesRepository = versoesRepository;
    this.visoesRepository = visoesRepository;    

    this.validado = false;

    this.ucIncluirVotacaoVersao = new UcIncluirVotacaoVersao(
      getComposicaoComite,
      getOneFunci,
      versoesRepository,
      visoesRepository,
      comiteVotacaoRepository
    );
  }

  async validate(dadosTratamento) {
    const { idVersao, justificativa, acao, documento, dadosUsuario } =
      dadosTratamento;

    if (!idVersao) {
      throw new exception("Id da versão é obrigatório!", 400);
    }

    if (!justificativa) {
      throw new exception("A justificativa é obrigatória!", 400);
    }

    if (!acao) {
      throw new exception("Ação é obrigatória!", 400);
    }

    if (!ACOES_ACEITAS.includes(acao)) {
      throw new exception(`Ação ${acao} é inválida.`, 400);
    }

    if (acao === ACOES_TRATAR_ALTERACAO.ACEITAR && !documento) {
      throw new exception(
        "Quando for aceitar a alteração de parâmetros é necessário incluir um novo documento",
        400
      );
    }

    this.idVersao = idVersao;
    this.justificativa = justificativa;
    this.acao = acao;
    this.dadosUsuario = dadosUsuario;
    if (documento) {
      this.documento = documento;
    }

    this.validado = true;
  }

  async run() {
    if (this.validado !== true) {
      throw new exception(
        "UCTratarAlteração: O Método validate deve ser chamado antes do run()",
        500
      );
    }

    const trx = await Database.connection("pgMtn").beginTransaction();

    try {
      switch (this.acao) {
        case ACOES_TRATAR_ALTERACAO.ACEITAR:
          await this._aceitarPropostaAlteracao(trx);
          break;
        case ACOES_TRATAR_ALTERACAO.RECUSAR:
          await this._recusarPropostaAlteracao(trx);
          break;
        default:
          throw new exception("Ação inválida");
      }

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

  async _aceitarPropostaAlteracao(trx) {
    const idVisao = await this.versoesRepository.getIdVisao(this.idVersao);

    const msgTimeline = `${this.dadosUsuario.chave} - ${this.dadosUsuario.nome_usuario} aceitou a proposta de alteração nos parâmetros.`;

    await this.visoesRepository.incluirLinhaTempo(
      idVisao,
      this.dadosUsuario.chave,
      msgTimeline,
      trx
    );

    await this.ucIncluirVotacaoVersao.validate({
      motivacao: this.justificativa,
      documento: this.documento,
      anexos: [],
      idVisao,
      tipoVotacao: ACOES_PARA_VOTACAO.ALTERAR_PARAMETRO,
      dadosUsuario: this.dadosUsuario,
    });

    await this.ucIncluirVotacaoVersao.run(trx);

    await this.versoesRepository.atualizarStatusVersao(
      this.idVersao,
      STATUS_PARAMETROS.SUBSTITUIDO,
      trx
    );
  }

  async _recusarPropostaAlteracao(trx) {
    const idVisao = await this.versoesRepository.getIdVisao(this.idVersao);

    const votoParaAlteracao = await this.versoesRepository.getVotoParaAlteracao(
      this.idVersao
    );

    const msgTimeline = `${this.dadosUsuario.chave} - ${this.dadosUsuario.nome_usuario} rejeitou a proposta de alteração nos parâmetros.`;
    await this.visoesRepository.incluirLinhaTempo(
      idVisao,
      this.dadosUsuario.chave,
      msgTimeline,
      trx
    );

    await this.versoesRepository.limparVotoVersao({
      idVersao: this.idVersao,
      matriculaVotante: votoParaAlteracao.matricula,
      trx,
    });

    await this.versoesRepository.atualizarStatusVersao(
      this.idVersao,
      STATUS_PARAMETROS.EM_VOTACAO,
      trx
    );
  }
}

module.exports = UcTratarAlteracao;
