"use strict";
/** @type {typeof import('../useCases/__mocks__/FluxosProcuracao')} */
const { getFluxos } = require("../useCases/__mocks__/FluxosProcuracao");
class Procuracao {
  /**
   * @param {Procuracoes.DadosProcuracao} dadosProcuracao
   * @param {Procuracoes.TipoFluxo['fluxo']} fluxo
   * @returns {dadosProcuracao is Procuracoes.DadosProcuracao}
   */
  validarDadosProcuracao(dadosProcuracao, fluxo) {
    /** @type {(keyof Procuracoes.DadosProcuracao)[]} */
    const camposProcuracaoBase = [
      'dataEmissao',
      'dataVencimento',
    ];

    /** @type {(keyof Procuracoes.DadosProcuracao)[]} */
    const camposProcuracaoPublica = [
      'dataManifesto',
      'folha',
      'livro',
    ];

    /**
     * @type {[keyof Procuracoes.DadosProcuracao, (value: number) => boolean][]}
     *
     * Funções de validação devem retornar true se existe erro de validação
     */
    const camposCusto = [
      ['custo', (c) => {
        if (dadosProcuracao.zerarCusto === 1) {
          return false;
        }
        return !c || c < 0 || Number.isNaN(Number(c));
      }],
      // custo de cadeia apenas para pública, não subsidiaria e feita na super
      ['custoCadeia', (c) => {
        if (dadosProcuracao.superCusto && fluxo === getFluxos().PUBLICA) {
          return !c || c < 0 || Number.isNaN(Number(c));
        } else {
          return false;
        }
      }],
      // id do cartorio do custo da cadeia
      // se custo cadeia, então verificar se é numero
      ['cartorioCadeia', (c) => {
        if (dadosProcuracao.custoCadeia) {
          return !c || c < 0 || Number.isNaN(Number(c));
        } else {
          return false;
        }
      }],
      ['superCusto', (s) => ![0, 1].includes(s)],
      ['zerarCusto', (z) => ![0, 1].includes(z)],
      ['prefixoCusto', (p) => !p || p < 1 || p > 9999 || Number.isNaN(Number(p))],
    ];

    /** @type {(keyof Procuracoes.DadosProcuracao | [keyof Procuracoes.DadosProcuracao, (value: number) => boolean])[]} */
    const camposObrigatorios = [
      ...camposProcuracaoBase,
      ...camposCusto,
      ...(fluxo !== getFluxos().PARTICULAR ? camposProcuracaoPublica : [])
    ];

    return camposObrigatorios.every((campoObrigatorio) => {
      if (typeof campoObrigatorio === 'string') {
        return Boolean(dadosProcuracao[/** @type {keyof Procuracoes.DadosProcuracao} */(campoObrigatorio)]);
      } else {
        const [campo, validador] = campoObrigatorio;
        return !validador(/** @type {number} */(dadosProcuracao[campo]));
      }
    });
  }
}

module.exports = Procuracao;
