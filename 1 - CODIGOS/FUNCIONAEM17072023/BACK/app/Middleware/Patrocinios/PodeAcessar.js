"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Solicitacao = use("App/Models/Mysql/Patrocinios/Solicitacao");
const getPrefixosAutorizados = use(
  "App/Commons/Patrocinios/getPrefixosAutorizados"
);
const isEquipeComunicacao = use("App/Commons/Patrocinios/isEquipeComunicacao");
const isRespAnalise = use("App/Commons/Patrocinios/isRespAnalise");

class PodeAcessar {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, session }, next) {
    try {
      const { idSolicitacao } = request.allParams();

      const arrayIdSolicitacao = Array.isArray(idSolicitacao)
        ? idSolicitacao
        : [idSolicitacao];

      for (const idSol of arrayIdSolicitacao) {
        if (idSol) {
          const solicitacao = await Solicitacao.find(idSol);

          if (solicitacao) {
            const { sequencial, prefixoSolicitante } = solicitacao;
            const dadosUsuario = session.get("currentUserAccount");

            if (
              !sequencial ||
              sequencial === 1 ||
              request.all().sequencial == 1
            ) {
              const isEquipeComunic = await isEquipeComunicacao(dadosUsuario);

              if (!isEquipeComunic) {
                // Busca os prefixos que o usuário tem acesso
                const prefAut = await getPrefixosAutorizados(dadosUsuario);

                // Se o prefixo solicitante não estiver nos prefixos autorizados, então não permite acesso.
                if (!prefAut.includes(prefixoSolicitante)) {
                  return response.forbidden(
                    "A ação solicitada não é permitida para as credenciais fornecidas!"
                  );
                }
              }
            } else {
              // Caso exista o responsável pela análise da solicitação e o usuário não o seja, então não permite acesso.
              if (!(await isRespAnalise(dadosUsuario, solicitacao))) {
                return response.forbidden(
                  "A ação solicitada não é permitida para as credenciais fornecidas!"
                );
              }
            }
          } else {
            return response.badRequest("Solicitação não encontrada.");
          }
        }
      }
    } catch (error) {
      return response.badRequest(
        "Erro ao verificar as permissões para a ação solicitada."
      );
    }

    // call next to advance the request
    await next();
  }
}

module.exports = PodeAcessar;
