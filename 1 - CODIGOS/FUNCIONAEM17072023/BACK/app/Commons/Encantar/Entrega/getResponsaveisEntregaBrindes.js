/** @type {typeof import('../../../Commons/Constants')} */
const { EncantarConsts } = use("Constants");

const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesBrindesModel = use(`${CAMINHO_MODELS}/SolicitacoesBrindes`);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const brindesResponsavelEntregaModel = use(
  `${CAMINHO_MODELS}/BrindesResponsavelEntrega`
);

const getManyFuncis = use("App/Commons/Arh/getManyFuncis");

/**
 *
 * 	Retorna os responsáveis pela entrega de Brindes
 *
 */

const getResponsaveisEntregaBrindes = async (idSolicitacao) => {
  //Recuperar os responsáveis pelo envio dos brindes selecionados
  const prefixos = await solicitacoesBrindesModel
    .query()
    .distinct("prefixo")
    .where("idSolicitacao", idSolicitacao)
    .fetch();

  const responsaveisBrindes = await brindesResponsavelEntregaModel
    .query()
    .whereIn(
      "prefixo",
      prefixos.toJSON().map((prefixo) => prefixo.prefixo)
    )
    .where("ativo", 1)
    .fetch();

  const dadosResponsaveis = await getManyFuncis(
    responsaveisBrindes.toJSON().map((responsavel) => responsavel.matricula)
  );

  return dadosResponsaveis;
};

module.exports = getResponsaveisEntregaBrindes;
