"use strict";

const Database = use("Database");
const exception = use("App/Exceptions/Handler");
const fileToBase64 = use("App/Commons/FileToBase64");

const md5 = require("md5");
const { STATUS_PARAMETROS, STATUS, ACOES_PARA_VOTACAO } = use(
  "App/Commons/Mtn/ComiteMtn/Constants"
);

const ARRAY_ACOES_PARA_VOTACAO = Object.keys(ACOES_PARA_VOTACAO).map(
  (key) => ACOES_PARA_VOTACAO[key]
);

/**
 * Ações que exigem que a visão possua uma versão atual para ser executada
 */
const ACOES_EXIGEM_VERSAO_ATUAL = [
  ACOES_PARA_VOTACAO.SUSPENDER,
  ACOES_PARA_VOTACAO.INATIVAR,
  ACOES_PARA_VOTACAO.ATIVAR,
];

class UcIncluirVotacaoVersao {
  constructor(
    getComposicaoComite,
    getOneFunci,
    versoesRepository,
    visoesRepository,
    comiteVotacaoRepository
  ) {
    this.getComposicaoComite = getComposicaoComite;
    this.getOneFunci = getOneFunci;
    this.versoesRepository = versoesRepository;
    this.visoesRepository = visoesRepository;
    this.comiteVotacaoRepository = comiteVotacaoRepository;
  }

  async validate({
    motivacao,
    documento,
    anexos,
    idVisao,
    dadosUsuario,
    tipoVotacao,
  }) {
    if (!motivacao) {
      throw new exception("É obrigatório informar a motivação", 400);
    }

    if (!documento) {
      throw new exception(
        "É obrigatório incluir o documento contendo os parâmetros",
        400
      );
    }

    if (!documento.tmpPath) {
      throw new exception("Documento dos parâmetros é inválido", 400);
    }

    if (!idVisao) {
      throw new exception("É obrigatório incluir o monitoramento", 400);
    }

    if (!tipoVotacao) {
      throw new exception("Obrigatório informar o tipo de votação.", 400);
    }

    if (!ARRAY_ACOES_PARA_VOTACAO.includes(tipoVotacao)) {
      throw new exception(`Tipo de ${tipoVotacao} votação inválido`, 400);
    }

    const idVersaoAtual = await this.visoesRepository.getIdVersaoAtual(idVisao);

    if (
      idVersaoAtual === null &&
      ACOES_EXIGEM_VERSAO_ATUAL.includes(tipoVotacao)
    ) {
      throw new exception(
        `Tipo de ${tipoVotacao} votação só pode ser executada se já existir versão atual.`,
        400
      );
    }

    this.idVersaoAtual = idVersaoAtual;
    this.tipoVersao = tipoVotacao;
    this.motivacao = motivacao;
    this.documento = documento;
    this.idVisao = idVisao;
    this.dadosUsuario = dadosUsuario;
    this.isAlteracaoParametro =
      this.tipoVotacao === ACOES_PARA_VOTACAO.ALTERAR_PARAMETRO;

    if (anexos) {
      this.anexos = anexos;
    }
  }

  async run(externalTrx = null) {
    const trx =
      externalTrx === null
        ? await Database.connection("pgMtn").beginTransaction()
        : externalTrx;

    try {
      const dadosDocumento = await this._getDadosDocumentoParaGravacao();
      const documentoCriado = await this.versoesRepository.salvarDocumento(
        dadosDocumento,
        trx
      );

      await this._marcarVisaoVigenteComoSubstituida(trx);
      const versaoCriada = await this._criarNovaVersao(documentoCriado, trx);
      await this._atualizarVersaoAtual(versaoCriada, trx);
      this.idVersaoAtual = versaoCriada.id;

      await this.visoesRepository.atualizarStatusVisao(
        this.idVisao,
        STATUS.EM_VOTACAO,
        trx
      );

      const membrosComite = await this._getMembrosComiteParaGravacao(
        this.idVersaoAtual
      );

      await this.versoesRepository.salvarComite(membrosComite, trx);

      if (externalTrx === null) {
        await trx.commit();
      }
    } catch (error) {
      await trx.rollback();
      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception(error, 500);
      }
    }
  }

  async _marcarVisaoVigenteComoSubstituida(trx) {
    await this.versoesRepository.atualizarStatusVersaoByVisao(
      this.idVisao,
      STATUS_PARAMETROS.SUBSTITUIDO,
      trx
    );
  }
  async _criarNovaVersao(documentoCriado, trx) {
    const versaoCriada = await this.versoesRepository.salvarVersao(
      {
        incluido_por: this.dadosUsuario.chave,
        incluido_por_nome: this.dadosUsuario.nome_usuario,
        versao_documento_id: documentoCriado.id,
        motivacao: this.motivacao,
        status_versao_id: STATUS_PARAMETROS.PENDENTE_VOTACAO,
        visao_id: this.idVisao,
        tipo_versao: this.tipoVersao,
      },
      trx
    );
    return versaoCriada;
  }
  
  async _atualizarVersaoAtual(versaoCriada, trx) {
    await this.visoesRepository.atualizarVersaoAtual(
      this.idVisao,
      versaoCriada.id,
      trx
    );
  }

  async _getDadosDocumentoParaGravacao() {
    const base64 = fileToBase64(this.documento.tmpPath);
    const nomeArquivo = md5(base64);

    const documentoCriado = {
      nome_arquivo: nomeArquivo,
      extensao: this.documento.extname,
      mime_type: `${this.documento.type}/${this.documento.subtype}`,
      nome_original: this.documento.clientName,
      incluido_por: this.dadosUsuario.chave,
      base64,
    };

    return documentoCriado;
  }

  async _getMembrosComiteParaGravacao(versaoId) {
    const comite = await this.comiteVotacaoRepository.getMembrosComiteMtn();
    const comiteCompleto = [
      ...comite.membrosComiteAdm,
      ...comite.membrosComiteExpandido,
    ];

    for (const membro of comiteCompleto) {
      const dadosFunci = await this.getOneFunci(membro.matricula);
      membro.dadosFunci = dadosFunci;
    }

    const transformedComite = comiteCompleto.map((membroComite) =>
      this._transformDadosComite(membroComite, versaoId)
    );

    return transformedComite;
  }

  _transformDadosComite(membroComite, versaoId) {
    const existeDadosFunci = membroComite.dadosFunci;

    return {
      matricula: existeDadosFunci
        ? membroComite.dadosFunci.matricula
        : membroComite.matricula,
      nome: existeDadosFunci ? membroComite.dadosFunci.nome : "Não Disponível",
      codigo_comite: membroComite.codigoComite,
      tipo_votacao: membroComite.tipoVotacao,
      versao_id: versaoId,
    };
  }
}

module.exports = UcIncluirVotacaoVersao;
