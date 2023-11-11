const { AbstractUserCase } = require('../../../AbstractUserCase');
const moment = require('moment');

/**
 * @typedef {{
 *  idProcuracao: number,
 *  cartorioId: number,
 *  dataManifesto: string,
 *  custoManifesto: number,
 *  superCusto: 1 | 0,
 *  prefixoCusto: number,
 *  nomeArquivo: string,
 *  matriculaRegistro: string,
 * }} RunArgs
 *
 * @typedef {{
 *  Repository: {
 *    procuracoes: import('../../repositories/ProcuracoesRepository'),
 *    eventos: import('../../repositories/EventosProcuracaoRepository'),
 *  },
 *  Functions: never,
 *  RunArguments: RunArgs,
 *  Payload: Awaited<ReturnType<UcSaveManifesto['_action']>>,
 *  UseTrx: true,
 * }} UcSaveManifestoTypes
 *
 * @extends {AbstractUserCase<UcSaveManifestoTypes>}
 */
class UcSaveManifesto extends AbstractUserCase {
  /**
   * @override
   * @param {RunArgs} props
   */
  async _action({
    idProcuracao,
    cartorioId,
    dataManifesto,
    nomeArquivo,
    custoManifesto,
    superCusto,
    prefixoCusto,
    matriculaRegistro,
  }) {
    const urlDocumento = await this.repository.procuracoes.getUrlDocumento({
      arquivoProcuracao: nomeArquivo
    });

    return Promise.all([
      this.repository.procuracoes.updateManifestoProcuracao({
        idProcuracao,
        dataManifesto,
        urlDocumento
      }, this.trx),
      this.repository.procuracoes.cadastrarHistoricoDocumento({
        idProcuracao,
        dataManifesto,
        urlDocumento,
        matriculaRegistro,
        mensagem: 'Atualização do Manifesto',
      }, this.trx),
      this.repository.eventos.saveEventoWithTrx({
        idProcuracao,
        matriculaRegistro,
        prefixoCusto,
        superCusto,
        idCartorio: cartorioId,
        evento: 'Atualização do Manifesto',
        custo: custoManifesto,
        dataCusto: dataManifesto,
      }, this.trx)
    ])
      .catch((err) => this._throwExpectedError(JSON.stringify(err)));
  }

  /**
   * @override
   * @param {RunArgs} props
   */
  async _checks({
    idProcuracao,
    cartorioId,
    dataManifesto,
    nomeArquivo,
    custoManifesto,
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

    if (custoManifesto < 0.01) {
      throw new Error('Informar o custo do manifesto.');
    }

    if (![0, 1].includes(superCusto)) {
      throw new Error('Informar se o custo do manifesto é para controle da Super.');
    }

    if (!prefixoCusto) {
      throw new Error('Informar o prefixo do custo do manifesto.');
    }

    if (prefixoCusto > 9999 || prefixoCusto < 1) {
      throw new Error('Informar um prefixo válido do custo do manifesto.');
    }

    if (!dataManifesto) {
      throw new Error('Informar a data do manifesto.');
    }

    if (!moment(dataManifesto).isValid()) {
      throw new Error('Informar uma data do manifesto válida.');
    }

    if (!nomeArquivo) {
      throw new Error('Erro ao salvar arquivo.');
    }
  }
}

module.exports = UcSaveManifesto;
