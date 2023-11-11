"use strict";
const FatoPainel = use("App/Models/Mysql/PainelGestor/FatoPainel");

class FatoPainelRepository {
  async getDadosPrefixoByPrefixoSubord(prefixo, subord) {
    const dadosPrefixo = await FatoPainel.query()
      .where({ prefixo: prefixo, subordinada: subord })
      .distinct(
        "uor",
        "prefixo",
        "subordinada",
        "nome",
        "pontosPrefixo",
        "uorResponsavel",
        "rankBrasil",
        "totalBrasil",
        "rankDiretoria",
        "totalDiretoria",
        "rankSuper",
        "totalSuper",
        "rankGerev",
        "totalGerev"
      )
      .first();

    return dadosPrefixo ? dadosPrefixo.toJSON() : null;
  }

  async getIndicadoresByPrefixoSubord(prefixo, subord) {
    const indicadores = await FatoPainel.query()
      .where({ prefixo: prefixo, subordinada: subord })
      .distinct(
        "idIndicador",
        "nomeIndicador",
        "pesoIndicador",
        "pontosIndicador",
        "maxPontosIndicador",
        "percAtingIndicador",
        "destaque",
        "percentualPesoIndicador",
        "mediaIndicador",
        "informacaoCalculo",
        "uorResponsavel",
        "linkRelatorio",
        "linkArtigo",
        "dataAtualizacao"
      )
      .orderBy("maiorCriticidadeIndicador")
      .orderBy("percAtingIndicador")
      .fetch();

    return indicadores ? indicadores.toJSON() : [];
  }

  async getCriticidadesComponentesByPrefixoSubord(prefixo, subord) {
    const componentes = await FatoPainel.query()
      .where({ prefixo: prefixo, subordinada: subord })
      .distinct(
        "idIndicador",
        "idCriticidade",
        "descricaoCriticidade",
        "codigoCor",
      )
      .orderBy("idCriticidade")
      .fetch();

    return componentes ? componentes.toJSON() : [];
  }

  async getComponentesByPrefixoSubord(prefixo, subord) {
    const detalheComponentes = await FatoPainel.query()
      .where({ prefixo: prefixo, subordinada: subord })
      .distinct(
        "idIndicador",
        "idComponente",
        "idCriticidade",
        "nomeComponente",
        "valorComponente",
        "pontosComponente",
        "percAtingComponente",
        "maxPontosComponente",
        "posicaoComponente"
      )
      .orderBy("idCriticidade")
      .fetch();

    return detalheComponentes ? detalheComponentes.toJSON() : [];
  }
}

module.exports = FatoPainelRepository;
