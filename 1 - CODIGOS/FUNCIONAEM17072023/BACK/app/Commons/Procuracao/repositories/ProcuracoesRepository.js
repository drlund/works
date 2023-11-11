"use strict";

const ProcuracaoModel = use("App/Models/Mysql/Procuracao/Procuracao");
const ProcuracoesSubsidiariasModel = use("App/Models/Mysql/Procuracao/ProcuracaoSubsidiarias");

const ProcuracaoHistoricoDocumentoModel = use("App/Models/Mysql/Procuracao/ProcuracaoHistoricoDocumento");
const ProcuracaoSubsidiariasModel = use("App/Models/Mysql/Procuracao/ProcuracaoSubsidiarias");

const CadeiaProcuracaoModel = use("App/Models/Mysql/Procuracao/CadeiaProcuracao");

const ProxyProcuracaoModel = use("App/Models/Mysql/Procuracao/ProxyProcuracao");

const Env = use('Env');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');

/**
 * Converte datas string para Date object.
 *
 * Se a data estiver formatada como DD/MM/YYYY hh:mm,
 * converte para YYYY-MM-DD hh:mm evitando erro de 'Data Inválida'
 */
const parsedDate = (dateString) => {
  const DDMMYYYYhhmmRegex = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/gm;
  const YYYYMMDDhhmmSubst = `$3-$2-$1 $4`;
  return new Date(dateString.replace(DDMMYYYYhhmmRegex, YYYYMMDDhhmmSubst));
};

class ProcuracaoRepository {
  async cadastrarDadosProcuracao(dadosProcuracao, trx) {
    const procuracaoCadastrada = await ProcuracaoModel.create(
      dadosProcuracao,
      trx
    );
    return /** @type {ProcuracaoCadastrada} */(procuracaoCadastrada.toJSON());
  }

  /**
   * @param {{
   *  idProcuracao: number,
   *  dataManifesto: string,
   *  urlDocumento: string,
   * }} props
   * @param {Adonis.Trx} trx
  */
  async updateManifestoProcuracao({ idProcuracao, dataManifesto, urlDocumento }, trx) {
    return ProcuracaoModel
      .query()
      .where("id", idProcuracao)
      .transacting(trx)
      .update({
        dataManifesto: moment(dataManifesto).format('YYYY-MM-DD'),
        urlDocumento
      });
  }

  /**
   * @param {{
   *  idProcuracao: number,
   *  dataRevogacao: string,
   *  urlDocumento: string,
   * }} props
   * @param {Adonis.Trx} trx
  */
  async updateRevogacaoProcuracao({ idProcuracao, dataRevogacao, urlDocumento }, trx) {
    return ProcuracaoModel
      .query()
      .where("id", idProcuracao)
      .transacting(trx)
      .update({
        dataRevogacao: moment(dataRevogacao).format('YYYY-MM-DD'),
        urlDocumento,
      });
  }

  /**
   * @param {{
   *  idsProcuracao: number[],
   * }} props
   * @param {Adonis.Trx} trx
  */
  async updateManyRevogacaoProcuracao({ idsProcuracao }, trx) {
    return ProcuracaoModel
      .query()
      .whereIn("id", idsProcuracao)
      .transacting(trx)
      .update({ ativo: 0 });
  }

  async cadastrarProcuracaoSubsidiaria(dadosProcuracaoSubsidiaria, trx) {
    /** O model do LUCID dá erro no caso de não receber um array maior que zero. */
    if (
      Array.isArray(dadosProcuracaoSubsidiaria) &&
      dadosProcuracaoSubsidiaria.length > 0
    ) {
      await ProcuracaoSubsidiariasModel.createMany(
        dadosProcuracaoSubsidiaria,
        trx
      );
    }
  }

  /**
   * @param {{
   *  arquivoProcuracao: string | Promise<string>,
   *  urlDocumento?: string,
   * }} props
   */
  async getUrlDocumento({ arquivoProcuracao, urlDocumento }) {
    const baseUrl = Env.get('BACKEND_URL');
    const arquivoNome = await arquivoProcuracao;
    if (arquivoNome) {
      return `${baseUrl}/procuracoes/cadastro/download-arquivo/${arquivoNome}`;
    }

    if (urlDocumento) {
      return urlDocumento;
    }

    throw new Error('Documento não encontrado.');
  }

  async getProxyIdByMatricula(matricula) {
    const proxy = await ProxyProcuracaoModel.query()
      .whereHas("procuracao", (qbProcuracao) => {
        qbProcuracao.whereHas("outorgadoSnapshot", (qbOutorgadosSnapshot) => {
          qbOutorgadosSnapshot.where("matricula", matricula);
        });
        qbProcuracao.where("ativo", 1);
      })
      .orderBy("createdAt", "desc")
      .first();

    if (proxy) {
      return proxy.idProxy;
    }

    return null;
  }

  async getPoderesByOutorgante(matricula) {
    const poderesOutorgante = await ProcuracoesSubsidiariasModel.query()
      .whereHas("procuracao", (qbProcuracaoWhere) => {
        qbProcuracaoWhere.whereHas(
          "outorgadoSnapshot",
          (qbOutorgadosSnapshot) => {
            qbOutorgadosSnapshot.where("matricula", matricula);
          }
        );
        qbProcuracaoWhere.where("ativo", 1);
      })
      .with("procuracao", (qbProcuracao) => {
        qbProcuracao.with("outorgadoSnapshot");
        qbProcuracao.with("cartorio");
      })
      .with("dadosSubsidiaria")
      .fetch();

    return poderesOutorgante.toJSON();
  }

  async cadastrarProxy({ novaProcuracaoId, idSubsidiaria, matriculaOutorgado }, trx) {
    const procuracoesOutorgado = await ProcuracaoModel.query()
      .where("ativo", 1)
      .whereHas("outorgadoSnapshot", (qbOutorgadosSnapshot) => {
        qbOutorgadosSnapshot.where("matricula", matriculaOutorgado);
      })
      .with("subsidiarias")
      .fetch();

    /**
     * reduz as procuracoes com base nas subsidiarias e data de criação
     * mantem sempre a ultima procuracao por subsidiaria
     */
    const reducedSubs = procuracoesOutorgado.toJSON().reduce((acc, cur) => {
      // ignora inativos
      if (cur.ativo === 0) {
        return acc;
      }

      const subId = cur.subsidiarias[0].idSubsidiaria;
      const createdAt = parsedDate(cur.createdAt);

      // adiciona se subsidiaria não foi adicionada ou se foi criada depois
      if (!acc[subId] || acc[subId].createdAt < createdAt) {
        acc[subId] = {
          createdAt,
          idProcuracao: cur.id,
        };
      }

      return acc;
    }, {
      // já começa com a nova procuracao
      [idSubsidiaria]: {
        createdAt: Infinity,
        idProcuracao: novaProcuracaoId,
      },
    });

    const idProxy = uuidv4();

    // map para retornar apenas idProcuracao e idProxy
    const novoProxyArr = Object
      .entries(reducedSubs)
      .map(([_, { idProcuracao }]) => ({ idProxy, idProcuracao }));

    await Promise.all([
      this.cadastrarCadeiaProcuracao({ idProxyAtual: idProxy }, trx),
      ProxyProcuracaoModel.createMany(novoProxyArr, trx)
    ]);
  }

  async cadastrarCadeiaProcuracao({
    idProcuracaoAtual = null,
    idProxyAtual = null,
    idProcuracaoParent = null,
    idProxyParent = null,
  },
    trx
  ) {
    await CadeiaProcuracaoModel.create(
      {
        idProcuracaoAtual,
        idProxyAtual,
        idProcuracaoParent,
        idProxyParent,
      },
      trx
    );
  }

  /**
   * @param {{
   *  urlDocumento: string,
   *  idProcuracao: number,
   *  dataManifesto?: string,
   *  mensagem: string,
   *  matriculaRegistro: string,
   * }} props
   * @param {Adonis.Trx} trx
   */
  async cadastrarHistoricoDocumento({
    urlDocumento,
    idProcuracao,
    dataManifesto,
    mensagem,
    matriculaRegistro,
  }, trx) {
    return ProcuracaoHistoricoDocumentoModel.create({
      dataManifesto: dataManifesto ? moment(dataManifesto).format('YYYY-MM-DD') : undefined,
      urlDocumento,
      idProcuracao,
      mensagem,
      matriculaRegistro,
    }, trx);
  }

  async getProxyExistente(idsProcuracao) {
    const dbProxies = await ProxyProcuracaoModel.query().whereIn(
      "idProcuracao",
      idsProcuracao
    );
    const proxies = dbProxies.toJSON();
    if (proxies.length === 0) {
      return null;
    }
    return proxies[0].idProxy;
  }
}

module.exports = ProcuracaoRepository;

/**
 * @typedef {{
 *  id: number,
 *  idCartorio: number,
 *  idFluxo: string,
 *  idOutorgadoSnapshot: number,
 *  dataEmissao: string,
 *  dataVencimento: string,
 *  dataManifesto: string,
 *  folha: string,
 *  livro: string,
 *  urlDocumento: string,
 *  idMinutaCadastrada: string,
 *  matriculaRegistro: string,
 *  createdAt: string,
 *  updatedAt: string,
 *  ativo: 1 | 0,
 * }} ProcuracaoCadastrada
 */
