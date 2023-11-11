"use strict";

const Drive = use('Drive');
const Helpers = use('Helpers');

const { handleAbstractUserCaseError } = require('../../../Commons/AbstractUserCase');
const { getDadosFunciDb2 } = require('../../../Commons/Arh/getDadosFunciDb2');
const getOneFunci = require('../../../Commons/Arh/getOneFunci');
const CartoriosRepository = require('../../../Commons/Procuracao/repositories/CartoriosRepository');
const EventosProcuracaoRepository = require('../../../Commons/Procuracao/repositories/EventosProcuracaoRepository');
const MinutaRepository = require('../../../Commons/Procuracao/repositories/MinutaRepository');
const OutorgadosRepository = require('../../../Commons/Procuracao/repositories/OutorgadosRepository');
const ProcuracoesRepository = require('../../../Commons/Procuracao/repositories/ProcuracoesRepository');
const SubsidiariasRepository = require('../../../Commons/Procuracao/repositories/SubsidiariasRepository');
const { UcPesquisarOutorgado, UcCadastrarProcuracao } = require('../../../Commons/Procuracao/useCases/cadastro');

const exception = use("App/Exceptions/Handler");
const Database = use("Database");

const {
  UcGetListaCartorios,
  UcCadastrarCartorio,
  UcCadastrarSubsidiaria,
  UcGetListaSubsidiarias,
  UcGetPoderesOutorgante,
} = use("App/Commons/Procuracao/useCases/cadastro");

class CadastroController {
  constructor() {
    this.cartoriosRepository = new CartoriosRepository();
    this.minutaRepository = new MinutaRepository();
    this.outorgadosRepository = new OutorgadosRepository();
    this.procuracoesRepository = new ProcuracoesRepository();
    this.subsidiariasRepository = new SubsidiariasRepository();
  }

  async downloadArquivo({ request, response, session, transform }) {
    const { docName } = request.allParams();

    const filePath = `/storage/procuracoes/arquivo_procuracoes/${docName}`;
    const docPath = Helpers.appRoot(filePath);
    const isExists = await Drive.exists(docPath);

    if (isExists) {
      return response.download(docPath);
    }

    return response.status(404).send('Arquivo não encontrado.');
  }

  async getListaCartorios({ request, response, session, transform }) {
    const ucGetListaCartorios = new UcGetListaCartorios(
      this.cartoriosRepository
    );
    const cartorios = await ucGetListaCartorios.run();
    return response.ok(cartorios);
  }

  async getListaSubsidiarias({ request, response, session, transform }) {
    const ucGelistaSubsidiarias = new UcGetListaSubsidiarias(
      this.subsidiariasRepository
    );
    const subsidiarias = await ucGelistaSubsidiarias.run();

    return subsidiarias;
  }

  /**
   * @param {ControllerRouteProps<{termoPesquisa: string, idFluxo: string}>} props
   */
  async pesquisarOutorgado({ request, response }) {
    const { termoPesquisa, idFluxo } = request.allParams();

    const { error, payload } = await new UcPesquisarOutorgado({
      functions: {
        getOneFunci,
        getDadosFunciDb2,
      },
      repository: {
        minutas: this.minutaRepository,
      },
    }).run({ termoPesquisa, idFluxo });

    handleAbstractUserCaseError(error);

    return response.json(payload);
  }

  async pesquisarPoderesOutorgante({ request, response }) {
    const { matricula } = request.allParams();

    const ucGetPoderesOutorgante = new UcGetPoderesOutorgante(
      this.procuracoesRepository
    );

    ucGetPoderesOutorgante.validate({
      matriculaPesquisa: matricula,
    });
    const { payload, error } = await ucGetPoderesOutorgante.run();

    if (error) {
      if (error instanceof Error) {
        throw new exception(error, 500);
      }

      if (error.msg && error.code) {
        throw new exception(error.msg, error.code);
      }
    }

    return response.ok(payload);
  }

  async cadastrarCartorio({ request, response, session, transform }) {
    const { nome, cnpj, endereco, complemento, bairro, cep, municipio, uf } =
      request.allParams();

    const ucCadastrarCartorio = new UcCadastrarCartorio(
      this.cartoriosRepository
    );

    await ucCadastrarCartorio.validate({
      nome,
      cnpj,
      endereco,
      complemento,
      bairro,
      cep,
      municipio,
      uf,
    });
    await ucCadastrarCartorio.run();
    return response.created();
  }

  /**
   * @param {ControllerRouteProps & {
   *  parsedParams: import('../../../Middleware/Procuracoes/parseCadastrarProcuracao').ReturnParseCadastrarProcuracao
   * }} props
   */
  async cadastrarProcuracao({ response, parsedParams, usuarioLogado }) {
    const {
      tipoFluxo,
      idCartorio,
      dadosProcuracao,
      matriculaOutorgado,
      idSubsidiaria,
      urlDocumento,
      arquivoProcuracao,
      poderes,
      idMinutaCadastrada,
    } = parsedParams;

    const trx = await Database.connection("procuracao").beginTransaction();
    const ucCadastrarProcuracao = new UcCadastrarProcuracao({
      repository: {
        cartorio: this.cartoriosRepository,
        minuta: this.minutaRepository,
        outorgados: this.outorgadosRepository,
        procuracoes: this.procuracoesRepository,
        eventos: new EventosProcuracaoRepository(),
      },
      functions: {
        getOneFunci,
      },
      trx
    });

    const { payload, error } = await ucCadastrarProcuracao.run({
      tipoFluxo,
      idCartorio,
      dadosProcuracao,
      matriculaOutorgado,
      urlDocumento,
      arquivoProcuracao,
      idSubsidiaria,
      poderes,
      idMinutaCadastrada,
      matriculaRegistro: usuarioLogado.matricula
    });

    handleAbstractUserCaseError(error);

    return response.created(payload);
  }

  async cadastrarSubsidiaria({ request, response, session, transform }) {
    const {
      nome,
      cnpj,
      endereco,
      complemento,
      bairro,
      cep,
      municipio,
      uf,
      nomeReduzido,
    } = request.allParams();

    const ucCadastrarSubsidiaria = new UcCadastrarSubsidiaria(
      this.subsidiariasRepository
    );

    await ucCadastrarSubsidiaria.validate({
      nome,
      cnpj,
      endereco,
      complemento,
      bairro,
      cep,
      municipio,
      uf,
      nomeReduzido,
    });
    await ucCadastrarSubsidiaria.run();
    return response.created();
  }
}

module.exports = CadastroController;
