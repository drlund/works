"use strict";

const Database = use("Database");
const _ = use("lodash");
const exception = use("App/Exceptions/Handler");
const Helpers = use("Helpers");
const {
  getFilesJarFromRequest,
  getFilesFromRequest,
  salvaArquivoPublicoNoDiretorio,
} = use("App/Commons/FileUtils");
const fs = use("fs");
const md5 = use("md5");
const moment = use("App/Commons/MomentZoneBR");
const { getOneFunci } = use("App/Commons/Arh");

// Getters
const {
  getAnexo,
  getAtividade,
  getFuncionalidade,
  getListaOpcoes,
  getProjeto,
  getResponsavel,
} = use("App/Commons/projetos/CatalogoMetodosGetters");

// Models
const {
  anexoFactory,
  atividadeFactory,
  atividadePausaFactory,
  esclarecimentoFactory,
  funcionalidadeFactory,
  projetoFactory,
  responsavelFactory
} = use("App/Commons/projetos/CatalogoMetodosModelFactory");

// Setters
const {
  setAnexo,
  setAtividade,
  setEsclarecimento,
  setFuncionalidade,
  setPausa,
  setProjeto,
  setResponsavel,
  setResponsavelPivot,
} = use("App/Commons/projetos/CatalogoMetodosSetters");

// Commons
const commons = use("App/Commons/projetos/CommonsFunctions");

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

class ProjetosController {
  /*********** Métodos Post ****************
   * Grava nas tabelas
   */

  async postProjeto({ request, response, session }) {
    const { informacaoBasica, responsaveis, funcionalidades } =
      request.allParams();
    const user = session.get("currentUserAccount");

    // inicio do transact
    const trx = await Database.connection("projetos").beginTransaction();

    try {
      // gravar os dados do projeto
      const projetoData = await setProjeto.setProjetoNovo(
        JSON.parse(informacaoBasica),
        user
      );

      // gravar os anexos, se houver
      const anexoData = [];
      const anexosJar = await getFilesJarFromRequest(request, "files", {
        size: "10mb",
      });
      if (anexosJar) {
        filesPath = `app_projetos/idProjeto${projetoData.id}`;
        // grava fisicamente
        const errosAoGravar = await salvaArquivoPublicoNoDiretorio(
          anexosJar,
          filesPath,
          setAnexo.renomearArquivo
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
          if (!arquivoJaExiste) {
            // grava na tabela referencia
            let anexoTemp = await setAnexo.setAnexoNovo( projetoData, filesPath, trx);
            anexoData.push(anexoTemp.toJSON());
          }
        }
      }

      // gravar os dados dos responsaveis
      const responsavelData = [];
      const responsaveisFromForm = JSON.parse(responsaveis);
      for (const responsavel of responsaveisFromForm) {
        let responsavelTemp = await setResponsavel.setResponsavelNovo(responsavel, trx);
        await setResponsavelPivot.setPivotResponsavelProjeto(responsavelTemp, projetoData.id, trx);
        responsavelData.push(responsavelTemp);
      }

      // gravar os dados da funcionalidade
      const funcionalidadeData = [];
      for (const funcionalidade of JSON.parse(funcionalidades)) {
        const funcionalidadeTemp = await setFuncionalidade.setFuncionalidadeNova(
          funcionalidade,
          projetoData,
          trx
        );
        funcionalidadeData.push(funcionalidadeTemp.toJSON());

        let responsaveisDestaFuncionalidade = commons.isResponsavelDestaFuncionalidade(responsaveisFromForm, funcionalidade.id);

        responsaveisDestaFuncionalidade.map( responsavel => {
          // adicionar o id do transact e salvar o id temporário
          responsavel.idAnterior = responsavel.id;
          const responsavelTemp = responsavelData.find(respData => respData.matricula === responsavel.matricula);
          responsavel.id = responsavelTemp.id;
          if(responsavel.principalNestasFuncionalidades.length) {
            responsavel.principalNestasFuncionalidades = [responsavel.principalNestasFuncionalidades.find(
              idFuncionalidade => idFuncionalidade === funcionalidadeTemp.idAnterior
            )];
          }
          // substituir o id temporário da funcionalidade pelo id gerado na gravação do transact
          responsavel.principalNestasFuncionalidades = responsavel.principalNestasFuncionalidades.map(
            idFuncionalidade => {
              if (idFuncionalidade = funcionalidadeTemp.idAnterior) return funcionalidadeTemp.id
            }
          );
          return responsavel;
        });

        // gravar o pivot dos responsáveis desta funcionalidade
        for (const responsavel of responsaveisDestaFuncionalidade) {
          // se o funci já está na base de dados
          let responsavelToTransact = responsavelData.find( respData => respData.matricula === responsavel.matricula)
          await setResponsavelPivot.setPivotResponsaveisFuncionalidade(
            responsavelToTransact,
            funcionalidadeTemp.id,
            responsavel,
            trx
          );
          console.log("atualizar pivot funcionalidade respons");
        }
      }

      // executar o transact
      const resultado = await trx.commit();
      if (!resultado) {
        throw new exception("Falha ao salvar o projeto.", 400);
      }
      response.ok("Projeto inserido com sucesso.");
    } catch (error) {
      await trx.rollback();
      fs.rmdirSync(Helpers.appRoot(constantes.publicPath + filesPath), {
        recursive: true,
      });
      response.error(error.message);
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
    const user = session.get("currentUserAccount");
    const trx = await Database.connection("projetos").beginTransaction();
    console.log("iniciou o trx");
    try {
      // alterar/incluir dados básicos do projeto
      const dadosBasicos = JSON.parse(informacaoBasica);
      let projetoData;
      if(typeof dadosBasicos.id === 'number') {
        projetoData = await getProjeto.setProjetoExistente(dadosBasicos, dadosBasicos.id, trx);
      } else {
        projetoData = await setProjeto.setProjetoNovo(dadosBasicos, user, trx);
      }

      // alterar/incluir anexos
      // lista de arquivos incluídos anteriormente
      const listaAnexos = JSON.parse(anexosServidor);
      if (listaAnexos.length) {
        for (const anexo of listaAnexos) {
          console.log("atualizar anexos anteriores");
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
        console.log("atualizar anexos novos");
      }

      // alterar responsaveis projeto
      const responsavelData = [];
      const projetoFullFromDB = await this._getProjeto(dadosBasicos.id, trx);
      console.log("consulta interna projeto");
      const responsaveisFromDB = projetoFullFromDB.responsavel;
      const responsaveisFromForm = JSON.parse(responsaveis);
      const responsaveisToRemove = [];
      // for (const responsavel of responsaveisFromDB) {
      //   const manter = responsaveisFromForm.find((responsavelForm) => {
      //     return responsavel.id === responsavelForm.id;
      //   });
      //   console.log("filtrou responsavis");
      //   if (!manter) responsaveisToRemove.push(responsavel);
      // }

      // // responsaveis a excluir
      // for (const responsavel of responsaveisToRemove) {
      //   const responsavelToTransact = await Responsavel.find(responsavel.id);
      //   await this._removerPivotResponsavelProjeto(
      //     responsavelToTransact,
      //     dadosBasicos.id,
      //     trx
      //   );
      //   console.log("excluiu responsavel");
      // }

      // remover o vinculo entre os responsaveis e o projeto
      const listaIdsResponsaveis = responsaveisFromForm.map(
        (responsavel) => responsavel.id
      );
      await this._removerPivotTodosResponsaveisProjeto(
        projetoData,
        listaIdsResponsaveis,
        trx
      );
      console.log("removeu todos responsaveis projeto");
      // responsaveis a serem gravados ou alterados
      for (const responsavel of responsaveisFromForm) {
        const responsavelTemp = await this._gravarResponsavelProjeto(
          responsavel,
          projetoData,
          trx
        );
        responsavelData.push(responsavelTemp);
        console.log("incluiu os reponsaveis no projeto");
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
        console.log("filtrou funcionalidades para remover");
        if (!manter) funcionalidadesToRemove.push(funcionalidade);
      }

      // funcionalidades a excluir
      for (const funcionalidade of funcionalidadesToRemove) {
        const remover = await Funcionalidade.find(funcionalidade.id);
        remover.ativo = "false";
        await remover.save(trx);
        if (remover.isNew) {
          throw new exception(
            "Falha ao excluir esta funcionalidade do projeto.",
            400
          );
        }
        console.log("removeu soft funcionalidade");
        // responsaveis a excluir
        for (const responsavel of funcionalidade.responsavel) {
          const responsavelToTransact = await Responsavel.find(responsavel.id);
          await this._removerPivotResponsavelFuncionalidade(
            responsavelToTransact,
            funcionalidade.id,
            trx
          );
          console.log("removeu pivot responsavel funcionalidade");
        }
      }

      // alterar funcionalidades do projeto
      for (const funcionalidade of funcionalidadesFromForm) {
        let funcionalidadeTemp = await this._gravarFuncionalidade(
          funcionalidade,
          projetoData,
          responsavelData,
          responsaveisFromForm,
          trx
        );
        console.log("alterou funcionalidade");
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
        console.log("verifica atividade a excluir");
        if (!manter) atividadesToRemove.push(atividade);
      }

      // atividades a excluir
      for (const atividade of atividadesToRemove) {
        const remover = await Atividade.find(atividade.id);
        remover.ativo = "false";
        await remover.save(trx);
        if (remover.isNew) {
          throw new exception(
            "Falha ao excluir esta atividade do projeto.",
            400
          );
        }
        console.log("excluiu atividade");
        // responsaveis a excluir
        for (const responsavel of atividade.responsavel) {
          const responsavelToTransact = await Responsavel.find(responsavel.id);
          await this._removerPivotResponsavelAtividade(
            responsavelToTransact,
            atividade.id,
            trx
          );
          console.log("removeu pivot respons atividade excluido");
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
        console.log("gravou atividade");
        if (atividade.pausa && atividade.pausa.length) {
          await this._gravarPausa(atividade, trx);
          console.log("gravou pausa");
        }
        atividadeData.push(atividadeTemp);
      }

      // executar o transact
      const resultado = await trx.commit();
      console.log("executou trx");
      if (!resultado) {
        console.log("falha executar trx");
        throw new exception("Falha ao alterar os dados do projeto.", 400);
      }
      response.ok("Projeto alterado com sucesso.");
    } catch (error) {
      console.log("rollback");
      await trx.rollback();
      response.error(error.message);
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
      if (projeto.isNew) {
        throw new exception("Falha ao remover este projeto.", 400);
      }
      response.ok("Projeto removido com sucesso.");
    } catch (error) {
      response.error(error.message);
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
      await esclarecimentoData.save();
      if (esclarecimentoData.isNew) {
        throw new exception(
          "Falha ao gravar os esclarecimentos/observações do projeto.",
          400
        );
      }
      if (!isObservacao) {
        await this._atualizarStatusProjeto(
          idProjeto,
          constantes.statusAguardandoEsclarecimento
        );
      }
      response.ok("Esclarecimento/Observação cadastrado com sucesso.");
    } catch (error) {
      response.error(error.message);
    }
  }

  async patchEsclarecimento({ request, response, session }) {
    const { id, resposta, ativo } = request.allParams();
    const user = session.get("currentUserAccount");

    try {
      // gravar os dados do projeto
      const esclarecimentoData = await Esclarecimento.find(id);
      if (resposta) {
        esclarecimentoData.resposta = resposta;
        esclarecimentoData.matriculaResposta = user.chave;
      } else {
        esclarecimentoData.ativo = ativo.toString();
      }
      await esclarecimentoData.save();
      if (esclarecimentoData.isNew) {
        throw new exception(
          "Falha ao gravar a resposta do esclarecimento/observação do projeto.",
          400
        );
      }
      response.ok(
        "Resposta do esclarecimento/observação registrada com sucesso."
      );
    } catch (error) {
      response.error(error.message);
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
    } else if (atividade.dtInicio && atividade.idStatus === constantes.statusNaoIniciado) {
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
    // pausaFactory.dtInicio = pausa.dtInicio;
    // pausaFactory.dtConclusao = pausa.dtConclusao;

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
          .where("ativo", "true");
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
          .where("ativo", "true");
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
          .where("ativo", "true");
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
      .with("status");
    let projeto;
    if (trx) {
      projeto = await queryProjeto.transacting(trx).first();
      console.log("consulta projeto com trx");
    } else {
      projeto = await queryProjeto.first();
      console.log("consulta projeto sem trx");
    }
    if (projeto) projeto = projeto.toJSON();
    return projeto;
  }

  async _getProjetosToLista() {
    let projeto = await Projeto.query()
      .with("responsavel", (builder) => {
        builder
          .withPivot(["administrador", "dev", "dba", "ativo"])
          .where("app_projetos.projetos_responsaveis.ativo", "true");
      })
      .with("status")
      .where("ativo", "true")
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
    // .with('esclarecimento')
    let funcionalidade;
    if (trx) {
      funcionalidade = await queryFuncionalidade.transacting(trx).first();
      console.log("busca funcionalidade com trx");
    } else {
      funcionalidade = await queryFuncionalidade.first();
      console.log("busca funcionalidade");
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
      console.log("pega atividade com trx");
    } else {
      atividade = await queryAtividade.first();
      console.log("pega atividade");
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

  async getListaProjetos({ response, session, transform }) {
    const user = session.get("currentUserAccount");
    const projetosFromDB = await this._getProjetosToLista();
    let listaProjetos;
    if (projetosFromDB.length) {
      listaProjetos = projetosFromDB.filter((projeto) => {
        let isSolicitante = projeto.matriculaSolicitante === user.chave;
        let isMesmaEquipe = projeto.uorSolicitante === user.uor_trabalho;
        let isResponsavel = projeto.responsavel.some((responsavel) => {
          return responsavel.matricula === user.chave;
        });

        return isSolicitante || isResponsavel || isMesmaEquipe;
      });
    }

    // adicionar o nome do responsavel
    listaProjetos = await listaProjetos.map(async (projeto) => {
      let funciResponsavel = await getOneFunci(projeto.matriculaSolicitante);
      if (funciResponsavel) {
        projeto.nomeSolicitante = funciResponsavel.nome;
      }

      return projeto;
    });

    const transformed = await transform.collection(
      listaProjetos,
      "Projetos/ProjetosTransformer.listaGeral"
    );

    const projetos = {};
    projetos.abertos = transformed.filter(
      (projeto) => projeto.idStatus !== constantes.statusConcluido
    );
    projetos.concluidos = transformed.filter(
      (projeto) => projeto.idStatus === constantes.statusConcluido
    );

    response.ok(projetos);
  }

  async getProjeto({ request, response, session, transform }) {
    const { id } = request.allParams();
    const user = session.get("currentUserAccount");
    const projeto = await this._getProjeto(id);
    if (
      projeto.idStatus === constantes.statusNaoIniciado &&
      projeto.atividade.length > 0
    ) {
      const statusAtividades = projeto.atividade.map((ativ) => ativ.idStatus);
      if (statusAtividades.some((status) => status !== constantes.statusNaoIniciado)) {
        await this._atualizarStatusProjeto(id, constantes.statusEmAndamento);
        projeto.idStatus = constantes.statusEmAndamento;
      }
    }

    projeto.listaComplexidades = await this._getComplexidades();
    projeto.listaPrioridades = await this._getPrioridades();
    projeto.listaStatus = await this._getStatus();
    projeto.listaTipos = await this._getTipos();

    let isResponsavel;
    let mesmaUor;
    if (projeto) {
      const responsavelInlcuidoProjeto = projeto.responsavel.find(
        (responsavel) => responsavel.matricula === user.chave
      );
      isResponsavel = responsavelInlcuidoProjeto
        ? responsavelInlcuidoProjeto.matricula === user.chave
        : false;
      mesmaUor = projeto.uorSolicitante === user.uor_trabalho;
    }

    let transformed = null;
    if (mesmaUor || isResponsavel) {
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

    // if (responsavelToTransact.isNew) {
    //   throw new exception(
    //     "Falha ao gravar o(s) responsavel(is) do projeto.",
    //     400
    //   );
    // }

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
    if (projeto.isNew) {
      throw new exception(
        "Falha ao desvincular o responsavel com o projeto.",
        400
      );
    }
  }

  // inserir os responsáveis por projeto
  async _gravarPivotResponsaveisProjeto(
    responsavelToTransact,
    idProjeto,
    responsavel,
    trx
  ) {
    const gravarPivot = await responsavelToTransact.projeto().attach(
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
    if (gravarPivot.isNew) {
      throw new exception(
        "Falha ao vincular o responsavel com o projeto.",
        400
      );
    }
  }

  async _atualizarStatusProjeto(idProjeto, novoStatus, trx = null) {
    let projeto = await Projeto.find(idProjeto);
    projeto.idStatus = novoStatus;
    if (trx) {
      await projeto.save(trx);
    } else {
      await projeto.save();
    }
    if (projeto.isNew) {
      throw new exception("Falha ao atualizar o status do projeto.", 400);
    }
    return;
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
        if (anexoTemp.isNew) {
          throw new exception(
            "Falha ao gravar os dados dos anexos do projeto.",
            400
          );
        }
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
    if (anexoData.isNew) {
      throw new exception("Falha ao alterar a lista de anexos.", 400);
    }
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
    if (typeof funcionalidade.id === 'number') {
      funcionalidadeDB = await this._getFuncionalidade(
        funcionalidade.id,
        trx
      );
      console.log("buscou interno funcionalidade");
    }
    let funcionalidadeToTransact;
    let funcionalidadeTemp;
    // se a funcionalidade é nova
    if (_.isNil(funcionalidadeDB)) {
      funcionalidadeTemp = await this._funcionalidadeFactory(
        funcionalidade,
        projetoData
      );
      console.log("criou nova funcionalidade");
    }
    // se já foi cadastrado essa funcionalidade
    else {
      funcionalidadeTemp = await Funcionalidade.find(funcionalidade.id);
      // atualiza os inputs da funcionalidade
      funcionalidadeTemp.titulo = funcionalidade.titulo;
      funcionalidadeTemp.descricao = funcionalidade.descricao;
      funcionalidadeTemp.detalhe = funcionalidade.detalhe;
    }

    // gravar/atualizar a funcionalidade no DB
    await funcionalidadeTemp.save(trx);
    if (funcionalidadeTemp.isNew) {
      throw new exception(
        "Falha ao gravar a(s) funcionalidade(s) do projeto.",
        400
      );
    }
    console.log("atualizaou funcionalidade");
    funcionalidadeTemp.idAnterior = funcionalidade.id;
    funcionalidadeToTransact = funcionalidadeTemp;
    funcionalidadeTemp = funcionalidadeTemp.toJSON();

    const responsaveisFromDB = funcionalidadeDB
      ? funcionalidadeDB.responsavel
      : [];
    // exibe somente os responsáveis desta funcionalidade
    responsaveisFromForm = responsaveisFromForm.filter( responsavel => {
      if (responsavel.funcionalidades.includes(funcionalidade.id)) {
        return responsavel;
      }
    });

    responsaveisFromForm.map( responsavel => {
      // adicionar o id do transact e salvar o id temporário
      responsavel.idAnterior = responsavel.id;
      const responsavelTemp = responsavelData.find(respData => respData.matricula === responsavel.matricula);
      responsavel.id = responsavelTemp.id;
      if(responsavel.principalNestasFuncionalidades.length) {
        responsavel.principalNestasFuncionalidades = [responsavel.principalNestasFuncionalidades.find(
          idFuncionalidade => idFuncionalidade === funcionalidadeTemp.idAnterior
        )];
      }
      // substituir o id temporário da funcionalidade pelo id gerado na gravação do transact
      responsavel.principalNestasFuncionalidades = responsavel.principalNestasFuncionalidades.map(
        idFuncionalidade => {
          if (idFuncionalidade = funcionalidadeTemp.idAnterior) return funcionalidadeTemp.id
        }
      );
      return responsavel;
    })

    // const responsaveisToRemove = [];
    // for (const responsavel of responsaveisFromDB) {
    //   const manter = responsaveisFromForm.find((responsavelForm) => {
    //     return responsavel.id === responsavelForm.id;
    //   });
    //   console.log("filtrar responsaveis funcionalidade");
    //   if (!manter) responsaveisToRemove.push(responsavel);
    // }

    // // responsaveis a excluir
    // for (const responsavel of responsaveisToRemove) {
    //   const responsavelToTransact = await Responsavel.find(responsavel.id);
    //   await this._removerPivotResponsavelFuncionalidade(
    //     responsavelToTransact,
    //     funcionalidade.id,
    //     trx
    //   );
    //   console.log("remover responsaveis funcionalidade");
    // }

    // remover todos os responsaveis desta funcionalidade
    const listaIdsResponsaveis = responsavelData.map(
      (responsavel) => responsavel.id
    );
    await this._removerPivotTodosResponsaveisFuncionalidade(
      funcionalidadeToTransact,
      listaIdsResponsaveis,
      trx
    );
    console.log("remover pivot todos resposaveis funcionalidade");

    // responsaveis a serem gravados ou alterados
    // const listaDeResponsaveisFuncionalidade =
    //   await this._listaResponsaveisFuncionalidade(
    //     responsavelData,
    //     funcionalidadeTemp
    //   );
    for (const responsavel of responsaveisFromForm) {
      // se o funci já está na base de dados
      let responsavelToTransact = await Responsavel.find(responsavel.id);
      // se o funci está sendo inserido no transact
      if (!responsavelToTransact) {
        responsavelToTransact = responsavelData.find( respData => respData.matricula === responsavel.matricula)
      }
      await this._gravarPivotResponsaveisFuncionalidade(
        responsavelToTransact,
        funcionalidadeTemp.id,
        responsavel,
        trx
      );
      console.log("atualizar pivot funcionalidade respons");
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
    if (funcionalidade.isNew) {
      throw new exception(
        "Falha ao desvincular os responsaveis com a funcionalidade.",
        400
      );
    }
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
    const gravarPivot = await responsavelToTransact.funcionalidade().attach(
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
    if (gravarPivot.isNew) {
      throw new exception(
        "Falha ao vincular o responsavel com a funcionalidade.",
        400
      );
    }
  }

  async _excluirFuncionalidades(funcionalidade, responsavelData, trx) {
    const funcionalidadeTemp = await Funcionalidade.find(funcionalidade.id);
    funcionalidadeTemp.ativo = "false";

    await funcionalidadeTemp.save(trx);
    if (funcionalidadeTemp.isNew) {
      throw new exception(
        "Falha ao gravar a(s) funcionalidade(s) do projeto.",
        400
      );
    }

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
    if (responsavelToTransact.isNew) {
      throw new exception(
        "Falha ao remover o responsavel da funcionalidade.",
        400
      );
    }
  }

  async _gravarAtividade(
    atividade,
    funcionalidadeData,
    responsavelData,
    responsaveisFromForm,
    trx
  ) {
    let atividadeDB = null;
    if (typeof atividade.id === 'number') {
      atividadeDB = await this._getAtividade(atividade.id, trx);
      console.log("buscou interno funcionalidade");
    }
    console.log("buscou atividade");
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
      console.log("atividade nova");
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
      console.log("editar atividade");
    }

    if (gravar) {
      // gravar/atualizar a atividade no DB
      await atividadeTemp.save(trx);
      if (atividadeTemp.isNew) {
        throw new exception(
          "Falha ao gravar a(s) atividade(s) do projeto.",
          400
        );
      }
      atividadeToTransact = atividadeTemp;
      atividadeTemp = atividadeTemp.toJSON();
      console.log("gravou atividade");

      const responsaveisFromDB = atividadeDB ? atividadeDB.responsavel : [];
      // exibe somente os responsáveis desta atividade
      responsaveisFromForm = responsaveisFromForm.filter((responsavel) => {
        if (atividade.responsavel.includes(responsavel.id)) {
          return responsavel;
        }
      });
      // const responsaveisToRemove = [];
      // for (const responsavel of responsaveisFromDB) {
      //   const manter = responsaveisFromForm.find((responsavelForm) => {
      //     return responsavel.id === responsavelForm.id;
      //   });

      //   if (!manter) responsaveisToRemove.push(responsavel);
      // }

      // // responsaveis a excluir
      // for (const responsavel of responsaveisToRemove) {
      //   const responsavelToTransact = await Responsavel.find(responsavel.id);
      //   await this._removerPivotResponsavelAtividade(
      //     responsavelToTransact,
      //     atividade.id,
      //     trx
      //   );
      //   console.log("removeu responsaveis selecionados atividade");
      // }

      // remover todos os responsaveis desta atividade
      const listaIdsResponsaveis = responsavelData.map(
        (responsavel) => responsavel.id
      );
      await this._removerPivotTodosResponsaveisAtividade(
        atividadeToTransact,
        listaIdsResponsaveis,
        trx
      );
      console.log("removeu todos responsaveis atividades");

      // responsaveis a serem gravados ou alterados
      for (const responsavel of responsaveisFromForm) {
        const responsavelToTransact = await Responsavel.find(responsavel.id);
        await this._gravarPivotResponsaveisAtividade(
          responsavelToTransact,
          atividadeTemp.id,
          trx
        );
        console.log("gravou responsavbeis atividades");
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
    if (responsavelToTransact.isNew) {
      throw new exception("Falha ao remover o responsavel da atividade.", 400);
    }
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
    if (atividade.isNew) {
      throw new exception(
        "Falha ao desvincular os responsaveis com a atividade.",
        400
      );
    }
  }

  async _gravarPivotResponsaveisAtividade(
    responsavelToTransact,
    idAtividade,
    trx
  ) {
    const gravarPivot = await responsavelToTransact.atividade().attach(
      // id da atividade
      [idAtividade],
      // marca a flag de ativo
      null,
      // incluir no transact
      trx
    );
    if (gravarPivot.isNew) {
      throw new exception(
        "Falha ao vincular o responsavel com a atividade.",
        400
      );
    }
  }

  async _gravarPausa(atividade, trx) {
    for (const pausa of atividade.pausa) {
      if (typeof pausa.id !== "number") {
        // criar uma nova pausa
        let pausaTemp = await this._atividadePausaFactory(pausa);
        await pausaTemp.save(trx);
        if (pausaTemp.isNew) {
          throw new exception("Falha ao gravar a(s) pausa(s) do projeto.", 400);
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
      let dadosFOT01 = await getOneFunci(responsavel.matricula);
      responsavel.codFuncao = dadosFOT01.codFuncLotacao;
      responsavel.nomeFuncao = dadosFOT01.descFuncLotacao;
      responsavel.codEquipe = dadosFOT01.codUorGrupo;
      responsavel.nomeEquipe = dadosFOT01.nomeUorGrupo;
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
      let diasPausas = 0;
      for (const pausa of atividade.pausa) {
        diasPausas += pausa.prazo;
      }
      if (
        atividade.idStatus === constantes.statusEmAndamento &&
        atividade.dtInicio &&
        !atividade.dtConclusao
      ) {
        let arrayInicio = atividade.dtInicio.split("/");
        let inicio = moment([
          arrayInicio[2].substring(0, 4),
          arrayInicio[1] - 1,
          arrayInicio[0],
        ]);
        let diasTrabalhando = moment().diff(inicio, "days");
        atividade.situacao =
          diasTrabalhando > atividade.prazo + diasPausas
            ? "Atrasado"
            : "No prazo";
        atividade.prazoRestante = atividade.prazo + diasPausas - diasTrabalhando;
      }
      atividade.prazoPausas = diasPausas;
      return atividade;
    });
  }

  /*********** Fim dos Métodos Internos ****************/
}

module.exports = ProjetosController;
