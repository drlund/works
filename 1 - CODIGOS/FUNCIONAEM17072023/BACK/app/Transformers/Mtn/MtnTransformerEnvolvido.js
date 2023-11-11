"use strict";

const { mode } = require("crypto-js");

const BumblebeeTransformer = use("Bumblebee/Transformer");
const getDadosFunci = use("App/Commons/Mtn/getDadosFunci");
const isFunciReincidente = use("App/Commons/Mtn/isFunciReincidente");
const MtnAnexoTransformer = use("App/Transformers/Mtn/MtnAnexoTransformer");
const MtnTransformerFind = use("App/Transformers/Mtn/MtnTransformerFind");
const getHistoricoMtn = use("App/Commons/Mtn/getHistoricoMtn");
const MtnEsclarecimentoTransformer = use(
  "App/Transformers/Mtn/MtnEsclarecimentoTransformer"
);
const MtnTimelineTransformer = use(
  "App/Transformers/Mtn/MtnTimelineTransformer"
);
const MtnHistoricoTransformer = use(
  "App/Transformers/Mtn/MtnHistoricoTransformer"
);
const MtnLogsEnvolvidoTransformer = use(
  "App/Transformers/Mtn/MtnLogsEnvolvidoTransformer"
);
const MtnAprovarMedidaTransformer = use(
  "App/Transformers/Mtn/MtnAprovarMedidaTransformer"
);

const isPendenteEnvolvido = use("App/Commons/Mtn/isPendenteEnvolvido");
const { mtnConsts } = use("Constants");
const { defaultPrefixoAnalise } = mtnConsts;

/**
 *   Função que retorna
 *
 *
 */
const getCommons = async (model, dadosFunci) => {
  const medidaSelecionada = model.medida
    ? {
        id: model.medida.id,
        txtMedida: model.medida.txt_medida,
      }
    : null;

  const medidaSugerida = model.medidaSugerida
    ? {
        id: model.medidaSugerida.id,
        txtMedida: model.medidaSugerida.txt_medida,
      }
    : null;

  return {
    key: model.id,
    idEnvolvido: model.id,
    idMtn: model.id_mtn,
    matricula: model.matricula ? model.matricula.trim() : "NÃO LOCALIZADO",
    nomeFunci: model.nome_funci ? model.nome_funci.trim() : "NÃO LOCALIZADO",
    cdCargoEpoca: model.cd_cargo_epoca
      ? model.cd_cargo_epoca.trim()
      : "NÃO LOCALIZADO",
    nomeCargoEpoca: model.nome_cargo_epoca
      ? model.nome_cargo_epoca.trim()
      : "NÃO LOCALIZADO",
    cdPrefixoEpoca: model.cd_prefixo_epoca
      ? model.cd_prefixo_epoca.trim()
      : "NÃO LOCALIZADO",
    nomePrefixoEpoca: model.nome_prefixo_epoca,
    cdCargoAtual: dadosFunci ? dadosFunci.comissao : "INF. NAO LOCALIZADA",
    nomeCargoAtual: dadosFunci ? dadosFunci.desc_cargo : "INF. NAO LOCALIZADA",
    cdPrefixoAtual: dadosFunci
      ? dadosFunci?.dependencia?.prefixo
      : "INF. NAO LOCALIZADA",
    nomePrefixoAtual: dadosFunci
      ? dadosFunci.dependencia?.nome
      : "INF. NAO LOCALIZADA",
    respondidoEm: model.respondido_em,
    txtAnalise: model.txt_analise,
    criadoEm: model.created_at,
    pendenteRecurso: model.pendente_recurso,
    pendenteAprovacao: model.aprovacao_pendente,
    historicoEnvolvido: model.historicoEnvolvido,
    nrGedip: model.nr_gedip ? model.nr_gedip : null,
    medidaSelecionada,
    instancia: model.instancia,
    notasInternas: model.notasInternas
      ? model.notasInternas.map((nota) => {
          return {
            id: nota.id,
            idEnvolvido: nota.id_envolvido,
            matRespAcao: nota.mat_resp_acao,
            nomeRespAcao: nota.nome_resp_acao,
            prefixoRespAcao: nota.prefixo_resp_acao,
            nomePrefixoRespAcao: nota.nome_prefixo_resp_acao,
            descNota: nota.desc_nota,
            criadoEm: nota.created_at,
          };
        })
      : [],
    medidaSugerida,
    versionado: model.versionado,
    versionadoEm: model.versionado_em,
    versionadoPorMatricula: model.versionado_por_matricula,
    versionadoPorNome: model.versionado_por_nome,
    versaoIdOriginal: model.versao_id_original,
    versaoIdNova: model.versao_id_nova,
  };
};

/**
 * EnvolvidoTransformer class
 *
 * @class EnvolvidoTransformer
 * @constructor
 */

class EnvolvidoTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return [
      "anexos",
      "timeline",
      "esclarecimentos",
      "esclarecimentosMeuMtn",
      "historico",
      "timelineMeuMtn",
      "recursos",
      "recursosMeuMtn",
      "alteracoesMedida",
      "aprovacoesMedida",
      "logs",
    ];
  }

  includeAnexos(model) {
    return this.collection(model.anexos, MtnAnexoTransformer);
  }

  includeAprovacoesMedida(model) {
    return this.collection(model.aprovacoesMedida, MtnAprovarMedidaTransformer);
  }

  includeLogs(model) {
    return this.collection(model.logs, MtnLogsEnvolvidoTransformer);
  }

  includeEsclarecimentos(model) {
    return this.collection(model.esclarecimentos, MtnEsclarecimentoTransformer);
  }

  includeEsclarecimentosMeuMtn(model) {
    return this.collection(
      model.esclarecimentos,
      "Mtn/MtnEsclarecimentoTransformer.meuMtn"
    );
  }

  includeEsclarecimentosMeutMtn(model) {
    return this.collection(
      model.esclarecimentos,
      "Mtn/MtnEsclarecimentoTransformer.meuMtn"
    );
  }

  includeTimeline(model) {
    return this.collection(model.timeline, MtnTimelineTransformer);
  }

  includeTimelineMeuMtn(model) {
    return this.collection(model.timeline, "Mtn/MtnTimelineTransformer.meuMtn");
  }

  includeAlteracoesMedida(model) {
    return this.collection(
      model.alteracoesMedida,
      "Mtn/MtnSolicitacaoAlterarMedidaTransformer"
    );
  }

  includeRecursos(model) {
    return this.collection(model.recursos, "Mtn/RecursoTransformer");
  }

  includeRecursosMeuMtn(model) {
    return this.collection(model.recursos, "Mtn/RecursoTransformer.meuMtn");
  }

  async includeHistorico(model) {
    let historico = await getHistoricoMtn(model.matricula, [model.id_mtn]);
    return this.collection(historico, MtnHistoricoTransformer);
  }

  /**
   * This method is used to transform the data.
   */
  async transform(model) {
    let dadosFunci = await getDadosFunci(model.matricula);
    const reincidente = await isFunciReincidente(model.matricula);
    const transformed = await getCommons(model, dadosFunci);
    const pendenteEnvolvido = await isPendenteEnvolvido(model.id);

    if (model.mtn) {
      transformed.nrMtn = model.mtn.nr_mtn;
    }

    return {
      ...transformed,
      pendenteEnvolvido,
      matRespAnalise: model.mat_resp_analise,
      nomeRespAnalise: model.nome_resp_analise,
      descOcorrencia: model.mtn ? model.mtn.desc_ocorrencia : "Não Informada",
      impedimentos: {
        odi: dadosFunci
          ? dadosFunci.dt_imped_odi.trim()
          : "INF. NAO LOCALIZADA",
        remocao: dadosFunci
          ? dadosFunci.dt_imped_remocao.trim()
          : "INF. NAO LOCALIZADA",
        comissionamento: dadosFunci
          ? dadosFunci.dt_imped_comissionamento.trim()
          : "INF. NAO LOCALIZADA",
        pas: dadosFunci
          ? dadosFunci.dt_imped_pas.trim()
          : "INF. NAO LOCALIZADA",
        institRelac: dadosFunci
          ? dadosFunci.dt_imped_instit_relac.trim()
          : "INF. NAO LOCALIZADA",
        demissao: dadosFunci
          ? dadosFunci.dt_imped_demissao.trim()
          : "INF. NAO LOCALIZADA",
        bolsaEstudos: dadosFunci
          ? dadosFunci.dt_imped_bolsa_estudos.trim()
          : "INF. NAO LOCALIZADA",
        reincidente: reincidente,
      },
      notasInternas: model.notasInternas
        ? model.notasInternas.map((nota) => {
            return {
              id: nota.id,
              idEnvolvido: nota.id_envolvido,
              matRespAcao: nota.mat_resp_acao,
              nomeRespAcao: nota.nome_resp_acao,
              prefixoRespAcao: nota.prefixo_resp_acao,
              nomePrefixoRespAcao: nota.nome_prefixo_resp_acao,
              descNota: nota.desc_nota,
              criadoEm: nota.created_at,
            };
          })
        : [],
      notasInternasLidas: model.notasInternasLidas,
    };
  }

  async transformFiltrados(model) {
    let dadosFunci = await getDadosFunci(model.matricula);
    const {
      id,
      nr_mtn,
      prefixo_ocorrencia,
      nome_prefixo_ocorrencia,
      prefixo_super_comercial,
      nome_super_comercial,
      prefixo_super_negocial,
      nome_super_negocial,
      prefixo_unidade_estrategica,
      nome_unidade_estrategica,
    } = model.mtn;
    const medida =
      model.medida === null
        ? model.medida
        : {
            idMedida: model.medida.id,
            txtMedida: model.medida.txt_medida,
          };

    return {
      idEnvolvido: model.id,
      key: model.id,
      mtn: {
        id: id,
        nrMtn: nr_mtn,
        prefixo: prefixo_ocorrencia,
        nomePrefixo: nome_prefixo_ocorrencia,
        prefixoSuperComercial: prefixo_super_comercial,
        nomeSuperComercial: nome_super_comercial,
        prefixoSuperNegocial: prefixo_super_negocial,
        nomeSuperNegocial: nome_super_negocial,
        prefixoUnidadeEstrategica: prefixo_unidade_estrategica,
        nomeUnidadeEstrategia: nome_unidade_estrategica,
      },
      medida,
      visao: model.mtn.visao ? model.mtn.visao.desc_visao : "NÃO DISPONÍVEL",
      idMtn: model.id_mtn,
      respondidoEm: model.respondido_em,
      matricula: model.matricula ? model.matricula.trim() : "NÃO LOCALIZADO",
      nomeFunci: model.nome_funci ? model.nome_funci.trim() : "NÃO LOCALIZADO",
      cdPrefixoAtual: dadosFunci
        ? dadosFunci.dependencia.prefixo
        : "INF. NAO LOCALIZADA",
      nomePrefixoAtual: dadosFunci
        ? dadosFunci.dependencia.nome
        : "INF. NAO LOCALIZADA",
      criadoEm: model.created_at,
      pendenteRecurso: model.pendente_recurso,
      pendenteAprovacao: model.aprovacao_pendente,
      instancia: model.instancia,
      criacaoOcorrencia: model.mtn.created_at,
    };
  }

  async transformMeuMtn(model) {
    let dadosFunci = await getDadosFunci(model.matricula);
    let transformed = await getCommons(model, dadosFunci);
    transformed.respAnalise = defaultPrefixoAnalise;
    transformed.medidaSelecionada = transformed.medidaSelecionada
      ? transformed.medidaSelecionada.txtMedida
      : null;
    return transformed;
  }
}

module.exports = EnvolvidoTransformer;
