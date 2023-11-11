"use strict";

/** @type {typeof import('../../../Commons/Constants')} */
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, CAMINHO_COMMONS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
const getFluxoAprovacaoAtual = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getFluxoAprovacaoAtual`
);
const exception = use("App/Exceptions/Handler");
const hasPermission = use("App/Commons/HasPermission");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class podeAlterarCarta {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {
    const { id } = request.allParams();
    const usuarioLogado = session.get("currentUserAccount");

    const solicitacao = await solicitacoesModel.find(id);
    await solicitacao.load("fluxoUtilizado");
    const fluxoAtual = await getFluxoAprovacaoAtual({
      fluxoUtilizado: solicitacao.toJSON().fluxoUtilizado,
      sequenciaFluxoAtual: solicitacao.sequenciaFluxoAtual,
    });

    const isFunciFluxoAtual = fluxoAtual.prefixoAutorizador === usuarioLogado.prefixo;
    
    const possuiAcesso = await hasPermission({
      nomeFerramenta: "Encantar",
      dadosUsuario: usuarioLogado,
      permissoesRequeridas: ["ADM_ENCANTAR", "CURADOR"],
      verificarTodas: false,
    });

    if (!possuiAcesso && !isFunciFluxoAtual) {
      throw new exception(
        `Usuário sem acesso para alterar a carta dessa solicitação.`,
        403,
        "MISSING_PERMISSION"
      );
    }


    // call next to advance the request
    await next();
  }
}

module.exports = podeAlterarCarta;
