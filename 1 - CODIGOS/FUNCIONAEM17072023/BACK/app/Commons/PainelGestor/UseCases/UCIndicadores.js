"use strict";
const { AbstractUserCase } = use(
  "App/Commons/AbstractUserCase/AbstractUserCase.js"
);
const IndicadoresTransformer = use(
  "App/Transformers/PainelGestor/IndicadoresTransformer.js"
);
class UCIndicadores extends AbstractUserCase {
  async _checks(params) {
    if (!params.prefixo || !params.subord) {
      throw new Error("O prefixo e a subordinada são obrigatórios");
    }

    [this.prefixoData, this.indicadorData, this.criticidadesData, this.componentesData] = await Promise.all([
      this.repository.getDadosPrefixoByPrefixoSubord(
        params.prefixo,
        params.subord
      ),
      this.repository.getIndicadoresByPrefixoSubord(
        params.prefixo,
        params.subord
      ),
      this.repository.getCriticidadesComponentesByPrefixoSubord(
        params.prefixo,
        params.subord
      ),
      this.repository.getComponentesByPrefixoSubord(
        params.prefixo,
        params.subord
      )
    ]);

    if (!this.prefixoData) {
      throw new Error("Não existem indicadores para este prefixo/subordinada.");
    }
  }

  async _action() {
    const indicadoresComCriticidadesEComponentes = [];
    for (const indicador of this.indicadorData) {
      const newCriticidades = this.criticidadesData
        .filter((criticidade) => {
          return criticidade.idIndicador === indicador.idIndicador
        })
        .map((criticidade) => {
          const componentes = this.componentesData.filter((componente) =>
            componente.idIndicador === indicador.idIndicador &&
            componente.idCriticidade === criticidade.idCriticidade);
          return {
            ...criticidade,
            componentes
          }
        });

      indicador.criticidades = newCriticidades;
      indicadoresComCriticidadesEComponentes.push(indicador);
    }

    const indicadoresTransformados = await this.functions.transform.collection(
      indicadoresComCriticidadesEComponentes,
      IndicadoresTransformer
    );

    return {
      uor: this.prefixoData.uor,
      prefixo: this.prefixoData.prefixo,
      subordinada: this.prefixoData.subordinada,
      nome: this.prefixoData.nome,
      pontosPrefixo: parseFloat(parseFloat(this.prefixoData.pontosPrefixo).toFixed(2)),
      classificacao: {
        br: `${this.prefixoData.rankBrasil} / ${this.prefixoData.totalBrasil}`,
        diretoria: `${this.prefixoData.rankDiretoria} / ${this.prefixoData.totalDiretoria}`,
        super: `${this.prefixoData.rankSuper} / ${this.prefixoData.totalSuper}`,
        gerev: `${this.prefixoData.rankGerev} / ${this.prefixoData.totalGerev}`,
      },
      indicadores: indicadoresTransformados,
    };
  }
}

module.exports = UCIndicadores;
