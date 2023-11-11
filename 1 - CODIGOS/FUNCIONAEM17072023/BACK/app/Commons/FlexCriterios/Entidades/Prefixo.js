const { round } = require("../../NumberUtils");

class Prefixo {
  static transformPrefixoExibeSolicitacao(dadosPrefixo) {
    let prefixo = {
      prefixo: dadosPrefixo.prefixo,
      nome: String(dadosPrefixo.nome).trim(),
      prefixoGerev: dadosPrefixo.dadosGerev?.prefixo ?? "",
      nomeGerev: String(dadosPrefixo.dadosGerev?.nome ?? "").trim(),
      prefixoSuper: dadosPrefixo.dadosSuper?.prefixo ?? "",
      nomeSuper: String(dadosPrefixo.dadosSuper?.nome ?? "").trim(),
      prefixoDiretoria: dadosPrefixo.dadosDiretoria.prefixo,
      nomeDiretoria: String(dadosPrefixo.dadosDiretoria.nome).trim(),
      clarosDestino: `${Number(
        this.calcularClaros(dadosPrefixo.dotacao)
      ).toLocaleString("pt-BR")} %`,
    };

    return prefixo;
  }

  static transformFuncao(dadosFuncao) {
    const funcao = {
      codigo: dadosFuncao.cod_comissao,
      nome: dadosFuncao.nome_comissao,
    };

    return funcao;
  }

  static _getDotacao(dotacao) {
    let totalDotacao = 0;
    let totalLotacao = 0;

    dotacao.forEach((item) => {
      totalDotacao += item.qtde_dotacao;
      totalLotacao += item.qtde_lotacao;
    });

    return { totalDotacao, totalLotacao };
  }

  static calcularClaros(dotacao) {
    if (!dotacao.length) {
      return 0.0;
    }

    const { totalDotacao, totalLotacao } = this._getDotacao(dotacao);

    const antes = round(100 - (totalLotacao / totalDotacao) * 100, 1);

    return antes;
  }

  static calcularClarosDepois(dotacao) {
    if (!dotacao.length) {
      return 0.0;
    }

    const { totalDotacao, totalLotacao } = this._getDotacao(dotacao);

    const depois = round(100 - ((totalLotacao - 1) / totalDotacao) * 100, 1);

    return depois;
  }
}

module.exports = Prefixo;
