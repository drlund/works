"use strict";
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, CAMINHO_COMMONS } = EncantarConsts;

const getComitesAdmByMatricula = use(
  "App/Commons/Arh/getComitesAdmByMatricula"
);
const exception = use("App/Exceptions/Handler");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
const typeDefs = require("../../../Types/TypeUsuarioLogado");
const isAdmEncantar = use(`${CAMINHO_COMMONS}/isAdmEncantar`);
const isComissaoNivelGerencial = use(
  "App/Commons/Arh/isComissaoNivelGerencial"
);

const isUsuarioSolicitante = (solicitacao, matricula) => {
  return solicitacao.matriculaSolicitante === matricula;
};
const isComiteAdmPrefixoSolicitante = async (solicitacao, matricula) => {
  const comitesAdm = await getComitesAdmByMatricula(matricula);
  return comitesAdm.includes(solicitacao.prefixoSolicitante);
};

const getPrefixosFluxoSolicitacao = (solicitacao) => {
  return solicitacao.toJSON().fluxoUtilizado.map((fluxo) => {
    return fluxo.prefixoAutorizador;
  });
};

const getPrefixosDoFluxoComAcesso = (
  prefixosFluxoSolicitacao,
  prefixosOndeUsuarioComiteAdm
) => {
  return prefixosFluxoSolicitacao.filter((prefixoFluxo) => {
    return prefixosOndeUsuarioComiteAdm.includes(prefixoFluxo);
  });
};

const isFunciFuncaoGerencialFluxoAprovacao = async (
  solicitacao,
  usuarioLogado
) => {
  
  const prefixosFluxoSolicitacao = getPrefixosFluxoSolicitacao(solicitacao);

  const funcaoGerencial = await isComissaoNivelGerencial(
    usuarioLogado.cod_funcao
  );

  if (!funcaoGerencial) {
    return false;
  }

  for (const fluxo of prefixosFluxoSolicitacao) {
    if (fluxo === usuarioLogado.prefixo) {
      return true;
    }
  }

  return false;
};

const isComiteAdmPrefixoFluxoAprovacao = async (solicitacao, matricula) => {
  
  const prefixosFluxoSolicitacao = getPrefixosFluxoSolicitacao(solicitacao);
  const prefixosOndeUsuarioComiteAdm = await getComitesAdmByMatricula(
    matricula
  );
  const prefixosDoFluxoComAcesso = getPrefixosDoFluxoComAcesso(
    prefixosFluxoSolicitacao,
    prefixosOndeUsuarioComiteAdm
  );
  return prefixosDoFluxoComAcesso.length > 0;
};

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 *   Indica se o usuário logado pode acessar a aprouma determinada solicitação, de acordo com o tipo da mesma.
 *   Podem acessar
 *
 *   1 - For a pessoa que solicitou
 *   2 - For do comitê de administração do prefixo que solicitou
 *   3 - For membro do comitê de administração de um dos prefixos que compõem o fluxo de aprovação
 *
 */
class PodeAcessarAprovacaoDaSolicitacao {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");
    const { matricula } = usuarioLogado;
    const { idSolicitacao } = request.allParams();
    const solicitacao = await solicitacoesModel.find(idSolicitacao);
    await solicitacao.load("fluxoUtilizado");
    const admEncantar = await isAdmEncantar(usuarioLogado);

    if (
      admEncantar ||
      isUsuarioSolicitante(solicitacao, matricula) ||
      (await isFunciFuncaoGerencialFluxoAprovacao(
        solicitacao,
        usuarioLogado
      )) ||
      (await isComiteAdmPrefixoSolicitante(solicitacao, matricula)) ||
      (await isComiteAdmPrefixoFluxoAprovacao(solicitacao, matricula))
    ) {
      next();
    } else {
      throw new exception("Usuário não tem acesso à solicitação ", 401);
    }
    await next();
  }
}

module.exports = PodeAcessarAprovacaoDaSolicitacao;
