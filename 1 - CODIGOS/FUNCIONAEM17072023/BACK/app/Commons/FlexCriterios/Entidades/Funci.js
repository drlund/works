const moment = require("moment");
const { DATA_REGEX } = require("../Constants");
const Prefixo = require("./Prefixo");

class Funci {
  static transformPesquisaFuncionario(dadosFunci) {
    const funcionario = {
      matricula: dadosFunci.matricula,
      nome: String(dadosFunci.nome).trim(),
      funcaoLotacao: dadosFunci.funcao_lotacao || dadosFunci.funcao,
      descricaoCargo: String(
        dadosFunci.desc_cargo || dadosFunci.nomeFuncao
      ).trim(),
      prefixoOrigem: {
        prefixo: dadosFunci.prefixoLotacao.prefixo,
        nome: String(dadosFunci.prefixoLotacao.nome).trim(),
        prefixoGerev: dadosFunci.prefixoLotacao.dadosGerev?.prefixo ?? "",
        nomeGerev: dadosFunci.prefixoLotacao.dadosGerev?.nome ?? "",
        prefixoSuper: dadosFunci.prefixoLotacao.dadosSuper?.prefixo ?? "",
        nomeSuper: dadosFunci.prefixoLotacao.dadosSuper?.nome ?? "",
        prefixoDiretoria:
          dadosFunci.prefixoLotacao.dadosDiretoria?.prefixo ?? "",
        nomeDiretoria: String(
          dadosFunci.prefixoLotacao.dadosDiretoria.nome
        ).trim(),
        clarosOrigem: `${Number(
          Prefixo.calcularClaros(dadosFunci.prefixoLotacao.dotacao)
        ).toLocaleString("pt-BR")} %`,
        clarosOrigemDepois: `${Number(
          Prefixo.calcularClarosDepois(dadosFunci.prefixoLotacao.dotacao)
        ).toLocaleString("pt-BR")} %`,
      },
    };

    return funcionario;
  }

  static transformFuncionarioDestino(dadosFunci) {
    const funcionario = {
      tipoMovimentacao: dadosFunci.tipoMovimentacao,
      pit: {
        valor: dadosFunci?.pit.length ? "SIM" : "NÂO",
        lista: this._transformQualificacoes(dadosFunci.pit),
      },
      qualificado: {
        valor: dadosFunci?.qualificacoes.length ? "SIM" : "NÂO",
        lista: this._transformQualificacoes(dadosFunci.qualificacoes),
      },
      movimentacao: dadosFunci.movimentacao,
      validacao: dadosFunci.validacao,
      gfmFunciOrigem: dadosFunci.gfmFunciOrigem,
      gfmFuncaoDestino: dadosFunci.gfmFuncaoDestino,
      impedimentoInstitucionalRelacional: dadosFunci.impedInstitRelac,
      dtImpedimentoInstRel: dadosFunci.dt_imped_instit_relac,
    };

    return funcionario;
  }

  static _transformQualificacoes(listaQualificacoes) {
    return listaQualificacoes.map((quali) => ({
      tpQualificacao: quali.CD_TIP_CTFC,
      cdQualificacao: quali.CD_OPT_CTFC_FUN,
      cdConhecimentoQualificacao: quali.CD_CNH_CTFC_FUN,
      cdCsoQualificacao: quali.CD_CSO_CTFC_FUN,
      dataExpiracaoQualificacao: moment(
        quali.DT_EXPC_CTFC,
        "YYYY-MM-DD"
      ).format("DD/MM/YYYY"),
    }));
  }

  static transformFunciEnvolvido(dados) {
    return {
      matricula: dados.funci.matricula,
      nome: dados.funci.nome,
      funcaoLotacao: dados.funci.cod_func_lotacao,
      descricaoCargo: dados.funci.desc_cargo,
      funcaoPretendida: dados.funcaoPretendida,
      nomeFuncaoPretendida: dados.nomeFuncaoPretendida,
      oportunidade: dados.oportunidade,
      prefixoOrigem: {
        prefixo: dados.prefixoOrig.prefixo,
        nome: String(dados.prefixoOrig.nome).trim(),
        prefixoGerev: dados.prefixoOrig.dadosGerev?.prefixo ?? "",
        nomeGerev: String(dados.prefixoOrig.dadosGerev?.nome ?? "").trim(),
        prefixoSuper: dados.prefixoOrig.dadosSuper?.prefixo ?? "",
        nomeSuper: String(dados.prefixoOrig.dadosSuper?.nome ?? "").trim(),
        prefixoDiretoria: dados.prefixoOrig.dadosDiretoria.prefixo,
        nomeDiretoria: String(dados.prefixoOrig.dadosDiretoria.nome).trim(),
        clarosOrigem: `${Number(
          Prefixo.calcularClaros(dados.prefixoOrig.dotacao)
        ).toLocaleString("pt-BR")} %`,
        totalComiteDiretoria:
          dados.prefixoOrig.dadosDiretoria.totalComiteDiretoria,
      },
      prefixoDestino: {
        prefixo: dados.prefixoDest.prefixo,
        nome: String(dados.prefixoDest.nome).trim(),
        prefixoGerev: dados.prefixoDest.dadosGerev?.prefixo ?? "",
        nomeGerev: String(dados.prefixoDest.dadosGerev?.nome ?? "").trim(),
        prefixoSuper: dados.prefixoDest.dadosSuper?.prefixo ?? "",
        nomeSuper: String(dados.prefixoDest.dadosSuper?.nome ?? "").trim(),
        prefixoDiretoria: dados.prefixoDest.dadosDiretoria.prefixo,
        nomeDiretoria: String(dados.prefixoDest.dadosDiretoria.nome).trim(),
        clarosDestino: `${Number(
          Prefixo.calcularClaros(dados.prefixoDest.dotacao)
        ).toLocaleString("pt-BR")} %`,
        totalComiteDiretoria:
          dados.prefixoDest.dadosDiretoria.totalComiteDiretoria,
      },
    };
  }
}

module.exports = Funci;
