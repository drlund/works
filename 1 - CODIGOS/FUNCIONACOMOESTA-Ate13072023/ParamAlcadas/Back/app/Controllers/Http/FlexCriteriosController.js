"use strict";

const Database = use("Database");
var fs = require("fs");
const Drive = use("Drive");
const Helpers = use("Helpers");

const {
  handleAbstractUserCaseError,
} = require("../../Commons/AbstractUserCase");

/** Repositorios */
const SolicitacoesRepository = require("../../Commons/FlexCriterios/Repositories/Solicitacoes");
const ArhMstRepository = require("../../Commons/FlexCriterios/Repositories/ArhMst");
const FuncisRepository = require("../../Commons/FlexCriterios/Repositories/Funcis");
const TiposRepository = require("../../Commons/FlexCriterios/Repositories/Tipos");
const EtapasRepository = require("../../Commons/FlexCriterios/Repositories/Etapas");
const StatusRepository = require("../../Commons/FlexCriterios/Repositories/Status");
const LocalizacoesRepository = require("../../Commons/FlexCriterios/Repositories/Localizacoes");
const AcoesRepository = require("../../Commons/FlexCriterios/Repositories/Acoes");
const SituacoesRepository = require("../../Commons/FlexCriterios/Repositories/Situacoes");
const EscaloesRepository = require("../../Commons/FlexCriterios/Repositories/Escaloes");
const ManifestacoesRepository = require("../../Commons/FlexCriterios/Repositories/Manifestacoes");
const hasPermission = use("App/Commons/HasPermission");
const AnexosRepository = require("../../Commons/FlexCriterios/Repositories/Anexos");

/** Casos de Uso */
const UCListarSolicitacoes = require("../../Commons/FlexCriterios/UseCases/UCListarSolicitacoes");
const UCObterDadosFunci = require("../../Commons/FlexCriterios/UseCases/UCObterDadosFunci");
const UCObterDadosPrefixo = require("../../Commons/FlexCriterios/UseCases/UCObterDadosPrefixo");
const UCGetTiposFlex = require("../../Commons/FlexCriterios/UseCases/UCGetTiposFlex");
const UCGetEtapas = require("../../Commons/FlexCriterios/UseCases/UCGetEtapas");
const UCGetStatus = require("../../Commons/FlexCriterios/UseCases/UCGetStatus");
const UCGetSituacoes = require("../../Commons/FlexCriterios/UseCases/UCGetSituacoes");
const UCGetAcoes = require("../../Commons/FlexCriterios/UseCases/UCGetAcoes");
const UCGetLocalizacoes = require("../../Commons/FlexCriterios/UseCases/UCGetLocalizacoes");
const UCObterDadosAnalise = require("../../Commons/FlexCriterios/UseCases/UCObterDadosAnalise");
const UCObterDadosFuncao = require("../../Commons/FlexCriterios/UseCases/UCObterDadosFuncao");
const UCIncluirSolicitacao = require("../../Commons/FlexCriterios/UseCases/UCIncluirSolicitacao");
const UCDetalharSolicitacao = require("../../Commons/FlexCriterios/UseCases/UCDetalharSolicitacao");
const UCGetEscaloes = require("../../Commons/FlexCriterios/UseCases/UCGetEscaloes");
const UCGetDadosEscalao = require("../../Commons/FlexCriterios/UseCases/UCGetDadosEscalao");
const UCRegistrarManifestacao = require("../../Commons/FlexCriterios/UseCases/UCRegistrarManifestacao");
const UCRegistrarAnalise = require("../../Commons/FlexCriterios/UseCases/UCRegistrarAnalise");
const UCRegistrarDespacho = require("../../Commons/FlexCriterios/UseCases/UCRegistrarDespacho");

const getOneFunci = require("../../Commons/Arh/getOneFunci");
const { ACOES, FILTROS } = require("../../Commons/FlexCriterios/Constants");
const UcSolicitarManifestacaoComplementar = require("../../Commons/FlexCriterios/UseCases/UcSolicitarManifestacaoComplementar");
const UcFinalizarSolicitacao = require("../../Commons/FlexCriterios/UseCases/UCFinalizarSolicitacao");
const UcRegistrarDeferimento = require("../../Commons/FlexCriterios/UseCases/UCRegistrarDeferimento");
const UCEncerrarSolicitacaoAntecipadamente = require("../../Commons/FlexCriterios/UseCases/UCEncerrarSolicitacaoAntecipadamente");
const UcAvocarSolicitacao = require("../../Commons/FlexCriterios/UseCases/UcAvocarSolicitacao");
const UCGetComplementacaoPendente = require("../../Commons/FlexCriterios/UseCases/UCGetComplementacaoPendente");
const UcRegistrarComplemento = require("../../Commons/FlexCriterios/UseCases/UCRegistrarComplemento");
const UCDispensarDespacho = require("../../Commons/FlexCriterios/UseCases/UCDispensarDespacho");
const UcGepesDiteroriaDevolveAnalise = require("../../Commons/FlexCriterios/UseCases/UcGepesDiteroriaDevolveAnalise");
const UCAvancarForcado = require("../../Commons/FlexCriterios/UseCases/UCAvancarForcado");
const UCRemoverDeferidorPorDiretoria = require("../../Commons/FlexCriterios/UseCases/UCRemoverDeferidorPorDiretoria");
const salvarUploadFlexCriterios = require("../../Commons/FlexCriterios/Repositories/salvarUploadsFlexCriterios");
const UCDownloadArquivo = require("../../Commons/FlexCriterios/UseCases/UCDownloadArquivo");
const UCVincularNovosAnexos = require("../../Commons/FlexCriterios/UseCases/UCVincularNovosAnexos");

class FlexCriteriosController {
  async listarSolicitacoes({ request, response, session }) {
    const trx = await Database.connection("flexCriterios").beginTransaction();
    const { filtro = FILTROS.MINHAS_PENDENCIAS } = request.allParams();

    const usuario = session.get("currentUserAccount");
    const ucListarSolicitacoes = new UCListarSolicitacoes({
      repository: {
        solicitacoes: new SolicitacoesRepository(),
      },
      trx,
      functions: { hasPermission },
    });

    const { error, payload } = await ucListarSolicitacoes.run(usuario, filtro);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async postDocumento({ request }) {
    const nomeArquivo = await salvarUploadFlexCriterios({ request });

    return nomeArquivo;
  }

  async vincularNovosAnexos({ request, response }) {
    const { anexos, idFlex } = request.allParams();
    const trx = await Database.connection("flexCriterios").beginTransaction();

    const ucVincularNovosAnexos = new UCVincularNovosAnexos({
      repository: {
        anexos: new AnexosRepository(),
      },
      functions: { hasPermission },
    });

    const { error, payload } = await ucVincularNovosAnexos.run(
      anexos,
      idFlex,
      trx
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async downloadAnexo({ request, response, session, transform }) {
    const { anexoUrl } = request.allParams();

    const filePath = `/storage/flexibilizacao/${anexoUrl}`;
    const docPath = Helpers.appRoot(filePath);
    const isExists = await Drive.exists(docPath);

    if (isExists) {
      return response.download(docPath);
    }

    return response.status(404).send("Arquivo não encontrado.");
  }

  /*   async downloadAnexo({ request, response }) {

    const trx = await Database.connection("flexCriterios").beginTransaction();
    const { anexoId } = request.allParams();
    const uCDownloadArquivo = new UCDownloadArquivo({
      repository: {
        solicitacoes: new SolicitacoesRepository(),
        anexos: new AnexosRepository(),
      },
      trx,
      functions: { hasPermission },
    });
    const { error, payload } = await uCDownloadArquivo.run(anexoId, response);
    handleAbstractUserCaseError(error);
    return response.ok(payload);
  } */

  async incluirSolicitacao({ request, response, session }) {
    const trx = await Database.connection("flexCriterios").beginTransaction();
    const { dadosSolicitacao } = request.allParams();

    dadosSolicitacao.usuario = session.get("currentUserAccount");

    const ucIncluirSolicitacao = new UCIncluirSolicitacao({
      repository: {
        solicitacoes: new SolicitacoesRepository(),
      },
      trx,
      functions: { hasPermission },
    });

    const { error, payload } = await ucIncluirSolicitacao.run(dadosSolicitacao);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async obterFunciByMatricula({ request, response, session }) {
    const usuario = session.get("currentUserAccount");
    const { matricula } = request.allParams();
    const ucObterDadosFunci = new UCObterDadosFunci({
      repository: {
        arhMst: new ArhMstRepository(),
        solicitacoes: new SolicitacoesRepository(),
      },
      functions: { hasPermission },
    });

    const { error, payload } = await ucObterDadosFunci.run(matricula, usuario);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async obterDadosPrefixo({ request, response, session }) {
    const { prefixo } = request.allParams();
    const usuario = session.get("currentUserAccount");
    const ucObterDadosPrefixo = new UCObterDadosPrefixo({
      repository: {
        arhMst: new ArhMstRepository(),
        solicitacoes: new SolicitacoesRepository(),
      },
      functions: { hasPermission },
    });

    const { error, payload } = await ucObterDadosPrefixo.run(prefixo, usuario);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async obterDadosFuncao({ request, response, session }) {
    const { funcao, prefixo } = request.allParams();
    const usuario = session.get("currentUserAccount");
    const ucObterDadosFuncao = new UCObterDadosFuncao({
      repository: {
        arhMst: new ArhMstRepository(),
      },
      functions: { hasPermission },
    });

    const { error, payload } = await ucObterDadosFuncao.run(
      funcao,
      prefixo,
      usuario
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async obterAnaliseFunci({ request, response, session }) {
    const { matricula, prefixoDestino, funcaoDestino } = request.allParams();
    const usuario = session.get("currentUserAccount");

    const ucGetAnalise = new UCObterDadosAnalise({
      repository: {
        funciRepository: new FuncisRepository(),
        arhMstRepository: new ArhMstRepository(),
      },
      functions: { hasPermission },
    });

    const { payload, error } = await ucGetAnalise.run({
      matricula,
      prefixoDestino,
      funcaoDestino,
      usuario,
    });

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async listarTiposSolicitacoes({ response, session }) {
    const usuario = session.get("currentUserAccount");
    const ucGetTiposFlex = new UCGetTiposFlex({
      repository: {
        tiposRepository: new TiposRepository(),
      },
      functions: { hasPermission },
    });

    const { payload, error } = await ucGetTiposFlex.run(null, usuario);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async listarEtapas({ response, session }) {
    const usuario = session.get("currentUserAccount");
    const ucGetEtapas = new UCGetEtapas({
      repository: {
        etapasRepository: new EtapasRepository(),
      },
      functions: { hasPermission },
    });

    const { payload, error } = await ucGetEtapas.run(null, usuario);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async listarStatus({ response, session }) {
    const usuario = session.get("currentUserAccount");
    const ucGetStatus = new UCGetStatus({
      repository: {
        statusRepository: new StatusRepository(),
      },
      functions: { hasPermission },
    });

    const { payload, error } = await ucGetStatus.run(null, usuario);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async listarLocalizacoes({ response, session }) {
    const usuario = session.get("currentUserAccount");
    const ucGetLocalizacoes = new UCGetLocalizacoes({
      repository: {
        localizacoesRepository: new LocalizacoesRepository(),
      },
      functions: { hasPermission },
    });

    const { payload, error } = await ucGetLocalizacoes.run(null, usuario);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async listarAcoes({ response, session }) {
    const usuario = session.get("currentUserAccount");
    const ucGetAcoes = new UCGetAcoes({
      repository: {
        acoesRepository: new AcoesRepository(),
      },
      functions: { hasPermission },
    });

    const { payload, error } = await ucGetAcoes.run(null, usuario);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async listarSituacoes({ response, session }) {
    const usuario = session.get("currentUserAccount");
    const ucGetSituacoes = new UCGetSituacoes({
      repository: {
        situacoesRepository: new SituacoesRepository(),
      },
      functions: { hasPermission },
    });

    const { payload, error } = await ucGetSituacoes.run(null, usuario);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async detalharSolicitacao({ request, response, session }) {
    const { id } = request.allParams();
    const usuario = session.get("currentUserAccount");
    const trx = await Database.connection("flexCriterios").beginTransaction();

    const ucDetalharSolicitacao = new UCDetalharSolicitacao({
      repository: {
        solicitacoesRepository: new SolicitacoesRepository(),
      },
      trx,
      functions: { hasPermission },
    });

    const { payload, error } = await ucDetalharSolicitacao.run(id, usuario);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async listarEscaloes({ response, request, session }) {
    const usuario = session.get("currentUserAccount");

    const { diretoria, idSolicitacao } = request.allParams();

    const ucGetEscaloes = new UCGetEscaloes({
      repository: {
        escaloesRepository: new EscaloesRepository(),
      },
      functions: { hasPermission },
    });

    const { payload, error } = await ucGetEscaloes.run(
      null,
      usuario,
      diretoria,
      idSolicitacao
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async dadosEscalao({ request, response, session }) {
    const usuario = session.get("currentUserAccount");
    const { prefixo } = request.allParams();

    const ucGetDadosEscalao = new UCGetDadosEscalao({
      repository: {
        escaloesRepository: new EscaloesRepository(),
      },
      functions: { hasPermission },
    });

    const { payload, error } = await ucGetDadosEscalao.run(prefixo, usuario);

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async complementosPendentes({ request, response, session }) {
    const usuario = session.get("currentUserAccount");
    const { idSolicitacao, analise } = request.allParams();
    const trx = await Database.connection("flexCriterios").beginTransaction();

    const uCGetComplementacaoPendente = new UCGetComplementacaoPendente({
      repository: {
        manifestacoesRepository: new ManifestacoesRepository(),
      },
      trx,
      functions: { hasPermission },
    });

    const { payload, error } = await uCGetComplementacaoPendente.run(
      usuario,
      idSolicitacao,
      analise
    );

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async manifestar({ request, response, session }) {
    const trx = await Database.connection("flexCriterios").beginTransaction();
    const usuario = session.get("currentUserAccount");
    const { manifestacao, idComplemento = null } = request.allParams();

    let result;
    switch (manifestacao?.idAcao) {
      case ACOES.CANCELAMENTO:
        const uCEncerrarSolicitacaoAntecipadamente =
          new UCEncerrarSolicitacaoAntecipadamente({
            repository: {
              solicitacoesRepository: new SolicitacoesRepository(),
              manifestacoesRepository: new ManifestacoesRepository(),
            },
            trx,
            functions: { hasPermission },
          });

        result = await uCEncerrarSolicitacaoAntecipadamente.run({
          ...manifestacao,
          usuario,
        });

        break;
      case ACOES.MANIFESTACAO:
        //Se for manifestação do tipo complemento
        if (idComplemento) {
          const ucRegistrarComplemento = new UcRegistrarComplemento({
            repository: {
              solicitacoesRepository: new SolicitacoesRepository(),
              manifestacoesRepository: new ManifestacoesRepository(),
            },
            trx,
            functions: { hasPermission },
          });

          result = await ucRegistrarComplemento.run({
            ...manifestacao,
            idComplemento,
            usuario,
          });
          break;
        }

        const ucRegistrarManifestacao = new UCRegistrarManifestacao({
          repository: {
            solicitacoesRepository: new SolicitacoesRepository(),
            manifestacoesRepository: new ManifestacoesRepository(),
          },
          trx,
          functions: { hasPermission },
        });

        result = await ucRegistrarManifestacao.run({
          ...manifestacao,
          usuario,
        });
        break;

      case ACOES.AVOCAR:
        const ucAvocarSolicitacao = new UcAvocarSolicitacao({
          repository: {
            solicitacoesRepository: new SolicitacoesRepository(),
            manifestacoesRepository: new ManifestacoesRepository(),
          },
          trx,
          functions: { hasPermission },
        });

        result = await ucAvocarSolicitacao.run({
          ...manifestacao,
          usuario,
        });

        break;
      case ACOES.COMPLEMENTO:
        const ucSolicitarManifestacaoComplementar =
          new UcSolicitarManifestacaoComplementar({
            repository: {
              solicitacoesRepository: new SolicitacoesRepository(),
              manifestacoesRepository: new ManifestacoesRepository(),
            },
            trx,
            functions: { hasPermission },
          });

        result = await ucSolicitarManifestacaoComplementar.run({
          ...manifestacao,
          usuario,
        });

        result;
        break;
      default:
        throw new Error("idAção Inválido");
    }

    //Caso: criar manifestação nova com pedido complementar
    /* if (manifestacao?.idAcao == ACOES.COMPLEMENTO) {
      const ucSolicitarManifestacaoComplementar =
        new UcSolicitarManifestacaoComplementar({
          repository: {
            solicitacoesRepository: new SolicitacoesRepository(),
            manifestacoesRepository: new ManifestacoesRepository(),
          },
          trx,
          functions: { hasPermission },
        });

      const { payload, error } = await ucSolicitarManifestacaoComplementar.run({
        ...manifestacao,
        usuario,
      });

      handleAbstractUserCaseError(error);

      return response.ok(payload);
    }
 */
    //AVOCAR
    /*  if (manifestacao?.idAcao == ACOES.AVOCAR) { */
    //manifestacao.idDispensa = 4 tabela manifestacaoDispensa
    /*  } */

    //ENCERRAR
    /* if (manifestacao?.idAcao == ACOES.CANCELAMENTO) { */
    //manifestacao.idDispensa = 5 tabela manifestacaoDispensa
    /*    } */

    //MANIFESTACAO
    /*  if (manifestacao?.idAcao == ACOES.MANIFESTACAO) {
      const ucRegistrarManifestacao = new UCRegistrarManifestacao({
        repository: {
          solicitacoesRepository: new SolicitacoesRepository(),
          manifestacoesRepository: new ManifestacoesRepository(),
        },
        trx,
        functions: { hasPermission },
      });

      const { payload, error } = await ucRegistrarManifestacao.run({
        ...manifestacao,
        usuario,
      });

      handleAbstractUserCaseError(error);

      return response.ok(payload);
    } */
    handleAbstractUserCaseError(result?.error);

    return response.ok(result?.payload);
  }

  async analisar({ request, response, session }) {
    const trx = await Database.connection("flexCriterios").beginTransaction();
    const usuario = session.get("currentUserAccount");
    const { analise } = request.allParams();

    if (analise.idAcao == ACOES.COMPLEMENTO) {
      const ucSolicitarManifestacaoComplementar =
        new UcSolicitarManifestacaoComplementar({
          repository: {
            solicitacoesRepository: new SolicitacoesRepository(),
            manifestacoesRepository: new ManifestacoesRepository(),
          },
          trx,
          functions: { hasPermission },
        });

      const { payload, error } = await ucSolicitarManifestacaoComplementar.run({
        ...analise,
        usuario,
      });

      handleAbstractUserCaseError(error);

      return response.ok(payload);
    }

    if (analise.idAcao == ACOES.ANALISE) {
      const ucRegistrarAnalise = new UCRegistrarAnalise({
        repository: {
          solicitacoesRepository: new SolicitacoesRepository(),
          manifestacoesRepository: new ManifestacoesRepository(),
        },
        trx,
        functions: { hasPermission },
      });

      const { payload, error } = await ucRegistrarAnalise.run({
        ...analise,
        usuario,
      });

      handleAbstractUserCaseError(error);

      return response.ok(payload);
    }
  }

  async despachar({ request, response, session }) {
    const trx = await Database.connection("flexCriterios").beginTransaction();
    const usuario = session.get("currentUserAccount");
    console.log("Despachando");
    //tipo de despachante escolhido pelo analista e enviado como objeto despacho

    const { despachar } = request.allParams();

    if (despachar?.avancar) {
      const uCAvancarForcado = new UCAvancarForcado({
        repository: {
          solicitacoesRepository: new SolicitacoesRepository(),
          manifestacoesRepository: new ManifestacoesRepository(),
          arhMstRepository: new ArhMstRepository(),
        },
        functions: {
          getOneFunci,
          hasPermission,
        },
        trx,
      });

      const { payload, error } = await uCAvancarForcado.run({
        ...despachar,
        usuario,
      });

      handleAbstractUserCaseError(error);

      return response.ok(payload);
    }

    if (despachar?.remover) {
      const uCRemoverDeferidorPorDiretoria = new UCRemoverDeferidorPorDiretoria(
        {
          repository: {
            solicitacoesRepository: new SolicitacoesRepository(),
            manifestacoesRepository: new ManifestacoesRepository(),
            arhMstRepository: new ArhMstRepository(),
          },
          functions: {
            getOneFunci,
            hasPermission,
          },
          trx,
        }
      );

      const { payload, error } = await uCRemoverDeferidorPorDiretoria.run({
        ...despachar,
        usuario,
      });

      handleAbstractUserCaseError(error);

      return response.ok(payload);
    }

    if (despachar.idAcao == ACOES.DISPENSADO) {
      const uCDispensarDespacho = new UCDispensarDespacho({
        repository: {
          solicitacoesRepository: new SolicitacoesRepository(),
          manifestacoesRepository: new ManifestacoesRepository(),
          arhMstRepository: new ArhMstRepository(),
        },
        functions: {
          getOneFunci,
          hasPermission,
        },
        trx,
      });

      const { payload, error } = await uCDispensarDespacho.run({
        ...despachar,
        usuario,
      });

      handleAbstractUserCaseError(error);

      return response.ok(payload);
    }

    const ucRegistrarDespacho = new UCRegistrarDespacho({
      repository: {
        solicitacoesRepository: new SolicitacoesRepository(),
        manifestacoesRepository: new ManifestacoesRepository(),
        arhMstRepository: new ArhMstRepository(),
      },
      functions: {
        getOneFunci,
        hasPermission,
      },
      trx,
    });

    const { payload, error } = await ucRegistrarDespacho.run({
      ...despachar,
      usuario,
    });

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async deferir({ request, response, session }) {
    const trx = await Database.connection("flexCriterios").beginTransaction();
    const usuario = session.get("currentUserAccount");
    const { deferir } = request.allParams();

    if (deferir.idAcao == ACOES.COMPLEMENTO) {
      const ucGepesDiteroriaDevolveAnalise = new UcGepesDiteroriaDevolveAnalise(
        {
          repository: {
            solicitacoesRepository: new SolicitacoesRepository(),
            manifestacoesRepository: new ManifestacoesRepository(),
          },
          trx,
          functions: { hasPermission },
        }
      );

      const { payload, error } = await ucGepesDiteroriaDevolveAnalise.run({
        ...deferir,
        usuario,
      });

      handleAbstractUserCaseError(error);

      return response.ok(payload);
    }

    const ucRegistrarDeferimento = new UcRegistrarDeferimento({
      repository: {
        solicitacoesRepository: new SolicitacoesRepository(),
        manifestacoesRepository: new ManifestacoesRepository(),
        escaloesRepository: new EscaloesRepository(),
      },
      trx,
      functions: { hasPermission },
    });

    const { payload, error } = await ucRegistrarDeferimento.run({
      ...deferir,
      usuario,
    });

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }

  async finalizar({ request, response, session }) {
    const trx = await Database.connection("flexCriterios").beginTransaction();
    const usuario = session.get("currentUserAccount");
    const { finalizar } = request.allParams();

    if (finalizar.idAcao == ACOES.COMPLEMENTO) {
      const ucGepesDiteroriaDevolveAnalise = new UcGepesDiteroriaDevolveAnalise(
        {
          repository: {
            solicitacoesRepository: new SolicitacoesRepository(),
            manifestacoesRepository: new ManifestacoesRepository(),
          },
          trx,
          functions: { hasPermission },
        }
      );

      const { payload, error } = await ucGepesDiteroriaDevolveAnalise.run({
        ...finalizar,
        usuario,
      });

      handleAbstractUserCaseError(error);

      return response.ok(payload);
    }

    const ucFinalizarSolicitacao = new UcFinalizarSolicitacao({
      repository: {
        solicitacoesRepository: new SolicitacoesRepository(),
        manifestacoesRepository: new ManifestacoesRepository(),
      },
      trx,
      functions: { hasPermission },
    });

    const { payload, error } = await ucFinalizarSolicitacao.run({
      ...finalizar,
      usuario,
    });

    handleAbstractUserCaseError(error);

    return response.ok(payload);
  }
}

module.exports = FlexCriteriosController;
