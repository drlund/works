"use strict";

const {
  isGestor,
} = require("../../../../start/NamedMiddlewares/CtrlDisciplinar");
const {
  AbstractUserCase,
  ExpectedAbstractError,
} = require("../../AbstractUserCase");
const { dadoscapacitacao } = require("../../PainelGestor/Mock");
const {
  ACOES,
  STATUS,
  LOCALIZACOES,
  ETAPAS,
  PARECER,
  SITUACOES,
} = require("../Constants");
const Manifestacao = require("../Entidades/Manifestacao");
const Solicitacao = require("../Entidades/Solicitacao");
const UnidadesAlvoModel = use("App/Models/Mysql/FlexCriterios/UnidadesAlvo");

class UcSolicitarManifestacaoComplementar extends AbstractUserCase {
  async _checks(complemento) {
    const { manifestacoesRepository } = this.repository;

    //this.retornar_etapa_diretorias = false; - quando Gepes/Operador puder solicitar complemento
    //this.retornar_etapa_analise = false; - quando diretoria e operador puder solicitar
    this.retornar_etapa_prefixos = false;

    /* const diretorias = await UnidadesAlvoModel.query()
      .select("prefixo")
      .fetch();
    const diretoriasJson = diretorias?.toJSON() ?? null; */

    //Dispensar as solicitações pendentes do prefixo e substituir por complementares
    complemento.manifestacoesComplementares.forEach(async (prefixo) => {
      await manifestacoesRepository.dispensarPendentesPorComplementar(
        complemento.idSolicitacao,
        prefixo,
        complemento.usuario,
        this.trx
      );

      //logica pra ser utilizada pra definir para quem volta a manifestação (o menor nivel)
      /*
      const isDiretoria = await diretoriasJson.find(
        (diretoria) => diretoria.prefixo == prefixo
      );

       const isGestor = await gestor.find(
        (diretoria) => diretoria.prefixo == prefixo
      );
      if (isGestor) {
        this.retornar_etapa_analise = true;
      }

      if (isDiretoria) {
        this.retornar_etapa_diretorias = true;
      } else {
        this.retornar_etapa_prefixos = true;
      }
      */
    });
    this.retornar_etapa_prefixos = true;
  }

  async _action(complemento) {
    const { solicitacoesRepository, manifestacoesRepository } = this.repository;
    let novaEtapa;

    //switch pra ver qual etapa retornar
    /*  if (this.retornar_etapa_prefixos) {
      console.log("RETORNAR ETAPA MANIFESTACAO");
      novaEtapa = {
        id_status: STATUS.MANIFESTACAO,
        id_localizacao: LOCALIZACOES.PREFIXOS,
        id_etapa: ETAPAS.MANIFESTACOES,
      };
    } else if (this.retornar_etapa_analise) {
      console.log("RETORNAR ETAPA ANALISE");
      novaEtapa = {
        id_status: STATUS.ANALISE,
        id_localizacao: LOCALIZACOES.GESTOR,
        id_etapa: ETAPAS.ANALISE,
      };
    } else {
      console.log("RETORNAR ETAPA DIRETORIA");
      novaEtapa = {
        id_status: STATUS.DEFERIMENTO,
        id_localizacao: LOCALIZACOES.DIRETORIA,
        id_etapa: ETAPAS.DEFERIMENTO,
      };
    } */

    novaEtapa = {
      id_status: STATUS.MANIFESTACAO,
      id_localizacao: LOCALIZACOES.PREFIXOS,
      id_etapa: ETAPAS.MANIFESTACOES,
    };

    const ordemManifestacaoAtual = await manifestacoesRepository.getOrdemManif(
      complemento.idSolicitacao,
      this.trx
    );

    complemento.manifestacoesComplementares.forEach(async (prefixo, index) => {
      console.log("VAI CHAMAR LASTMANIFESTAÇÂO");
      //no futuro seria interessante indicar o ID de qual quer
      const lastManifestacao =
        await manifestacoesRepository.getLastManifestacaoByPrefixo(
          complemento.idSolicitacao,
          prefixo
        );

      let novoComplemento = {};
      novoComplemento.id_solicitacao = complemento.idSolicitacao;
      novoComplemento.id_situacao = SITUACOES.PENDENTE;
      novoComplemento.id_acao = ACOES.COMPLEMENTO;
      novoComplemento.matSolicitanteComplemento = complemento.usuario.chave;
      novoComplemento.isComplemento = "1";
      novoComplemento.complementoEsperado = complemento.texto;
      novoComplemento.ordemManifestacao = ordemManifestacaoAtual + (index + 1);
      novoComplemento.matricula = lastManifestacao?.matricula;
      novoComplemento.nome = lastManifestacao?.nome;
      novoComplemento.funcao = lastManifestacao?.funcao;
      novoComplemento.nomeFuncao = lastManifestacao?.nomeFuncao;
      novoComplemento.prefixo = lastManifestacao?.prefixo;
      novoComplemento.nomePrefixo = lastManifestacao?.nomePrefixo;
      await manifestacoesRepository.novaAnalise(novoComplemento, this.trx);
    });

    await solicitacoesRepository.avancarEtapaSolicitacao(
      complemento.idSolicitacao,
      novaEtapa,
      this.trx
    );

    return;
  }
}

module.exports = UcSolicitarManifestacaoComplementar;
