const { AbstractUserCase } = require('../../../AbstractUserCase');
const moment = require('moment');

/**
 * @typedef {{
 *  idProcuracao: number,
 *  cartorioId: number,
 *  dataEmissao: string,
 *  custo: number,
 *  superCusto: 1 | 0,
 *  prefixoCusto: number,
 *  matriculaRegistro: string,
 * }} RunArgs
 *
 * @typedef {{
 *  Repository: {
 *    eventos: import('../../repositories/EventosProcuracaoRepository'),
 *  },
 *  Functions: never,
 *  RunArguments: RunArgs,
 *  Payload: Awaited<ReturnType<UcSaveCopiaAutenticada['_action']>>,
 * }} UcSaveCopiaAutenticadaTypes
 *
 * @extends {AbstractUserCase<UcSaveCopiaAutenticadaTypes>}
 */
class UcSaveCopiaAutenticada extends AbstractUserCase {
  /**
   * @override
   * @param {RunArgs} props
   */
  async _action({
    idProcuracao,
    cartorioId,
    dataEmissao,
    custo,
    superCusto,
    prefixoCusto,
    matriculaRegistro,
  }) {
    return this.repository.eventos.saveEventoWithTrx({
      idProcuracao,
      matriculaRegistro,
      prefixoCusto,
      superCusto,
      custo,
      idCartorio: cartorioId,
      evento: 'Emissão de Cópia Autenticada',
      dataCusto: dataEmissao,
    }, null);
  }

  /**
   * @override
   * @param {RunArgs} props
   */
  async _checks({
    idProcuracao,
    cartorioId,
    dataEmissao,
    custo,
    superCusto,
    prefixoCusto,
    matriculaRegistro,
  }) {
    if (!matriculaRegistro) {
      throw new Error('Usuário não está logado.');
    }

    if (!idProcuracao) {
      throw new Error('Informar a procuração.');
    }

    if (!cartorioId) {
      throw new Error('Informar o cartório.');
    }

    if (Number(custo) < 0.01) {
      throw new Error('Informar o custo da cópia autenticada.');
    }

    if (![0, 1].includes(superCusto)) {
      throw new Error('Informar se o custo da cópia é para controle da Super.');
    }

    if (!prefixoCusto) {
      throw new Error('Informar o prefixo do custo.');
    }

    if (prefixoCusto > 9999 || prefixoCusto < 1) {
      throw new Error('Informar um prefixo válido.');
    }

    if (!dataEmissao) {
      throw new Error('Informar a data da emissão da cópia.');
    }

    if (!moment(dataEmissao).isValid()) {
      throw new Error('Informar uma data de emissão válida.');
    }
  }
}

module.exports = UcSaveCopiaAutenticada;
