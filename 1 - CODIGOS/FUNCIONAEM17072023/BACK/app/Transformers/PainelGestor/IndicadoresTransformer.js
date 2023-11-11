"use strict";
const BumblebeeTransformer = use("Bumblebee/Transformer");
const coresBB = use("App/Commons/paletaCoresBB");

/**
 * ProjetosTransformer class
 *
 * @class ProjetosTransformer
 * @constructor
 */
class IndicadoresTransformer extends BumblebeeTransformer {
  // transforma os dados dos indicadores
  transform(indicador) {
    const indicadorTransformado = {
      idIndicador: indicador.idIndicador,
      nomeIndicador: indicador.nomeIndicador,
      uorResponsavel: indicador.uorResponsavel,
      participacao: parseFloat(
        (parseFloat(indicador.percentualPesoIndicador) * 100).toFixed(2)
      ),
      pesoIndicador: parseFloat(parseFloat(indicador.pesoIndicador).toFixed(2)),
      pontosIndicador: parseFloat(parseFloat(indicador.pontosIndicador).toFixed(2)),
      maxPontosIndicador: parseFloat(
        parseFloat(indicador.maxPontosIndicador).toFixed(2)
      ),
      percentualAtingimento: parseFloat(
        (parseFloat(indicador.percAtingIndicador) * 100).toFixed(2)
      ),
      media: parseFloat(parseFloat(indicador.mediaIndicador).toFixed(2)),
      destaque: parseInt(indicador.destaque),
      dataAtualizacao: indicador.dataAtualizacao,
      infoCalculo: indicador.informacaoCalculo,
      relatorio: indicador.linkRelatorio,
      materialApoio: indicador.linkArtigo,
      grafEvolucao: "em breve",
      criticidades: this._componentes(indicador.criticidades),
    };
    return indicadorTransformado;
  }

  // transforma os dados dos componentes
  _componentes(criticidades) {
    for (const criticidade of criticidades) {
      const componentes = criticidade.componentes;
      criticidade.componentes = [];
      for (const componente of componentes) {
        criticidade.componentes.push({
          nomeComponente: componente.nomeComponente,
          valorComponente: parseInt(componente.valorComponente),
          pontosComponente: parseFloat(parseFloat(componente.pontosComponente).toFixed(2)),
          percAtingComponente: parseInt(parseFloat(componente.percAtingComponente) * 100),
          maxPontosComponente: parseFloat(parseFloat(componente.maxPontosComponente).toFixed(2)),
          posicaoComponente: componente.posicaoComponente,
        });
      }
    }
    return criticidades;
  }
}

module.exports = IndicadoresTransformer;
