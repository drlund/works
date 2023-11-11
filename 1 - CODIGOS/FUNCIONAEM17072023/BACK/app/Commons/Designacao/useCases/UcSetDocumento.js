"use strict";
const { isEmpty, isNil } = require('lodash');

const { AbstractUserCase } = require("../../AbstractUserCase");

const {
  TIPOS_DEACORDO, TIPOS_HISTORICO, SITUACOES, STATUS, PERFIL, TIPOS_EMAIL
} = require("../Constants");

const _PERFIL = (profile, prefixo, gerev) => {
  const perf = {
    17: {
      prefixo: prefixo,
      novaSituacao: 7
    },
    1: {
      prefixo: gerev,
      novaSituacao: 7
    },
    20: {
      prefixo: "9009",
      novaSituacao: 2
    },
    21: {
      prefixo: "8559",
      novaSituacao: 3
    },
    22: {
      prefixo: "8592",
      novaSituacao: 4
    },
    23: {
      prefixo: "8929",
      novaSituacao: 8
    },
    24: {
      prefixo: "9270",
      novaSituacao: 9
    },
    25: {
      prefixo: "9220",
      novaSituacao: 10
    }
  }

  return perf[profile];
}

class UcSetDocumento extends AbstractUserCase {

  async _action({
    user,
    parecer,
    arquivos
  }) {
    const {
      solicitacaoRepository,
      analiseRepository,
      deAcordoRepository,
      mailRepository,
    } = this.repository;

    const analise = await analiseRepository.getAnalise(parecer.id_solicitacao);
    const solicitacao = await solicitacaoRepository.getSolicitacao(parecer.id_solicitacao);

    const doEncaminhar = async () => {
      await solicitacao.load('prefixo_dest');
      const profile = _PERFIL(parecer.id_historico, solicitacao.pref_dest, solicitacao.prefixo_dest.gerev);

      const propsSolicitacao = {
        encaminhado_de: solicitacao.encaminhado_para,
        encaminhado_para: profile.prefixo,
        id_status: STATUS.SOLICITADO,
        id_situacao: profile.novaSituacao,
        responsavel: null
      };

      await solicitacaoRepository.set(parecer.id_solicitacao, propsSolicitacao, this.trx);
    };

    const doConcluir = async () => {

      const parecer = {
        id_solicitacao: parecer.id_solicitacao,
        id_negativa: null,
        id_historico: 27,
        texto: isNil(texto) ? ' ' : texto,
      };

      const deAcordo = await deAcordoRepository.setConcluir(
        solicitacao,
        analise,
        user,
        parecer,
        null,
        this.trx
      );

      await mailRepository.post(TIPOS_EMAIL.CANCELADA, solicitacao, analise, deAcordo, this.trx);
    };

    const doDocumento = async () => {
      const novoDocumento = await documentoRepository.post(documento, null, user, trx);
    };

    const documento = async (historico) => {
      const historicosParaEncaminhar = ["17", "20", "21", "22", "23", "24", "25"];
      const historicosParaConcluir = ["26", "27", "28", "30"];
      const historicosParaDocumento = ["17", "20", "21", "22", "23", "24", "25", "26", "27", "28", "30"];


      if (historicosParaEncaminhar.includes(id_historico)) {
        await doEncaminhar();
      }
      if (historicosParaConcluir.includes(id_historico)) {
        await doConcluir();
      }
      if (historicosParaDocumento.includes(id_historico)) {
        await doDocumento();
      }

    };

    await documento(parecer.id_historico);

    await mailRepository.post(TIPOS_EMAIL.CANCELADA, solicitacao, analise, deAcordo, this.trx);
    return deAcordo;

  }

  _checks({
    parecer,
    user
  }) {
    if (isEmpty(user)) throw new Error("Os dados do usuário logado deve ser informado", 400);
    if (isEmpty(parecer)) throw new Error("Os dados do parecer devem ser informados", 400);
  }
}

module.exports = UcSetDocumento;
