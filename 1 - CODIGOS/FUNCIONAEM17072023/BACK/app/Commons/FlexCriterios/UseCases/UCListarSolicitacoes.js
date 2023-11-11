"use strict";

const { AbstractUserCase } = require("../../AbstractUserCase");
const Solicitacao = require("../Entidades/Solicitacao");
const getAcessoExtra = require("../getAcessoExtra");

class UCListarSolicitacoes extends AbstractUserCase {
  async _checks(usuario) {
    const [podeAcessar, listaDeAcessosAutomaticos] = await Promise.all([
      this.functions.hasPermission({
        nomeFerramenta: "Flex Critérios",
        dadosUsuario: usuario,
        permissoesRequeridas: [
          "SOLICITANTE",
          "MANIFESTANTE",
          "ANALISTA",
          "DESPACHANTE",
          "EXECUTANTE",
          "ROOT",
          "DEFERIDOR",
        ],
      }),
      getAcessoExtra(usuario),
    ]);

    const testAcessos = listaDeAcessosAutomaticos.permissoes.some(
      (elelemento) =>
        /ROOT|SOLICITANTE|MANIFESTANTE|ANALISTA|DESPACHANTE|EXECUTANTE|ROOT|DEFERIDOR/.test(
          elelemento
        )
    );

    if (!podeAcessar && !testAcessos) {
      throw new Error(
        "Você não tem permissão para listar as solicitações de flexibilização de sua agência."
      );
    }

    this.perfil_flex = listaDeAcessosAutomaticos.permissoes || null;
  }
  async _action(usuario, filtro) {
    const { solicitacoes } = this.repository;
    const trx = this.trx;

    const { contadores, resultado } = await solicitacoes.listarSolicitacoes(
      usuario,
      filtro,
      this.perfil_flex,
      trx
    );

    const lista = resultado ? Solicitacao.listarSolicitacoes(resultado) : null;
    return { contadores, lista };
  }
}

module.exports = UCListarSolicitacoes;
