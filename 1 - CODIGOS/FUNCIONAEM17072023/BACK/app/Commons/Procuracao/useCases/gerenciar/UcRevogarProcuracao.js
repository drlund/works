const { AbstractUserCase } = require('../../../AbstractUserCase');
const moment = require('moment');

/**
 * @typedef {{
 *  idProcuracao: number,
 *  cartorioId: number,
 *  dataRevogacao: string,
 *  custo: number,
 *  superCusto: 1 | 0,
 *  prefixoCusto: number,
 *  nomeArquivo: string,
 *  matriculaRegistro: string,
 * }} RunArgs
 *
 * @typedef {{
 *  Repository: {
 *    procuracoes: import('../../repositories/ProcuracoesRepository'),
 *    pesquisa: import('../../repositories/PesquisaRepository'),
 *    eventos: import('../../repositories/EventosProcuracaoRepository'),
 *  },
 *  Functions: never,
 *  RunArguments: RunArgs,
 *  Payload: Awaited<ReturnType<UcRevogarProcuracao['_action']>>,
 *  UseTrx: true,
 * }} UcRevogarProcuracaoTypes
 *
 * @extends {AbstractUserCase<UcRevogarProcuracaoTypes>}
 *
 * Hoje a ideia é que uma procuração "proxy" não herde de outro proxy
 * ou mesmo de uma outra procuração "normal".
 * Com isso, estou desconsiderando o caso de que uma procuração "normal"
 * pudesse ser ter proxys a serem revogados junto da procuração "pai".
 * No caso de estar revogando uma procuração "normal" e precisar revogar uma "proxy",
 * será necessário alterar esta função para lidar com o proxy.
 * Aqui também não está contemplado a revogação de um "proxy".
 */
class UcRevogarProcuracao extends AbstractUserCase {
  /**
   * @override
   * @param {RunArgs} props
   */
  async _action({
    idProcuracao,
    cartorioId,
    dataRevogacao,
    nomeArquivo,
    custo,
    superCusto,
    prefixoCusto,
    matriculaRegistro,
  }) {
    const [urlDocumento, cadeiaAbaixo] = await Promise.all([
      await this.repository.procuracoes.getUrlDocumento({
        arquivoProcuracao: nomeArquivo
      }),
      await this.repository.pesquisa.getCadeiaAbaixoDeProcuracaoById({
        idProcuracao,
      })
    ]);

    const idsToInactivate = cadeiaAbaixo
      .map((c) => c.idProcuracao)
      .concat(idProcuracao);

    return Promise.all([
      this.repository.procuracoes.updateManyRevogacaoProcuracao({
        idsProcuracao: idsToInactivate,
      }, this.trx),
      this.repository.procuracoes.updateRevogacaoProcuracao({
        idProcuracao,
        dataRevogacao,
        urlDocumento
      }, this.trx),
      this.repository.procuracoes.cadastrarHistoricoDocumento({
        idProcuracao,
        urlDocumento,
        matriculaRegistro,
        dataManifesto: dataRevogacao,
        mensagem: 'Revogação de Procuração',
      }, this.trx),
      this.repository.eventos.saveEventoWithTrx({
        idProcuracao,
        matriculaRegistro,
        prefixoCusto,
        superCusto,
        custo,
        idCartorio: cartorioId,
        evento: 'Revogação de Procuração',
        dataCusto: dataRevogacao,
      }, this.trx),
    ]);
  }

  /**
   * @override
   * @param {RunArgs} props
   */
  async _checks({
    idProcuracao,
    cartorioId,
    dataRevogacao,
    nomeArquivo,
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

    if (custo < 0.01) {
      throw new Error('Informar o custo do revogação.');
    }

    if (![0, 1].includes(superCusto)) {
      throw new Error('Informar se o custo do revogação é para controle da Super.');
    }

    if (!prefixoCusto) {
      throw new Error('Informar o prefixo do custo do revogação.');
    }

    if (prefixoCusto > 9999 || prefixoCusto < 1) {
      throw new Error('Informar um prefixo válido do custo do revogação.');
    }

    if (!dataRevogacao) {
      throw new Error('Informar a data do revogação.');
    }

    if (!moment(dataRevogacao).isValid()) {
      throw new Error('Informar uma data do revogação válida.');
    }

    if (!nomeArquivo) {
      throw new Error('Erro ao salvar arquivo.');
    }
  }
}

module.exports = UcRevogarProcuracao;
