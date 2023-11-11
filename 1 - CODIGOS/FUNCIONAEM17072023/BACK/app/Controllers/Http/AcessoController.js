"use strict";

const CryptoJS = use("crypto-js");
const { validate } = use("Validator");
const _ = use("lodash");
const { mongo } = use('mongoose');
const moment = use("moment");

const { handleAbstractUserCaseError } = use("App/Commons/AbstractUserCase");

const { REGEX_ACESSO } = use("App/Commons/Acesso/Constants");
const getListaRemocaoAutomatica = use("App/Commons/Acesso/getListaRemocaoAutomatica");


const { getDadosComissaoCompleto, getOneFunci } = use("App/Commons/Arh");
const { getListaComitesByMatricula } = use("App/Commons/Arh/dadosComites");

const ConcessoesAcessosRepository = use("App/Commons/Acesso/Repositories/ConcessoesAcessosRepository");
const PermissoesFerramentasRepository = use("App/Commons/Acesso/Repositories/PermissoesFerramentasRepository");
const TiposAcessoRepository = use("App/Commons/Acesso/Repositories/TiposAcessoRepository");

const UCFindTiposAcesso = use("App/Commons/Acesso/UseCases/UCFindTiposAcesso");
const UCFindPermissoesUsuario = use("App/Commons/Acesso/UseCases/UCFindPermissoesUsuario");
const UCFindListaFerramentas = use("App/Commons/Acesso/UseCases/UCFindListaFerramentas");
const UCFindListaConcessoes = use("App/Commons/Acesso/UseCases/UCFindListaConcessoes");
const UCSaveFerramenta = use("App/Commons/Acesso/UseCases/UCSaveFerramenta");
const UCSaveConcessaoAcesso = use("App/Commons/Acesso/UseCases/UCSaveConcessaoAcesso");
const UCDeleteConcessaoAcesso = use("App/Commons/Acesso/UseCases/UCDeleteConcessaoAcesso");
const UCDeleteFerramenta = use("App/Commons/Acesso/UseCases/UCDeleteFerramenta");

const getAcessosExtras = use("App/Commons/Acesso/getAcessosExtras");

const getDadosIniciaisProducao = use("App/Commons/Acesso/getDadosIniciaisProducao");
const getDadosIdentificadores = use("App/Commons/Acesso/getDadosIdentificadores");
const {
  MENSAGENS_LOG,
  ESTADOS
} = use("App/Commons/Acesso/Constants");

const { DATABASE_DATETIME_OUTPUT } = use("App/Commons/Designacao/Constants");

const concessoesAcessosModel = use("App/Models/Mongo/ConcessoesAcessos");
const { MongoTypes } = use("App/Models/Mongo/FactoryModelMongo");

const { replaceVariable } = use('App/Commons/StringUtils');


class AcessoController {
  async findPermissoesUsuario({ request, response, session }) {
    const { token } = request.allParams();

    let dadosUsuario = session.get("currentUserAccount");

    const ucFindPermissoesUsuario = new UCFindPermissoesUsuario({
      repository: {
        concessoesAcessos: new ConcessoesAcessosRepository()
      },
      functions: {
        getListaComitesByMatricula,
        getDadosComissaoCompleto,
        getAcessosExtras,
        CryptoJS,
        _,
      }
    })

    const { error, payload } = await ucFindPermissoesUsuario.run({ dadosUsuario, ESTADOS, token });

    if (error) {
      const ciphertext = CryptoJS.AES.encrypt("[]", token);
      return response.badRequest(ciphertext.toString());
    }

    response.header("Content-type", "application/json");
    return response.ok(`"${payload.toString()}"`);
  }

  async findListaFerramentas({ response }) {
    const ucFindListaFerramentas = new UCFindListaFerramentas({
      repository: {
        permissoesFerramentas: new PermissoesFerramentasRepository()
      }
    })

    const { error, payload } = await ucFindListaFerramentas.run(true);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async saveFerramenta({ request, response }) {
    const params = request.all();

    const ucSaveFerramenta = new UCSaveFerramenta({
      repository: {
        permissoesFerramentas: new PermissoesFerramentasRepository()
      },
      functions: {
        validate,
      }
    })

    const { error, payload } = await ucSaveFerramenta.run(params);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async deleteFerramenta({ request, response }) {
    const params = request.params;

    const ucDeleteFerramenta = new UCDeleteFerramenta({
      repository: {
        permissoesFerramentas: new PermissoesFerramentasRepository(),
        concessoesAcessos: new ConcessoesAcessosRepository(),
      },
      functions: {
        MongoTypes,
      }
    })

    const { error, payload } = await ucDeleteFerramenta.run(params);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async findTiposAcesso({ response }) {
    const ucFindTiposAcesso = new UCFindTiposAcesso({
      repository: {
        tiposAcesso: new TiposAcessoRepository()
      }
    });

    const { error, payload } = await ucFindTiposAcesso.run(true);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async findListaConcessoes({ request, response }) {
    const { ativo = ESTADOS.ATIVO } = request.allParams();

    const ucFindListaConcessoes = new UCFindListaConcessoes({
      repository: {
        tiposAcesso: new TiposAcessoRepository(),
        permissoesFerramentas: new PermissoesFerramentasRepository(),
        concessoesAcessos: new ConcessoesAcessosRepository(),
      },
      functions: {
        getDadosIdentificadores
      }
    });

    const { error, payload } = await ucFindListaConcessoes.run({ ativo });

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async saveConcessaoAcesso({ request, response, session }) {
    const { chave, nome_usuario: nome } = session.get("currentUserAccount");
    const params = request.allParams();
    const { ObjectId } = mongo;

    const ucSaveConcessaoAcesso = new UCSaveConcessaoAcesso({
      repository: {
        concessoesAcessos: new ConcessoesAcessosRepository(),
      },
      functions: {
        ObjectId,
        moment,
        replaceVariable,
        REGEX_ACESSO,
        ESTADOS,
        MENSAGENS_LOG,
        getOneFunci,
        DATABASE_DATETIME_OUTPUT,
        validate
      }
    })

    const { error, payload } = await ucSaveConcessaoAcesso.run({ params, chave, nome });

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async deleteConcessaoAcesso({ response, session, params }) {
    const { chave, nome_usuario: nome } = session.get("currentUserAccount");
    const { id = null } = params;

    const ucDeleteConcessaoAcesso = new UCDeleteConcessaoAcesso({
      repository: {
        concessoesAcessos: new ConcessoesAcessosRepository(),
      }
    })

    const { error, payload } = await ucDeleteConcessaoAcesso.run({ id, chave, nome });

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async findMatriculasEPrefixos({ response }) {
    const all = await concessoesAcessosModel.find({});

    const alterados = await getDadosIniciaisProducao(all);

    response.ok(alterados);

  }
}

module.exports = AcessoController;
