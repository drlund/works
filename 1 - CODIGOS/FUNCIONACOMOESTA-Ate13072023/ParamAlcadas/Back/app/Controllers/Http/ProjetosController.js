"use strict";

const Database = use("Database");
const _ = use("lodash");
const exception = use("App/Exceptions/Handler");
const Helpers = use("Helpers");
// const transformaData = use("App/Commons/projetos/CommonsFunctionsProjetos");
const {
  getFilesJarFromRequest,
  getFilesFromRequest,
  salvaArquivoPublicoNoDiretorio,
} = use("App/Commons/FileUtils");
const fs = use("fs");
const md5 = use("md5");
const { reject } = require("lodash");
const moment = require("moment");
const { getOneFunci } = use("App/Commons/Arh");
const hasPermission = use("App/Commons/HasPermission");

// Getters
// const {
//   getAnexo,
//   getAtividadeById,
//   getFuncionalidadeById,
//   getListaOpcoes,
//   getProjeto,
//   getProjetosToLista,
//   getResponsavel,
// } = use("App/Commons/projetos/CatalogoMetodosGetters");

// Models
// const {
//   anexoFactory,
//   atividadeFactory,
//   atividadePausaFactory,
//   esclarecimentoFactory,
//   funcionalidadeFactory,
//   projetoFactory,
//   responsavelFactory
// } = use("App/Commons/projetos/CatalogoMetodosModelFactory");

const Projeto = use("App/Models/Mysql/Projetos/Projeto.js");
const Responsavel = use("App/Models/Mysql/Projetos/Responsavel.js");
const Funcionalidade = use("App/Models/Mysql/Projetos/Funcionalidade.js");
const Anexo = use("App/Models/Mysql/Projetos/Anexo.js");
const Esclarecimento = use("App/Models/Mysql/Projetos/Esclarecimento.js");
const Atividade = use("App/Models/Mysql/Projetos/Atividade.js");
const AtividadePausa = use("App/Models/Mysql/Projetos/AtividadePausa.js");
const AtividadeComplexidade = use(
  "App/Models/Mysql/Projetos/AtividadeComplexidade.js"
);
const AtividadePrioridade = use(
  "App/Models/Mysql/Projetos/AtividadePrioridade.js"
);
const AtividadeFuncionalidadeProjetoStatus = use(
  "App/Models/Mysql/Projetos/AtividadeFuncionalidadeProjetoStatus.js"
);
const AtividadeFuncionalidadeTipo = use(
  "App/Models/Mysql/Projetos/AtividadeFuncionalidadeTipo.js"
);

// Transformers
const ProjetosTransformer = use(
  "App/Transformers/Projetos/ProjetosTransformer.js"
);
const ResponsaveisTransformer = use(
  "App/Transformers/Projetos/ResponsaveisTransformer.js"
);
const FuncionalidadesTransformer = use(
  "App/Transformers/Projetos/FuncionalidadesTransformer.js"
);

// variáveis com endereços dos diretórios dos anexos no servidor
const constantes = use("App/Commons/Projetos/Constantes");
let filesPath;
const statusAtrasado = -1;
const statusNaoIniciado = 1;
const statusEmAndamento = 2;
const statusInterrompido = 3;
const statusAguardandoEsclarecimento = 4;
const statusConcluido = 5;
const statusTodos = 8;
const permissoesRequeridasAdm = ["ADM", "ACPTOTAL"];
class ProjetosController {
  /*********** Métodos Post ****************
   * Grava nas tabelas
   */

  async postProjeto({ request, response, session }) {
    const { informacaoBasica, responsaveis, funcionalidades, atividades } =
      request.allParams();
    const user = session.get("currentUserAccount");

    // inicio do transact
    const trx = await Database.connection("projetos").beginTransaction();

    try {
      // gravar os dados do projeto
      const projetoData = await this._projetoFactory(
        JSON.parse(informacaoBasica),
        user
      );
      await projetoData.save(trx);
      // if (projetoData.isNew) {
      //   throw new exception(
      //     "Falha ao gravar os dados básicos do projeto.",
      //     400
      //   );
      // }

      // gravar os anexos, se houver
      const anexoData = [];
      const anexosJar = await getFilesJarFromRequest(request, "files", {
        size: "10mb",
      });
      if (anexosJar) {
        filesPath = `app_projetos/idProjeto${projetoData.id}`;
        // // grava fisicamente
        // const errosAoGravar = await salvaArquivoPublicoNoDiretorio(
        //   anexosJar,
        //   filesPath,
        //   setAnexo.renomearArquivo
        // );
        // if (errosAoGravar.length) {
        //   throw new exception("Falha ao gravar os anexos do projeto.", 400);
        // }
        // const anexoArrayFiles = await getFilesFromRequest(request);
        // for (const anexo of anexoArrayFiles) {
        //   let temp = setAnexo.renomearArquivo(anexo);
        //   const arquivoJaExiste = await getAnexo.getAnexoToJson(
        //     projetoData.id,
        //     temp.name
        //   );
        //   // grava na tabela
        //   let anexoTemp;
        //   if (arquivoJaExiste) {
        //     arquivoJaExiste.ativo = "true";
        //     anexoTemp = await setAnexo.setAnexoExistente(arquivoJaExiste, trx);
        //   } else {
        //     anexoTemp = await setAnexo.setAnexoNovo( projetoData, filesPath, trx);
        //   }
        //   anexoData.push(anexoTemp);
        // }

        await this._gravarAnexo(
          anexosJar,
          projetoData,
          request,
          filesPath,
          trx
        );
      }

      // gravar os dados dos responsaveis
      const responsavelData = [];
      const responsaveisFromForm = JSON.parse(responsaveis);
      for (const responsavel of responsaveisFromForm) {
        const responsavelTemp = await this._gravarResponsavelProjeto(
          responsavel,
          projetoData,
          trx
        );
        responsavelData.push(responsavelTemp);
      }

      // gravar os dados da funcionalidade
      const funcionalidadeData = [];
      for (const funcionalidade of JSON.parse(funcionalidades)) {
        const funcionalidadeTemp = await this._gravarFuncionalidade(
          funcionalidade,
          projetoData,
          responsavelData,
          responsaveisFromForm,
          trx
        );
        funcionalidadeData.push(funcionalidadeTemp);
      }

      // gravar as atividades do projeto
      const atividadeData = [];
      for (const atividade of JSON.parse(atividades)) {
        const atividadeTemp = await this._gravarAtividade(
          atividade,
          funcionalidadeData,
          responsavelData,
          responsaveisFromForm,
          trx
        );
        if (atividade.pausa && atividade.pausa.length) {
          await this._gravarPausa(atividade, trx);
        }
        atividadeData.push(atividadeTemp);
      }

      // executar o transact
      await trx.commit();
      response.ok(projetoData.id);
    } catch (error) {
      await trx.rollback();
      fs.rmdirSync(Helpers.appRoot(constantes.publicPath + filesPath), {
        recursive: true,
      });
      if (error.message) {
        response.badRequest(error.message);
      } else {
        response.badRequest("Erro interno em subrotinas.");
      }
    }
  }

  async patchProjeto({ request, response, session }) {
    const {
      informacaoBasica,
      responsaveis,
      funcionalidades,
      anexosServidor,
      atividades,
    } = request.allParams();
    const trx = await Database.connection("projetos").beginTransaction();
    try {
      // alterar os dados do projeto
      const dadosBasicos = JSON.parse(informacaoBasica);
      const projetoData = await Projeto.find(dadosBasicos.id);

      (projetoData.titulo = dadosBasicos.titulo),
        (projetoData.resumo = dadosBasicos.resumo),
        (projetoData.objetivo = dadosBasicos.objetivo),
        (projetoData.qtdePessoas = dadosBasicos.qtdePessoas),
        (projetoData.reducaoTempo = dadosBasicos.reducaoTempo),
        (projetoData.reducaoCusto = dadosBasicos.reducaoCusto),
        (projetoData.idStatus = dadosBasicos.idStatus),
        await projetoData.save(trx);

      // alterar/incluir anexos
      // lista de arquivos incluídos anteriormente
      const listaAnexos = JSON.parse(anexosServidor);
      if (listaAnexos.length) {
        for (const anexo of listaAnexos) {
          await this._updateAnexos(anexo, trx);
        }
      }
      // novos arquivos a serem incluidos
      const anexosJar = await getFilesJarFromRequest(request, "files", {
        size: "10mb",
      });
      if (anexosJar) {
        filesPath = `app_projetos/idProjeto${projetoData.id}`;
        await this._gravarAnexo(
          anexosJar,
          projetoData,
          request,
          filesPath,
          trx
        );
      }

      // alterar responsaveis projeto
      const responsavelData = [];
      const projetoFullFromDB = await this._getProjeto(dadosBasicos.id, trx);
      const responsaveisFromDB = projetoFullFromDB.responsavel;
      const responsaveisFromForm = JSON.parse(responsaveis);
      const responsaveisToRemove = [];

      // remover o vinculo entre os responsaveis e o projeto
      const listaIdsResponsaveis = await this._getResponsaveisToRemove(
        responsaveisFromForm
      );
      await this._removerPivotTodosResponsaveisProjeto(
        projetoData,
        listaIdsResponsaveis,
        trx
      );
      // responsaveis a serem gravados ou alterados
      for (const responsavel of responsaveisFromForm) {
        const responsavelTemp = await this._gravarResponsavelProjeto(
          responsavel,
          projetoData,
          trx
        );
        responsavelData.push(responsavelTemp);
      }

      // alterar os dados da funcionalidade
      const funcionalidadeData = [];
      const funcionalidadesFromDB = projetoFullFromDB.funcionalidade;
      const funcionalidadesFromForm = JSON.parse(funcionalidades);
      const funcionalidadesToRemove = [];
      for (const funcionalidade of funcionalidadesFromDB) {
        const manter = funcionalidadesFromForm.find((funcionalidadeForm) => {
          return funcionalidade.id === funcionalidadeForm.id;
        });
        if (!manter) funcionalidadesToRemove.push(funcionalidade);
      }

      // funcionalidades a excluir
      for (const funcionalidade of funcionalidadesToRemove) {
        const remover = await Funcionalidade.find(funcionalidade.id);
        remover.ativo = "false";
        await remover.save(trx);

        // responsaveis a excluir
        for (const responsavel of funcionalidade.responsavel) {
          const responsavelToTransact = await Responsavel.find(responsavel.id);
          await this._removerPivotResponsavelFuncionalidade(
            responsavelToTransact,
            funcionalidade.id,
            trx
          );
        }
      }

      // alterar funcionalidades do projeto
      for (const funcionalidade of funcionalidadesFromForm) {
        // se o projeto estiver concluído, todas as funcionalidades tbm estarão
        if (projetoData.idStatus === statusConcluido)
          funcionalidade.idStatus = statusConcluido;
        let funcionalidadeTemp = await this._gravarFuncionalidade(
          funcionalidade,
          projetoData,
          responsavelData,
          responsaveisFromForm,
          trx
        );
        funcionalidadeData.push(funcionalidadeTemp);
      }

      // verifica quais atividades estão registradas
      const atividadeData = [];
      const atividadesFromDB = projetoFullFromDB.atividade;
      const atividadesFromForm = JSON.parse(atividades);
      const atividadesToRemove = [];
      for (const atividade of atividadesFromDB) {
        const manter = atividadesFromForm.find((atividadeForm) => {
          return atividade.id === atividadeForm.id;
        });
        if (!manter) atividadesToRemove.push(atividade);
      }

      // atividades a excluir
      for (const atividade of atividadesToRemove) {
        const remover = await Atividade.find(atividade.id);
        remover.ativo = "false";
        await remover.save(trx);

        // responsaveis a excluir
        for (const responsavel of atividade.responsavel) {
          const responsavelToTransact = await Responsavel.find(responsavel.id);
          await this._removerPivotResponsavelAtividade(
            responsavelToTransact,
            atividade.id,
            trx
          );
        }
      }

      // alterar atividades do projeto
      for (const atividade of atividadesFromForm) {
        let atividadeTemp = await this._gravarAtividade(
          atividade,
          funcionalidadeData,
          responsavelData,
          responsaveisFromForm,
          trx
        );
        if (atividade.pausa && atividade.pausa.length) {
          await this._gravarPausa(atividade, trx);
        }
        atividadeData.push(atividadeTemp);
      }

      // executar o transact
      await trx.commit();
      response.ok(projetoData.id);
    } catch (error) {
      await trx.rollback();
      throw new exception("Falha ao alterar os dados do projeto.", 500);
    }
  }

  async patchAtividade({ request, response }) {
    const { idProjeto, idStatusProjeto, idAtividade, idStatusAtividade } =
      request.allParams();
    try {
      const atividade = await Atividade.find(idAtividade);
      let mensagem;
      const gravarData = moment().format();
      if (!atividade) {
        throw new exception("Atividade não foi encontrada.", 400);
      }

      switch (parseInt(idStatusAtividade)) {
        case statusEmAndamento:
          atividade.dtInicio = gravarData;
          mensagem = "Atividade iniciada.";
          break;
        case statusConcluido:
          atividade.dtConclusao = gravarData;
          mensagem = "Atividade concluída.";
          break;
        default:
          break;
      }
      atividade.idStatus = parseInt(idStatusAtividade);
      await atividade.save();
      // if (atividade.isNew) {
      //   throw new exception("Não foi possível iniciar a atividade. Tente novamente.", 400);
      // }

      if (parseInt(idStatusProjeto) === statusConcluido) {
        const projeto = await Projeto.find(idProjeto);
        if (!projeto) {
          throw new exception("Projeto não foi encontrado.", 400);
        }
        projeto.dtConclusao = gravarData;
        projeto.idStatus = parseInt(idStatusProjeto);
        await projeto.save();

        // if (projeto.isNew) {
        //   throw new exception("Não foi possível encerrar o Projeto. Tente novamente.", 400);
        // }
      }

      response.ok(mensagem);
    } catch (error) {
      response.badRequest(error.message);
    }
  }

  async postPausa({ request, response }) {
    const { pausa } = request.allParams();
    const atividade = await Atividade.find(pausa.idAtividadePausada);
    if (atividade.pausa && atividade.pausa.length) {
      atividade.pausa.push(pausa);
    } else {
      atividade.pausa = [pausa];
    }

    try {
      // gravar os dados da pausa
      await this._gravarPausa(atividade.toJSON());
      response.ok("Esclarecimento/Observação cadastrado com sucesso.");
    } catch (error) {
      response.badRequest(error.message);
    }
  }

  async deleteProjeto({ request, response }) {
    const { idProjeto } = request.allParams();

    try {
      const projeto = await Projeto.query().where("id", idProjeto).first();

      if (!projeto) {
        throw new exception(
          "O projeto escolhido para remoção não foi encontrado.",
          400
        );
      }
      projeto.ativo = "false";
      await projeto.save();
      response.ok("Projeto removido com sucesso.");
    } catch (error) {
      throw new exception("Falha ao remover este projeto.", 400);
    }
  }

  async postEsclarecimento({ request, response, session }) {
    const {
      idAtividade,
      idEsclarecimento,
      idFuncionalidade,
      idProjeto,
      matriculaIndicadoResponder,
      pedido,
      isObservacao,
    } = request.allParams();
    const user = session.get("currentUserAccount");

    const trx = await Database.connection("projetos").beginTransaction();
    try {
      // gravar os dados do projeto
      const esclarecimentoData = await this._esclarecimentoFactory(
        {
          idAtividade,
          idEsclarecimento,
          idFuncionalidade,
          idProjeto,
          matriculaIndicadoResponder,
          pedido,
          isObservacao,
        },
        user
      );
      await esclarecimentoData.save(trx);

      if (!isObservacao) {
        if (this._isNovoStatus(idAtividade)) {
          await this._atualizarStatus(
            "atividade",
            idAtividade,
            constantes.statusAguardandoEsclarecimento,
            trx
          );
        }
        if (this._isNovoStatus(idFuncionalidade)) {
          await this._atualizarStatus(
            "funcionalidade",
            idFuncionalidade,
            constantes.statusAguardandoEsclarecimento,
            trx
          );
        }
        if (this._isNovoStatus(idProjeto)) {
          await this._atualizarStatus(
            "projeto",
            idProjeto,
            constantes.statusAguardandoEsclarecimento,
            trx
          );
        }
      }
      await trx.commit();
      response.ok("Esclarecimento/Observação cadastrado com sucesso.");
    } catch (error) {
      await trx.rollback();
      throw new exception(
        "Falha ao gravar os esclarecimentos/observações do projeto.",
        500
      );
    }
  }

  async patchEsclarecimento({ request, response, session }) {
    const { id, resposta, ativo } = request.allParams();
    const user = session.get("currentUserAccount");

    const trx = await Database.connection("projetos").beginTransaction();
    try {
      // gravar os dados do projeto
      const esclarecimentoData = await Esclarecimento.find(id);
      if (resposta) {
        esclarecimentoData.resposta = resposta;
        esclarecimentoData.matriculaResposta = user.chave;
        esclarecimentoData.dtResposta = moment().format("YYYY-MM-DD HH:mm:ss");
        esclarecimentoData.diasParaResposta = moment().diff(
          moment(esclarecimentoData.dtCriacao).format("YYYY-MM-DD"),
          "days"
        );

        await this._checkAtualizacaoStatus(
          "esclarecimento",
          esclarecimentoData.idProjeto,
          null,
          id,
          trx
        );
      } else {
        esclarecimentoData.ativo = ativo.toString();
      }
      await esclarecimentoData.save(trx);
      await trx.commit();
      response.ok(
        "Resposta do esclarecimento/observação registrada com sucesso."
      );
    } catch (error) {
      await trx.rollback();
      throw new exception(
        "Falha ao gravar a resposta do esclarecimento/observação do projeto.",
        500
      );
    }
  }
  /*********** Fim dos Métodos Post ****************/

  /*********** Métodos Model(factory) ****************
   * Cria as models para serem usadas no transact
   */
  async _projetoFactory(informacaoBasica, user) {
    const projetoFactory = new Projeto();
    projetoFactory.idStatus = informacaoBasica.idStatus;
    projetoFactory.matriculaSolicitante = user.chave;
    projetoFactory.prefixoSolicitante = user.prefixo;
    projetoFactory.uorSolicitante = user.uor_trabalho;
    projetoFactory.titulo = informacaoBasica.titulo;
    projetoFactory.resumo = informacaoBasica.resumo;
    projetoFactory.objetivo = informacaoBasica.objetivo;
    projetoFactory.qtdePessoas = informacaoBasica.qtdePessoas;
    projetoFactory.reducaoTempo = informacaoBasica.reducaoTempo;
    projetoFactory.reducaoCusto = informacaoBasica.reducaoCusto;

    return projetoFactory;
  }

  async _responsavelFactory(responsavel) {
    const funci = await getOneFunci(responsavel.matricula);
    const responsavelFactory = new Responsavel();
    responsavelFactory.matricula = funci.matricula;
    responsavelFactory.nome = funci.nome;

    return responsavelFactory;
  }

  async _funcionalidadeFactory(funcionalidade, projeto) {
    const funcionalidadeFactory = new Funcionalidade();
    funcionalidadeFactory.idProjeto = projeto.id;
    funcionalidadeFactory.idStatus = funcionalidade.idStatus;
    funcionalidadeFactory.idTipo = funcionalidade.idTipo;
    funcionalidadeFactory.idFuncionalidadeReferencia =
      funcionalidade.idFuncionalidadeReferencia;
    funcionalidadeFactory.titulo = funcionalidade.titulo;
    funcionalidadeFactory.descricao = funcionalidade.descricao;
    funcionalidadeFactory.detalhe = funcionalidade.detalhe;

    return funcionalidadeFactory;
  }

  async _anexoFactory(anexo, projeto) {
    const anexoFactory = new Anexo();
    anexoFactory.idProjeto = projeto.id;
    anexoFactory.nome = anexo.nome;
    anexoFactory.nomeOriginal = anexo.nomeOriginal;
    anexoFactory.extensao = anexo.extensao;
    anexoFactory.path = anexo.path;

    return anexoFactory;
  }

  async _esclarecimentoFactory(esclarecimento, user) {
    const esclarecimentoFactory = new Esclarecimento();
    esclarecimentoFactory.idProjeto = esclarecimento.idProjeto;
    esclarecimentoFactory.idEsclarecimento = esclarecimento.idEsclarecimento;
    esclarecimentoFactory.idFuncionalidade = esclarecimento.idFuncionalidade;
    esclarecimentoFactory.idAtividade = esclarecimento.idAtividade;
    esclarecimentoFactory.pedido = esclarecimento.pedido;
    esclarecimentoFactory.matriculaPedido = user.chave;
    esclarecimentoFactory.matriculaIndicadoResponder =
      esclarecimento.matriculaIndicadoResponder;
    esclarecimentoFactory.isObservacao = esclarecimento.isObservacao.toString();

    return esclarecimentoFactory;
  }

  async _atividadeFactory(atividade, funcionalidade) {
    const atividadeFactory = new Atividade();
    atividadeFactory.idProjeto = funcionalidade.idProjeto;
    atividadeFactory.idFuncionalidade = funcionalidade.id;
    atividadeFactory.idComplexidade = atividade.idComplexidade;
    atividadeFactory.idPrioridade = atividade.idPrioridade;
    if (!atividade.dtInicio) {
      // não iniciado
      atividadeFactory.idStatus = constantes.statusNaoIniciado;
    } else if (
      atividade.dtInicio &&
      atividade.idStatus === constantes.statusNaoIniciado
    ) {
      // em andamento
      atividadeFactory.idStatus = constantes.statusEmAndamento;
    } else if (atividade.dtConclusao) {
      // concluído
      atividadeFactory.idStatus = constantes.statusConcluido;
    } else {
      atividadeFactory.idStatus = atividade.idStatus;
    }
    atividadeFactory.idTipo = atividade.idTipo;
    atividadeFactory.titulo = atividade.titulo;
    atividadeFactory.descricao = atividade.descricao;
    atividadeFactory.dtInicio = atividade.dtInicio;
    atividadeFactory.dtConclusao = atividade.dtConclusao;
    atividadeFactory.prazo = atividade.prazo;

    return atividadeFactory;
  }

  async _atividadePausaFactory(pausa) {
    const pausaFactory = new AtividadePausa();
    pausaFactory.idAtividadePausada = pausa.idAtividadePausada;
    pausaFactory.idAtividadeGeradoraPausa = pausa.idAtividadeGeradoraPausa;
    pausaFactory.titulo = pausa.titulo;
    pausaFactory.descricao = pausa.descricao;
    pausaFactory.prazo = pausa.prazo;

    return pausaFactory;
  }

  /*********** Fim dos Métodos Model(factory) ****************/

  /*********** Métodos Get Internos ****************
   * Faz consultas internas para prover dados para métodos externos
   */
  async _getProjeto(idProjeto, trx = null) {
    let queryProjeto = Projeto.query()
      .where({ id: idProjeto, ativo: "true" })
      .with("responsavel", (builder) => {
        // adiciona os campos extras da tabela pivot
        builder
          .withPivot(
            ["administrador", "dev", "dba", "ativo"],
            "app_projetos.projetos_responsaveis"
          )
          .where("ativo", "true")
          .with("responsavelData");
      })
      .with("funcionalidade", (builder) => {
        // adiciona os responsáveis pelas funcionalidades
        builder
          .with("responsavel", (builder2) => {
            // adiciona os campos extras da tabela pivot
            builder2
              .withPivot(
                ["principal", "ativo"],
                "app_projetos.funcionalidades_responsaveis"
              )
              .where("ativo", "true");
          })
          .where("ativo", "true")
          .orderBy("idStatus", "asc")
          .orderBy("dtCriacao", "asc")
          .orderBy("titulo", "asc");
      })
      .with("anexo", (builder) => {
        builder.where("ativo", "true");
      })
      .with("timeline")
      .with("atividade", (builder) => {
        builder
          .with("responsavel", (builder2) => {
            builder2
              .withPivot(["ativo"], "app_projetos.atividades_responsaveis")
              .where("ativo", "true");
          })
          .with("status")
          .with("complexidade")
          .with("prioridade")
          .with("pausa")
          .with("esclarecimento")
          .where("ativo", "true")
          .orderBy("idStatus", "asc")
          .orderBy("dtCriacao", "asc")
          .orderBy("titulo", "asc");
      })
      .with("conhecimento")
      .with("esclarecimento", (builder) => {
        builder
          .with("nomePedido")
          .with("nomeIndicadoResponder")
          .with("nomeResposta")
          .where("ativo", "true");
      })
      .with("problema")
      .with("status")
      .orderBy("titulo", "asc");
    let projeto;
    if (trx) {
      projeto = await queryProjeto.transacting(trx).first();
    } else {
      projeto = await queryProjeto.first();
    }
    if (projeto) projeto = projeto.toJSON();
    return projeto;
  }

  async _getListaAtividades(matricula, status) {
    status = parseInt(status);
    const responsavel = await Responsavel.findBy("matricula", matricula);
    let queryAtividade = Atividade.query()
      .with("projeto")
      .with("funcionalidade")
      .with("pausa")
      .with("status")
      .with("complexidade")
      .with("prioridade")
      .with("responsavel")
      .with("esclarecimento")
      .where("ativo", "true");
    if (status === statusConcluido) {
      queryAtividade = queryAtividade.where("idStatus", status);
    } else {
      queryAtividade = queryAtividade
        .whereHas("projeto", (builder) => {
          builder.whereNot("idStatus", statusConcluido);
        })
        .whereNot("idStatus", statusConcluido);
    }
    let listaAtividades = await queryAtividade
      .whereHas("responsavel", (builder) => {
        builder.where("idResponsaveis", responsavel.id);
      })
      .orderBy("idStatus")
      .orderBy("idProjeto")
      .fetch();
    if (listaAtividades) listaAtividades = listaAtividades.toJSON();

    return listaAtividades;
  }

  async _getProjetosToLista(user, statusTipo) {
    const isAdmFerramenta = await hasPermission({
      nomeFerramenta: "Projetos",
      dadosUsuario: user,
      permissoesRequeridas: permissoesRequeridasAdm,
      verificarTodas: false,
    });

    let queryProjeto = Projeto.query()
      .with("responsavelData")
      .with("responsavel", (builder) => {
        builder
          .with("responsavelData")
          .withPivot(["administrador", "dev", "dba", "ativo"])
          .where("app_projetos.projetos_responsaveis.ativo", "true");
      })
      // aqui verificar se vou colocar condicional aqui, para incluir funcionalidade e atividade sob demanda
      .with("funcionalidade", (builder) => {
        // adiciona os responsáveis pelas funcionalidades
        builder
          .with("responsavel", (builder2) => {
            // adiciona os campos extras da tabela pivot
            builder2
              .with("responsavelData")
              .withPivot(
                ["principal", "ativo"],
                "app_projetos.funcionalidades_responsaveis"
              )
              .where("ativo", "true");
          })
          .where("ativo", "true")
          .orderBy("idStatus", "asc")
          .orderBy("dtCriacao", "asc")
          .orderBy("titulo", "asc");
      })
      .with("atividade", (builder) => {
        builder
          .with("responsavel", (builder2) => {
            builder2
              .with("responsavelData")
              .withPivot(["ativo"], "app_projetos.atividades_responsaveis")
              .where("ativo", "true");
          })
          .with("status")
          .with("complexidade")
          .with("prioridade")
          .with("pausa")
          .with("esclarecimento")
          .where("ativo", "true")
          .orderBy("idStatus", "asc")
          .orderBy("dtCriacao", "asc")
          .orderBy("titulo", "asc");
      })
      .with("esclarecimento")
      .with("status")
      .where("ativo", "true");
    if (!isAdmFerramenta) {
      queryProjeto = queryProjeto.where(function () {
        this.whereHas("responsavel", (builder) => {
          builder.where("matricula", user.chave);
        })
          .orWhere("matriculaSolicitante", user.chave)
          .orWhere("uorSolicitante", user.uor_trabalho);
      });
    }

    if (statusTipo === 5) {
      queryProjeto = queryProjeto.where("idStatus", 5);
    } else {
      queryProjeto = queryProjeto.whereNot("idStatus ", 5);
    }

    let projeto = await queryProjeto
      .orderBy("idStatus", "asc")
      .orderBy("titulo", "asc")
      .fetch();

    if (projeto) projeto = projeto.toJSON();

    return projeto;
  }

  async _getResponsavel(matricula, trx) {
    let queryResponsavel = Responsavel.query()
      .where("matricula", matricula)
      .with("projeto.responsavel")
      .with("projeto.status")
      .with("projeto", (builder) => {
        builder.withPivot(["administrador", "dev", "dba", "ativo"]).where({
          "app_projetos.projetos_responsaveis.ativo": "true",
          "app_projetos.projetos.ativo": "true",
        });
      })
      .with("funcionalidade", (builder) => {
        builder
          .withPivot(["principal", "ativo"])
          .where("app_projetos.funcionalidades_responsaveis.ativo", "true")
          .where("app_projetos.funcionalidades.ativo", "true");
      })
      .with("atividade", (builder) => {
        builder
          .withPivot(["ativo"])
          .where("app_projetos.atividades_responsaveis.ativo", "true")
          .where("app_projetos.atividades.ativo", "true");
      });
    let responsavel;
    if (trx) {
      responsavel = await queryResponsavel.transacting(trx).first();
    } else {
      responsavel = await queryResponsavel.first();
    }
    if (responsavel) responsavel = responsavel.toJSON();
    return responsavel;
  }

  async _getResponsaveisToRemove(lista) {
    const listaIdsResponsaveis = lista.reduce((acumulador, valorAtual) => {
      if (typeof valorAtual.id === "number") {
        acumulador.push(valorAtual.id);
      }
      return acumulador;
    }, []);

    return listaIdsResponsaveis;
  }

  async _getAnexoByName(idProjeto, nome) {
    let anexo = await Anexo.query()
      .where("idProjeto", idProjeto)
      .where("nome", nome)
      .where("ativo", "true")
      .first();

    if (anexo) anexo = anexo.toJSON();
    return anexo;
  }

  async _getFuncionalidade(idFuncionalidade, trx) {
    let queryFuncionalidade = Funcionalidade.query()
      .where("id", idFuncionalidade)
      .where("ativo", "true")
      .with("projeto")
      .with("responsavel", (builder) => {
        builder.withPivot(["principal", "ativo"]).where("ativo", "true");
      })
      .with("status")
      .with("tipo");
    let funcionalidade;
    if (trx) {
      funcionalidade = await queryFuncionalidade.transacting(trx).first();
    } else {
      funcionalidade = await queryFuncionalidade.first();
    }

    if (funcionalidade) funcionalidade = funcionalidade.toJSON();
    return funcionalidade;
  }

  async _getAtividade(idAtividade, trx) {
    let queryAtividade = Atividade.query()
      .where("id", idAtividade)
      .where("ativo", "true")
      .with("projeto")
      .with("responsavel", (builder) => {
        builder.withPivot(["ativo"]).where("ativo", "true");
      })
      .with("prioridade")
      .with("complexidade")
      .with("grupo")
      .with("status")
      .with("tipo")
      .with("esclarecimento")
      .with("pausa");
    let atividade;
    if (trx) {
      atividade = await queryAtividade.transacting(trx).first();
    } else {
      atividade = await queryAtividade.first();
    }

    if (atividade) atividade = atividade.toJSON();
    return atividade;
  }

  async _getComplexidades() {
    let lista = await AtividadeComplexidade.all();

    return lista.toJSON();
  }

  async _getPrioridades() {
    let lista = await AtividadePrioridade.all();

    return lista.toJSON();
  }

  async _getStatus() {
    let lista = await AtividadeFuncionalidadeProjetoStatus.all();

    return lista.toJSON();
  }

  async _getTipos() {
    let lista = await AtividadeFuncionalidadeTipo.all();

    return lista.toJSON();
  }

  /*********** Fim dos Métodos Get Internos ****************/

  /*********** Métodos Get ****************
   * Faz select nas tabelas
   */
  async getListaAtividadesByFunci({ request, response, session, transform }) {
    const { matricula, statusTipo } = request.allParams();
    const user = session.get("currentUserAccount");
    let atividadeComPrazoPausa = [];
    if (user.chave === matricula) {
      const atividadesFromDB = await this._getListaAtividades(
        matricula,
        statusTipo
      );
      atividadeComPrazoPausa = await this._atividadesToFrontEnd(
        atividadesFromDB
      );
    }
    response.ok(atividadeComPrazoPausa);
  }

  async getListaProjetos({ request, response, session, transform }) {
    const { andamento, statusTipo } = request.allParams();
    const user = session.get("currentUserAccount");
    const projetosFromDB = await this._getProjetosToLista(
      user,
      parseInt(statusTipo)
    );

    for (const projeto of projetosFromDB) {
      // ajustar conteúdo das atividades
      if (JSON.parse(andamento))
        projeto.atividade = await this._atividadesToFrontEnd(projeto.atividade);

      for (const func of projeto.funcionalidade) {
        // incluir as atividades desta funcionalidade como parâmetro da funcionalidade
        if (projeto.atividade.length) {
          func.atividades = projeto.atividade.filter(
            (ativ) => ativ.idFuncionalidade === func.id
          );
        } else {
          func.atividades = [];
        }
        // inclui a data de inicio da primeira atividade como data da funcionalidade
        func.dtInicio = func.atividades.length
          ? func.atividades[0].dtInicio
          : null;
      }
    }

    let transformed;
    if (JSON.parse(andamento)) {
      transformed = await transform.collection(
        projetosFromDB,
        "Projetos/ProjetosTransformer.listaAndamento"
      );
    } else {
      transformed = await transform.collection(
        projetosFromDB,
        "Projetos/ProjetosTransformer.listaGeral"
      );
    }

    response.ok(transformed);
  }

  async getProjeto({ request, response, session, transform }) {
    const { id } = request.allParams();
    const user = session.get("currentUserAccount");
    let projeto;
    if (id) {
      projeto = await this._getProjeto(id);
    } else {
      projeto = {};
      projeto.listaComplexidades = await this._getComplexidades();
      projeto.listaPrioridades = await this._getPrioridades();
      projeto.listaStatus = await this._getStatus();
      projeto.listaTipos = await this._getTipos();

      return response.ok(projeto);
    }

    projeto.listaComplexidades = await this._getComplexidades();
    projeto.listaPrioridades = await this._getPrioridades();
    projeto.listaStatus = await this._getStatus();
    projeto.listaTipos = await this._getTipos();

    let transformed = null;
    const isAdmFerramenta = await hasPermission({
      nomeFerramenta: "Projetos",
      dadosUsuario: user,
      permissoesRequeridas: permissoesRequeridasAdm,
      verificarTodas: false,
    });
    if (await this._checkAcessoProjeto(user, projeto)) {
      const ajustaResponsavelParams = await this._responsaveisToFrontEnd(
        projeto.responsavel,
        projeto.funcionalidade
      );
      projeto.responsaveis = await transform.collection(
        ajustaResponsavelParams,
        ResponsaveisTransformer
      );
      const ajustaFuncionalidadesParams = await this._funcionalidadesToFrontEnd(
        projeto.funcionalidade
      );
      projeto.funcionalidades = await transform.collection(
        ajustaFuncionalidadesParams,
        FuncionalidadesTransformer
      );

      projeto.atividade = await this._atividadesToFrontEnd(projeto.atividade);
      transformed = await transform.item(projeto, ProjetosTransformer);
    }

    response.ok(transformed);
  }

  /*********** Fim dos Métodos Get ****************/

  /*********** Métodos Internos ************************/

  async _checkAcessoProjeto(user, projeto) {
    // retorna o projeto que o usuário tem acesso
    const isAdmFerramenta = await hasPermission({
      nomeFerramenta: "Projetos",
      dadosUsuario: user,
      permissoesRequeridas: permissoesRequeridasAdm,
      verificarTodas: false,
    });

    if (isAdmFerramenta) {
      return true;
    } else {
      const isSolicitante = projeto.matriculaSolicitante === user.chave;
      const isMesmaEquipe = projeto.uorSolicitante === user.uor_trabalho;
      const isResponsavel = projeto.responsavel.some((responsavel) => {
        return responsavel.matricula === user.chave;
      });
      return isSolicitante || isResponsavel || isMesmaEquipe;
    }
  }

  async _gravarResponsavelProjeto(responsavel, projetoData, trx) {
    // pesquisar se o responsável já foi cadastrado na tabela
    const responsavelDB = await this._getResponsavel(
      responsavel.matricula,
      trx
    );
    let responsavelTemp;
    let responsavelToTransact;
    if (_.isNil(responsavelDB)) {
      responsavelTemp = await this._responsavelFactory(responsavel);
      await responsavelTemp.save(trx);
      responsavelToTransact = responsavelTemp;
    }
    // se não tiver sido cadastrado
    else {
      responsavelTemp = responsavelDB;
      responsavelToTransact = await Responsavel.find(responsavelTemp.id);
    }

    // vincular os responsaveis e o projeto na pivot
    await this._gravarPivotResponsaveisProjeto(
      responsavelToTransact,
      projetoData.id,
      responsavel,
      trx
    );

    responsavelToTransact.idAnterior = responsavel.id;
    responsavelToTransact.funcionalidades = responsavel.funcionalidades;
    responsavelToTransact.principal = responsavel.principal;
    responsavelToTransact.dev = responsavel.dev;
    responsavelToTransact.dba = responsavel.dba;

    return responsavelToTransact;
  }

  // remover todos os responsáveis por projeto (impede a remoção de responsáveis de outros projetos)
  async _removerPivotTodosResponsaveisProjeto(projeto, listaResponsaveis, trx) {
    await projeto.responsavel().detach(
      // array de ids de responsaveis
      listaResponsaveis,
      // incluir no transact
      trx
    );
    // try {
    // } catch (error) {
    //   trx.rollback();
    //   throw new exception(
    //     "Falha ao desvincular o responsavel com o projeto.",
    //     400
    //   );
    // }
  }

  // inserir os responsáveis por projeto
  async _gravarPivotResponsaveisProjeto(
    responsavelToTransact,
    idProjeto,
    responsavel,
    trx
  ) {
    await responsavelToTransact.projeto().attach(
      // id do projeto
      [idProjeto],
      // marca a flag de administrador
      (linha) => {
        linha.administrador = responsavel.administrador.toString();
        linha.dev = responsavel.dev.toString();
        linha.dba = responsavel.dba.toString();
      },
      // incluir no transact
      trx
    );
    // teste
    // try {
    // } catch (error) {
    //   trx.rollback;
    //   throw new exception(
    //     "Falha ao vincular o responsavel com o projeto.",
    //     400
    //   );
    // }
  }

  async _removerPivotResponsavelProjeto(responsavelToTransact, idProjeto, trx) {
    await responsavelToTransact.projeto().detach(
      // id do projeto
      [idProjeto],
      // incluir no transact
      trx
    );
    // teste
    // try {
    // } catch (error) {
    //   trx.rollback;
    //   throw new exception(
    //     "Falha ao vincular o responsavel com o projeto.",
    //     400
    //   );
    // }
  }

  /**
   * Verifica se o id passado não é nulo
   * @param {string} id O id do projeto, da funcionalida, da atividade ou null
   * @returns {boolean}
   */
  async _isNovoStatus(id) {
    return _.isNil(JSON.parse(id));
  }

  /**
   * Realiza update no status da tabela informada
   * @param {string} tabela o nome da tabela a ser atualizada
   * @param {integer} id o identificador do registro
   * @param {integer} novoStatus o novo idStatus
   * @param {object} trx se a chamada estiver contida em um transact
   * @returns não há retorno, somente execução
   */
  async _atualizarStatus(tabela, id, novoStatus, trx = null) {
    let seraAtualizado = null;
    switch (tabela) {
      case "projeto":
        seraAtualizado = await Projeto.find(id);
        break;
      case "funcionalidade":
        seraAtualizado = await Funcionalidade.find(id);
        break;
      case "atividade":
        seraAtualizado = await Atividade.find(id);
        break;
      default:
        break;
    }

    if (seraAtualizado) {
      seraAtualizado.idStatus = novoStatus;
      if (trx) {
        await seraAtualizado.save(trx);
        // try {
        // } catch (error) {
        //   trx.rollback;
        //   throw new exception(`Falha ao atualizar o status do ${tipo}.`, 400);
        // }
      } else {
        await seraAtualizado.save();
      }
    }
    return;
  }

  async _checkAtualizacaoStatus(
    atualizarBy,
    idProjeto,
    idFuncionalidade = null,
    idEsclarecimento = null,
    trx
  ) {
    const projeto = await this._getProjeto(idProjeto, trx);
    switch (atualizarBy) {
      case "esclarecimento":
        const AguardandoEsclarecimento = projeto.esclarecimento.filter(
          (esclar) =>
            !JSON.parse(esclar.isObservacao) &&
            _.isNil(esclar.resposta) &&
            esclar.id !== idEsclarecimento
        );
        const idsAtividadeAguardandoEsclarecimento =
          AguardandoEsclarecimento.map((info) => info.idAtividade);

        if (idsAtividadeAguardandoEsclarecimento.length) {
          await this._atualizarStatus(
            "projeto",
            projeto.id,
            statusAguardandoEsclarecimento,
            trx
          );
        } else {
          await this._atualizarStatus(
            "projeto",
            projeto.id,
            statusEmAndamento,
            trx
          );
        }

        for (const ativ of projeto.atividade) {
          if (idsAtividadeAguardandoEsclarecimento.includes(ativ.id)) {
            await this._atualizarStatus(
              "atividade",
              ativ.id,
              statusAguardandoEsclarecimento,
              trx
            );
          }
          if (
            ativ.idStatus === statusAguardandoEsclarecimento &&
            !idsAtividadeAguardandoEsclarecimento.includes(ativ.id)
          ) {
            await this._atualizarStatus(
              "atividade",
              ativ.id,
              statusEmAndamento,
              trx
            );
          }
        }

        const idsFuncionalidadeAguardandoEsclarecimento =
          AguardandoEsclarecimento.map((info) => info.idFuncionalidade);
        for (const func of projeto.funcionalidade) {
          if (idsFuncionalidadeAguardandoEsclarecimento.includes(func.id)) {
            await this._atualizarStatus(
              "funcionalidade",
              func.id,
              statusAguardandoEsclarecimento,
              trx
            );
          }
          if (
            func.idStatus === statusAguardandoEsclarecimento &&
            !idsFuncionalidadeAguardandoEsclarecimento.includes(func.id)
          ) {
            await this._atualizarStatus(
              "funcionalidade",
              func.id,
              statusEmAndamento,
              trx
            );
          }
        }
        break;
      case "atividadeNova":
        await this._atualizarStatus(
          "projeto",
          idProjeto,
          statusEmAndamento,
          trx
        );
        await this._atualizarStatus(
          "funcionalidade",
          idFuncionalidade,
          statusEmAndamento,
          trx
        );
        break;
      default:
        throw new exception("Falha ao atualizar o status.", 500);
    }
  }

  async _gravarAnexo(anexosJar, projetoData, request, filesPath, trx) {
    const anexoData = [];
    const errosAoGravar = await salvaArquivoPublicoNoDiretorio(
      anexosJar,
      filesPath,
      this._renomearArquivo
    );
    if (errosAoGravar.length) {
      throw new exception("Falha ao gravar os anexos do projeto.", 400);
    }
    const anexoArrayFiles = await getFilesFromRequest(request);
    for (const anexo of anexoArrayFiles) {
      let temp = this._renomearArquivo(anexo);
      const arquivoJaExiste = await this._getAnexoByName(
        projetoData.id,
        temp.name
      );

      let anexoTemp;
      if (arquivoJaExiste) {
        arquivoJaExiste.ativo = "true";
        anexoTemp = await this._updateAnexos(arquivoJaExiste, trx);
      } else {
        anexoTemp = await this._anexoFactory(
          {
            nome: temp.name,
            nomeOriginal: anexo.clientName,
            extensao: anexo.extname,
            path: "uploads/" + filesPath,
            ativo: "true",
          },
          projetoData
        );
        await anexoTemp.save(trx);
        // try {
        // } catch (error) {
        //   trx.rollback;
        //   throw new exception(
        //     "Falha ao gravar os dados dos anexos do projeto.",
        //     400
        //   );
        // }
        anexoTemp = anexoTemp.toJSON();
      }
      anexoData.push(anexoTemp);
    }

    return anexoData;
  }

  async _updateAnexos(anexo, trx) {
    const anexoData = await Anexo.find(anexo.id);
    anexoData.ativo = anexo.ativo;

    await anexoData.save(trx);
    // try {
    // } catch (error) {
    //   trx.rollback;
    //   throw new exception("Falha ao alterar a lista de anexos.", 400);
    // }
    return anexoData.toJSON();
  }

  async _gravarFuncionalidade(
    funcionalidade,
    projetoData,
    responsavelData,
    responsaveisFromForm,
    trx
  ) {
    let funcionalidadeDB = null;
    if (typeof funcionalidade.id === "number") {
      funcionalidadeDB = await this._getFuncionalidade(funcionalidade.id, trx);
    }
    let funcionalidadeToTransact;
    let funcionalidadeTemp;
    // se a funcionalidade é nova
    if (_.isNil(funcionalidadeDB)) {
      funcionalidadeTemp = await this._funcionalidadeFactory(
        funcionalidade,
        projetoData
      );
    }
    // se já foi cadastrado essa funcionalidade
    else {
      funcionalidadeTemp = await Funcionalidade.find(funcionalidade.id);
      // atualiza os inputs da funcionalidade
      funcionalidadeTemp.titulo = funcionalidade.titulo;
      funcionalidadeTemp.descricao = funcionalidade.descricao;
      funcionalidadeTemp.detalhe = funcionalidade.detalhe;
      // try {
      // } catch (error) {
      //   trx.rollback;
      //   throw new exception(
      //     "Falha ao gravar a(s) funcionalidade(s) do projeto.",
      //     400
      //   );
      // }
    }
    // gravar/atualizar a funcionalidade no DB
    await funcionalidadeTemp.save(trx);

    funcionalidadeTemp.idAnterior = funcionalidade.id;
    funcionalidadeToTransact = funcionalidadeTemp;
    funcionalidadeTemp = funcionalidadeTemp.toJSON();

    const responsaveisFromDB = funcionalidadeDB
      ? funcionalidadeDB.responsavel
      : [];
    // exibe somente os responsáveis desta funcionalidade
    responsaveisFromForm = responsaveisFromForm.filter((responsavel) => {
      if (responsavel.funcionalidades.includes(funcionalidade.id)) {
        return responsavel;
      }
    });

    responsaveisFromForm.map((responsavel) => {
      // adicionar o id do transact e salvar o id temporário
      responsavel.idAnterior = responsavel.id;
      const responsavelTemp = responsavelData.find(
        (respData) => respData.matricula === responsavel.matricula
      );
      responsavel.id = responsavelTemp.id;
      if (responsavel.principalNestasFuncionalidades.length) {
        responsavel.principalNestasFuncionalidades = [
          responsavel.principalNestasFuncionalidades.find(
            (idFuncionalidade) =>
              idFuncionalidade === funcionalidadeTemp.idAnterior
          ),
        ];
      }
      // substituir o id temporário da funcionalidade pelo id gerado na gravação do transact
      responsavel.principalNestasFuncionalidades =
        responsavel.principalNestasFuncionalidades.map((idFuncionalidade) => {
          if ((idFuncionalidade = funcionalidadeTemp.idAnterior))
            return funcionalidadeTemp.id;
        });
      return responsavel;
    });

    // remover todos os responsaveis desta funcionalidade
    const listaIdsResponsaveis = await this._getResponsaveisToRemove(
      responsavelData
    );
    await this._removerPivotTodosResponsaveisFuncionalidade(
      funcionalidadeToTransact,
      listaIdsResponsaveis,
      trx
    );

    for (const responsavel of responsaveisFromForm) {
      // se o funci já está na base de dados
      let responsavelToTransact = await Responsavel.find(responsavel.id);
      // se o funci está sendo inserido no transact
      if (!responsavelToTransact) {
        responsavelToTransact = responsavelData.find(
          (respData) => respData.matricula === responsavel.matricula
        );
      }
      await this._gravarPivotResponsaveisFuncionalidade(
        responsavelToTransact,
        funcionalidadeTemp.id,
        responsavel,
        trx
      );
    }

    return funcionalidadeTemp;
  }

  async _removerPivotTodosResponsaveisFuncionalidade(
    funcionalidade,
    listaResponsaveis,
    trx
  ) {
    await funcionalidade.responsavel().detach(
      // array de ids dos responsaveis
      listaResponsaveis,
      // incluir no transact
      trx
    );
    // try {
    // } catch (error) {
    //   trx.rollback;
    //   throw new exception(
    //     "Falha ao desvincular os responsaveis com a funcionalidade.",
    //     400
    //   );
    // }
  }

  async _listaResponsaveisFuncionalidade(responsavelData, funcionalidade) {
    // vincular os responsaveis e funcionalidades, gravar os dados na tabela pivot
    const listaDeResponsaveisFuncionalidade = responsavelData
      .filter((responsavel) => {
        if (responsavel.funcionalidades.includes(funcionalidade.id))
          return responsavel;
      })
      .map((resp) => resp);

    return listaDeResponsaveisFuncionalidade;
  }

  async _gravarPivotResponsaveisFuncionalidade(
    responsavelToTransact,
    idFuncionalidade,
    responsavel,
    trx
  ) {
    await responsavelToTransact.funcionalidade().attach(
      // id da funcionalidade
      [idFuncionalidade],
      // marca a flag de principal contato
      (linha) => {
        let principal = "false";
        if (
          responsavel.principalNestasFuncionalidades.includes(idFuncionalidade)
        ) {
          principal = "true";
        }
        linha.principal = principal;
      },
      // incluir no transact
      trx
    );
    // try {
    // } catch (error) {
    //   trx.rollback;
    //   throw new exception(
    //     "Falha ao vincular o responsavel com a funcionalidade.",
    //     400
    //   );
    // }
  }

  async _excluirFuncionalidades(funcionalidade, responsavelData, trx) {
    const funcionalidadeTemp = await Funcionalidade.find(funcionalidade.id);
    funcionalidadeTemp.ativo = "false";

    await funcionalidadeTemp.save(trx);
    // try {
    // } catch (error) {
    //   trx.rollback;
    //   throw new exception(
    //     "Falha ao gravar a(s) funcionalidade(s) do projeto.",
    //     400
    //   );
    // }

    funcionalidadeTemp = funcionalidadeTemp.toJSON();

    // vincular os responsaveis e funcionalidades, gravar os dados na tabela pivot
    const listaDeResponsaveisFuncionalidade =
      await this._listaResponsaveisFuncionalidade(
        responsavelData,
        funcionalidade
      );

    // incluir ou alterar responsaveis na funcionalidade
    for (const responsavel of listaDeResponsaveisFuncionalidade) {
      const responsavelToTransact = await Responsavel.find(responsavel.id);
      await this._gravarPivotResponsaveisFuncionalidade(
        responsavelToTransact,
        funcionalidadeTemp.id,
        responsavel,
        trx
      );
    }

    return funcionalidadeTemp;
  }

  async _removerPivotResponsavelFuncionalidade(
    responsavelToTransact,
    idFuncionalidade,
    trx
  ) {
    await responsavelToTransact.funcionalidade().detach(
      // id da funcionalidade
      [idFuncionalidade],
      // incluir no transact
      trx
    );
    // try {
    // } catch (error) {
    //   trx.rollback;
    //   throw new exception(
    //     "Falha ao remover o responsavel da funcionalidade.",
    //     400
    //   );
    // }
  }

  async _gravarAtividade(
    atividade,
    funcionalidadeData,
    responsavelData,
    responsaveisFromForm,
    trx
  ) {
    let atividadeDB = null;
    if (typeof atividade.id === "number") {
      atividadeDB = await this._getAtividade(atividade.id, trx);
    }
    let atividadeToTransact;
    let atividadeTemp;
    let gravar = false;
    // se a atividade é nova
    if (_.isNil(atividadeDB)) {
      const funcionalidadeTemp = funcionalidadeData.find(
        (funcionalidade) =>
          funcionalidade.idAnterior === atividade.idFuncionalidade
      );
      atividadeTemp = await this._atividadeFactory(
        atividade,
        funcionalidadeTemp
      );
      gravar = true;
      await this._checkAtualizacaoStatus(
        "atividadeNova",
        atividadeTemp.idProjeto,
        atividadeTemp.idFuncionalidade,
        null,
        trx
      );
    }
    // se já foi cadastrado essa atividade
    else {
      atividadeTemp = await Atividade.find(atividade.id);
      // atualiza os inputs da atividade
      if (!atividadeTemp.dtConclusao) {
        atividadeTemp.idFuncionalidade = atividade.idFuncionalidade;
        atividadeTemp.titulo = atividade.titulo;
        atividadeTemp.descricao = atividade.descricao;
        atividadeTemp.prazo = atividade.prazo;
        if (!atividadeTemp.dtInicio)
          atividadeTemp.dtInicio = atividade.dtInicio;
        if (!atividadeTemp.dtConclusao)
          atividadeTemp.dtConclusao = atividade.dtConclusao;
        atividadeTemp.idComplexidade = atividade.idComplexidade;
        atividadeTemp.idPrioridade = atividade.idPrioridade;
        if (!atividade.dtInicio) {
          // não iniciado
          atividadeTemp.idStatus = constantes.statusNaoIniciado;
        } else if (
          atividade.dtInicio &&
          atividade.idStatus === constantes.statusNaoIniciado
        ) {
          // em andamento
          atividadeTemp.idStatus = constantes.statusEmAndamento;
        } else if (atividade.dtConclusao) {
          // concluído
          atividadeTemp.idStatus = constantes.statusConcluido;
        } else {
          atividadeTemp.idStatus = atividade.idStatus;
        }
        atividadeTemp.idTipo = atividade.idTipo;
        gravar = true;
      } else {
        atividadeTemp = atividadeTemp.toJSON();
      }
    }

    if (gravar) {
      // gravar/atualizar a atividade no DB
      await atividadeTemp.save(trx);
      // try {
      // } catch (error) {
      //   trx.rollback;
      //   throw new exception(
      //     "Falha ao gravar a(s) atividade(s) do projeto.",
      //     400
      //   );
      // }

      atividadeToTransact = atividadeTemp;
      atividadeTemp = atividadeTemp.toJSON();

      // exibe somente os responsáveis desta atividade
      responsaveisFromForm = responsaveisFromForm.filter((responsavel) => {
        if (
          atividade.responsavel.includes(responsavel.id) ||
          atividade.responsavel.includes(responsavel.idAnterior)
        ) {
          return responsavel;
        }
      });

      // remover todos os responsaveis desta atividade
      const listaIdsResponsaveis = await this._getResponsaveisToRemove(
        responsavelData
      );
      await this._removerPivotTodosResponsaveisAtividade(
        atividadeToTransact,
        listaIdsResponsaveis,
        trx
      );

      // responsaveis a serem gravados ou alterados
      for (const responsavel of responsaveisFromForm) {
        let responsavelToTransact = await Responsavel.find(responsavel.id);
        if (_.isNil(responsavelToTransact)) {
          responsavelToTransact = responsavelData.find(
            (resp) => resp.matricula === responsavel.matricula
          );
        }
        await this._gravarPivotResponsaveisAtividade(
          responsavelToTransact,
          atividadeTemp.id,
          trx
        );
      }
    }

    return atividadeTemp;
  }

  async _removerPivotResponsavelAtividade(
    responsavelToTransact,
    idAtividade,
    trx
  ) {
    await responsavelToTransact.atividade().detach(
      // id da funcionalidade
      [idAtividade],
      // incluir no transact
      trx
    );
    // try {
    // } catch (error) {
    //   trx.rollback;
    //   throw new exception("Falha ao remover o responsavel da atividade.", 400);
    // }
  }

  async _removerPivotTodosResponsaveisAtividade(
    atividade,
    listaResponsaveis,
    trx
  ) {
    await atividade.responsavel().detach(
      // array de ids dos responsaveis
      listaResponsaveis,
      // incluir no transact
      trx
    );
    // try {
    // } catch (error) {
    //   trx.rollback;
    //   throw new exception(
    //     "Falha ao desvincular os responsaveis com a atividade.",
    //     400
    //   );
    // }
  }

  async _gravarPivotResponsaveisAtividade(
    responsavelToTransact,
    idAtividade,
    trx
  ) {
    await responsavelToTransact.atividade().attach(
      // id da atividade
      [idAtividade],
      // marca a flag de ativo
      null,
      // incluir no transact
      trx
    );
    // try {
    // } catch (error) {
    //   trx.rollback;
    //   throw new exception(
    //     "Falha ao vincular o responsavel com a atividade.",
    //     400
    //   );
    // }
  }

  async _gravarPausa(atividade, trx = null) {
    for (const pausa of atividade.pausa) {
      if (typeof pausa.id !== "number") {
        // criar uma nova pausa
        let pausaTemp = await this._atividadePausaFactory(pausa);
        if (trx) {
          await pausaTemp.save(trx);
          // try {
          // } catch (error) {
          //   trx.rollback;
          //   throw new exception(
          //     "Falha ao gravar a(s) pausa(s) do projeto.",
          //     400
          //   );
          // }
        } else {
          await pausaTemp.save();
        }
      }
    }
    return;
  }

  _renomearArquivo(file) {
    const nome = md5(file.clientName + moment().format());
    return {
      name: `${nome}.${file.extname}`,
      overwrite: true,
    };
  }

  async _responsaveisToFrontEnd(responsaveis, funcionalidades) {
    return responsaveis.map(async (responsavel) => {
      responsavel.codFuncao = responsavel.responsavelData
        ? responsavel.responsavelData.cod_func_lotacao
        : "Indisponível";
      responsavel.nomeFuncao = responsavel.responsavelData
        ? responsavel.responsavelData.desc_func_lotacao.trim()
        : "Indisponível";
      responsavel.codEquipe = responsavel.responsavelData
        ? responsavel.responsavelData.cod_uor_grupo
        : "Indisponível";
      responsavel.nomeEquipe = responsavel.responsavelData
        ? responsavel.responsavelData.nome_uor_grupo.trim()
        : "Indisponível";
      responsavel.funcionalidades = [];
      responsavel.principalNestasFuncionalidades = [];
      responsavel.principal = false;
      responsavel.administrador = false;
      responsavel.dev = false;
      responsavel.dba = false;
      for (const funcionalidade of funcionalidades) {
        funcionalidade.responsavel.find((responsavelFuncionalidade) => {
          if (responsavel.id === responsavelFuncionalidade.id) {
            responsavel.funcionalidades.push(funcionalidade.id);
            responsavel.principal = JSON.parse(
              responsavelFuncionalidade.pivot.principal
            );
            if (responsavel.principal)
              responsavel.principalNestasFuncionalidades.push(
                funcionalidade.id
              );
            return responsavel;
          }
        });
      }
      responsavel.administrador = JSON.parse(responsavel.pivot.administrador);
      responsavel.dev = JSON.parse(responsavel.pivot.dev);
      responsavel.dba = JSON.parse(responsavel.pivot.dba);
      delete responsavel.responsavelData;
      delete responsavel.pivot;
      return responsavel;
    });
  }

  async _funcionalidadesToFrontEnd(funcionalidades) {
    return funcionalidades.map((funcionalidade) => {
      funcionalidade.responsaveis = funcionalidade.responsavel.map(
        (responsavel) => responsavel.id
      );
      return funcionalidade;
    });
  }

  async _atividadesToFrontEnd(atividades) {
    return atividades.map((atividade) => {
      atividade.complexidade = atividade.complexidade.descricao;
      atividade.status = atividade.status.descricao;
      atividade.prioridade = atividade.prioridade.descricao;
      atividade.responsavel = atividade.responsavel.map(
        (responsavelAtiv) => responsavelAtiv.id
      );
      atividade.situacao = atividade.status;
      atividade.idSituacao = atividade.idStatus;
      let diasEsclarecimento = 0;
      for (const esclarecimento of atividade.esclarecimento) {
        diasEsclarecimento += esclarecimento.diasParaResposta;
      }
      let diasPausas = 0;
      for (const pausa of atividade.pausa) {
        if (!_.isNil(pausa.prazo)) diasPausas += pausa.prazo;
      }
      atividade.prazoRestante = "";
      if (
        atividade.idStatus === constantes.statusEmAndamento &&
        atividade.dtInicio &&
        !atividade.dtConclusao
      ) {
        // método anterior, testar se o novo formato de data irá funcionar
        // const [dia, mes, ano_hora] = atividade.dtInicio.split('/');
        // const inicio = `${mes}/${dia}/${ano_hora}`;
        // let diasTrabalhando = moment().diff(moment(inicio, 'MM/DD/YYYY HH:mm:ss'), "days");
        let diasTrabalhando = moment().diff(
          moment(atividade.dtInicio, "DD/MM/YYYY HH:mm:ss"),
          "days"
        );
        diasTrabalhando = diasTrabalhando ? diasTrabalhando : 0;
        if (
          diasTrabalhando >
          atividade.prazo + diasPausas + diasEsclarecimento
        ) {
          atividade.situacao = "Atrasado";
          atividade.idSituacao = statusAtrasado;
        } else {
          atividade.situacao = "No prazo";
        }
        atividade.prazoRestante =
          atividade.prazo + diasPausas + diasEsclarecimento - diasTrabalhando;
      }
      atividade.prazoPausas = diasPausas + diasEsclarecimento;
      return atividade;
    });
  }

  /*********** Fim dos Métodos Internos ****************/
}

module.exports = ProjetosController;
