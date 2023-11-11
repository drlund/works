"use strict";

const _ = require("lodash");
const moment = require("moment");

const { AbstractUserCase } = require("../../AbstractUserCase");
const Funci = require("../Entidades/Funci");

const {
  FLAGS,
  CD_QUALIF_PIT,
  CD_QUALIF_QUALIFIC,
  TP_IMPEDIMENTO,
  GFM_ESCRITURARIO,
} = require("../Constants");
const { round } = require("../../NumberUtils");

class UCObterDadosAnalise extends AbstractUserCase {
  async _checks({ matricula, prefixoDestino, funcaoDestino, usuario }) {
    const podeVisualizarDadosAnalise = await this.functions.hasPermission({
      nomeFerramenta: "Flex Critérios",
      dadosUsuario: usuario,
      permissoesRequeridas: [
        "SOLICITANTE",
        "MANIFESTANTE",
        "ANALISTA",
        "DESPACHANTE",
        "DEFERIDOR",
        "EXECUTANTE",
        "ROOT",
      ],
    });
    /*     if (!podeVisualizarDadosAnalise) {
      throw new Error(
        "Você não tem permissão para acessar o detalhamento da solicitação informada"
      );
    } */

    if (!matricula) {
      throw new Error("Matrícula não informada");
    }
    if (!prefixoDestino) {
      throw new Error("Prefixo de Destino não informado");
    }
    if (!funcaoDestino) {
      throw new Error("Função de Destino não informada");
    }
  }

  async _action({ matricula, prefixoDestino, funcaoDestino }) {
    const { funciRepository, arhMstRepository } = this.repository;

    const [funciOrigem, dadosPrefixo] = await Promise.all([
      funciRepository.getFunciOrigem(matricula),
      arhMstRepository.getDadosPrefixoDestino(prefixoDestino),
    ]);

    const analise = {};

    const [
      movimentacao,
      funciIncorporado,
      nomeacao,
      qualificacoes,
      habilitadoTCU,
      impedInstitRelac,
      dadosFuncao,
    ] = await Promise.all([
      arhMstRepository.obterDadosGeograficos(
        {
          cod_uor_pref_lotacao: funciOrigem.cod_uor_localizacao,
          cd_municipio_ibge_dv: dadosPrefixo.cd_municipio_ibge_dv,
          cd_municipio_ibge: funciOrigem.prefixoLotacao.cd_municipio_ibge,
        },
        {
          cd_municipio_ibge_dv: dadosPrefixo.cd_municipio_ibge_dv,
          cd_municipio_ibge: dadosPrefixo.cd_municipio_ibge,
        }
      ),
      funciRepository.ehFunciIncorporado(matricula),
      funciRepository.ehNomeacaoPendente(matricula),
      arhMstRepository._obterDadosQualificacaoByFunci(matricula),
      arhMstRepository.obterInabilitadosTCU(funciOrigem.cpf_nr),
      funciRepository.impedimentoInstRel(funciOrigem.dt_imped_instit_relac),
      arhMstRepository.getDadosFuncaoDestino(
        funcaoDestino,
        funciOrigem.prefixoLotacao.dadosDiretoria.prefixo
      ),
    ]);

    analise.impedInstitRelac = impedInstitRelac;

    analise.qualificacoes = qualificacoes.filter((dado) =>
      CD_QUALIF_QUALIFIC.includes(dado.CD_TIP_CTFC)
    );

    // this.analise.funciIncorporado =
    //   funciIncorporado.incorporado && funciIncorporado.regulamentoBB
    //     ? "SIM, REGULAMENTO BB"
    //     : funciIncorporado.incorporado
    //     ? "SIM, SEM REGULAMENTO BB"
    //     : "NÃO";

    // this.analise.regulamento = funciIncorporado.regulamento;

    analise.dt_imped_odi = String(funciOrigem.dt_imped_odi)
      .trim()
      .toUpperCase();
    analise.dt_imped_instit_relac = String(funciOrigem.dt_imped_instit_relac)
      .trim()
      .toUpperCase();

    analise.gfmFunciOrigem = funciOrigem.gfm?.id_grupo ?? GFM_ESCRITURARIO;
    analise.gfmFuncaoDestino = dadosFuncao.gfm?.id_grupo ?? GFM_ESCRITURARIO;
    const vrFunci = round(
      funciOrigem.ddComissaoFot05?.valor_referencia ?? 0,
      2
    );
    const vrFuncaoDestino = round(dadosFuncao?.valor_referencia ?? 0, 2);

    analise.tipoMovimentacao =
      vrFuncaoDestino >= vrFunci
        ? vrFuncaoDestino > vrFunci
          ? "Ascensão"
          : "Lateralidade"
        : vrFunci === 0
        ? "Ascensão"
        : "Descenso";

    analise.pit = qualificacoes.filter((dado) =>
      CD_QUALIF_PIT.includes(dado.CD_TIP_CTFC)
    );

    analise.qualificacoes = qualificacoes.filter((dado) =>
      CD_QUALIF_QUALIFIC.includes(dado.CD_TIP_CTFC)
    );
    /**
     * array analise recebe todos os valores da analise para basear a lista de itens que o componente FrameVaga irá utilizar para renderizar.
     */

    analise.movimentacao = [
      {
        nome: "vantagemNomeacao",
        label: "Nomeação com vantagem",
        valor: movimentacao.limitrofes.limitrofes
          ? "Não (Municípios Limítrofes ou mesma região metropolitana)"
          : "Sim (Municípios NÃO Limítrofes)",
        flag: true,
      },
      {
        nome: "distanciaRod",
        label: "Distância por Rodovia",
        valor:
          movimentacao.rotaRodoviaria.distancia +
          " km :: (" +
          movimentacao.rotaRodoviaria.duracao +
          " aprox.)",
        flag: true,
      },
      {
        nome: "distanciaLinear",
        label: "Distância Linear",
        valor: movimentacao.rotaLinear + " km",
        flag: true,
      },
      {
        nome: "municipiosOrigDest",
        label: "Municípios Limítrofes",
        valor: movimentacao.limitrofes.texto,
        flag: movimentacao.limitrofes.limitrofes ? FLAGS.SIM : FLAGS.NAO,
      },
    ];

    analise.validacao = [
      {
        nome: "certificacoes",
        label: "Certificações",
        valor:
          dadosFuncao.cpa && !_.isNil(dadosFuncao.cpaLista)
            ? _.isEmpty(funciOrigem.treinamentos.cpaFunci.cpaLista)
              ? "SEM CERTIFICAÇÕES"
              : funciOrigem.treinamentos.cpaFunci.cpaLista
                  .toString()
                  .replace(/\,/, ", ")
            : "CPA NÃO EXIGIDA",
        flag:
          _.isNil(dadosFuncao.cpaLista) ||
          dadosFuncao.cpa.some((elem) => elem.certificacao_exigida === "NÃO")
            ? FLAGS.SIM
            : _.isEmpty(funciOrigem.treinamentos.cpaFunci.cpaLista)
            ? FLAGS.NAO
            : (dadosFuncao.cpaLista.includes("CPA-10") &&
                (funciOrigem.treinamentos.cpaFunci.cpaLista.includes(
                  "CPA-10"
                ) ||
                  funciOrigem.treinamentos.cpaFunci.cpaLista.includes(
                    "CPA-20"
                  ) ||
                  funciOrigem.treinamentos.cpaFunci.cpaLista.includes(
                    "CEA"
                  ))) ||
              (dadosFuncao.cpaLista.includes("CPA-20") &&
                (funciOrigem.treinamentos.cpaFunci.cpaLista.includes(
                  "CPA-20"
                ) ||
                  funciOrigem.treinamentos.cpaFunci.cpaLista.includes(
                    "CEA"
                  ))) ||
              (dadosFuncao.cpaLista.includes("CEA") &&
                funciOrigem.treinamentos.cpaFunci.cpaLista.includes("CEA"))
            ? FLAGS.SIM
            : FLAGS.NAO,
      },
      {
        nome: "trilhaEtica",
        label: "Trilha Ética",
        valor: !funciOrigem.treinamentos.trilhaEtica.length ? "SIM" : "NÃO",
        flag: funciOrigem.treinamentos.trilhaEtica.length
          ? FLAGS.NAO
          : FLAGS.SIM,
      },
      {
        nome: "posseBB",
        label: "Posse no Banco",
        valor: moment(funciOrigem.data_posse).format("DD/MM/YYYY"),
        flag: FLAGS.SIM,
      },
      {
        nome: "pendentePosse",
        label: "Nomeação pendente de posse",
        valor: nomeacao,
        flag: nomeacao.trim() === "PENDENTE DE POSSE" ? FLAGS.NAO : FLAGS.SIM,
      },
      {
        nome: "inamovivel",
        label: "Inamovível",
        valor: funciOrigem.ind_inamovivel ? "SIM" : "NÃO",
        flag: funciOrigem.ind_inamovivel ? FLAGS.NAO : FLAGS.SIM,
      },
      {
        nome: "habitualidade",
        label: "Habitualidade",
        valor: funciOrigem.habitualidade ? "IMPEDIDO" : "SEM IMPEDIMENTO",
        flag: funciOrigem.habitualidade ? FLAGS.NAO : FLAGS.SIM,
      },
      {
        nome: "incorporado",
        label: "Incorporado",
        valor: funciIncorporado?.regulamento,
        flag:
          funciIncorporado.incorporado && !funciIncorporado.regulamentoBB
            ? FLAGS.NAO
            : FLAGS.SIM,
      },
      {
        nome: "impedimentoODI",
        label: "Impedimento ODI",
        valor: analise.dt_imped_odi,
        flag:
          analise.dt_imped_odi === "SEM IMPEDIMENTO" ? FLAGS.SIM : FLAGS.NAO,
      },

      {
        nome: "dtImpedimentoInstRel",
        label: "Tempo de Impedimento",
        valor: (analise.dt_imped_instit_relac = String(
          funciOrigem.dt_imped_instit_relac
        )
          .trim()
          .toUpperCase()),
        flag: (analise.dt_imped_instit_relac = String(
          funciOrigem.dt_imped_instit_relac
        )
          .trim()
          .toUpperCase()),
      },

      {
        nome: "vcp",
        label: "VCP/Período",
        valor: [undefined, null, 0, "0"].includes(funciOrigem.ind_vcp)
          ? "NÃO"
          : moment(funciOrigem.data_vcp_ini).format("DD/MM/YYYY") +
            " a " +
            moment(funciOrigem.data_vcp_fim).format("DD/MM/YYYY"),
        flag: [undefined, null, 0, "0"].includes(funciOrigem.ind_vcp)
          ? FLAGS.SIM
          : FLAGS.NAO,
      },
      {
        nome: "inabilitadoTCU",
        label: "Inabilitado TCU",
        valor: habilitadoTCU,
        flag: habilitadoTCU === TP_IMPEDIMENTO.IMPEDIDO ? FLAGS.NAO : FLAGS.SIM,
      },
    ];

    const resultado = Funci.transformFuncionarioDestino(analise);

    return resultado;
  }
}

module.exports = UCObterDadosAnalise;
