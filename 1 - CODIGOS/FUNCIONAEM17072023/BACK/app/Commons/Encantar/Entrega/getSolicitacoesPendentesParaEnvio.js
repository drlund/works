const exception = use('App/Exceptions/Handler');
const { query } = require("@adonisjs/lucid/src/Lucid/Model");

//CONSTANTES
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, STATUS_SOLICITACAO, CAMINHO_COMMONS } = EncantarConsts;
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getPrefixosUsuarioResponsavelBrindes')} */
const getPrefixosUsuarioResponsavelBrindes = use(
  `${CAMINHO_COMMONS}/Estoque/getPrefixosUsuarioResponsavelBrindes`
);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

const regras = {
  solicitacoesComBrindes: (query, prefixos) => {
    query.orWhere((builder) => {
      builder.whereHas("brindes", (builder) => {
        builder.whereIn("prefixo", prefixos);
      });
    });
  },

  solicitacoesSemBrindes: (query, prefixos) => {
    //Regra provisória que será alterada posteriormente
    if (prefixos.includes("9009")) {
      query.orWhere((builder) => {
        builder.whereDoesntHave("brindes");
      });
    }
  },
};

/**
 *
 *   Função que retorna as solicitações pendentes para entrega na qual o usuario logado é responsável por enviar.
 *   Regras para definir se um usuário é responsável por enviar o brinde:
 *
 *    1 - Caso a solicitação tenha brinde e o usuário é responsável pelos brindes no prefixo gestor do estoque.
 *    2 - Caso a solicitação não tenha brindes e o usuário é responsável por brindes no prefixo 9009 (REGRA PROVISÓRIA)
 *
 *
 */

const getSolicitacoesPendentesParaEnvio = async (usuarioLogado, status) => {
  const statusAceitos = [
    STATUS_SOLICITACAO.PENDENTE_DEVOLVIDA,
    STATUS_SOLICITACAO.DEFERIDA,
  ];
  if (!statusAceitos.includes(status)) {
    throw new exception(
      `getSolicitacoesPendentesParaEnvio: Status ${status} inválido para essa função.`,
      500
    );
  }

  const prefixosUsuarioResponsavelBrindes = await getPrefixosUsuarioResponsavelBrindes(
    usuarioLogado.chave
  );

  const querySolicitacoesPendentes = solicitacoesModel
    .query()
    .where("idSolicitacoesStatus", status);

  querySolicitacoesPendentes.where((builder) => {
    regras.solicitacoesComBrindes(builder, prefixosUsuarioResponsavelBrindes);
    regras.solicitacoesSemBrindes(builder, prefixosUsuarioResponsavelBrindes);
  });

  const solicitacoesPendentesParaEnvio = await querySolicitacoesPendentes
    .orderBy("finalAprovacaoEm", "desc")
    .with("status")
    .with("brindes", (builder) => {
      builder.with("dadosPrefixo");
      builder.with("brinde");
    })
    .fetch();

  return solicitacoesPendentesParaEnvio.toJSON();
};

module.exports = getSolicitacoesPendentesParaEnvio;
