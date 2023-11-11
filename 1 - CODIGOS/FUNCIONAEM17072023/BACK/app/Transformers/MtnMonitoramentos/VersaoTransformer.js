"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const { mode } = require("crypto-js");
const moment = require("moment");
const constants = use("App/Commons/Mtn/ComiteMtn/Constants");
const Env = use("Env");
const { TIPO_VOTO_OBRIGATORIO } = constants;
const BACKEND_URL = Env.get("BACKEND_URL", "http://localhost:3333");

const DOCUMENTO_BASE_URL = `${BACKEND_URL}/mtn/monitoramentos/download-documento`;
/**
 * VersaoTransformer class
 *
 * @class VersaoTransformer
 * @constructor
 */

const commonTransform = (model) => {
  return {
    id: model.id,
    createdAt: moment(model.created_at).format("DD/MM/YYYY HH:mm"),
    incluidoPor: model.incluido_por,
    tipoVersao: model.tipo_versao,
    incluidoPorNome: model.incluido_por_nome,
    statusVersaoId: model.status_versao_id,
    motivacao: model.motivacao,
    status: {
      id: model.status.id,
      display: model.status.display,
    },
  };
};

class VersaoTransformer extends BumblebeeTransformer {
  transformParaAlteracao(model) {
    const common = commonTransform(model);
    return {
      ...common,
      visao: model.visao.origem_visao,
      status: model.status.display,
    };
  }

  transformTratarAlteracao(model) {
    const commons = commonTransform(model);
    return {
      ...commons,
      documento: {
        id: model.documento.id,
        nomeArquivo: model.documento.nome_arquivo,
        extensao: model.documento.extensao,
        mimeType: model.documento.mime_type,
        nomeOriginal: model.documento.nome_original,
      },
      votoParaAlteracao: {
        id: model.votoParaAlteracao.id,
        matricula: model.votoParaAlteracao.matricula,
        nome: model.votoParaAlteracao.nome,
        versaoId: model.votoParaAlteracao.versao_id,
        votadoEm: model.votoParaAlteracao.votado_em,
        tipoVoto: model.votoParaAlteracao.tipo_voto_id,
        justificativa: model.votoParaAlteracao.justificativa,
        anexos: [
          ...model.votoParaAlteracao.anexos.map((anexo) => {
            return {
              id: anexo.id,
              nomeArquivo: anexo.nome_arquivo,
              extensao: anexo.extensao,
              mimeType: anexo.mime_type,
              nomeOriginal: anexo.nome_original,
            };
          }),
        ],
      },
      visao: {
        id: model.visao.id,
        ativa: model.visao.ativa,
        nomeReduzido: model.visao.nome_reduzido
          ? model.visao.nome_reduzido
          : "Não informado",
        nome: model.visao.origem_visao,
        descricao: model.visao.desc_visao,
        status: {
          id: model.visao.status.id,
          display: model.visao.status.display,
        },
        createdAt: model.visao.created_at,
      },
    };
  }

  transform(model) {
    const common = commonTransform(model);
    return {
      ...common,

      comite: model.comite.map((membroComite) => {
        return {
          matricula: membroComite.matricula,
          nome: membroComite.nome,
          codigoComite: membroComite.codigo_comite,
          votadoEm: membroComite.votado_em,
          tipoVersao: membroComite.tipo_versao,
          tipoVoto: membroComite.tipoVoto,
          justificativa: membroComite.justificativa
            ? membroComite.justificativa
            : "Não informada",
          obrigatorio:
            parseInt(membroComite.tipo_votacao) === TIPO_VOTO_OBRIGATORIO,
          anexos: membroComite.anexos
            ? membroComite.anexos.map((anexo) => {
                return {
                  id: anexo.id,
                  nomeArquivo: anexo.nome_arquivo,
                  nomeOriginal: anexo.nome_original,
                };
              })
            : [],
        };
      }),

      documento: {
        nomeOriginal: model.documento.nome_original,
        idDocumento: model.documento.id,
        nomeDocumento: model.documento.nome_arquivo,
        url: `${DOCUMENTO_BASE_URL}/${model.documento.id}/${model.documento.nome_arquivo}`,
      },
    };
  }
}

module.exports = VersaoTransformer;
