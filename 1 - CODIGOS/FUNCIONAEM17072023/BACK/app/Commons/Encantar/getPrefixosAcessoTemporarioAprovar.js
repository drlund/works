const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const fluxoAcessoTemporarioAprovarModel = use(
  `${CAMINHO_MODELS}/FluxoAcessoTemporarioAprovar`
);

/**
 *
 *   Retorna array de prefixos onde o usuário tem acesso temporario
 *
 */

const getPrefixosAcessoTemporarioAprovar = async (matricula) => {
  
  const acessosTemporarios = await fluxoAcessoTemporarioAprovarModel
    .query()
    .where("matricula", matricula)
    .where("ativo", 1)
    .fetch();

  const prefixosAcessoTemporario = acessosTemporarios
    .toJSON()
    .map((acesso) => acesso.prefixo);

  return prefixosAcessoTemporario;
};

module.exports = getPrefixosAcessoTemporarioAprovar;
