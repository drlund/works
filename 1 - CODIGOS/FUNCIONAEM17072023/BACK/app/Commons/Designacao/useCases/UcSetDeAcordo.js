"use strict";

const { isNil } = require('lodash');
const { AbstractUserCase } = require("../../AbstractUserCase");
const {
  TIPOS_DEACORDO,
  TIPOS_EMAIL
} = require("../Constants");

class UcSetDeAcordo extends AbstractUserCase {

  async _action({
    user,
    id,
    tipo,
    texto
  }) {
    const {
      solicitacaoRepository,
      analiseRepository,
      deAcordoRepository,
      mailRepository,
    } = this.repository;

    const solicitacao = await solicitacaoRepository.getSolicitacao(id);
    const analise = await analiseRepository.getAnalise(id);

    if (tipo === TIPOS_DEACORDO.NEGADO) {
      const parecer = {
        id_solicitacao: id,
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
      return deAcordo;
    }

    return await deAcordoRepository.setDeAcordo(solicitacao, analise, user, tipo, texto, this.trx);
  }

  _checks({
    user,
    id,
    tipo,
    texto
  }) {
    if (!user) throw new Error("Os dados do usuário logado deve ser informado", 400);
    if (!id) throw new Error("O id da solicitação deve ser informado", 400);
    if (!tipo) throw new Error("O tipo do Acordo deve ser informado", 400);
  }
}

module.exports = UcSetDeAcordo;
