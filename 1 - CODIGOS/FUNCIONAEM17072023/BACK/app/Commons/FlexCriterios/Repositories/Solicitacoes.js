"use strict";

const SolicitacoesModel = use("App/Models/Mysql/FlexCriterios/Solicitacoes");
const UnidadesAlvoModel = use("App/Models/Mysql/FlexCriterios/UnidadesAlvo");
const ManifestacoesModel = use("App/Models/Mysql/FlexCriterios/Manifestacoes");
const SolictTiposModel = use("App/Models/Mysql/FlexCriterios/SolictTipos");
const AnalisesModel = use("App/Models/Mysql/FlexCriterios/Analises");
const SolicitacoesFiltros = use("App/Models/Mysql/FlexCriterios/Filtros");
const DispensasModel = use("App/Models/Mysql/FlexCriterios/Dispensas");
const AnexosModel = use("App/Models/Mysql/FlexCriterios/Anexos");
const JurisdicoesSubordinadasModel = use(
  "App/Models/Mysql/JurisdicoesSubordinadas"
);
const Comites = use("App/Commons/Arh/dadosComites");
const Env = use("Env");

const CargosComissoes = use("App/Models/Mysql/Arh/CargosComissoes");

const ComissoesFot09 = use("App/Models/Mysql/Arh/ComissoesFot09");
const FuncisRegionais = use("App/Models/Mysql/Arh/FuncisRegionais");
const Dipes = use("App/Models/Mysql/Dipes");
const Gestores = use("App/Models/Mysql/FlexCriterios/Gestores");

const OperacionalGestor = use(
  "App/Models/Mysql/FlexCriterios/OperacionalGestor"
);
const hasPermission = require("../../HasPermission");
const { ACOES, SITUACOES, STATUS, ETAPAS, OPTS } = require("../Constants");

const Database = use("Database");

class Solicitacoes {
  async getUrlDocumento({ arquivoProcuracao, urlDocumento }) {
    const baseUrl = Env.get("BACKEND_URL");
    const arquivoNome = await arquivoProcuracao;
    if (arquivoNome) {
      return `${baseUrl}/flexibilizacao/${arquivoNome}`;
    }

    if (urlDocumento) {
      return urlDocumento;
    }

    throw new Error("Documento não encontrado.");
  }

  async saveDocumento(documento, novaSolicitacaoId, trx) {
    console.log(documento);
    const newAnexo = {
      id_solicitacao: novaSolicitacaoId,
      nome: documento.name,
      url: documento.url,
    };
    AnexosModel.create(newAnexo, trx);
  }

  async umaSolicitacaoPorId(id, trx = null) {
    const consulta = await SolicitacoesModel.query()
      .where("id", id)
      .with("funci")
      .with("tipos")
      .with("localizacao")
      .with("status")
      .with("etapa")
      .with("analise")
      .with("anexos")
      .with("manifestacoes", (subQuery) => {
        subQuery.with("acao").with("situacao");
      })
      .with("prefixoDest", (subQuery) => {
        subQuery
          .sb00()
          .with("dadosGerev", (subQuery) => {
            subQuery.sb00();
          })
          .with("dadosSuper", (subQuery) => {
            subQuery.sb00();
          })
          .with("dadosDiretoria", (subQuery) => {
            subQuery.sb00();
          })
          .with("dotacao");
      })
      .with("prefixoOrig", (subQuery) => {
        subQuery
          .sb00()
          .with("dadosGerev", (subQuery) => {
            subQuery.sb00();
          })
          .with("dadosSuper", (subQuery) => {
            subQuery.sb00();
          })
          .with("dadosDiretoria", (subQuery) => {
            subQuery.sb00();
          })
          .with("dotacao");
      })
      .transacting(trx)
      .first();

    return consulta?.toJSON() ?? null;
  }

  async getDiretoriasEnvolvidas(id_solicitacao, trx = null) {
    const consulta = await SolicitacoesModel.query()
      .select("diretoriaOrigem", "diretoriaDestino")
      .where("id", id_solicitacao)
      .transacting(trx)
      .fetch();

    return consulta?.toJSON() ?? null;
  }

  async getUnidadesGerevsSupersByIdSoliticacao(id_solicitacao) {
    const consulta = await SolicitacoesModel.query()
      .select(
        "prefixoOrigem",
        "prefixoDestino",
        "gerevOrigem",
        "gerevDestino",
        "superOrigem",
        "superDestino"
      )
      .where("id", id_solicitacao)
      .fetch();
    return consulta?.toJSON() ?? null;
  }

  async getDiretoriasAlvo() {
    const diretoriasAutorizadas = await UnidadesAlvoModel.query()
      .select("prefixo")
      .fetch();
    return diretoriasAutorizadas?.toJSON() ?? null;
  }

  async podeCriarSolicitacaoNasDiretoriasInformadas(
    diretoriaOrigem,
    diretoriaDestino
  ) {
    const diretoriasAutorizadas = await this.getDiretoriasAlvo();

    const diretoriaOrigemAutorizada = diretoriasAutorizadas.find(
      (a) => a.prefixo == diretoriaOrigem
    );
    const diretoriaDestinoAutorizada = diretoriasAutorizadas.find(
      (a) => a.prefixo == diretoriaDestino
    );

    if (diretoriaOrigemAutorizada && diretoriaDestinoAutorizada) {
      return true;
    } else {
      return false;
    }
  }

  async usuarioTemSolicitacaoEmAndamento(matricula) {
    const umaEmAndamento = await SolicitacoesModel.query()
      .whereNot("id_etapa", ETAPAS.ENCERRADO)
      .where("matricula", matricula)
      .first();

    if (umaEmAndamento) {
      return true;
    } else {
      return false;
    }
  }

  async listarSolicitacoes(usuario, filtro, perfil, trx = null) {
    const isRootUser = /ROOT/.test(perfil);
    let isOperadorGestor;
    let prefixoVirtualAtual = usuario.prefixo;
    let prefSubords;
    //Checa se é funci gerev e calcula o prefixo certo
    const funciPrefixoVirtual = await FuncisRegionais.query()
      .where("matricula", usuario.matricula)
      .first();
    if (funciPrefixoVirtual) {
      prefixoVirtualAtual = [funciPrefixoVirtual.pref_gerev];
      prefSubords = [prefixoVirtualAtual];
    } else {
      prefSubords = [usuario.prefixo];
    }
    //prefixos que serão usados nas queryss

    //altera os prefixos quando operacionalGestor
    if (!isRootUser) {
      //precisa manter o if do userRoot pq quem é ROOT tambem recebe Analista(tabelaGestores) e quebraria
      isOperadorGestor = /ANALISTA|DESPACHANTE|EXECUTANTE/.test(perfil);

      if (isOperadorGestor) {
        const atendidasGestor = await Gestores.query()
          .whereIn("uor", [usuario.uor, usuario.uor_trabalho])
          .with("unidadesAlvo")
          .first();

        const atendidasOperador = await OperacionalGestor.query()
          .whereIn("uor", [usuario.uor, usuario.uor_trabalho])
          .with("unidadesAlvo")
          .first();

        const gestorToJson = atendidasGestor?.toJSON();
        const operadorToJson = atendidasOperador?.toJSON();

        const unidadesGestorArray = gestorToJson?.unidadesAlvo;
        const unidadesOperadorArray = operadorToJson?.unidadesAlvo;

        let allAtendidas;
        if (unidadesGestorArray && unidadesOperadorArray) {
          allAtendidas = unidadesGestorArray.concat(unidadesOperadorArray);
        }
        if (unidadesGestorArray && !unidadesOperadorArray) {
          allAtendidas = unidadesGestorArray;
        }
        if (!unidadesGestorArray && unidadesOperadorArray) {
          allAtendidas = unidadesOperadorArray;
        }

        const prefixosAtendidos = allAtendidas.map((elem) => {
          return elem.prefixo;
        });
        //Quando o usuário ROOT a variável `prefSubords` estava sendo alterada, não incluindo o prefixo do usuário. Essa ausência de informação do prefixo, estava excluindo o contador do filtro de minhas pendências;
        prefixosAtendidos.push(usuario.prefixo)
        prefSubords = prefixosAtendidos; //gepes
      }
    }

    //QUERY FORMATADA COM OS PREFIXOS QUE CADA PERFIL PODE FILTRAR
    const prefixosConstraints = (query) => {
      //Se for rootUser retorna a query sem filtros
      /*  if (isRootUser) {
        return query;
      } */

      return query
        .whereIn("prefixoOrigem", prefSubords)
        .orWhereIn("gerevOrigem", prefSubords)
        .orWhereIn("diretoriaOrigem", prefSubords)
        .orWhereIn("superOrigem", prefSubords)
        .orWhereIn("prefixoDestino", prefSubords)
        .orWhereIn("gerevDestino", prefSubords)
        .orWhereIn("superDestino", prefSubords)
        .orWhereIn("diretoriaDestino", prefSubords);
    };
    //Utilizado no contador 1 e quando gera
    const minhasPendenciasConstraints = (query) => {
      if (filtro == 1 && /MANIFESTANTE|DEFERIDOR/.test(perfil)) {
        query.whereHas("manifestacoes", (subQuery) => {
          subQuery
            .where("prefixo", usuario.prefixo)
            .whereIn("id_acao", [
              ACOES.MANIFESTACAO,
              ACOES.DEFERIMENTO,
              ACOES.COMPLEMENTO,
            ])
            .where("id_situacao", SITUACOES.PENDENTE);
        });
      }
    };

    //utilizado somente no contador 1 nos casos de manifestante e deferidor
    // prefSubords já é um array
    const minhasPendenciasConstraintsContador = (query) => {
      if (/MANIFESTANTE|DEFERIDOR/.test(perfil)) {
        query.whereHas("manifestacoes", (subQuery) => {
          subQuery
            .whereIn("prefixo",
              prefSubords /* usuario.prefixo */ /* , usuario.pref_regional */,
            )
            .whereIn("id_acao", [
              ACOES.MANIFESTACAO,
              ACOES.DEFERIMENTO,
              ACOES.COMPLEMENTO,
            ])
            .where("id_situacao", SITUACOES.PENDENTE);
        });
      }
    };

    //caso agencias e diretoria id acao = manifestacao + pendente
    const d = [STATUS.DEFERIMENTO];
    const m = [STATUS.MANIFESTACAO];
    //caso leonor id status = 2 e 3
    const aD = [STATUS.DESPACHO, STATUS.ANALISE];

    const aD2 = [STATUS.ANALISE];
    //caso da gepes solicitacao id_status : 6 - finalizando
    const f = [STATUS.FINALIZANDO];

    let currentIdStatus = /* isRootUser
      ? m.concat(aD, f, d)
      : */ /DEFERIDOR/.test(perfil)
      ? d
      : /EXECUTANTE/.test(perfil)
      ? f
      : /DESPACHANTE/.test(perfil)
      ? aD
      : /ANALISTA/.test(perfil)
      ? aD2
      : m;
    //TAMBEM UTILIZADA NO CONTADOR... Alterações aqui impactam diretamente no contador, deve ser somente leitura esse bloco
    const querys = {
      1: (query) => {
        query.where(prefixosConstraints).whereIn("id_status", currentIdStatus);
      },
      2: (query) => {
        // todas abertas e fechadas
        query.where(prefixosConstraints);
      },
      3: (query) => {
        // ativas
        query
          .whereNotIn("id_status", [STATUS.CANCELADO, STATUS.ENCERRADO])
          .where(prefixosConstraints);
      },
      4: (query) => {
        //AGUARDANDO MANIFESTACAO
        query
          .where("id_status", STATUS.MANIFESTACAO)
          .where(prefixosConstraints);
      },
      5: (query) => {
        //AGUARDANDO ANALISE
        query.where("id_status", STATUS.ANALISE).where(prefixosConstraints);
      },
      6: (query) => {
        // AGUARDANDO DESPACHO
        query.where("id_status", STATUS.DESPACHO).where(prefixosConstraints);
      },
      7: (query) => {
        // AGUARDANDO DEFERIMENTO
        query.where("id_status", STATUS.DEFERIMENTO).where(prefixosConstraints);
      },
      8: (query) => {
        // GEPES -- Em Finalização
        query.where("id_status", STATUS.FINALIZANDO).where(prefixosConstraints);
      },
      9: (query) => {
        //ENCERRADOS CANCELADOS
        query
          .whereIn("id_status", [STATUS.CANCELADO, STATUS.ENCERRADO])
          .where(prefixosConstraints);
      },
    };

    const [resultFiltro, abertasFechadasUserLogado, ...contagem] =
      await Promise.all([
        //Somente gera os filtros
        SolicitacoesFiltros.query().orderBy("ordem", "asc").fetch(),
        //Busca as solicitações do usuariologado
        SolicitacoesModel.query()
          .where(querys[filtro])
          .andWhere(minhasPendenciasConstraints)
          .with("tipos")
          .with("status")
          .with("localizacao")
          .with("etapa")
          .with("analise")
          .with("funci")
          .with("prefixoDest", (subQuery) => {
            subQuery
              .sb00()
              .with("dadosDiretoria", (subQuery) => {
                subQuery.sb00();
              })
              .with("dotacao");
          })
          .with("prefixoOrig", (subQuery) => {
            subQuery
              .sb00()
              .with("dadosDiretoria", (subQuery) => {
                subQuery.sb00();
              })
              .with("dotacao");
          })
          .orderBy("id", "DESC")
          .transacting(trx)
          .fetch(),
        ,
        //Informação da quantidade que vai aparecer nos contadores na pagina inicial (todos,em andamento, abertos,fechados,)
        SolicitacoesModel.query()
          .select(Database.raw("1 as id"))
          .select(Database.raw("COUNT(id) AS valor"))
          .where(querys[1])
          .andWhere(minhasPendenciasConstraintsContador)
          .transacting(trx)
          .first(),
        SolicitacoesModel.query()
          .select(Database.raw("2 as id"))
          .select(Database.raw("COUNT(id) AS valor"))
          .where(querys[2])
          .transacting(trx)
          .first(),
        SolicitacoesModel.query()
          .select(Database.raw("3 as id"))
          .select(Database.raw("COUNT(id) AS valor"))
          .where(querys[3])
          .transacting(trx)
          .first(),
        SolicitacoesModel.query()
          .select(Database.raw("4 as id"))
          .select(Database.raw("COUNT(id) AS valor"))
          .where(querys[4])
          .transacting(trx)
          .first(),
        SolicitacoesModel.query()
          .select(Database.raw("5 as id"))
          .select(Database.raw("COUNT(id) AS valor"))
          .where(querys[5])
          .transacting(trx)
          .first(),
        SolicitacoesModel.query()
          .select(Database.raw("6 as id"))
          .select(Database.raw("COUNT(id) AS valor"))
          .where(querys[6])
          .transacting(trx)
          .first(),
        SolicitacoesModel.query()
          .select(Database.raw("7 as id"))
          .select(Database.raw("COUNT(id) AS valor"))
          .where(querys[7])
          .transacting(trx)
          .first(),
        SolicitacoesModel.query()
          .select(Database.raw("8 as id"))
          .select(Database.raw("COUNT(id) AS valor"))
          .where(querys[8])
          .transacting(trx)
          .first(),
        SolicitacoesModel.query()
          .select(Database.raw("9 as id"))
          .select(Database.raw("COUNT(id) AS valor"))
          .where(querys[9])
          .transacting(trx)
          .first(),
      ]);

    //Logica pra montar os contadores da pagina inicial
    const filtrosTabelaSolicitacoesFiltros = resultFiltro?.toJSON() ?? null;
    const counters = contagem
      .filter((item) => !!item)
      .map((item) => item?.toJSON() ?? null);
    const contadores = counters.map((item) => {
      const nomeFiltro = filtrosTabelaSolicitacoesFiltros.find(
        (intItem) => intItem.ordem === item.id
      );

      return {
        id: item.id,
        nome: nomeFiltro.nome,
        valor: item.valor,
      };
    });
    //Fim da logicas pra montar os contadores da pagina inicial

    return {
      contadores,
      resultado: abertasFechadasUserLogado?.toJSON() ?? null,
    };
  }

  async getTotalComitesByPrefixo(consulta) {
    const totalComitesDiretoriaOrigem = await Comites.getListaComitesAdm(
      consulta.prefixoOrig.dadosDiretoria.prefixo
    );
    const totalComitesDiretoriaDestino = await Comites.getListaComitesAdm(
      consulta.prefixoDest.dadosDiretoria.prefixo
    );

    //assimilacao dos totais
    consulta.prefixoOrig.dadosDiretoria.totalComiteDiretoria =
      totalComitesDiretoriaOrigem.length;
    consulta.prefixoDest.dadosDiretoria.totalComiteDiretoria =
      totalComitesDiretoriaDestino.length;

    return consulta;
  }

  async contarSolicitacoes(usuario) {
    const consulta = await SolicitacoesModel.query().select(
      Database.raw("COUNT (*) as ")
    );
  }

  async novaSolicitacao(dados, trx = null) {
    const solicitacao = await SolicitacoesModel.create(dados, trx);

    return solicitacao;
  }

  async novoSolicitacaoTipo(tipos, trx = null) {
    const consulta = await SolictTiposModel.createMany(tipos, trx);

    return consulta;
  }

  async novaManifestacao(dados, trx = null) {
    const item = {
      id_solicitacao: parseInt(dados.id_solicitacao, 10),
      ...dados,
    };

    // criar as linhas da tabela manifestacoes
    const nova = await ManifestacoesModel.create(item, trx);
    return nova;
  }

  async gerarSlotsManifestacoesIniciais(
    id_solicitacao,
    prefixoOrigem,
    prefixoDestino,
    usuario,
    trx
  ) {
    // calcular os níveis de cada prefixo
    const [consulta, consultaFunci, prefDestino, prefOrigem, dispensasPrx] =
      await Promise.all([
        JurisdicoesSubordinadasModel.query()
          .select("prefixo", "nome as nomePrefixo", "nivel")
          .whereIn("prefixo_subordinada", [
            prefixoOrigem.prefixo,
            prefixoDestino.prefixo,
          ])
          .where((subQuery) => {
            subQuery
              .where("cd_subord", "00")
              .where("cd_subord_subordinada", "00")
              .whereNotIn("prefixo", [
                prefixoOrigem.prefixoDiretoria,
                prefixoDestino.prefixoDiretoria,
              ])
              .where("nivel", "<=", 10);
          })
          .orWhere("prefixo_subordinada", "prefixo")
          .orderBy("nivel", "asc")
          .orderByRaw(`prefixo_subordinada = ${prefixoOrigem.prefixo}`)
          .fetch(),
        CargosComissoes.query().where("cod_funcao", usuario.cod_funcao).first(),
        JurisdicoesSubordinadasModel.query()
          .where("prefixo_subordinada", prefixoDestino.prefixo)
          .orWhere("prefixo_subordinada", "prefixo")
          .where((subQuery) => {
            subQuery
              .where("cd_subord", "00")
              .where("cd_subord_subordinada", "00")
              .whereNot("prefixo", prefixoDestino.prefixoDiretoria)
              .where("nivel", "<=", 10);
          })
          .fetch(),
        JurisdicoesSubordinadasModel.query()
          .where("prefixo_subordinada", prefixoOrigem.prefixo)
          .orWhere("prefixo_subordinada", "prefixo")
          .where((subQuery) => {
            subQuery
              .where("cd_subord", "00")
              .where("cd_subord_subordinada", "00")
              .whereNot("prefixo", prefixoOrigem.prefixoDiretoria)
              .where("nivel", "<=", 10);
          })
          .fetch(),
        DispensasModel.all(),
      ]);

    const [subordinantes, funci, prefsDestino, prefsOrigem, dispensas] = [
      consulta?.toJSON() ?? null,
      consultaFunci?.toJSON() ?? null,
      prefDestino?.toJSON() ?? null,
      prefOrigem?.toJSON() ?? null,
      dispensasPrx?.toJSON() ?? null,
    ];

    if (!subordinantes) {
      return null;
    }

    const result = [prefixoDestino, prefixoOrigem, ...subordinantes];

    const [virtuais, reais] = [
      result.filter((item) => parseInt(item?.nivel) === 9),
      result.filter((item) => parseInt(item?.nivel) !== 9),
    ];

    let resultado = result.map((item) => {
      delete item.nivel;
      return item;
    });

    const [resultadoReais, resultadoVirtuais] = await Promise.all([
      Dipes.query()
        .from("DIPES.arhfot09")
        .join("superadm.cargos_e_comissoes", "cod_cargo", "cod_funcao")
        .whereIn(
          "arhfot09.cod_dependencia",
          reais.map((item) => item.prefixo)
        )
        .where("cargos_e_comissoes.flag_administrador", OPTS.SIM)
        .where("arhfot09.qtde_lotacao", ">", 0)
        .fetch(),
      FuncisRegionais.query()
        .leftJoin("superadm.cargos_e_comissoes", "comissao", "cd_funcao")
        .whereIn(
          "pref_gerev",
          virtuais.map((item) => item.prefixo)
        )
        .where("cargos_e_comissoes.flag_administrador", OPTS.SIM)
        .fetch(),
    ]);

    const [real, virtual] = [
      resultadoReais.toJSON(),
      resultadoVirtuais.toJSON(),
    ];

    const realFiltered = real.reduce((acc, obj) => {
      const index = acc.findIndex(
        (t) =>
          t.cod_dependencia === obj.cod_dependencia &&
          t.ref_org.match(/^\d+/)[0] !== obj.ref_org.match(/^\d+/)[0]
      );
      if (index === -1) {
        acc.push(obj);
      } else if (obj.ref_org.localeCompare(acc[index].ref_org) < 0) {
        acc[index] = obj;
      }
      return acc;
    }, []);

    const filtrados = [...realFiltered, ...virtual];

    //Sen destino/origem mesma diretoria, tira os duplicados
    if (prefixoOrigem.prefixoDiretoria == prefixoDestino.prefixoDiretoria) {
      resultado = await resultado.filter(
        (value, index, self) =>
          index === self.findIndex((t) => t.nomePrefixo === value.nomePrefixo)
      );
    }

    const prefixos = resultado.map((item, index) => {
      const prefixo = filtrados.find((l) =>
        [l.cod_dependencia, l.pref_gerev].includes(item.prefixo)
      );
      delete item.prefixoDiretoria;

      return {
        id_solicitacao: parseInt(id_solicitacao, 10),
        ordemManifestacao: index + 1,
        id_acao: ACOES.MANIFESTACAO,
        id_situacao: SITUACOES.PENDENTE,
        funcao: prefixo?.cod_funcao ?? null,
        nomeFuncao: prefixo?.nome_funcao ?? null,
        ...item,
      };
    });

    // criar as linhas da tabela manifestacoes
    const manifestacoes = await ManifestacoesModel.createMany(prefixos, trx);

    return manifestacoes;
  }

  async substituiSuper(prefixo) {
    // calcular os níveis de cada prefixo
    const consulta = await JurisdicoesSubordinadasModel.query()
      .where("prefixo_subordinada", prefixo)
      .where("cd_subord_subordinada", 1)
      .where("nivel", "=", 20)
      .fetch();

    return consulta?.toJSON() ?? null;
  }

  async novaAnalise(dados, trx = null) {
    const consulta = await AnalisesModel.create(dados, trx);

    return consulta;
  }

  async avancarEtapaSolicitacao(id_solicitacao, novaEtapa, trx = null) {
    const solicitacao = await SolicitacoesModel.find(id_solicitacao);
    solicitacao.merge(novaEtapa);
    await solicitacao.save(trx);
    return solicitacao.id;
  }

  async cancelarSolicitacao(id, trx) {
    const solicitacao = await SolicitacoesModel.find(id);
    solicitacao.merge({
      id_status: STATUS.CANCELADO,
      id_etapa: ETAPAS.ENCERRADO,
    });
    await solicitacao.save(trx);
    return solicitacao.id;
  }
}

module.exports = Solicitacoes;
