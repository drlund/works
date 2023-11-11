"use strict";

const _ = require("lodash");
const moment = require("moment");

const { AbstractUserCase } = require("../../AbstractUserCase");
const {
  NEGATIVADO,
} = require("../Constants");

class UcGetAnalise extends AbstractUserCase {
  analise = {};

  async _action({ origem, destino, user }) {
    const {
      funciRepository,
      prefixoRepository,
      municipioRepository
    } = this.repository;

    const funciOrigem = await funciRepository.getFunciOrigem(origem.matricula);

    this.analise = {
      admin: user.funciIsAdmin,
      carga_horaria: funciOrigem.carga_horaria,
      cd_super_juris: funciOrigem.prefixoLotacao.cd_super_juris,
      cod_situacao: funciOrigem.cod_situacao,
      data_comis: funciOrigem.data_comis,
      data_posse_incorp: funciOrigem.data_posse_incorp,
      data_posse: funciOrigem.data_posse,
      data_situacao: funciOrigem.data_situacao,
      data_vcp_fim: funciOrigem.data_vcp_fim,
      data_vcp_ini: funciOrigem.data_vcp_ini,
      desc_func_lotacao: funciOrigem.desc_func_lotacao,
      dt_imped_instit_relac: funciOrigem.dt_imped_instit_relac,
      dt_imped_odi: funciOrigem.dt_imped_odi,
      funcao_lotacao: funciOrigem.funcao_lotacao,
      habitualidade: funciOrigem.habitualidade,
      ind_inamovivel: funciOrigem.ind_inamovivel,
      ind_vcp: funciOrigem.ind_vcp,
      municipio: funciOrigem.prefixoLotacao.municipio,
      nivel_agencia: funciOrigem.prefixoLotacao.nivel_agencia,
      nm_uf: funciOrigem.prefixoLotacao.nm_uf,
      nome: funciOrigem.prefixoLotacao.nome,
      prefixo_lotacao: funciOrigem.prefixo_lotacao,
      prefixo: funciOrigem.prefixoLotacao.prefixo,
      uor_dependencia: funciOrigem.prefixoLotacao.uor_dependencia,
      uor_trabalho: funciOrigem.uor_trabalho,
    };

    const [
      treinamentos,
      nivel_alfab,
      dadosLimitrofes,
      latLong,
      funciIncorporado,
      nomeacao,
      nivelGer,
    ] = await Promise.all([
      funciRepository.getTreinamentosRealizados(funciOrigem.matricula),
      prefixoRepository.getNivelAlfab(funciOrigem.prefixoLotacao.nivel_agencia),
      municipioRepository.getLimitrofes(origem, destino),
      municipioRepository.obterLatLong(origem, destino),
      funciRepository.ehFunciIncorporado(origem.matricula),
      funciRepository.ehNomeacaoPendente(origem.matricula),
      destino.cod_comissao
        ? funciRepository.obterDadosComissaoCompleto(destino.cod_comissao)
        : null,
    ]);

    this.analise.rotaRodoviaria = await municipioRepository.obterRotaRodoviaria(latLong);

    this.analise.treinamentos = treinamentos;
    this.analise.nivel_alfab = nivel_alfab;
    this.analise.limitrofes = dadosLimitrofes;
    this.analise.latLong = latLong;
    this.analise.nomeacao = nomeacao;
    this.analise.nivelGer = nivelGer

    if (funciOrigem.prefixoLotacao.cd_super_juris === "0000") {
      this.analise.nome_super = "";
    } else {
      this.analise.nome_super = funciOrigem.prefixoLotacao.dadosSuper.nome;
    }

    this.analise.funciIncorporado =
      funciIncorporado.incorporado && funciIncorporado.regulamentoBB
        ? "SIM, REGULAMENTO BB"
        : funciIncorporado.incorporado
          ? "SIM, SEM REGULAMENTO BB"
          : "NÃO";
    this.analise.regulamento = funciIncorporado.regulamento;

    this.analise.dt_imped_odi = funciOrigem.dt_imped_odi.trim().toUpperCase();
    this.analise.dt_imped_instit_relac = funciOrigem.dt_imped_instit_relac
      .trim()
      .toUpperCase();

    this.analise.origem = origem;

    this.analise.destino = destino;

    /**
     * array analise recebe todos os valores da analise para basear a lista de itens que o componente FrameVaga irá utilizar para renderizar.
     */
    this.analise.analise = [
      {
        limitrofes: {
          nome: "limitrofes",
          label: "Municípios Limítrofes",
          valor: this.analise.limitrofes.texto,
        },
      },
      {
        distRodoviaria: {
          nome: "distRodoviaria",
          label: "Distância por Rodovia",
          valor:
            this.analise.rotaRodoviaria.distancia +
            " km :: (" +
            this.analise.rotaRodoviaria.duracao +
            " aprox.)",
        },
      },
      {
        certs: {
          nome: "certs",
          label: "Certificações",
          valor:
            this.analise.destino.cpa &&
              _.isNil(this.analise.destino.cpa.certificacao_exigida)
              ? _.isEmpty(this.analise.origem.treinamentos.cpaFunci.cpaLista)
                ? "SEM CERTIFICAÇÕES"
                : this.analise.origem.treinamentos.cpaFunci.cpaLista
                  .toString()
                  .replace(/\,/, ", ")
              : "CPA NÃO EXIGIDA",
        },
      },
      {
        posse: {
          nome: "posse",
          label: "Posse no Banco",
          valor: moment(this.analise.data_posse).format("DD/MM/YYYY"),
        },
      },
      {
        incorporado: {
          nome: "incorporado",
          label: "Incorporado",
          valor: this.analise.funciIncorporado,
        },
      },
      {
        nomeacao: {
          nome: "nomeacao",
          label: "Nomeação pendente de posse",
          valor: this.analise.nomeacao,
        },
      },
      {
        odi: {
          nome: "odi",
          label: "Impedimento ODI",
          valor: this.analise.dt_imped_odi,
        },
      },
      {
        inamovivel: {
          nome: "inamovivel",
          label: "Inamovível",
          valor: this.analise.ind_inamovivel ? "SIM" : "NÃO",
        },
      },
      {
        vcp: {
          nome: "vcp",
          label: "VCP/Período",
          valor:
            this.analise.ind_vcp === "0"
              ? "NÃO"
              : moment(this.analise.data_vcp_ini).format("DD/MM/YYYY") +
              " a " +
              moment(this.analise.data_vcp_fim).format("DD/MM/YYYY"),
        },
      },
      {
        habitualidade: {
          nome: "habitualidade",
          label: "Habitualidade",
          valor: this.analise.habitualidade ? "IMPEDIDO" : "SEM IMPEDIMENTO",
        },
      },
      {
        trilhaEtica: {
          nome: "trilhaEtica",
          label: "Trilha Ética",
          valor: !this.analise.origem.treinamentos.trilhaEtica.length
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
        valor: this.analise.limitrofes.limitrofes
          ? NEGATIVADO.NAO
          : NEGATIVADO.SIM,
      },
      {
        nome: "certs",
        valor:
          _.isNil(this.analise.destino.cpaLista) ||
            this.analise.destino.cpa.some(
              (elem) => elem.certificacao_exigida === "NÃO"
            )
            ? NEGATIVADO.NAO
            : _.isEmpty(this.analise.origem.treinamentos.cpaFunci.cpaLista)
              ? NEGATIVADO.SIM
              : (this.analise.destino.cpaLista.includes("CPA-10") &&
                (this.analise.origem.treinamentos.cpaFunci.cpaLista.includes(
                  "CPA-10"
                ) ||
                  this.analise.origem.treinamentos.cpaFunci.cpaLista.includes(
                    "CPA-20"
                  ) ||
                  this.analise.origem.treinamentos.cpaFunci.cpaLista.includes(
                    "CEA"
                  ))) ||
                (this.analise.destino.cpaLista.includes("CPA-20") &&
                  (this.analise.origem.treinamentos.cpaFunci.cpaLista.includes(
                    "CPA-20"
                  ) ||
                    this.analise.origem.treinamentos.cpaFunci.cpaLista.includes(
                      "CEA"
                    ))) ||
                (this.analise.destino.cpaLista.includes("CEA") &&
                  this.analise.origem.treinamentos.cpaFunci.cpaLista.includes("CEA"))
                ? NEGATIVADO.NAO
                : NEGATIVADO.SIM,
      },
      {
        nome: "posse",
        valor: NEGATIVADO.NAO,
      },
      {
        nome: "incorporado",
        valor:
          this.analise.funciIncorporado.incorporado &&
            !this.analise.funciIncorporado.regulamentoBB
            ? NEGATIVADO.SIM
            : NEGATIVADO.NAO,
      },
      {
        nome: "nomeacao",
        valor:
          this.analise.nomeacao.trim() === "PENDENTE DE POSSE"
            ? NEGATIVADO.SIM
            : NEGATIVADO.NAO,
      },
      {
        nome: "odi",
        valor:
          this.analise.dt_imped_odi === "SEM IMPEDIMENTO"
            ? NEGATIVADO.NAO
            : NEGATIVADO.SIM,
      },
      {
        nome: "inamovivel",
        valor: this.analise.ind_inamovivel
          ? NEGATIVADO.SIM
          : NEGATIVADO.NAO,
      },
      {
        nome: "vcp",
        valor:
          this.analise.ind_vcp === "0"
            ? NEGATIVADO.NAO
            : NEGATIVADO.SIM,
      },
      {
        nome: "habitualidade",
        valor: this.analise.habitualidade
          ? NEGATIVADO.SIM
          : NEGATIVADO.NAO,
      },
      {
        nome: "trilhaEtica",
        valor: this.analise.origem.treinamentos.trilhaEtica.length
          ? NEGATIVADO.SIM
          : NEGATIVADO.NAO,
      },
    ];

    this.analise.negativas = negativas
      .filter((elem) => !_.isNil(elem.valor))
      .map((elem) => elem.nome);

    let negsArray = this.analise.negativas.filter((neg) =>
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

    if (!_.isEmpty(negsArray)) {
      let negativasTexto = this.analise.analise
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

      this.analise.vetado = true;
    }

    return this.analise;
  }

  _checks({ origem, destino }) {
    if (!origem) {
      throw new Error("Dados da análise da origem ausentes");
    }
    if (!destino) {
      throw new Error("Dados da análise do destino ausentes");
    }
  }

}


module.exports = UcGetAnalise;
