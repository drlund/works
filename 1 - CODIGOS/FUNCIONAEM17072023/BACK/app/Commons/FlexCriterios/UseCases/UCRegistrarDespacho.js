"use strict";

const {
  AbstractUserCase,
  ExpectedAbstractError,
} = require("../../AbstractUserCase");

const {
  ACOES,
  STATUS,
  LOCALIZACOES,
  ETAPAS,
  SITUACOES,
  ESCALOES_INT,
} = require("../Constants");
const Manifestacao = require("../Entidades/Manifestacao");

class UCRegistrarDespacho extends AbstractUserCase {
  async _checks(despacho) {
    const podeDespacharNaSolicitacao = await this.functions.hasPermission({
      nomeFerramenta: "Flex Critérios",
      dadosUsuario: despacho.usuario,
      permissoesRequeridas: ["DESPACHANTE", "ROOT"],
    });
  }

  async _action(despacho) {
    const {
      solicitacoesRepository,
      manifestacoesRepository,
      arhMstRepository,
    } = this.repository;
    const { getOneFunci } = this.functions;

    if (despacho?.force) {
      //Não verifica
    } else {
      const temDespachantesCriadosPraEstePrefixo =
        await manifestacoesRepository.findDeferimentoByDiretoriaQualquerSituacao(
          despacho.idSolicitacao,
          [despacho.diretoria[0]],
          this.trx
        );
      if (temDespachantesCriadosPraEstePrefixo) {
        throw new ExpectedAbstractError(
          "Escalão desta diretoria já registrado para esta solicitação!",
          403
        );
      }
    }

    const ordemManifestacaoAtual = await manifestacoesRepository.getOrdemManif(
      despacho.idSolicitacao,
      this.trx
    );

    const titleCase = (text) => {
      return text
        .toLowerCase()
        .split(" ")
        .map((word) => {
          return word[0].toUpperCase() + word.slice(1);
        })
        .join(" ");
    };

    let newSavedByTransactionManifestation;

    if (despacho.idEscalao == ESCALOES_INT.MATRICULA) {
      //Colocar logica pra verificar se tem F OU NAO, pq ele quebra na linha de baixo se inserem F
      let funci = await getOneFunci(
        `${
          despacho.matricula[0] === "f" || despacho.matricula[0] === "F"
            ? despacho.matricula
            : `F${despacho.matricula}`
        }`
      );
      let manifestacao = {};
      
      funci.prefixo = funci.dependencia.prefixo;
      funci.cod_funcao = funci.comissao;
      funci.nome = titleCase(funci.nome);
      manifestacao.id_solicitacao = despacho.idSolicitacao;
      
      const newDespachante = {
        id_solicitacao: despacho.idSolicitacao,
        matricula: funci.matricula,
        nome: funci.nome,
        funcao: funci.comissao,
        nomeFuncao: funci.descCargo,
        prefixo: despacho.diretoria[0],
        nomePrefixo: despacho.diretoria[1],
        id_situacao: SITUACOES.PENDENTE,
        id_acao: ACOES.DEFERIMENTO,
        id_escalao: despacho.idEscalao,
        ordemManifestacao: ordemManifestacaoAtual + 1,
        isComplemento: despacho?.force ? "1" : null,
      };

      newSavedByTransactionManifestation =
        await manifestacoesRepository.novaAnalise(newDespachante);
    }

    if (despacho.idEscalao == ESCALOES_INT.ADMINISTRADOR) {
      const comissao = await arhMstRepository.getFuncaoAdmDiretoria(
        despacho.diretoria[0]
      );
      const newDespachante = {
        id_solicitacao: despacho.idSolicitacao,
        funcao: comissao.funcao,
        nomeFuncao: comissao.nomeFuncao,
        prefixo: despacho.diretoria[0],
        nomePrefixo: despacho.diretoria[1],
        id_situacao: SITUACOES.PENDENTE,
        id_escalao: despacho.idEscalao,
        id_acao: ACOES.DEFERIMENTO,
        ordemManifestacao: ordemManifestacaoAtual + 1,
        isComplemento: despacho?.force ? "1" : null,
      };

      newSavedByTransactionManifestation =
        await manifestacoesRepository.novaAnalise(newDespachante, this.trx);
    }

    if (despacho.idEscalao == ESCALOES_INT.MEMBRO_COMITE) {
      const newDespachante = {
        id_solicitacao: despacho.idSolicitacao,
        prefixo: despacho.diretoria[0],
        nomePrefixo: despacho.diretoria[1],
        nomeFuncao: "MEMBRO COMITÊ",
        id_situacao: SITUACOES.PENDENTE,
        id_acao: ACOES.DEFERIMENTO,
        ordemManifestacao: ordemManifestacaoAtual + 1,
        isComplemento: despacho?.force ? "1" : null,
      };

      newSavedByTransactionManifestation =
        await manifestacoesRepository.novaAnalise(newDespachante, this.trx);
    }

    if (despacho.idEscalao == ESCALOES_INT.COMITE) {
      return "METODO A SER IMPLEMENTADO";
      //slots: quorum + ? cordenador
      //diretoria:
    }

    const diretoriasEnvolvidas =
      await solicitacoesRepository.getDiretoriasEnvolvidas(
        despacho.idSolicitacao,
        this.trx
      );

    const qtdDiretoriasEnvolvidas =
      diretoriasEnvolvidas[0]?.diretoriaOrigem ==
      diretoriasEnvolvidas[0]?.diretoriaDestino
        ? 1
        : 2;

    if (qtdDiretoriasEnvolvidas == 1 && newSavedByTransactionManifestation.id) {
      const novaEtapa = {
        id_status: STATUS.DEFERIMENTO,
        id_localizacao: LOCALIZACOES.DIRETORIA,
        id_etapa: ETAPAS.DEFERIMENTO,
      };
      return await solicitacoesRepository.avancarEtapaSolicitacao(
        despacho.idSolicitacao,
        novaEtapa,
        this.trx
      );
    }

    if (qtdDiretoriasEnvolvidas == 2) {
      const dadosSolicitacao = await solicitacoesRepository.umaSolicitacaoPorId(
        despacho.idSolicitacao,
        this.trx
      );

      const existeDeferimentoDestino =
        diretoriasEnvolvidas[0].diretoriaDestino ==
          newSavedByTransactionManifestation.prefixo ||
        dadosSolicitacao.manifestacoes.find(
          (manifestacao) =>
            manifestacao.id_acao == ACOES.DEFERIMENTO &&
            manifestacao.prefixo == diretoriasEnvolvidas[0].diretoriaDestino
        );

      const existeDeferimentoOrigem =
        diretoriasEnvolvidas[0].diretoriaOrigem ==
          newSavedByTransactionManifestation.prefixo ||
        dadosSolicitacao.manifestacoes.find(
          (manifestacao) =>
            manifestacao.id_acao == ACOES.DEFERIMENTO &&
            manifestacao.prefixo == diretoriasEnvolvidas[0].diretoriaOrigem
        );

      if (existeDeferimentoDestino && existeDeferimentoOrigem) {
        const novaEtapa = {
          id_status: STATUS.DEFERIMENTO,
          id_localizacao: LOCALIZACOES.DIRETORIA,
          id_etapa: ETAPAS.DEFERIMENTO,
        };
        return await solicitacoesRepository.avancarEtapaSolicitacao(
          despacho.idSolicitacao,
          novaEtapa,
          this.trx
        );
      }
    }
  }
}

module.exports = UCRegistrarDespacho;
