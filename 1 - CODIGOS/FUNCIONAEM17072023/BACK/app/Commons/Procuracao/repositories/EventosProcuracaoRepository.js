const moment = require('moment');
const EventosProcuracaoModel = use("App/Models/Mysql/Procuracao/EventosProcuracao");

/**
 * @typedef {{
 *  id: number;
 *  idProcuracao: number;
 *  evento: string;
 *  custo: number;
 *  superCusto: 1 | 0;
 *  prefixoCusto: number;
 *  idCartorio?: number;
 *  dataCusto: string;
 *  matriculaRegistro: string;
 * }} EventoProcuracao
 */

class EventosProcuracaoRepository {
  /**
   * @param {Omit<EventoProcuracao, 'id'>} eventoProcuracao
   * @param {Adonis.Trx} trx
   */
  async saveEventoWithTrx(eventoProcuracao, trx) {
    const { superCusto, dataCusto, ...restEventoProcuracao } = eventoProcuracao;
    return EventosProcuracaoModel.create({
      ...restEventoProcuracao,
      controleSuper: superCusto,
      dataCusto: dataCusto ? moment(dataCusto).format('YYYY-MM-DD') : undefined,
    }, trx);
  }
}

module.exports = EventosProcuracaoRepository;
