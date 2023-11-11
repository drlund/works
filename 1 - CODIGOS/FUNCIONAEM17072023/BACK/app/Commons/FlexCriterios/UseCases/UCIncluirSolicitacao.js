"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");
const Solicitacao = require("../Entidades/Solicitacao");
const {
  ACOES,
  LOCALIZACOES,
  STATUS,
  ETAPAS,

  PARECER_STRING,
} = require("../Constants");
const FuncisRegionais = require("../../../Models/Mysql/Arh/FuncisRegionais");
const JurisdicoesSubordinadas = require("../../../Models/Mysql/JurisdicoesSubordinadas");
const getAcessoExtra = require("../getAcessoExtra");

class UCIncluirSolicitacao extends AbstractUserCase {
  async _checks(dadosSolicitacao) {
    const { solicitacoes } = this.repository;

    /////////////////CHECKS DE ACESSOS

    const acessos = await getAcessoExtra(dadosSolicitacao.usuario);

    if (/ANALISTA|DESPACHANTE/.test(acessos?.permissoes)) {
      //Não verifica jurisdição
    } else {
      ////////////////CHECKS DE REGRAS DE NEGÒCIOS

      //check quem está incluindo pode incluir pro pref destino
      //TODO: gestores poderão incluir também
      const funciPrefixoVirtual = await FuncisRegionais.query()
        .where("matricula", dadosSolicitacao.usuario.matricula)
        .first();
      if (funciPrefixoVirtual) {
        dadosSolicitacao.usuario.prefixo = funciPrefixoVirtual.pref_gerev;
      }

      const juris = await JurisdicoesSubordinadas.query()
        .select("prefixo_subordinada")
        .where("prefixo", dadosSolicitacao.usuario.prefixo)
        .where("cd_subord_subordinada", "00")
        .distinct()
        .fetch();

      const jurisToJson = juris.toJSON();
      jurisToJson.push({
        prefixo_subordinada: `${dadosSolicitacao.usuario.prefixo}`,
      });

      const jurisSubordinada = await jurisToJson.find(
        (sub) =>
          sub.prefixo_subordinada == dadosSolicitacao.prefixoDestino.prefixo
      );

      if (jurisSubordinada === (null || undefined)) {
        throw new Error(
          "Funcionário não tem jurisdição para incluir solicitações para o prefixo destino informado."
        );
      }
    }

    //check usuario com solicitação em andamento
    const usuarioComSolicitacaoEmAndamento =
      await solicitacoes.usuarioTemSolicitacaoEmAndamento(
        dadosSolicitacao.matricula
      );

    if (usuarioComSolicitacaoEmAndamento === true) {
      throw new Error(
        "Funcionário já possui solicitação de flexibilização de critérios em andamento."
      );
    }

    const diretoriasParteFerramenta =
      await solicitacoes.podeCriarSolicitacaoNasDiretoriasInformadas(
        dadosSolicitacao.prefixoOrigem.prefixoDiretoria,
        dadosSolicitacao.prefixoDestino.prefixoDiretoria
      );

    if (diretoriasParteFerramenta === false) {
      throw new Error(
        "Diretorias envolvidas não contempladas nesta ferramenta."
      );
    }
  }

  async _action(dadosSolicitacao) {
    const { solicitacoes } = this.repository;
    const trx = this.trx;
    /* const urlDocumento = await this.repository.procuracoes.getUrlDocumento({
      arquivoProcuracao: dadosSolicitacao.nomeArquivo,
    }); */

    //Transforma os dados e grava a solicitação inicial na tabela solicitacoes
    const dadosParaInsercao =
      Solicitacao.transformInserirSolicitacao(dadosSolicitacao);
    dadosParaInsercao.id_status = STATUS.MANIFESTACAO;
    dadosParaInsercao.id_localizacao = LOCALIZACOES.PREFIXOS;
    dadosParaInsercao.id_etapa = ETAPAS.MANIFESTACOES;

    const novaSolicitacao = await solicitacoes.novaSolicitacao(
      dadosParaInsercao,
      trx
    );

    dadosSolicitacao?.arquivos?.forEach(async (documento, index) => {
      await solicitacoes.saveDocumento(documento, novaSolicitacao.id, this.trx);
    });

    ///???
    // tabela pivot solicitacoes_tipos
    await solicitacoes.novoSolicitacaoTipo(
      dadosSolicitacao.tipoFlex.map((tipo) => ({
        id_tipo: tipo,
        id_solicitacao: novaSolicitacao.id,
      })),
      trx
    );

    //Cria a primeira manifestação - Justificativa
    const dadosManifestacao = Solicitacao.transformInserirJustificativa({
      ...dadosSolicitacao,
      id_acao: ACOES.JUSTIFICATIVA,
      id_solicitacao: novaSolicitacao.id,
      ordemManifestacao: 0,
      parecer: PARECER_STRING.FAVORAVEL,
    });

    await solicitacoes.novaManifestacao(dadosManifestacao, trx);

    //Cria as demais manifestações iniciais na tabela manifestações
    //A ORDEM SE SUBORDINANTE ANTES OU DEPOIS É AQUI
    //ALTERAR A ORDEM
    /*  {
      prefixo: dadosSolicitacao.prefixoOrigem.prefixo,
      nomePrefixo: dadosSolicitacao.prefixoOrigem.nome,
      prefixoDiretoria: dadosSolicitacao.prefixoOrigem.prefixoDiretoria,
    },
    {
      prefixo: dadosSolicitacao.prefixoDestino.prefixo,
      nomePrefixo: dadosSolicitacao.prefixoDestino.nome,
      prefixoDiretoria: dadosSolicitacao.prefixoDestino.prefixoDiretoria,
    }, */

    await solicitacoes.gerarSlotsManifestacoesIniciais(
      novaSolicitacao.id,
      {
        prefixo: dadosSolicitacao.prefixoOrigem.prefixo,
        nomePrefixo: dadosSolicitacao.prefixoOrigem.nome,
        prefixoDiretoria: dadosSolicitacao.prefixoOrigem.prefixoDiretoria,
      },
      {
        prefixo: dadosSolicitacao.prefixoDestino.prefixo,
        nomePrefixo: dadosSolicitacao.prefixoDestino.nome,
        prefixoDiretoria: dadosSolicitacao.prefixoDestino.prefixoDiretoria,
      },

      dadosSolicitacao.usuario,
      trx
    );

    //Gera um "log" da solicitação inicial
    dadosSolicitacao.id = novaSolicitacao.id;
    const analise = Solicitacao.transformNovaAnalise(dadosSolicitacao);
    await solicitacoes.novaAnalise(analise, trx);

    return novaSolicitacao.id;
  }
}

module.exports = UCIncluirSolicitacao;
