const _ = require("lodash");
const moment = require("moment");

const exception = use("App/Exceptions/Handler");

const Designacao = use("App/Models/Mysql/Designacao");
const Superadm = use("App/Models/Mysql/Superadm");
const Dipes = use("App/Models/Mysql/Dipes");
const Funci = use("App/Models/Mysql/Arh/Funci");
const Uors500g = use("App/Models/Mysql/Arh/Uors500g");

const {
  isFunciIncorporado,
  isNomeacaoPendente,
  getLatLong,
  getRotaRodoviaria,
  getDadosComissaoCompleto,
} = use("App/Commons/Arh");
const { limitrofes } = use("App/Commons/Mst");
const Constants = use("App/Commons/Designacao/Constants");
const getNivelAlfab = use("App/Commons/Designacao/getNivelAlfab");

async function setAnalise({ origem, destino }) {
  try {
    let analysis = await Funci.query()
      .with("prefixoLotacao", (dbQuery) => {
        dbQuery.with("dadosDiretoria").with("dadosSuper").with("dadosGerev");
      })
      .with("codUorLocalizacao", (dbQuery) => {
        dbQuery.with("dadosDiretoria").with("dadosSuper").with("dadosGerev");
      })
      .where("matricula", origem.matricula)
      .first();

    analysis = analysis.toJSON();

    let analise = {
      //funci
      data_posse: analysis.data_posse,
      habitualidade: analysis.habitualidade,
      cod_situacao: analysis.cod_situacao,
      data_situacao: analysis.data_situacao,
      data_comis: analysis.data_comis,
      dt_imped_odi: analysis.dt_imped_odi,
      ind_vcp: analysis.ind_vcp,
      data_vcp_ini: analysis.data_vcp_ini,
      data_vcp_fim: analysis.data_vcp_fim,
      prefixo_lotacao: analysis.prefixo_lotacao,
      funcao_lotacao: analysis.funcao_lotacao,
      carga_horaria: analysis.carga_horaria,
      desc_func_lotacao: analysis.desc_func_lotacao,
      ind_inamovivel: analysis.ind_inamovivel,
      dt_imped_instit_relac: analysis.dt_imped_instit_relac,
      uor_trabalho: analysis.uor_trabalho,
      data_posse_incorp: analysis.data_posse_incorp,
      //prefixo_lotacao
      cd_super_juris: analysis.prefixoLotacao.cd_super_juris,
      prefixo: analysis.prefixoLotacao.prefixo,
      nome: analysis.prefixoLotacao.nome,
      uor_dependencia: analysis.prefixoLotacao.uor_dependencia,
      nivel_agencia: analysis.prefixoLotacao.nivel_agencia,
      municipio: analysis.prefixoLotacao.municipio,
      nm_uf: analysis.prefixoLotacao.nm_uf,
    };

    if (analysis.prefixoLotacao.cd_super_juris === "0000") {
      analise.nome_super = "";
    } else {
      analise.nome_super = analysis.prefixoLotacao.dadosSuper.nome;
    }

    analise.nivel_alfab = await getNivelAlfab(parseInt(analise.nivel_agencia));

    const funciIncorporado = await isFunciIncorporado(origem.matricula);

    analise.funciIncorporado =
      funciIncorporado.incorporado && funciIncorporado.regulamentoBB
        ? "SIM, REGULAMENTO BB"
        : funciIncorporado.incorporado
        ? "SIM, SEM REGULAMENTO BB"
        : "NÃO";
    analise.regulamento = funciIncorporado.regulamento;

    analise.dt_imped_odi = analysis.dt_imped_odi.trim().toUpperCase();
    analise.dt_imped_instit_relac = analysis.dt_imped_instit_relac
      .trim()
      .toUpperCase();

    analise.nomeacao = await isNomeacaoPendente(origem.matricula);

    analise.origem = origem;

    analise.destino = destino;

    analise.nivelGer = destino.cod_comissao
      ? await getDadosComissaoCompleto(destino.cod_comissao)
      : null;

    analise.limitrofes = await limitrofes(origem, destino);

    analise.latLong = await getLatLong(origem, destino);

    analise.rotaRodoviaria = await getRotaRodoviaria(analise.latLong);

    /**
     * array analise recebe todos os valores da analise para basear a lista de itens que o componente FrameVaga irá utilizar para renderizar.
     */
    analise.analise = [
      {
        limitrofes: {
          nome: "limitrofes",
          label: "Municípios Limítrofes",
          valor: analise.limitrofes.texto,
        },
      },
      {
        distRodoviaria: {
          nome: "distRodoviaria",
          label: "Distância por Rodovia",
          valor:
            analise.rotaRodoviaria.distancia +
            " km :: (" +
            analise.rotaRodoviaria.duracao +
            " aprox.)",
        },
      },
      {
        certs: {
          nome: "certs",
          label: "Certificações",
          valor:
            analise.destino.cpa &&
            _.isNil(analise.destino.cpa.certificacao_exigida)
              ? _.isEmpty(analise.origem.treinamentos.cpaFunci.cpaLista)
                ? "SEM CERTIFICAÇÕES"
                : analise.origem.treinamentos.cpaFunci.cpaLista
                    .toString()
                    .replace(/\,/, ", ")
              : "CPA NÃO EXIGIDA",
        },
      },
      {
        posse: {
          nome: "posse",
          label: "Posse no Banco",
          valor: moment(analise.data_posse).format("DD/MM/YYYY"),
        },
      },
      {
        incorporado: {
          nome: "incorporado",
          label: "Incorporado",
          valor: analise.funciIncorporado,
        },
      },
      {
        nomeacao: {
          nome: "nomeacao",
          label: "Nomeação pendente de posse",
          valor: analise.nomeacao,
        },
      },
      {
        odi: {
          nome: "odi",
          label: "Impedimento ODI",
          valor: analise.dt_imped_odi,
        },
      },
      {
        inamovivel: {
          nome: "inamovivel",
          label: "Inamovível",
          valor: analise.ind_inamovivel ? "SIM" : "NÃO",
        },
      },
      {
        vcp: {
          nome: "vcp",
          label: "VCP/Período",
          valor:
            analise.ind_vcp === "0"
              ? "NÃO"
              : moment(analise.data_vcp_ini).format("DD/MM/YYYY") +
                " a " +
                moment(analise.data_vcp_fim).format("DD/MM/YYYY"),
        },
      },
      {
        habitualidade: {
          nome: "habitualidade",
          label: "Habitualidade",
          valor: analise.habitualidade ? "IMPEDIDO" : "SEM IMPEDIMENTO",
        },
      },
      {
        trilhaEtica: {
          nome: "trilhaEtica",
          label: "Trilha Ética",
          valor: !analise.origem.treinamentos.trilhaEtica.length
            ? "SIM"
            : "NÃO", // trilhaEtica informa os cursos que não foram realizados
        },
      },
    ];

    /**
     * Array negativas irá fazer a sinalização do ícone e gerar o campo correspondente na aba Confirmação do formulário de nova solicitação, baseado nos valores do array 'analise'.
     */
    const negativas = [
      {
        nome: "limitrofes",
        valor: analise.limitrofes.limitrofes
          ? Constants.NEGATIVADO.NAO
          : Constants.NEGATIVADO.SIM,
      },
      {
        nome: "certs",
        valor:
          _.isNil(analise.destino.cpaLista) ||
          analise.destino.cpa.some(
            (elem) => elem.certificacao_exigida === "NÃO"
          )
            ? Constants.NEGATIVADO.NAO
            : _.isEmpty(analise.origem.treinamentos.cpaFunci.cpaLista)
            ? Constants.NEGATIVADO.SIM
            : (analise.destino.cpaLista.includes("CPA-10") &&
                (analise.origem.treinamentos.cpaFunci.cpaLista.includes(
                  "CPA-10"
                ) ||
                  analise.origem.treinamentos.cpaFunci.cpaLista.includes(
                    "CPA-20"
                  ) ||
                  analise.origem.treinamentos.cpaFunci.cpaLista.includes(
                    "CEA"
                  ))) ||
              (analise.destino.cpaLista.includes("CPA-20") &&
                (analise.origem.treinamentos.cpaFunci.cpaLista.includes(
                  "CPA-20"
                ) ||
                  analise.origem.treinamentos.cpaFunci.cpaLista.includes(
                    "CEA"
                  ))) ||
              (analise.destino.cpaLista.includes("CEA") &&
                analise.origem.treinamentos.cpaFunci.cpaLista.includes("CEA"))
            ? Constants.NEGATIVADO.NAO
            : Constants.NEGATIVADO.SIM,
      },
      {
        nome: "posse",
        valor: Constants.NEGATIVADO.NAO,
      },
      {
        nome: "incorporado",
        valor:
          analise.funciIncorporado.incorporado &&
          !analise.funciIncorporado.regulamentoBB
            ? Constants.NEGATIVADO.SIM
            : Constants.NEGATIVADO.NAO,
      },
      {
        nome: "nomeacao",
        valor:
          analise.nomeacao.trim() === "PENDENTE DE POSSE"
            ? Constants.NEGATIVADO.SIM
            : Constants.NEGATIVADO.NAO,
      },
      {
        nome: "odi",
        valor:
          analise.dt_imped_odi === "SEM IMPEDIMENTO"
            ? Constants.NEGATIVADO.NAO
            : Constants.NEGATIVADO.SIM,
      },
      {
        nome: "inamovivel",
        valor: analise.ind_inamovivel
          ? Constants.NEGATIVADO.SIM
          : Constants.NEGATIVADO.NAO,
      },
      {
        nome: "vcp",
        valor:
          analise.ind_vcp === "0"
            ? Constants.NEGATIVADO.NAO
            : Constants.NEGATIVADO.SIM,
      },
      {
        nome: "habitualidade",
        valor: analise.habitualidade
          ? Constants.NEGATIVADO.SIM
          : Constants.NEGATIVADO.NAO,
      },
      {
        nome: "trilhaEtica",
        valor: analise.origem.treinamentos.trilhaEtica.length
          ? Constants.NEGATIVADO.SIM
          : Constants.NEGATIVADO.NAO,
      },
    ];

    analise.negativas = negativas
      .filter((elem) => !_.isNil(elem.valor))
      .map((elem) => elem.nome);

    let negsArray = analise.negativas.filter((neg) =>
      [
        "posse",
        "incorporado",
        "nomeacao",
        "odi",
        "inamovivel",
        "vcp",
        "habitualidade",
      ].includes(neg)
    );

    if (negsArray) {
      let negativasTexto = analise.analise
        .filter((anls) => negsArray.includes(Object.keys(anls)))
        .map((anls) => anls.label);
      if (negativasTexto.length > 1) {
        const ultimo = negativasTexto.pop();
        negativasTexto = negativasTexto
          .toString()
          .replace(/[a-zA-Z]+/g, "$&")
          .replace(/,/g, ",\n")
          .concat(` e ${ultimo}.\n`);
      } else {
        negativasTexto = negativasTexto.toString();
      }

      analise.vetado = true;
    }

    return { analise };
  } catch (err) {
    throw new exception(err, 404);
  }
}

module.exports = setAnalise;
