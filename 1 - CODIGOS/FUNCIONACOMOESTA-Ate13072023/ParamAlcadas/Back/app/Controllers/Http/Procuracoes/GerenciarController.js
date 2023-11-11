"use strict";

const { handleAbstractUserCaseError } = require('../../../Commons/AbstractUserCase');
const EventosProcuracaoRepository = require('../../../Commons/Procuracao/repositories/EventosProcuracaoRepository');
const PesquisaRepository = require('../../../Commons/Procuracao/repositories/PesquisaRepository');
const ProcuracaoRepository = require('../../../Commons/Procuracao/repositories/ProcuracoesRepository');
const { getPrefixosComAcessoEspecial } = require('../../../Commons/Procuracao/useCases/__mocks__/FluxosProcuracao');
const UcRevogarProcuracao = require('../../../Commons/Procuracao/useCases/gerenciar/UcRevogarProcuracao');
const UcSaveCopiaAutenticada = require('../../../Commons/Procuracao/useCases/gerenciar/UcSaveCopiaAutenticada');
const UcSaveManifesto = require('../../../Commons/Procuracao/useCases/gerenciar/UcSaveManifesto');
const salvarUploadProcuracao = require('../../../Middleware/Procuracoes/salvarUploadProcuracao');
const Database = use("Database");

class GerenciarController {
  async getPrefixosAcessoGerenciar() {
    return getPrefixosComAcessoEspecial();
  }

  /**
   * @param {ControllerRouteProps<{
   *  idProcuracao: number,
   *  cartorioId: number,
   *  custoManifesto: number,
   *  prefixoCusto: number,
   *  dataManifesto: string,
   *  superCusto: '1' | '0',
   * }>} props
   */
  async postManifesto({ request, usuarioLogado }) {
    const { idProcuracao, cartorioId, custoManifesto, prefixoCusto, dataManifesto, superCusto } = request.allParams();
    const nomeArquivo = await salvarUploadProcuracao({ request });

    const trx = await Database.connection("procuracao").beginTransaction();

    const { error, payload } = await new UcSaveManifesto({
      repository: {
        procuracoes: new ProcuracaoRepository(),
        eventos: new EventosProcuracaoRepository(),
      },
      trx,
    }).run({
      idProcuracao,
      cartorioId,
      dataManifesto,
      nomeArquivo,
      custoManifesto,
      prefixoCusto,
      superCusto: /** @type {1 | 0} */(Number(superCusto)),
      matriculaRegistro: usuarioLogado.matricula,
    });

    handleAbstractUserCaseError(error);
    return payload;
  }

  /**
   * @param {ControllerRouteProps<{
   *  idProcuracao: number,
   *  cartorioId: number,
   *  custo: number,
   *  prefixoCusto: number,
   *  dataEmissao: string,
   *  superCusto: '1' | '0',
   * }>} props
   */
  async postCopiaAutenticada({ request, usuarioLogado }) {
    const { idProcuracao, cartorioId, custo, prefixoCusto, dataEmissao, superCusto } = request.allParams();

    const { error, payload } = await new UcSaveCopiaAutenticada({
      repository: {
        eventos: new EventosProcuracaoRepository(),
      },
    }).run({
      idProcuracao,
      cartorioId,
      dataEmissao,
      custo,
      prefixoCusto,
      superCusto: /** @type {1 | 0} */(Number(superCusto)),
      matriculaRegistro: usuarioLogado.matricula,
    });

    handleAbstractUserCaseError(error);
    return payload;
  }


  /**
   * @param {ControllerRouteProps<{
  *  idProcuracao: number,
  *  cartorioId: number,
  *  custo: number,
  *  prefixoCusto: number,
  *  dataRevogacao: string,
  *  superCusto: '1' | '0',
  * }>} props
  */
  async postRevogacao({ request, usuarioLogado }) {
    const { idProcuracao, cartorioId, custo, prefixoCusto, dataRevogacao, superCusto } = request.allParams();
    const nomeArquivo = await salvarUploadProcuracao({ request });

    const trx = await Database.connection("procuracao").beginTransaction();

    const { error, payload } = await new UcRevogarProcuracao({
      repository: {
        procuracoes: new ProcuracaoRepository(),
        pesquisa: new PesquisaRepository(),
        eventos: new EventosProcuracaoRepository(),
      },
      trx,
    }).run({
      idProcuracao,
      cartorioId,
      dataRevogacao,
      nomeArquivo,
      custo,
      prefixoCusto,
      superCusto: /** @type {1 | 0} */(Number(superCusto)),
      matriculaRegistro: usuarioLogado.matricula,
    });

    handleAbstractUserCaseError(error);
    return payload;
  }
}

module.exports = GerenciarController;
