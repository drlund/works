"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const getDadosFunci = use("App/Commons/Mtn/getDadosFunci");
const { mtnConsts } = use("Constants");
const { mtnStatus } = mtnConsts;
const { A_ANALISAR, EM_ANALISE, FINALIZADO } = mtnStatus;
const MtnTransformerEnvolvido = use(
  "App/Transformers/Mtn/MtnTransformerEnvolvido"
);

/**
 * MeuMtnTransformer class
 *
 * @class MeuMtnTransformer
 * @constructor
 */

class MeuMtnTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  async transform(model, { transform }) {
    model.envolvido = model.envolvidos[0];
    delete model.envolvidos;
    delete model.envolvido.impedimentos;

    model.dadosEnvolvido = await transform
      .include("anexos,esclarecimentosMeuMtn,timelineMeuMtn,recursosMeuMtn")
      .item(model.envolvido, "Mtn/MtnTransformerEnvolvido.meuMtn");

    let status = "";
    switch (model.status.id) {
      case A_ANALISAR:
        status = "A analisar";
        break;
      case EM_ANALISE:
        status = "Em análise";
        break;
      case FINALIZADO:
        status = "Finalizado";
        break;
      default:
        status = "STATUS INVÁLIDO";
        break;
    }

    return {
      id: model.id,
      idEnvolvido: model.envolvido.id,
      nrMtn: model.nr_mtn,
      visao: model.visao.desc_visao,
      orientJustVisao: model.visao.orientacao_justificativa,
      dadosEnvolvido: model.dadosEnvolvido,
      status,
      idStatus: model.status.id,
      acao: model.acao,
      abertoEm: model.created_at,
      descOcorrencia: model.desc_ocorrencia,
      dadosPrefixo: {
        prefixo: model.prefixo_ocorrencia,
        nomePrefixo: model.nome_prefixo_ocorrencia,

        superComercial: {
          prefixo: model.prefixo_super_comercial,
          nome: model.nome_super_comercial
        },
        superNegocial: {
          prefixo: model.prefixo_super_negocial,
          nome: model.nome_super_negocial
        },
        unidadeEstrategica: {
          prefixo: model.prefixo_unidade_estrategica,
          nome: model.nome_unidade_estrategica
        }
      }
      
    };
  }
}

module.exports = MeuMtnTransformer;
