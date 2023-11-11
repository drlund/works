"use strict";

const {
  AbstractUserCase,
  ExpectedAbstractError,
} = require("../../AbstractUserCase");

const {
  STATUS,
  LOCALIZACOES,
  ETAPAS,
  PARECER,
  PARECER_STRING,
} = require("../Constants");
const Manifestacao = require("../Entidades/Manifestacao");

class UCRegistrarManifestacao extends AbstractUserCase {
  async _checks(manifestacao) {
    
    const podeRegistrarManifestacao = await this.functions.hasPermission({
      nomeFerramenta: "Flex Critérios",
      dadosUsuario: manifestacao.usuario,
      permissoesRequeridas: ["MANIFESTANTE", "ROOT"],
    });
    /*     if (!podeRegistrarManifestacao) {
      throw new Error(
        "Você não tem permissão para registrar manifestação nesta solicitação de  informada"
      );
    } */

    if (
      manifestacao.parecer == PARECER.DESFAVORAVEL &&
      manifestacao.texto.length === 0
    ) {
      throw new ExpectedAbstractError(
        "Obrigatório informar um texto para parecer desfavoravel!",
        404
      );
    }
  }

  async _action(manifestacao) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;
    const dadosManifestacao =
      Manifestacao.transformEditarManifestacao(manifestacao);
    let idManifestacaoAtualizada;

    //Case voto favorável
    //No voto favoravel id_acao ainda fica como manifestacao?, id situacao fica registrada
    if (manifestacao.parecer == PARECER.FAVORAVEL) {
      dadosManifestacao.parecer = PARECER_STRING.FAVORAVEL;
      idManifestacaoAtualizada =
        await manifestacoesRepository.atualizarManifestacaoFavoravel(
          dadosManifestacao,
          manifestacao.usuario,
          this.trx
        );
      //

      if (!idManifestacaoAtualizada) {
        throw new ExpectedAbstractError(
          "Você não está autorizado, ou já se manifestou nesta solicitação de flexibilização!",
          403
        );
      }

      // verificar se existe manifestações pendentes
      const manifestacoesPendentes =
        await manifestacoesRepository.temManifestacaoPendente(
          dadosManifestacao.id_solicitacao,
          this.trx
        );
      //
      if (!manifestacoesPendentes) {
        const novaEtapa = {
          id_status: STATUS.ANALISE,
          id_localizacao: LOCALIZACOES.GESTOR,
          id_etapa: ETAPAS.ANALISE,
        };
        await solicitacoesRepository.avancarEtapaSolicitacao(
          dadosManifestacao.id_solicitacao,
          novaEtapa,
          this.trx
        );
      }
    }

    //MANIFESTAçÂO DESFAVORAVEL => DISPENSA PENDENTES E CANCELA PEDIDO
    if (manifestacao.parecer == PARECER.DESFAVORAVEL) {
      idManifestacaoAtualizada =
        await manifestacoesRepository.atualizarManifestacaoDesfavoravel(
          dadosManifestacao,
          manifestacao.usuario,
          this.trx
        );

      if (!idManifestacaoAtualizada) {
        throw new ExpectedAbstractError(
          "Você não está autorizado a manifestar-se nesta solicitação de flexibilização!",
          403
        );
      }

      const novaEtapa = {
        id_status: STATUS.CANCELADO,
        id_etapa: ETAPAS.ENCERRADO,
      };
      await solicitacoesRepository.avancarEtapaSolicitacao(
        dadosManifestacao.id_solicitacao,
        novaEtapa,
        this.trx
      );
    }

    return idManifestacaoAtualizada;
  }
}

module.exports = UCRegistrarManifestacao;
