"use strict";

const Database = use("Database");
const _ = use("lodash");
const exception = use("App/Exceptions/Handler");
const fs = use("fs");
const md5 = use("md5");
const moment = use("App/Commons/MomentZoneBR");
const Moeda = use("App/Commons/MoedaUtils");
const { capitalize } = use("App/Commons/StringUtils");
const { getOneFunci } = use("App/Commons/Arh");
const Comites = use("App/Commons/Arh/dadosComites");
const TemplateEmailEngine = use("App/Commons/TemplateEmailEngine");
const isEquipeComunicacao = use("App/Commons/Patrocinios/isEquipeComunicacao");
const isRespAnalise = use("App/Commons/Patrocinios/isRespAnalise");
const getRespAnalise = use("App/Commons/Patrocinios/getRespAnalise");
const getPrefixosAutorizados = use(
  "App/Commons/Patrocinios/getPrefixosAutorizados"
);
const jsonExport = use("App/Commons/JsonExport");

// Models
const Dependencia = use("App/Models/Mysql/Dependencia.js");
const Acao = use("App/Models/Mysql/Patrocinios/Acao");
const ExcecaoQuorum = use("App/Models/Mysql/Patrocinios/ExcecaoQuorum");
const FaseTipoSolicitacao = use(
  "App/Models/Mysql/Patrocinios/FaseTipoSolicitacao"
);
const FormPergunta = use("App/Models/Mysql/Patrocinios/FormPergunta");
const Historico = use("App/Models/Mysql/Patrocinios/Historico");
const Pergunta = use("App/Models/Mysql/Patrocinios/Pergunta");
const Recorrencia = use("App/Models/Mysql/Patrocinios/Recorrencia");
const RecorrenciaAux = use("App/Models/Mysql/Patrocinios/RecorrenciaAux");
const Resposta = use("App/Models/Mysql/Patrocinios/Resposta");
const Solicitacao = use("App/Models/Mysql/Patrocinios/Solicitacao");
const Snapshot = use("App/Models/Mysql/Patrocinios/Snapshot");
const TipoLancamento = use("App/Models/Mysql/Patrocinios/TipoLancamento");
const TipoSolicitacao = use("App/Models/Mysql/Patrocinios/TipoSolicitacao");
const Votos = use("App/Models/Mysql/Patrocinios/Voto");
const Status = use("App/Models/Mysql/Patrocinios/Status");
const Arquivos = use("App/Models/Mysql/Patrocinios/Arquivos");
const EquipeComunicacao = use("App/Models/Mysql/Patrocinios/EquipeComunicacao");
const RespAnalise = use("App/Models/Mysql/Patrocinios/RespAnalise");

// Status da solicitação
const STATUS_EM_ANDAMENTO = 1,
  STATUS_CONCLUIDO = 2,
  STATUS_CANCELADO = 3;

// Sequenciais das fases
const SEQUENCIAL_INCLUSAO_SAC = 1,
  SEQUENCIAL_ANALISE_ACOLHIMENTO = 2;

// Fases da solicitação
const FASE_ANALISE_ACOLHIMENTO = [2, 11],
  FASE_CONDUCAO = 5,
  FASE_ENCERRAMENTO = 8;

// Status da votação
const STATUS_VOTACAO_NAO_INICIADA = 0,
  STATUS_VOTACAO_EM_ANDAMENTO = 1,
  STATUS_VOTACAO_CONCLUIDA = 2,
  STATUS_VOTACAO_CANCELADA = 3;

// Ações
const ACAO_INCLUSAO_SOLIC = 1,
  ACAO_CANCELAMENTO_SOLIC = 3,
  ACAO_ENVIO_PARA_VOTACAO = 4,
  ACAO_ANALISE_ACOLHIMENTO = 6,
  ACAO_DEVOLUCAO_SOLIC = 8,
  ACAO_ATRIBUICAO_RESP_ANALISE = 21;

// Tipo de pergunta
const TIPO_PERGUNTA_TEXTAREA = 2,
  TIPO_PERGUNTA_CHECKBOX = [3, 15],
  TIPO_PERGUNTA_SIM_NAO_SUBPERGUNTAS = 17,
  TIPO_PERGUNTA_NR_MKT = 21,
  TIPO_PERGUNTA_RADIO_SUBPERGUNTAS = 22;

// Tipo de arquivo
const TP_FILE_AUT_DIMAC = 8, // Autorização DIMAC
  TP_FILE_BRIEFING = 57;

// Array de hashPergunta cuja resposta não está na tabela "respostas"
const ARRAY_HASH_PERGUNTAS_NAO_PASSIVEIS_DE_VERIFICACAO = [
  "nomeEvento",
  "dataInicioEvento",
  "dataFimEvento",
];

const HASH_PERGUNTA_AUTORIZ_SECOM = "autorizacaoSECOM";

const filtroPeriodo = {
  1: { descricao: "Data de Inclusão", campo: "dtInclusao" },
  2: { descricao: "Data do Evento", campo: "dataInicioEvento" },
  3: { descricao: "Data de Conclusão da Solicitação", campo: "dtConclusao" },
};

class PatrociniosController {
  /*********** Métodos check ****************
   * verificam algum tipo de dado para dar proseguimento ou não nas ações
   */

  /**
   * Verifica se a solicitação tem o tipo de arquivo passado como parâmetro
   * @param {Integer} idSolicitacao
   * @param {String} tipoArquivo
   * @param {Boolean} getArquivo
   */
  async _checkTemArquivo(idSolicitacao, tipoArquivo, getArquivo = false) {
    let idTipoArquivo;

    switch (tipoArquivo) {
      case "autDimac":
        idTipoArquivo = TP_FILE_AUT_DIMAC;
        break;
      case "briefing":
        idTipoArquivo = TP_FILE_BRIEFING;
        break;
      default:
        idTipoArquivo = null;
    }

    if (!idTipoArquivo) {
      return null;
    }

    const fetchArquivo = await Arquivos.query()
      .where({ idSolicitacao, idTipoArquivo, ativo: 1 })
      .fetch();

    if (getArquivo) {
      if (!fetchArquivo.rows.length) {
        return null;
      }

      const arquivo = fetchArquivo.rows[0];
      return `data:${arquivo.type};base64,${arquivo.conteudo}`;
    }

    return fetchArquivo.rows.length;
  }

  /**
   * calcula se o pedido está dentro do prazo mínimo previsto
   * @param {Date} dataEvento
   * @param {Integer} tipoSolic
   */
  async _checkForaPrazo(dataEvento, tipoSolic) {
    try {
      const diasPrazo = await TipoSolicitacao.find(tipoSolic); // Busca a informação do prazo do tipo de solicitação
      let dtEvento;

      if (dataEvento.includes("/")) {
        // Se data no formato "DD/MM/YYYY"
        const arrayDate = dataEvento.split("/");
        const day = arrayDate[0];
        const month = arrayDate[1];
        const year = arrayDate[2];

        dtEvento = moment(`${year}-${month}-${day}T03:00:00.0000Z`);
      } else {
        dtEvento = moment(dataEvento);
      }

      const diffDays = dtEvento.diff(moment(), "days"); // Quantidade de dias até a data do evento
      return diasPrazo.prazoAntecedente > diffDays ? 1 : 0;
    } catch (error) {
      throw new exception("Erro ao verificar o prazo da solicitação.", 400);
    }
  }

  /**
   * verifica se a solcitação preencheu todos os requisitos para ser enviada para votação
   * @param {Object} solic
   * @param {Object} dadosUsuario
   */
  async _checkVotacao(solic) {
    let solicitacao;
    if (solic.idSolicitacao) {
      solicitacao = await this._getSolicitacao(solic.idSolicitacao);
    } else {
      solicitacao = solic;
    }

    // verificar se a solcitação está em andamento
    if (solicitacao.idStatus !== STATUS_EM_ANDAMENTO) {
      return {
        valor: false,
        mensagem: "Esta solicitação não está disponível para votação.",
      };
    }
    // se votação em andamento ou concluída
    if (solicitacao.votacao !== STATUS_VOTACAO_NAO_INICIADA) {
      if (solicitacao.votacao === STATUS_VOTACAO_EM_ANDAMENTO) {
        return {
          valor: false,
          mensagem: "Esta solicitação já está em votação.",
        };
      } else if (solicitacao.votacao === STATUS_VOTACAO_CONCLUIDA) {
        return {
          valor: false,
          mensagem: "Esta solicitação está com votação concluída.",
        };
      }
    }

    // Se solicitação fora do prazo de antecedência
    // if (solicitacao.solicitadoForaPrazo) {
    // Verifica se tem autorização da Dimac
    //   const temAutDimac = await this._checkTemArquivo(solicitacao.id, 'autDimac');

    //   if (!temAutDimac)
    //     return {
    //       valor: false,
    //       mensagem:
    //         "Esta solicitação está fora do prazo de antecedência e sem autorização da DIMAC.",
    //     };
    // }

    // Verifica se a solicitação se tem todas as respostas
    const tudoRespondido = await this._checkTodasRespostas(solicitacao);

    if (!tudoRespondido) {
      return {
        valor: false,
        mensagem:
          "Esta solicitação não foi preenchida por completo. Responda todos os itens antes do envio para votação.",
      };
    }

    return { valor: true, mensagem: "Votação liberada." };
  }

  /**
   * verifica se a solcitação tem todas as respostas preenchidas
   * @param {Object} solic
   */
  async _checkTodasRespostas(solicitacao) {
    try {
      const perguntas = await this._getPerguntas(solicitacao.idForm);
      const arrayRespostas = [];

      // Se solicitacao na fase "Condução"
      if (solicitacao.idFase === FASE_CONDUCAO) {
        const tipoSolicitacao = await TipoSolicitacao.find(
          solicitacao.idTipoSolicitacao
        );

        // Se valor do evento abaixo do valor de autorização da SECOM, então não verificar respostas da Autorização SECOM
        if (solicitacao.valorEvento < tipoSolicitacao.valorAutorizSECOM) {
          ARRAY_HASH_PERGUNTAS_NAO_PASSIVEIS_DE_VERIFICACAO.push(
            HASH_PERGUNTA_AUTORIZ_SECOM
          );
        }
      }

      for (const perg of perguntas) {
        if (
          !ARRAY_HASH_PERGUNTAS_NAO_PASSIVEIS_DE_VERIFICACAO.includes(
            perg.hashPergunta
          )
        ) {
          let checkResposta;
          const resposta = await this._getRespostas(
            perg.id,
            solicitacao.id,
            solicitacao.idForm
          );
          checkResposta = !!(
            resposta &&
            resposta.descricaoResposta &&
            resposta.descricaoResposta !== "[]"
          ); // Verifica se existe resposta e se este não é um array vazio
          arrayRespostas.push(checkResposta);

          if (
            checkResposta &&
            perg.opcoes.length &&
            (perg.idTipoPergunta !== TIPO_PERGUNTA_SIM_NAO_SUBPERGUNTAS ||
              (perg.idTipoPergunta === TIPO_PERGUNTA_SIM_NAO_SUBPERGUNTAS &&
                resposta.descricaoResposta !== "Não"))
          ) {
            for (const opcao of perg.opcoes) {
              if (TIPO_PERGUNTA_CHECKBOX.includes(perg.tipo.id)) {
                const arrayDescResp = JSON.parse(resposta.descricaoResposta);

                if (Array.isArray(arrayDescResp)) {
                  checkResposta = arrayDescResp.includes(opcao.id);
                  arrayRespostas.push(checkResposta);
                }
              }

              // desabilitada a opção de verificação dos arquivos em 24/05/22 a pedido do André(F0010020)
              // if (opcao.idTipoArquivo) {
              //   const arquivos = await this._getArquivos(
              //     solicitacao.id,
              //     opcao.idTipoArquivo
              //   );
              //   checkResposta = !!(arquivos && Object.keys(arquivos).length); // Verifica se existe arquivo referente à resposta
              //   arrayRespostas.push(checkResposta);
              // }

              if (opcao.idTipoOpcao) {
                switch (opcao.idTipoOpcao) {
                  case TIPO_PERGUNTA_NR_MKT:
                    arrayRespostas.push(
                      !!(
                        solicitacao.nrMKT &&
                        solicitacao.nrMKT.replace("_", "").length === 10
                      )
                    );

                    break;
                  case TIPO_PERGUNTA_SIM_NAO_SUBPERGUNTAS:
                    let arrayDescResp = [];

                    try {
                      arrayDescResp = JSON.parse(resposta.descricaoResposta);
                    } catch {}

                    for (const val of arrayDescResp) {
                      const idOpcao = opcao.id.toString();

                      if (
                        typeof val === "object" &&
                        Object.keys(val).includes(idOpcao)
                      ) {
                        arrayRespostas.push(
                          !!(
                            val[idOpcao] === "Não" ||
                            (Array.isArray(val[idOpcao]) && val[idOpcao].length)
                          )
                        );
                      }
                    }

                    break;
                  case TIPO_PERGUNTA_TEXTAREA:
                    if (
                      perg.idTipoPergunta === TIPO_PERGUNTA_RADIO_SUBPERGUNTAS
                    ) {
                      try {
                        const resp = JSON.parse(resposta.descricaoResposta);
                        const keysResp = Object.keys(resp);

                        if (
                          keysResp.length &&
                          Number(keysResp[0]) === opcao.id
                        ) {
                          arrayRespostas.push(!!resp[keysResp[0]]);
                        }
                      } catch {}
                    }
                    break;
                  default:
                    break;
                }
              }
            }
          }
        }
      }

      return (
        arrayRespostas.length && arrayRespostas.every((elem) => elem === true)
      ); // Verifica se todas as respostas foram registradas
    } catch (e) {
      throw new exception(
        e.message ||
          "Falha ao verificar se todas as perguntas foram respondidas.",
        e.status || 400
      );
    }
  }

  //Método gestão total (Paulo)
  async getGestaoTotal() {
    const dadosGestao = await Solicitacao.query().with("gestao").fetch();

    return dadosGestao;
  }

  /*********** Fim dos Métodos check *****************/

  /*********** Métodos update *********************
   * atualizar as tabelas que necessitarem de alterações
   * /
  
   /**
   * faz o soft delete nos snaps
   * @param {Integer} idSolicitacao 
   */
  async _updSnapshot(idSolicitacao) {
    const affectedRows = await Database.connection("patrocinios")
      .table("snapshotComite")
      .where("idSolicitacao", idSolicitacao)
      .update("ativo", 0);
    if (affectedRows) return true;
    return false;
  }

  /**
   * faz o soft delete nos votos
   * @param {Integer} idSolicitacao
   */
  async _updVotos(idSolicitacao) {
    const affectedRows = await Database.connection("patrocinios")
      .table("votos")
      .where("idSolicitacao", idSolicitacao)
      .update("ativo", 0);
    if (affectedRows) return true;
    return false;
  }

  /**
   * atualiza os campos da solicitação
   * @param {Integer} idSolicitacao
   * @param {Object} dados
   */
  async _updSolicitacao(idSolicitacao, dados) {
    const solicitacao = await Solicitacao.find(idSolicitacao);
    solicitacao.merge(dados);
    await solicitacao.save();
    if (solicitacao.isNew) return false;
    return true;
  }

  /*********** Fim dos Métodos update *****************/

  /*********** Métodos geters Dados ****************
   * retornar conjunto de dados das tabelas principais
   * busca pelo id
   */

  /**
   * retorna os membros ativos da equipe de comunicação
   */
  async getEquipeComunicacao({ response }) {
    const equipeComunicacao = await EquipeComunicacao.query()
      .where("ativo", 1)
      .fetch();

    response.send(equipeComunicacao);
  }

  /**
   * retorna as fases da solicitação
   * @param {Integer} request.idSolicitacao
   */
  async getFases({ request, response }) {
    try {
      const { idSolicitacao } = request.allParams();

      const solicitacao = await Solicitacao.find(idSolicitacao);

      let faseTipoSolic = await FaseTipoSolicitacao.query()
        .select("idFase", "sequencial")
        .where({
          idTipoSolicitacao: solicitacao.idTipoSolicitacao,
          versao: solicitacao.versao,
        })
        .with("fase")
        .fetch();

      faseTipoSolic = faseTipoSolic.toJSON();

      let fases = faseTipoSolic.map((val) => {
        return {
          sequencial: val.sequencial,
          idFase: val.idFase,
          nomeFase: val.fase.descricao,
        };
      });

      fases = fases.filter((val) => val.sequencial !== 1);

      fases.sort((a, b) => a.sequencial - b.sequencial);

      response.send(fases);
    } catch (error) {
      throw new exception(
        error.message || "Erro na busca de fases",
        error.status || 400
      );
    }
  }

  /**
   * retorna o histórico da solicitação
   * @param {Integer} request.idSolicitacao
   */
  async getHistorico({ request, response }) {
    try {
      const { idSolicitacao } = request.allParams();

      const historico = await Historico.query()
        .where("idSolicitacao", idSolicitacao)
        .orderBy("dtCriacao", "desc")
        .fetch();

      response.send(historico);
    } catch (error) {
      throw new exception(
        error.message || "Erro na busca do histórico",
        error.status || 400
      );
    }
  }

  /**
   * retorna os tipos de lançamentos possíveis na conta corrente
   */
  async getTipoLancam({ response }) {
    const tipoLancam = await TipoLancamento.all();

    response.send(tipoLancam);
  }

  /**
   * retorna os tipos de formulários possíveis de serem cadastrados pelo app
   */
  async getTipoSolic({ response }) {
    const tipoSolic = await TipoSolicitacao.query().where("ativo", 1).fetch();
    response.send(tipoSolic);
  }

  async getForaPrazo({ request, response }) {
    const { idTipoSolicitacao, dataInicioEvento } = request.allParams();
    const tipoSolicitacao = await TipoSolicitacao.find(idTipoSolicitacao);
    const foraPrazo = await this._checkForaPrazo(
      dataInicioEvento,
      idTipoSolicitacao
    );

    response.send({ tipoSolicitacao: tipoSolicitacao, foraPrazo: foraPrazo });
  }

  /**
   * Retorna o arquivo base64
   * @param {Integer} request.idSolicitacao
   * @param {Integer} request.idTipoArquivo
   */
  async getArquivo({ request, response }) {
    const { idSolicitacao, idTipoArquivo } = request.allParams();
    const arquivo = await this._getArquivos(idSolicitacao, idTipoArquivo, true);
    response.send(arquivo);
  }

  /**
   * retorna o conjuto de perguntas e fase do tipo de solicitação
   * para saber quais perguntas deve ser carregadas é necessário o id do form.
   * se a versão não for informada, é carregado a versão mais recente
   * @param {Integer} request.id_tipo_solicitacao
   * @param {Integer} request.sequencial
   * @param {Integer} request.versao
   */
  async getFormularioSolicitacao({ request, response }) {
    const { sequencial, idTipoSolicitacao, versao, idSolicitacao } =
      request.allParams();
    let faseTipoSolic;
    let perguntas;

    // se existe idSolicitacao, carregar a solicitacao requerida
    const solicitacao = await this._getSolicitacao(idSolicitacao);

    // se a recorrencia não vier da tabela auxiliar, fazer o ajuste na recorrencia
    if (
      solicitacao &&
      solicitacao.recorrencia &&
      solicitacao.recorrencia.idSolicitacaoAnterior
    ) {
      let help = await this._getSolicitacao(
        solicitacao.recorrencia.idSolicitacaoAnterior
      );
      solicitacao.recorrencia.prefixo = help.prefixoSolicitante;
      solicitacao.recorrencia.dtEvento = help.dataEvento;
      solicitacao.recorrencia.valorEvento = help.valorEvento;
      solicitacao.recorrencia.nomeEvento = help.nomeEvento;
    }

    if (idSolicitacao && solicitacao) {
      solicitacao.arquivos = await this._getArquivos(idSolicitacao);
      solicitacao.tudoRespondido = await this._checkTodasRespostas(solicitacao);
      solicitacao.liberaEdicao =
        solicitacao.idStatus === STATUS_EM_ANDAMENTO &&
        solicitacao.votacao === STATUS_VOTACAO_NAO_INICIADA;
      solicitacao.emAnalise =
        solicitacao.idStatus === STATUS_EM_ANDAMENTO &&
        solicitacao.sequencial !== SEQUENCIAL_INCLUSAO_SAC &&
        solicitacao.votacao === STATUS_VOTACAO_CONCLUIDA;

      if (sequencial) {
        if (idTipoSolicitacao) {
          faseTipoSolic = await this._getFaseTipoSolicitacao(
            sequencial,
            idTipoSolicitacao,
            solicitacao.versao
          ); // buscar o idForm
        } else {
          faseTipoSolic = await this._getFaseTipoSolicitacao(
            sequencial,
            solicitacao.idTipoSolicitacao,
            solicitacao.versao
          ); // buscar o idForm
        }

        perguntas = await this._getPerguntas(
          faseTipoSolic.idForm,
          idSolicitacao
        ); // buscar as perguntas
      } else {
        faseTipoSolic = await this._getFaseTipoSolicitacao(
          solicitacao.sequencial,
          solicitacao.idTipoSolicitacao,
          solicitacao.versao
        ); // buscar o idForm
        perguntas = await this._getPerguntas(
          faseTipoSolic.idForm,
          idSolicitacao
        ); // buscar as perguntas
      }
    } else {
      const versaoAtual = _.isNil(versao)
        ? await this._getVersao(idTipoSolicitacao, sequencial)
        : versao; // verifica se a versão foi informada
      faseTipoSolic = await this._getFaseTipoSolicitacao(
        sequencial,
        idTipoSolicitacao,
        versaoAtual,
        null
      ); // buscar o idForm
      perguntas = await this._getPerguntas(faseTipoSolic.idForm, idSolicitacao); // buscar as perguntas
    }

    if (solicitacao && faseTipoSolic) {
      solicitacao.isAnaliseAcolhimento = FASE_ANALISE_ACOLHIMENTO.includes(
        faseTipoSolic.idFase
      );
    }

    response.send({ solicitacao, perguntas, faseTipoSolic });
  }

  /**
   * busca os dados da solictação para exibir no data tables e na recorrência
   * @param {Object} request
   * @param {Object} session
   */
  async getSolicitacao({ request, response, session }) {
    const { filtro, idSolicitacao } = request.allParams();

    const dadosUsuario = session.get("currentUserAccount");

    // Verifica se o usuário é da equipe de comunicação
    const isEquipeComunic = await isEquipeComunicacao(dadosUsuario);

    // Busca os prefixos autorizados
    const prefixosAutorizados = !isEquipeComunic
      ? await getPrefixosAutorizados(dadosUsuario)
      : [];

    const solics = await this._getSolicitacao(
      idSolicitacao,
      prefixosAutorizados,
      filtro
    );
    const solicit = await this._getRespostasSelecionadas(
      solics,
      "table",
      dadosUsuario
    );
    const solicitacoes = solicit.selecao;
    const membroComite = solicit.membroComite;
    const listaStatus = await Status.all();
    const listaAno = await Solicitacao.query()
      .distinct(Database.raw("substring(dataInicioEvento, 1, 4) as ano"))
      .orderBy("dataInicioEvento", "desc")
      .fetch();

    response.send({
      solicitacoes,
      membroComite,
      listaStatus,
      listaAno,
      isEquipeComunic,
    });
  }

  /**
   * buscar todas as recorrencias do(s) prefixo(s)
   * @param {Object} request
   * @param {Object} session
   */
  async getListaRecorrencia({ request, response, session }) {
    // pegar os dados do usuario
    const dadosUsuario = session.get("currentUserAccount");

    // pegar a lista de prefixos permitidos
    let prefixosAutorizados = await getPrefixosAutorizados(dadosUsuario);

    // verificar o acesso
    let { prefixo } = request.allParams();
    prefixo = [prefixo];
    const filtro = {
      campo: "idStatus",
      valor: STATUS_CONCLUIDO,
    };

    // pegar os registros da tabela solicitacoes
    const solicitacoes = await this._getSolicitacao(
      null,
      _.isNil(prefixo[0]) ? prefixosAutorizados : prefixo,
      filtro
    );
    const listaRecor = await this._getRespostasSelecionadas(
      solicitacoes,
      "recor",
      dadosUsuario
    );

    // pegar os registros da tabela auxiliar
    // const recorAux = await this._getRecorrenciaAux(null, _.isNil(prefixo[0]) ? prefixosAutorizados : prefixo);

    // unir os registros
    // const listaRecorrencia = listaRecor.concat(recorAux);

    // devolver a lista
    // response.send(listaRecorrencia);
    if (listaRecor) {
      response.send(listaRecor.selecao);
    } else {
      response.send([]);
    }
  }

  /**
   * retornar os prefixos que o funci logado pode consultar e tratar
   * @param {Object} session
   */
  async getPrefAutorizados({ response, session }) {
    const dadosUsuario = session.get("currentUserAccount");
    const prefixosAutorizados = await getPrefixosAutorizados(dadosUsuario);

    // Verifica se usuário é da Equipe de Comunicação da Super Adm
    if (await isEquipeComunicacao(dadosUsuario)) {
      return prefixosAutorizados;
    }

    for (const elem in prefixosAutorizados) {
      let nomePref = await Dependencia.query()
        .where("prefixo", prefixosAutorizados[elem])
        .first();

      nomePref = nomePref.toJSON();
      prefixosAutorizados[elem] = {
        prefixo: prefixosAutorizados[elem],
        nome: nomePref.nome,
      };
    }

    response.send(prefixosAutorizados);
  }

  async getEmVotacao({ response, session }) {
    const dadosUsuario = session.get("currentUserAccount");
    const listaComite = await this._getListaComitesByMatricula(
      dadosUsuario.chave
    );
    if (!listaComite.length) {
      throw new exception(
        "Acesso negado. Você não é membro de nenhum comitê de Administração.",
        400
      );
    }
    const jaVotados = await this._getVotoByMatricula(dadosUsuario.chave);
    const filtro = {
      campo: "votacao",
      valor: 1,
      idSolicitacao: jaVotados,
    };

    const emVotacao = await this._getSolicitacao(null, listaComite, filtro);
    const solicsParaVotacao = [];

    for (const solic of emVotacao) {
      // Verifica se a solicitação está no prazo de antecedência ou se está autorizado pela DIMAC
      // const noPrazoOuAutorizado = solic.solicitadoForaPrazo
      //   ? await this._checkTemArquivo(solic.id, "autDimac")
      //   : true;
      // Verifica se o formulário SAC foi todo respondido
      const tudoRespondido = await this._checkTodasRespostas(solic);

      if (/*noPrazoOuAutorizado &&*/ tudoRespondido) {
        solicsParaVotacao.push(solic);
      }
    }

    response.ok(solicsParaVotacao);
  }
  /*********** Fim dos Métodos geters Dados ****************  */

  /*********** Métodos geters internos ****************
   * retornar conjunto de dados das tabelas principais
   * busca pelo id
   */

  /**
   * retornar se usuário é da Equipe de Comunicação da Super Adm
   * @param {Object} session
   */

  /**
   * retorna o texto descritivo de cada ação
   * @param {Integer} idAcao
   */
  async _getAcao(idAcao) {
    const acao = await Acao.find(idAcao);
    return acao;
  }

  /**
   * retorna os atributos necessários para exibição no data tables da lista de solicitações ou das recorrencias
   * @param {Object} solicitacoes
   * @param {String} tipo
   */

  async _getRespostasSelecionadas(solicitacoes, tipo, dadosUsuario) {
    let selecao = [];
    let prefixosComite = await this._getListaComitesByMatricula(
      dadosUsuario.chave
    );
    let membroComite = prefixosComite.length ? 1 : 0;

    solicitacoes = Array.isArray(solicitacoes) ? solicitacoes : [solicitacoes];

    for (const elem in solicitacoes) {
      // o retorno é a lista de recorrencias para montar o data tables
      if (tipo === "table") {
        const liberaVoto = await this._checkVotacao(
          solicitacoes[elem],
          dadosUsuario
        );

        selecao[elem] = {
          tabela: "solicitacao",
          idSolicitacao: solicitacoes[elem].id,
          prefixoSolicitante: solicitacoes[elem].prefixoSolicitante,
          nomeSolicitante: solicitacoes[elem].nomeSolicitante,
          dataInicioEvento: solicitacoes[elem].dataInicioEvento,
          dataFimEvento: solicitacoes[elem].dataFimEvento,
          dtInclusao: solicitacoes[elem].dtInclusao,
          nomeEvento: solicitacoes[elem].nomeEvento,
          valorEvento: Moeda.fromDB(solicitacoes[elem].valorEvento, true),
          valorEvento: solicitacoes[elem].valorEvento,
          fase: solicitacoes[elem].fase.descricao,
          emFaseInclusao:
            solicitacoes[elem].sequencial === SEQUENCIAL_INCLUSAO_SAC,
          statusEmAndamento:
            solicitacoes[elem].idStatus === STATUS_EM_ANDAMENTO,
          status: solicitacoes[elem].status.descricao,
          colorStatus: solicitacoes[elem].status.colorStatus,
          votacaoEmAndamento:
            solicitacoes[elem].votacao === STATUS_VOTACAO_EM_ANDAMENTO,
          voto: solicitacoes[elem].voto,
          qtdVotos: solicitacoes[elem].voto.length,
          liberaVoto: liberaVoto.valor,
          liberaEdicao:
            solicitacoes[elem].idStatus === STATUS_EM_ANDAMENTO &&
            solicitacoes[elem].votacao === STATUS_VOTACAO_NAO_INICIADA,
          liberaCancelamento:
            solicitacoes[elem].idStatus === STATUS_EM_ANDAMENTO &&
            solicitacoes[elem].votacao !== STATUS_VOTACAO_CONCLUIDA,
          solicitadoForaPrazo: solicitacoes[elem].solicitadoForaPrazo,
          gestao: solicitacoes[elem].gestao,
          temBriefing: await this._checkTemArquivo(
            solicitacoes[elem].id,
            "briefing",
            true
          ),
          temAutDimac: await this._checkTemArquivo(
            solicitacoes[elem].id,
            "autDimac",
            true
          ),
          isRespAnalise: await isRespAnalise(dadosUsuario, solicitacoes[elem]),
          respAnalise: await getRespAnalise(solicitacoes[elem].id), // Busca responsável análise
          equipeComunicacao: solicitacoes[elem].equipeComunicacao,
          obsDevolucao: solicitacoes[elem].obsDevolucao,
          devolucao:
            solicitacoes[elem].obsDevolucao &&
            solicitacoes[elem].idStatus === STATUS_EM_ANDAMENTO &&
            solicitacoes[elem].sequencial <= SEQUENCIAL_ANALISE_ACOLHIMENTO
              ? "Devolução"
              : "",
          nrMKT: solicitacoes[elem].nrMKT ? solicitacoes[elem].nrMKT : "",
        };
      }

      // o retorno é a lista de recorrencias com base na tabela solicitacoes
      if (tipo === "recor") {
        selecao[elem] = {
          tabela: "solicitacao",
          idSolicitacao: solicitacoes[elem].id,
          prefixoSolicitante: solicitacoes[elem].prefixoSolicitante,
          dataInicioEvento: solicitacoes[elem].dataInicioEvento,
          dataFimEvento: solicitacoes[elem].dataFimEvento,
          nomeEvento: solicitacoes[elem].nomeEvento,
        };
      }
    }

    return { selecao, membroComite };
  }

  /**
   * busca a recorrencia auxiliar pelo id ou prefixo(s)
   * @param {Integer} id
   * @param {String} prefixo
   */
  async _getRecorrenciaAux(id = null, prefixo = null, idSolicitacao = null) {
    let aux;

    if (!_.isNil(id)) {
      aux = await RecorrenciaAux.find(id);
    }
    if (!_.isNil(idSolicitacao)) {
      aux = await RecorrenciaAux.query()
        .select("*")
        .where("idSolicitacao", idSolicitacao)
        .first();
    }
    if (!_.isNil(prefixo)) {
      aux = await RecorrenciaAux.query()
        .select(
          "id as idSolicitacao",
          "prefixo as prefixoSolicitante",
          "dtEvento as dataEvento",
          "nomeEvento"
        )
        .whereIn("prefixo", prefixo)
        .fetch();
      aux = aux.toJSON();
      for (const elem in aux) {
        aux[elem].tabela = "recorrenciaAux";
      }
    } else if (aux) {
      aux = aux.toJSON();
    }

    return aux;
  }

  /**
   * retorna a lista de votos de um funci
   * @param {String} matricula
   */
  async _getVotoByMatricula(matricula) {
    let lista = await Votos.query()
      .select("idSolicitacao")
      .where("matriculaVotante", matricula)
      .where("ativo", 1)
      .fetch();

    lista = lista.toJSON();

    const listaIds = _.map(lista, "idSolicitacao");

    return listaIds;
  }

  /**
   * retorna todos os dados da lista de votos por id da solicitação
   * @param {Integer} idSolicitacao
   */
  async _getVotoById(idSolicitacao) {
    let lista = await Votos.query()
      .where("idSolicitacao", idSolicitacao)
      .where("ativo", 1)
      .fetch();

    if (lista) lista = lista.toJSON();

    return lista;
  }

  /**
   * verifica se o prefixo possui um quorum de comitê diferente do padrão (o padrão atual é 3)
   * @param {String} prefixo
   */
  async _getExcecaoQuorum(prefixo) {
    let lista = await ExcecaoQuorum.find(prefixo);
    if (lista) lista = lista.toJSON();

    return lista;
  }

  /**
   * busca as informações da próxima fase da solicitação
   * @param {Object} solicitacao
   */
  async _getProximaFase({ sequencial, idTipoSolicitacao, versao }) {
    const proximaFase = await this._getFaseTipoSolicitacao(
      sequencial + 1,
      idTipoSolicitacao,
      versao,
      null
    );

    if (!proximaFase) {
      throw new exception("Falha ao enviar a solicitação para a próxima fase.");
    }

    return {
      idFase: proximaFase.idFase,
      sequencial: proximaFase.sequencial,
      idForm: proximaFase.idForm,
    };
  }

  /**
   * busca as informações da solicitação e das recorrencias
   * @param {Integer} id
   * @param {String} prefixo
   * @param {Array} filtro que tipo de filtro se pretende utilizar
   */
  async _getSolicitacao(id = null, prefixo = null, filtro = null) {
    let solic;
    if (_.isNil(id) && _.isNil(prefixo)) {
      return null;
    }
    const query = Solicitacao.query();

    query
      .with("fase")
      .with("gestao")
      .with("status")
      .with("equipeComunicacao")
      .with("voto", (builder) => {
        builder.where("ativo", 1);
      })
      .orderBy("dtInclusao", "desc");

    if (filtro) {
      // testa se filtro é um string com json
      if (typeof filtro === "string") filtro = JSON.parse(filtro);
      const {
        idStatus,
        idSolicitacao,
        periodo,
        inicioData,
        fimData,
        campo,
        valor,
      } = filtro;
      if (campo) query.where(campo, valor);
      if (idStatus) query.where("idStatus", idStatus);
      if (idSolicitacao) query.whereNotIn("id", idSolicitacao);

      if (periodo && inicioData && fimData) {
        query.where(filtroPeriodo[periodo].campo, ">=", inicioData);
        query.where(filtroPeriodo[periodo].campo, "<=", fimData);
      }
    }

    if (!_.isNil(id)) {
      query.with("recorrencia");
      query.where("id", id);
      query.with("gestao");
      const sol = await query.first();
      solic = _.isNil(sol) ? null : sol.toJSON();

      let auxiliar;
      if (!_.isNil(solic) && !_.isNil(solic.recorrencia)) {
        const recor = solic.recorrencia;
        auxiliar = await this._getRecorrenciaAux(null, null, solic.id);
        if (!_.isNil(auxiliar)) {
          recor.idAuxiliar = auxiliar.id;
          recor.prefixo = auxiliar.prefixo;
          recor.dtEvento = auxiliar.dtEvento;
          recor.valorEvento = Moeda.fromDB(auxiliar.valorEvento, true);
          recor.nomeEvento = auxiliar.nomeEvento;
          recor.avaliacaoResultado = auxiliar.avaliacaoResultado;

          solic.recorrencia = recor;
        }
      }
      solic.valorEvento = Moeda.fromDB(solic.valorEvento, true);
    }

    if (!_.isNil(prefixo) && !id) {
      if (prefixo.length) {
        query.whereIn("prefixoSolicitante", prefixo);
      }

      const sol = await query.fetch();
      solic = sol.toJSON();
      for (const elem in solic) {
        solic[elem].valorEvento = Moeda.fromDB(solic[elem].valorEvento, true);
        solic[elem].key = solic[elem].id;
        solic[elem].qtdVotos = solic[elem].voto.length;
      }
    }

    return solic;
  }

  /**
   * buscar as informações de id de formulário e id de fase
   * @param {Integer} sequencial
   * @param {Integer} idTipoSolicitacao
   * @param {Integer} versao
   */
  async _getFaseTipoSolicitacao(
    sequencial,
    idTipoSolicitacao,
    versao,
    idForm = null
  ) {
    const query = FaseTipoSolicitacao.query();
    if (!_.isNil(sequencial) && !_.isNil(idTipoSolicitacao)) {
      query.where({
        sequencial,
        idTipoSolicitacao,
      });
    }
    if (!_.isNil(versao)) {
      query.where("versao", versao);
    }
    if (!_.isNil(idForm)) {
      query.where("idForm", idForm);
    }

    const faseTipoSolicitacao = await query.first();

    return faseTipoSolicitacao;
  }

  /**
   * retorna a versão atual das fases se a versão não for especificada
   * @param {Integer} id_tipo_solicitacao
   * @param {Integer} sequencial
   * @param {Integer} versao
   */
  async _getVersao(idTipoSolicitacao, sequencial) {
    let where = {
      idTipoSolicitacao,
      sequencial,
    };

    const versaoRet = await FaseTipoSolicitacao.query()
      .where(where)
      .getMax("versao");

    return versaoRet;
  }

  /**
   * retorna os arquivos da solicitação
   * @param {Integer} idSolicitacao
   * @param {Integer} idTipoArquivo
   * @param {Boolean} comBase64
   */
  async _getArquivos(idSolicitacao, idTipoArquivo = 0, comBase64 = false) {
    const select = ["id", "idSolicitacao", "idTipoArquivo", "nome", "type"];

    if (comBase64) {
      select.push("conteudo");
    }

    const where = {
      idSolicitacao,
      ativo: 1,
    };

    if (idTipoArquivo) {
      where.idTipoArquivo = idTipoArquivo;
    }

    const files = await Arquivos.query().select(select).where(where).fetch();

    if (files.rows) {
      const arquivos = files.rows.reduce((result, value) => {
        if (value) {
          value.uid = value.id;
          value.name = value.nome;
          value.url = value.conteudo
            ? `data:${value.type};base64,${value.conteudo}`
            : "0";
          result[value.idTipoArquivo] = [value];
        }

        return result;
      }, {});

      return arquivos;
    }

    return {};
  }

  /**
   * retorna as perguntas do formulário ou fase
   * @param {Integer} idForm
   */
  async _getPerguntas(idForm, idSolicitacao = null) {
    let formPerg = await FormPergunta.query()
      .where("idForm", idForm)
      .orderBy("sequencial", "asc")
      .fetch();

    formPerg = formPerg.toJSON();

    // transformar a coluna idPergunta num array
    const idsPerg = _.map(formPerg, "idPergunta");

    const query = Pergunta.query().with("opcoes").with("tipo");

    if (!_.isNil(idSolicitacao)) {
      query.with("resposta", (builder) => {
        builder
          .setVisible(["descricaoResposta"])
          .where({ idSolicitacao, idForm });
      });
    }

    query.whereIn("id", idsPerg);
    const perguntas = await query.fetch();

    const perguntasJSON = perguntas.toJSON();

    const resultPerguntas = _.reduce(
      idsPerg,
      (result, value) => {
        const perg = _.reduce(
          perguntasJSON,
          (resPerg, pergunta) => {
            if (pergunta.id === value) {
              if (pergunta.opcoes) {
                pergunta.opcoes.sort((a, b) => a.sequencial - b.sequencial);
              }

              resPerg.push(pergunta);
            }

            return resPerg;
          },
          []
        );

        result.push(perg[0]);
        return result;
      },
      []
    );

    return resultPerguntas;
  }

  /**
   * retorna as respostas da solicitação, caso existam
   * @param {Integer} idPergunta
   */
  async _getRespostas(idPergunta, idSolicitacao, idForm) {
    return await Resposta.query()
      .where({ idSolicitacao, idForm, idPergunta })
      .first();
  }

  /**
   * retorna as informações (principalmente a matricula) do comite de adm de um prefixo
   * @param {Integer} prefixo
   */
  async _getListaComitesAdm(prefixo) {
    const matriculas = await Comites.getListaComitesAdm(prefixo);

    return matriculas;
  }

  /**
   * retorna as informações (principalmente os prefixos) dos comites que uma matricula pertence
   * @param {string} matricula
   */
  async _getListaComitesByMatricula(matricula) {
    const prefixos = await Comites.getListaComitesByMatricula(matricula);
    const prefixosComite = _.map(prefixos, "PREFIXO");
    return prefixosComite;
    // return await Comites.getListaComitesByMatricula(matricula);
  }

  /**
   *
   *  Salva os arquivos recebidos no request.
   *
   * @param {*} request Requisição contendo os arquivos a serem salvos
   * @param {*} dadosUsuario
   *
   */
  async _setArquivos(request, idSolicitacao, dadosUsuario) {
    try {
      const arquivos = request.files();
      const arrayNewFiles = [];

      const getIdTipoArquivo = (key) => {
        return key.substring(4); // Ex.: key = 'file3', então idTipoArquivo = 3. Pega-se o número após a palavra 'file'.
      };

      const desativaArquivo = async (idSolicitacao, key) => {
        const idTipoArquivo = getIdTipoArquivo(key);

        // Busca arquivo a ser desativado pelos campos idSolicitação e idTipoArquivo
        const arquivo = await Arquivos.query()
          .where({ idSolicitacao, idTipoArquivo, ativo: 1 })
          .first();

        if (arquivo) {
          arquivo.ativo = 0; // Desativa o arquivo
          arrayNewFiles.push(arquivo); // Adiciona o modelo de arquivo ao array para ser executado no transact posteriormente.
        }
      };

      if (request.all().respostas) {
        const respostas = JSON.parse(request.all().respostas);

        // Desativar arquivos excluídos pelo usuário no formulário
        for (const key in respostas) {
          // Verifica se o campos começa por 'file' e se é um array vazio
          if (key.substring(0, 4) === "file" && respostas[key].length === 0) {
            await desativaArquivo(idSolicitacao, key);
          }
        }
      }

      for (const key in arquivos) {
        if (arquivos[key].extname === "pdf" || arquivos[key].type === "image") {
          await desativaArquivo(idSolicitacao, key); // Desativa o arquivo, caso exista.

          const file = fs.readFileSync(arquivos[key].tmpPath);

          // convert binary data to base64 encoded string
          const conteudo = new Buffer.from(file).toString("base64");

          const newFile = new Arquivos(); // Modelo de arquivo
          newFile.idSolicitacao = idSolicitacao;
          newFile.idTipoArquivo = getIdTipoArquivo(key);
          newFile.nome = arquivos[key].clientName;
          newFile.type = `${arquivos[key].type}/${arquivos[key].subtype}`;
          newFile.tamanho = arquivos[key].size;
          newFile.incluidoPor = dadosUsuario.chave;
          newFile.hash = md5(arquivos[key].clientName + moment().toString());
          newFile.extensao = arquivos[key].extname;
          newFile.conteudo = conteudo;
          newFile.ativo = 1;

          arrayNewFiles.push(newFile); // Adiciona o modelo de arquivo ao array para ser executado no transact posteriormente.
        } else {
          throw new exception(
            "Permitido apenas arquivos de imagens (jpg/png) ou pdf!",
            400
          );
        }
      }

      return arrayNewFiles;
    } catch (error) {
      throw new exception("Falha ao gravar os arquivos.", 400);
    }
  }

  /*********** Fim dos Métodos geters internos ****************  */

  /*********** Métodos post ****************
   * insere conjunto de dados das tabelas principais
   */

  /**
   * grava as respostas do formulário
   * @param {Object} request
   * @param {Object} session
   */
  async postSolic({ request, session }) {
    let { respostas, solicitacoes, recorrencia } = request.allParams();

    try {
      solicitacoes = JSON.parse(solicitacoes);

      if (respostas) {
        respostas = JSON.parse(respostas);
      }

      if (recorrencia) {
        recorrencia = JSON.parse(recorrencia);
      }
    } catch (error) {
      throw new exception("Falha no recebimento das informações.", 400);
    }

    const dadosUsuario = session.get("currentUserAccount");

    // preparando a acao para ser gravada no histórico
    const { descricao } = await this._getAcao(solicitacoes.idAcao);
    const acao = {
      idAcao: solicitacoes.idAcao,
      descricaoAcao: descricao,
    };

    // preprarando o solicitações para ser incluído no bd
    delete solicitacoes.idAcao;
    let dadosSolicitacao = await this._getFaseTipoSolicitacao(
      null,
      null,
      solicitacoes.versao,
      solicitacoes.idForm
    );
    dadosSolicitacao = dadosSolicitacao.toJSON();
    solicitacoes.idTipoSolicitacao = dadosSolicitacao.idTipoSolicitacao;
    solicitacoes.idFase = dadosSolicitacao.idFase;
    solicitacoes.sequencial = dadosSolicitacao.sequencial;

    // inicio do transact
    const trx = await Database.connection("patrocinios").beginTransaction();
    try {
      // gravar a solicitação e obter seu id
      const dadosSolic = await this._setSolicitacao(solicitacoes);
      await dadosSolic.save(trx);
      if (dadosSolic.isNew)
        throw new exception("Falha ao gravar a solicitação.", 400);
      dadosSolic.toJSON();
      // fim da solicitação

      // verifica se existe resposta
      let resp = [];
      if (!_.isNil(respostas)) {
        // gravar as respostas e criar o objeto para o histórico
        for (const elem in respostas) {
          // Se a resposta não for arquivo
          if (elem.substring(0, 4) !== "file") {
            const dadosResp = await this._setRespostas(
              elem,
              respostas[elem],
              dadosSolic.id,
              dadosSolic.idForm
            );
            await dadosResp.save(trx);
            if (dadosResp.isNew)
              throw new exception("Falha ao gravar as respostas.", 400);
            resp.push(dadosResp.toJSON());
          }
        }
      }

      let alteracao = {
        nome: "respostas",
        dados: resp,
      };
      // fim das repostas

      // Salva os arquivos de upload, caso existam
      const arquivos = await this._setArquivos(
        request,
        dadosSolic.id,
        dadosUsuario
      );
      arquivos.forEach(async (arquivo) => await arquivo.save(trx));

      if (arquivos.isNew)
        throw new exception("Falha ao gravar o(s) arquivo(s).", 400);
      // fim de arquivos //

      // verifica se existe recorrencia
      let dadosRecorAux;
      let dadosRecor;
      if (!_.isNil(recorrencia)) {
        let recor = { idSolicitacao: dadosSolic.id };
        // verifica se é recorrencia auxiliar
        if (_.isNil(recorrencia.idSolicitacao)) {
          recorrencia.idAuxiliar = dadosSolic.id;
          // gravar a recorrencia auxiliar e criar o objeto para o histórico
          dadosRecorAux = await this._setRecorrenciaAux(recorrencia);
          await dadosRecorAux.save(trx);
          if (dadosRecorAux.isNew)
            throw new exception("Falha ao gravar a recorrência auxiliar.", 400);
          dadosRecorAux = dadosRecorAux.toJSON();
          // gera o id da auxiliar para ser inserido na tabela recorrencia
          recor.idAuxiliarRecorrencia = dadosRecorAux.id;
        } else {
          // gera o id da anterior para ser inserido na tabela recorrencia
          recor.idSolicitacaoAnterior = recorrencia.idSolicitacao;
        }
        // gravar a recorrencia e criar o objeto para o histórico
        dadosRecor = await this._setRecorrencia(recor);
        await dadosRecor.save(trx);
        if (dadosRecor.isNew)
          throw new exception("Falha ao gravar a recorrência.", 400);
        dadosRecor = dadosRecor.toJSON();
      }
      // fim da recorrencia

      // gravar o histórico
      let dadosHist = this._setHistorico(
        dadosUsuario,
        dadosSolic,
        acao,
        alteracao,
        dadosRecor,
        dadosRecorAux
      );
      await dadosHist.save(trx);
      if (dadosHist.isNew)
        throw new exception("Falha ao gravar o histórico.", 400);
      // fim do histórico

      const resultado = trx.commit();
      if (!resultado) {
        throw new exception("Falha ao salvar a solicitação.", 400);
      }
      throw new exception("Solicitação gravada com sucesso.", 200);
    } catch (error) {
      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception(
          "Falha ao criar a SAC! Contate o administrador do sistema.",
          400
        );
      }
    }
    // fim do transact
  }

  async postVoto({ request, response, session }) {
    const { idSolicitacao, idAcao, deferido } = request.allParams();
    const dadosUsuario = session.get("currentUserAccount");
    const { descricao } = await this._getAcao(idAcao);
    const acao = {
      idAcao: idAcao,
      descricaoAcao: descricao,
    };
    let acaoSolicitacao;
    let qtdQuorum = 3;

    // será retornado os votos excluídos se houver mudança no comitê
    let votosExcluidos = [];
    let mudouComite = [];

    // iterar nos ids de voto para verificar se podem ser inseridos
    for (const elem in idSolicitacao) {
      // verificar se o funci pode acessar os dados do prefixo
      const solicitacao = await this._getSolicitacao(idSolicitacao[elem]);

      // Verifica se a solicitação está no prazo de antecedência ou se está autorizado pela DIMAC
      // const noPrazoOuAutorizado = solicitacao.solicitadoForaPrazo
      //   ? await this._checkTemArquivo(solicitacao.id, "autDimac")
      //   : true;

      // if (!noPrazoOuAutorizado) {
      //   throw new exception(
      //     "Esta solicitação está fora do prazo de antecedência e sem autorização da DIMAC.",
      //     400
      //   );
      // }

      // Verifica se o formulário SAC foi todo respondido
      const tudoRespondido = await this._checkTodasRespostas(solicitacao);

      if (!tudoRespondido) {
        throw new exception(
          "Esta solicitação não foi preenchida por completo.",
          400
        );
      }

      // verificar se o funci é membro do comitê do prefixo
      const prefixosComite = await this._getListaComitesByMatricula(
        dadosUsuario.chave
      );
      if (!prefixosComite.includes(parseInt(solicitacao.prefixoSolicitante)))
        throw new exception(
          "Você não pode registrar votos neste prefixo.",
          400
        );

      // verificar se o funci já votou em alguma das solicitações da lista
      const jaVotou = await this._getVotoByMatricula(dadosUsuario.chave);
      if (jaVotou.includes(idSolicitacao[elem]))
        throw new exception(
          `Não é possível registrar o(s) voto(s) pois você já registrou voto na solicitação ${solicitacao.nomeEvento}.`,
          400
        );

      const votacao = new Votos();
      votacao.idSolicitacao = idSolicitacao[elem];
      votacao.matriculaVotante = dadosUsuario.chave;
      votacao.nomeVotante = dadosUsuario.nome_usuario;
      votacao.codFuncaoVotante = dadosUsuario.cod_funcao;
      votacao.nomeFuncaoVotante = dadosUsuario.nome_funcao;
      votacao.prefixoVotante = dadosUsuario.prefixo;
      votacao.nomePrefixoVotante = dadosUsuario.dependencia;
      votacao.ativo = 1;
      votacao.deferido = deferido;

      // cria os parametros para serem gravados no histórico
      let alteracao = {
        nome: "votos",
        dados: votacao.toJSON(),
      };
      // let alteracaoSolicitacao;
      let gravou;
      let novoValorSolic;

      // se o voto for para deferir
      if (deferido) {
        // verificar se já tem snapshot
        let snapshots = await Snapshot.query()
          .select("matricula")
          .where({
            idSolicitacao: idSolicitacao[elem],
            ativo: 1,
          })
          .fetch();
        snapshots = snapshots.toJSON().map((funci) => funci.matricula);

        // buscar os membros do comitê no db2
        const comite = await this._getListaComitesAdm(
          solicitacao.prefixoSolicitante
        );
        let matriculasComite;
        let dtComite;
        if (comite.length) {
          matriculasComite = _.map(comite, "MATRICULA_MEMBRO");
          dtComite = comite[0].TS_CRIACAO_ESTRUTURA;
        }

        let gravouAux;
        if (snapshots.length) {
          // verificar se o comite do snapshot é igual ao do db2
          if (JSON.stringify(snapshots) !== JSON.stringify(matriculasComite)) {
            // salvar os votos para uso no front
            votosExcluidos = await this._getVotoById(idSolicitacao[elem]);
            // remover os votos
            const delVoto = await this._updVotos(idSolicitacao[elem]);
            if (!delVoto) {
              gravou = "cod_4";
            } else {
              // remover o snapshot
              const delSnap = await this._updSnapshot(idSolicitacao[elem]);
              if (!delSnap) {
                gravou = "cod_5";
              } else {
                gravou = "cod_3";
              }
              gravouAux = gravou;
            }
            // gravar o snapshot com todas as matriculas do novo comitê
            gravou = await this._setSnapshot(
              idSolicitacao[elem],
              matriculasComite,
              dtComite
            );
          }
        } else {
          // gravar o snapshot com todas as matriculas do comitê
          gravou = await this._setSnapshot(
            idSolicitacao[elem],
            matriculasComite,
            dtComite
          );
        }

        // se houve mudança na composição do comite, retornar o array dos votos excluídos
        if (gravou === "cod_1" && gravouAux === "cod_3") gravou = gravouAux;
      } else {
        // se o voto for para indeferir
        // alterar o status da solicitação para 3 = cancelado e o voto para 3 = cancelada
        let dados = {
          idStatus: STATUS_CANCELADO,
          votacao: STATUS_VOTACAO_CANCELADA,
        };
        let solicitacaoAlterada = await this._updSolicitacao(
          idSolicitacao[elem],
          dados
        );
        gravou = solicitacaoAlterada ? "cod_1" : "cod_6";
        // cria o log do cancelamento da solicitação
        const { descricao } = await this._getAcao(3);
        acaoSolicitacao = {
          idAcao: ACAO_CANCELAMENTO_SOLIC,
          descricaoAcao: descricao,
        };
      }
      // pega os dados atualizados da solicitação
      novoValorSolic = await this._getSolicitacao(idSolicitacao[elem]);

      // cod_1 = deu tudo certo
      switch (gravou) {
        case "cod_2":
          throw new exception("Falha ao gravar a composição do comitê.", 400);

        case "cod_3":
          // throw new exception('Houve mudança na composição do comitê. Todos os votos foram excluídos e será necessário reiniciar a votação.', 400);
          mudouComite.push({
            idSolicitacao: idSolicitacao[elem],
            nomeEvento: solicitacao.nomeEvento,
            prefixoVotante: dadosUsuario.prefixo,
            nomePrefixoVotante: dadosUsuario.dependencia,
            votos: votosExcluidos,
          });
          break;

        case "cod_4":
          throw new exception(
            "Houve mudança na composição do comitê, mas não foi possível reiniciar a votação. Tente novamente.",
            400
          );

        case "cod_5":
          throw new exception(
            "Houve mudança na composição do comitê, mas não foi possível alterar o comitê. Tente novamente.",
            400
          );

        case "cod_6":
          throw new exception(
            "Falha ao indeferir a solicitação. Tente novamente.",
            400
          );
      }

      // inicio do transact
      const trx = await Database.connection("patrocinios").beginTransaction();
      try {
        // gravar o voto
        await votacao.save(trx);
        if (votacao.isNew) throw new exception("Falha ao gravar o voto.", 400);
        // fim do voto

        // gravar o histórico
        let dadosHist = this._setHistorico(
          dadosUsuario,
          solicitacao,
          acao,
          alteracao
        );
        await dadosHist.save(trx);
        if (dadosHist.isNew)
          throw new exception("Falha ao gravar o histórico.", 400);
        if (!deferido) {
          let dadosHist = this._setHistorico(
            dadosUsuario,
            novoValorSolic,
            acaoSolicitacao
          );
          await dadosHist.save(trx);
          if (dadosHist.isNew)
            throw new exception("Falha ao gravar o histórico.", 400);
        }
        // fim do histórico

        const resultado = trx.commit();
        if (!resultado) {
          throw new exception("Falha ao salvar a solicitação.", 400);
        }
      } catch (error) {
        if (error.message) {
          throw new exception(error.message, error.status);
        } else {
          throw new exception(
            "Falha ao criar a SAC! Contate o administrador do sistema.",
            400
          );
        }
      }
      // fim do transact

      // verificar se é o último voto e se a solicitação está em andamento status = 1
      let excecaoQuorum = await this._getExcecaoQuorum(
        solicitacao.prefixoSolicitante
      );
      qtdQuorum = excecaoQuorum ? excecaoQuorum.quorum : qtdQuorum;
      let votosValor = await this._getVotoById(idSolicitacao[elem]);
      let qtdVotos = votosValor.length;

      // se for último voto, alterar a fase para 2 = em tratamento
      if (
        qtdQuorum === qtdVotos &&
        novoValorSolic.idStatus === STATUS_EM_ANDAMENTO
      ) {
        const proximaFase = await this._getProximaFase(novoValorSolic);
        proximaFase.votacao = STATUS_VOTACAO_CONCLUIDA;
        const atualizaSolic = await this._updSolicitacao(
          idSolicitacao[elem],
          proximaFase
        );

        if (!atualizaSolic)
          throw new exception(
            "Falha ao enviar a solicitação para análise. Tente novamente. Caso o problema persista, entre em contato com a SuperAdm para regularizar."
          );
      }
    }
    response.ok({ mudouComite });
  }

  /**
   * atualizar os dados de uma solicitação
   * @param {Object} request
   * @param {Object} response
   * @param {Object} session
   */
  async postRespAnalise({ request, response, session }) {
    const trx = await Database.connection("patrocinios").beginTransaction();

    try {
      const { idSolicitacao, respAtribuido } = request.allParams();

      for (const resp of respAtribuido) {
        const respAnalise = await this._setRespAnalise(idSolicitacao, resp);

        // Grava responsável atribuído
        await respAnalise.save(trx);
      }

      const dadosUsuario = session.get("currentUserAccount");
      const acao = await this._getAcao(ACAO_ATRIBUICAO_RESP_ANALISE); // Busca a ação de atribuição de responsável

      // Prepara para gravar histórico
      const dadosHist = this._setHistorico(
        dadosUsuario,
        { ...respAtribuido, id: idSolicitacao },
        { idAcao: acao.id, descricaoAcao: acao.descricao }
      );

      // Grava log no histórico
      await dadosHist.save(trx);

      const resultado = trx.commit();

      if (!resultado) {
        return response.badRequest("Falha ao salvar a solicitação.");
      }

      return response.ok("Responsável atribuído com sucesso!");
    } catch (error) {
      trx.rollback;
      throw new exception(
        error.message || "Falha ao atribuir responsável pela análise.",
        error.status || 400
      );
    }
  }
  /*********** Fim dos Métodos post ****************  */

  /*********** Métodos patch ****************
   * atualizar os dados nas tabelas principais
   */

  /**
   * atualizar os dados de uma solicitação
   * @param {Object} request
   * @param {Object} response
   * @param {Object} session
   */
  async patchSolic({ request, response, session }) {
    let { respostas, solicitacoes, recorrencia } = request.allParams();

    try {
      solicitacoes = JSON.parse(solicitacoes);

      if (respostas) {
        respostas = JSON.parse(respostas);
      }

      if (recorrencia) {
        recorrencia = JSON.parse(recorrencia);
      }
    } catch (error) {
      throw new exception("Falha no recebimento das informações.", 400);
    }

    const { descricao } = await this._getAcao(solicitacoes.idAcao);
    const acao = {
      idAcao: solicitacoes.idAcao,
      descricaoAcao: descricao,
    };

    const dadosUsuario = session.get("currentUserAccount");

    // testar se é envio para votação
    if (solicitacoes.idAcao === ACAO_ENVIO_PARA_VOTACAO) {
      let liberaVoto = await this._checkVotacao(solicitacoes, dadosUsuario);
      if (!liberaVoto.valor) {
        throw new exception(liberaVoto.mensagem, 400);
      }
      solicitacoes.votacao = STATUS_VOTACAO_EM_ANDAMENTO;
    } else {
      if (!solicitacoes.prefixoSolicitante && solicitacoes.idSolicitacao) {
        const solicitacao = await this._getSolicitacao(
          solicitacoes.idSolicitacao
        );
        solicitacoes.prefixoSolicitante = solicitacao.prefixoSolicitante;
      }
      // verificar o acesso no prefixo para os casos de edição da solicitação
      if (!solicitacoes.prefixoSolicitante)
        throw new exception("Prefixo solicitante não encontrado.", 400);

      if (solicitacoes.idAcao === ACAO_DEVOLUCAO_SOLIC) {
        try {
          await this.devolverSolic(
            dadosUsuario,
            solicitacoes.idSolicitacao,
            acao,
            solicitacoes.obsDevolucao
          );

          return response.ok("Devolução efetuada com sucesso!");
        } catch (error) {
          throw new exception(
            "Falha ao efetuar a devolução da solicitação.",
            400
          );
        }
      }
    }

    const trx = await Database.connection("patrocinios").beginTransaction();
    try {
      // alterar a solicitação
      let dadosSolic = await this._setSolicitacao(solicitacoes, respostas);
      await dadosSolic.save(trx);

      if (dadosSolic.isNew) {
        throw new exception("Falha ao gravar a solicitação.", 400);
      }

      dadosSolic = dadosSolic.toJSON();
      // fim da solicitação

      // Atribuir Responsável para análise da solicitação
      if (acao.idAcao === ACAO_ANALISE_ACOLHIMENTO) {
        // todo
        const respAnalise = await this._setRespAnalise(solicitacoes.id, {
          matricula: dadosUsuario.matricula,
        });

        // Grava responsável atribuído
        await respAnalise.save(trx);
      }

      // alterar as respostas e criar o objeto para o histórico
      const resp = [];
      let alteracao;

      if (!_.isNil(respostas)) {
        for (const elem in respostas) {
          // Se a resposta não for arquivo
          if (!["file", "resp"].includes(elem.substring(0, 4))) {
            const dadosResp = await this._setRespostas(
              elem,
              respostas[elem],
              dadosSolic.id,
              dadosSolic.idForm
            );
            await dadosResp.save(trx);
            if (dadosResp.isNew)
              throw new exception("Falha ao gravar as respostas.", 400);
            resp.push(dadosResp.toJSON());
          }
        }
        alteracao = {
          nome: "respostas",
          dados: resp,
        };
      }
      // fim das repostas

      // Salva os arquivos de upload, caso existam
      const arquivos = await this._setArquivos(
        request,
        dadosSolic.id,
        dadosUsuario
      );

      arquivos.forEach(async (arquivo) => await arquivo.save(trx));

      if (arquivos.isNew)
        throw new exception("Falha ao gravar o(s) arquivo(s).", 400);
      // fim de arquivos //

      // verifica se existe recorrencia
      let dadosRecorAux;
      let dadosRecor;
      // auxiliar para saber se tem recorrencia auxiliar
      let gravaRecorAux = false;
      // auxiliar para saber quais parametros passar para a gravação da recorrencia
      let gravaRecor;
      if (!_.isNil(recorrencia)) {
        // se não existe a recorrencia, inserir os registros
        if (_.isNil(recorrencia.id)) {
          // verifica se é insert de recorrencia auxiliar
          if (
            _.isNil(recorrencia.idAuxiliarRecorrencia) &&
            !_.isNil(recorrencia.avaliacaoResultado)
          ) {
            let dadosAux = {
              idSolicitacao: dadosSolic.id,
              prefixo: recorrencia.prefixo,
              nomeDependencia: recorrencia.nomeDependencia,
              nomeEvento: recorrencia.nomeEvento,
              valorEvento: recorrencia.valorEvento,
              dtEvento: recorrencia.dtEvento,
              avaliacaoResultado: recorrencia.avaliacaoResultado,
            };
            // cria a model da recorrencia auxiliar
            dadosRecorAux = await this._setRecorrenciaAux(dadosAux);
            gravaRecorAux = true;

            // instrução para criar a model da recorrencia com nova auxiliar
            gravaRecor = "novaAuxiliar";
          } else {
            // instrução para criar a model da recorrencia com nova recorrencia
            gravaRecor = "novaRecorrencia";
          }
        } else {
          // verifica se é recorrencia auxiliar
          if (
            !_.isNil(recorrencia.idAuxiliarRecorrencia) &&
            recorrencia.ativo === 1
          ) {
            // cria a model da recorrencia auxiliar
            dadosRecorAux = await this._setRecorrenciaAux(recorrencia);
            gravaRecorAux = true;
          }
          // instrução para criar a model da recorrencia com atualização da existente
          gravaRecor = "atualizaRecorrencia";
        }
        // gravar a recorrencia auxiliar e criar o objeto para o histórico
        if (gravaRecorAux) {
          await dadosRecorAux.save(trx);
          if (dadosRecorAux.isNew)
            throw new exception("Falha ao gravar a recorrência auxiliar.", 400);
          dadosRecorAux = dadosRecorAux.toJSON();
        }
        // cria a model da recorrencia
        let paramRecor;
        switch (gravaRecor) {
          case "novaAuxiliar":
            paramRecor = {
              id: null,
              idSolicitacao: recorrencia.idSolicitacao,
              idSolicitacaoAnterior: recorrencia.idSolicitacaoAnterior,
              idAuxiliarRecorrencia: dadosRecorAux.id,
              ativo: 1,
            };
            break;
          case "novaRecorrencia":
            paramRecor = {
              id: null,
              idSolicitacao: recorrencia.idSolicitacao,
              idSolicitacaoAnterior: recorrencia.idSolicitacaoAnterior,
              idAuxiliarRecorrencia: null,
              ativo: 1,
            };
            break;
          case "atualizaRecorrencia":
            paramRecor = {
              id: recorrencia.id,
              idSolicitacao: recorrencia.idSolicitacao,
              idSolicitacaoAnterior: recorrencia.idSolicitacaoAnterior,
              idAuxiliarRecorrencia: recorrencia.idAuxiliarRecorrencia,
              ativo: recorrencia.ativo,
            };
            break;
        }
        dadosRecor = await this._setRecorrencia(paramRecor);
        // gravar a recorrencia e criar o objeto para o histórico
        await dadosRecor.save(trx);
        if (dadosRecor.isNew)
          throw new exception("Falha ao gravar a recorrência.", 400);
        dadosRecor = dadosRecor.toJSON();
      }
      // fim da recorrencia

      // gravar o histórico
      let dadosHist = this._setHistorico(
        dadosUsuario,
        dadosSolic,
        acao,
        alteracao,
        dadosRecor,
        dadosRecorAux
      );
      await dadosHist.save(trx);
      if (dadosHist.isNew)
        throw new exception("Falha ao gravar o histórico.", 400);
      // fim do histórico

      const resultado = trx.commit();

      if (!resultado) {
        throw new exception("Falha ao salvar a solicitação.", 400);
      }

      const tudoRespondido = await this._checkTodasRespostas(dadosSolic);
      response.ok({ msg: "Solicitação alterada com sucesso!", tudoRespondido });
    } catch (error) {
      await trx.rollback();
      if (error.message) {
        throw new exception(error.message, error.status);
      } else {
        throw new exception(
          "Falha ao criar a SAC! Contate o administrador do sistema.",
          400
        );
      }
    }
  }

  /**
   * atualizar os dados de uma solicitação
   * @param {Object} dadosUsuario
   * @param {Integer} idSolicitacao
   * @param {Object} acao
   * @param {String} obsDevolucao
   */
  async devolverSolic(dadosUsuario, idSolicitacao, acao, obsDevolucao) {
    try {
      const trx = await Database.connection("patrocinios").beginTransaction();

      // Desativa os votos da solicitacao
      await Votos.query()
        .where({ idSolicitacao })
        .transacting(trx)
        .update({ ativo: 0 });

      // Desativa o snapshot do comitê
      await Snapshot.query()
        .where({ idSolicitacao })
        .transacting(trx)
        .update({ ativo: 0 });

      // Desatribui o responsável pela Análise na Equipe de Comunicação
      await RespAnalise.query()
        .where({ idSolicitacao })
        .transacting(trx)
        .update({ ativo: 0 });

      // Busca os dados da solicitacao
      const solic = await Solicitacao.find(idSolicitacao);

      // Busca o idForm
      const faseTipoSolic = await this._getFaseTipoSolicitacao(
        SEQUENCIAL_INCLUSAO_SAC,
        solic.idTipoSolicitacao,
        solic.versao
      );
      const { idFase, sequencial, idForm } = faseTipoSolic;

      solic.merge({
        votacao: STATUS_VOTACAO_NAO_INICIADA, // Alterar o status da votação para não iniciada
        idFase,
        sequencial,
        idForm,
        // idResponsavel: null, // Desatribui o responsável pela Análise na Equipe de Comunicação
        // devolucao: 1,
        obsDevolucao,
      });

      // Salva os dados na tabela solicitacoes
      await solic.save(trx);

      // Grava o histórico da devolução
      const dadosHist = this._setHistorico(
        dadosUsuario,
        solic,
        acao,
        null,
        null,
        null,
        obsDevolucao
      );
      await dadosHist.save(trx);

      trx.commit();

      // Busca os dados do histótico da solicitacao
      const historico = await Historico.query()
        .where({ idSolicitacao, idAcao: ACAO_INCLUSAO_SOLIC })
        .first();

      // Busca os dados do funci que registrou a solicitação
      const funci = await getOneFunci(historico.matricula);
      const nomeGuerra = capitalize(funci.nomeGuerra);

      // Busca o template do email
      const emailEngine = new TemplateEmailEngine(
        "Patrocinios/DevolucaoSolicitacao",
        {
          from: "naoresponder@bb.com.br",
          subject: "Devolução de Solicitação de Patrocínio",
        }
      );

      await emailEngine.sendMail({ matricula: historico.matricula }, [
        nomeGuerra,
        solic.nomeEvento,
        obsDevolucao,
        solic.idSolicitacao,
      ]);
    } catch (error) {
      trx.rollback();
    }
  }

  /*********** Fim dos Métodos patch ****************  */

  /*********** Métodos setters ****************
   * criação de objetos para model ou métodos internos
   */

  /**
   * Grava as matriculas do snapshot se o campo ativo for igual a 1
   * Caso contrário, soft delete na composição do comitê
   * cod_1 = gravou a composição do comitê
   * cod_2 = erro ao gravar/atualizar a composição
   * cod_3 = soft delete na composição do comitê
   * cod_5 = necessário fazer update no snapshot
   *
   * @param {Integer} idSolicitacao
   * @param {String} matricula
   * @param {Date} dtComite
   * @param {Binary} ativo
   */
  async _setSnapshot(idSolicitacao, matriculasComite, dtComite, ativo = 1) {
    if (ativo) {
      for (const elem in matriculasComite) {
        const novoSnap = new Snapshot();
        novoSnap.idSolicitacao = idSolicitacao;
        novoSnap.matricula = matriculasComite[elem];
        novoSnap.ativo = ativo;
        novoSnap.dtComite = dtComite;

        await novoSnap.save();
        if (novoSnap.isNew) return "cod_2";
      }
      return "cod_1";
    } else {
      return "cod_5";
    }
  }

  /**
   * prepara o model Solicitacao para ser gravado no bd
   * @param {Object} dadosSolicitacao
   * @param {Object} respostas
   */
  async _setSolicitacao(dadosSolicitacao, respostas = null) {
    let dadosSolic;

    if (_.isNil(dadosSolicitacao.idSolicitacao)) {
      dadosSolic = new Solicitacao();

      // adicionando o status "em andamento"
      dadosSolicitacao.idStatus = STATUS_EM_ANDAMENTO;
      // verificar se o pedido está dentro do prazo
      dadosSolicitacao.solicitadoForaPrazo = await this._checkForaPrazo(
        dadosSolicitacao.dataInicioEvento,
        dadosSolicitacao.idTipoSolicitacao
      );

      for (const elem in dadosSolicitacao) {
        dadosSolic[elem] = dadosSolicitacao[elem];
      }
    } else {
      // ajustando o objeto solicitacoes
      dadosSolicitacao.id = dadosSolicitacao.idSolicitacao;
      dadosSolic = await Solicitacao.find(dadosSolicitacao.id);
      let proximaFase = null;

      if (dadosSolicitacao.idAcao === ACAO_CANCELAMENTO_SOLIC) {
        dadosSolicitacao.idStatus = STATUS_CANCELADO;
      }

      if (dadosSolicitacao.mudarFase) {
        // Quando a solicitação estiver na fase de "Encerramento"
        if (dadosSolic.idFase === FASE_ENCERRAMENTO) {
          // Altera o status da solicitação para "Concluído"
          proximaFase = {
            idStatus: STATUS_CONCLUIDO,
            dtConclusao: new Date(),
          };
        } else {
          proximaFase = await this._getProximaFase(dadosSolic);
        }

        delete dadosSolicitacao.mudarFase;
      }

      delete dadosSolicitacao.idSolicitacao;
      delete dadosSolicitacao.idAcao;
      dadosSolic.merge(dadosSolicitacao);

      if (
        dadosSolic.idStatus === STATUS_CANCELADO &&
        dadosSolic.votacao === STATUS_VOTACAO_EM_ANDAMENTO
      ) {
        dadosSolic.votacao = STATUS_VOTACAO_CANCELADA;
      } else if (proximaFase) {
        dadosSolic.merge(proximaFase);
      }
    }

    for (const key in respostas) {
      if (key.substring(0, 4) === "resp") {
        if (parseInt(key.substring(key.length - 2)) === TIPO_PERGUNTA_NR_MKT) {
          dadosSolic.nrMKT = respostas[key];
        }
      }
    }

    return dadosSolic;
  }

  /**
   * prepara o model Resposta para ser gravado no bd
   * @param {Integer} idPergunta
   * @param {String} descricaoResposta
   * @param {Integer} idSolicitacao
   * @param {Boolean} update indica se o modelo da resposta é de inserção ou update
   */
  async _setRespostas(idPergunta, descricaoResposta, idSolicitacao, idForm) {
    let dadosResp = await Resposta.query()
      .where({ idSolicitacao, idForm, idPergunta })
      .first();

    if (dadosResp) {
      dadosResp.merge({
        descricaoResposta: Array.isArray(descricaoResposta)
          ? JSON.stringify(descricaoResposta)
          : descricaoResposta,
      });
    } else {
      dadosResp = new Resposta();
      dadosResp.idSolicitacao = idSolicitacao;
      dadosResp.idForm = idForm;
      dadosResp.idPergunta = idPergunta;
      dadosResp.descricaoResposta = Array.isArray(descricaoResposta)
        ? JSON.stringify(descricaoResposta)
        : descricaoResposta;
    }

    return dadosResp;
  }

  /**
   * prepara o model RecorrenciaAux para ser gravado
   * @param {Object} recorrenciaAux
   */
  async _setRecorrenciaAux(recorrenciaAux) {
    recorrenciaAux.valorEvento = Moeda.toDB(recorrenciaAux.valorEvento);
    let dadosRecorAux;
    if (_.isNil(recorrenciaAux.idSolicitacao)) {
      dadosRecorAux = new RecorrenciaAux();

      recorrenciaAux.idSolicitacao = recorrenciaAux.idAuxiliar;
      delete recorrenciaAux.idAuxiliar;
      for (const elem in recorrenciaAux) {
        dadosRecorAux[elem] = recorrenciaAux[elem];
      }
    } else {
      dadosRecorAux = recorrenciaAux.idAuxiliarRecorrencia
        ? await RecorrenciaAux.find(recorrenciaAux.idAuxiliarRecorrencia)
        : new RecorrenciaAux();

      dadosRecorAux.merge({
        idSolicitacao: recorrenciaAux.idSolicitacao,
        prefixo: recorrenciaAux.prefixo,
        nomeDependencia: recorrenciaAux.nomeDependencia,
        dtEvento: recorrenciaAux.dtEvento,
        valorEvento: recorrenciaAux.valorEvento,
        nomeEvento: recorrenciaAux.nomeEvento,
        avaliacaoResultado: recorrenciaAux.avaliacaoResultado,
      });
    }

    return dadosRecorAux;
  }

  /**
   * prepara o model Recorrencia para ser gravado
   * @param {Integer} recorrencia
   */
  async _setRecorrencia(recorrencia) {
    let dadosRecor;
    if (_.isNil(recorrencia.id)) {
      dadosRecor = new Recorrencia();

      dadosRecor.idSolicitacao = recorrencia.idSolicitacao;
      dadosRecor.idSolicitacaoAnterior = recorrencia.idSolicitacaoAnterior;
      dadosRecor.idAuxiliarRecorrencia = recorrencia.idAuxiliarRecorrencia;
      dadosRecor.ativo = recorrencia.ativo;
    } else {
      dadosRecor = await Recorrencia.find(recorrencia.id);
      dadosRecor.merge({
        idSolicitacao: recorrencia.idSolicitacao,
        idSolicitacaoAnterior: recorrencia.idSolicitacaoAnterior,
        idAuxiliarRecorrencia: recorrencia.idAuxiliarRecorrencia,
        ativo: recorrencia.ativo,
      });
    }

    return dadosRecor;
  }

  /**
   * gravar o histórico
   * @param {Object} historico
   * @param {Object} trx
   */
  _setHistorico(
    dadosUsuario,
    dadosSolic,
    acao,
    alteracao = null,
    dadosRecor = null,
    dadosRecorAux = null,
    obs = null
  ) {
    let dadosHist = new Historico();
    dadosHist.idSolicitacao = dadosSolic.id;
    dadosHist.prefixo = dadosUsuario.prefixo;
    dadosHist.nomePrefixo = dadosUsuario.nome_super;
    dadosHist.idAcao = acao.idAcao;
    dadosHist.descricaoAcao = acao.descricaoAcao;
    dadosHist.matricula = dadosUsuario.matricula;
    dadosHist.nomeFunci = dadosUsuario.nome_usuario;
    dadosHist.codFuncaoFunci = dadosUsuario.cod_funcao;
    dadosHist.nomeFuncaoFunci = dadosUsuario.nome_funcao;
    let dados = alteracao
      ? { solicitacao: dadosSolic, [alteracao.nome]: alteracao.dados }
      : { solicitacao: dadosSolic };
    if (dadosRecorAux) dados.recorrenciaAuxiliar = dadosRecorAux;
    if (dadosRecor) dados.recorrencia = dadosRecor;
    dadosHist.dados = JSON.stringify(dados);
    if (obs) dadosHist.obs = obs;

    return dadosHist;
  }

  /**
   * prepara o model RespAnalise para ser gravado
   * @param {Integer} idSolicitacao
   * @param {Object} respAtribuido
   */
  async _setRespAnalise(idSolicitacao, respAtribuido = null) {
    let respAnalise = await RespAnalise.findOrCreate({
      idSolicitacao,
      matricula: respAtribuido.matricula,
    });

    // Prepara para gravar responsável atribuído
    const resp = await EquipeComunicacao.findBy(
      "matricula",
      respAtribuido.matricula
    );
    respAnalise.nome = resp.nome;
    respAnalise.ativo = 1;

    return respAnalise;
  }

  /*********** Fim dos Métodos setters ****************  */

  async exportarDados({ request, response, session }) {
    try {
      // pegar os dados do usuario
      const dadosUsuario = session.get("currentUserAccount");

      // Verifica se o usuário é da equipe de comunicação
      const isEquipeComunic = await isEquipeComunicacao(dadosUsuario);

      // Busca os prefixos autorizados
      const prefixosAutorizados = !isEquipeComunic
        ? await getPrefixosAutorizados(dadosUsuario)
        : [];

      let { filtro } = request.allParams();
      filtro = JSON.parse(filtro);

      const solics = await this._getSolicitacao(
        null,
        prefixosAutorizados,
        filtro
      );

      const dados = solics.map((solic) => ({
        Id: solic.id,
        "Data Inclusão": solic.dtInclusao,
        Super: `${solic.prefixoSolicitante} - ${solic.nomeSolicitante}`,
        "Data Inicio": solic.dataInicioEvento,
        "Data Fim": solic.dataFimEvento,
        Valor: solic.valorEvento,
        "Nr. MKT": solic.nrMKT,
        Fase: solic.fase.descricao,
        Status: solic.status.descricao,
      }));

      let tmpHeader = Object.keys(dados[0]);
      let headers = [];

      for (const tmp of tmpHeader) {
        headers.push({ key: tmp, header: tmp });
      }

      let arquivoExportado = await jsonExport.convert({
        dadosJson: dados,
        headers,
        type: "xls",
      });

      await jsonExport.download(response, arquivoExportado);
    } catch (err) {
      throw new exception("Falha ao exportar os dados", 400);
    }
  }
}

module.exports = PatrociniosController;
