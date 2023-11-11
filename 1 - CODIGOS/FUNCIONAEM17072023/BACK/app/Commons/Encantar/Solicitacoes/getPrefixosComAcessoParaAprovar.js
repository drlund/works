const { getListaComitesByMatricula } = use("App/Commons/Arh/dadosComites");

const { EncantarConsts } = use("Constants");
const { CAMINHO_COMMONS } = EncantarConsts;

const prefixoIntToString = use("App/Commons/prefixoIntToString");
const isComissaoNivelGerencial = use(
  "App/Commons/Arh/isComissaoNivelGerencial"
);

/** @type {typeof import('./getPrefixosAcessoTemporarioAprovar')} */
const getPrefixosAcessoTemporarioAprovar = use(
  `${CAMINHO_COMMONS}/getPrefixosAcessoTemporarioAprovar`
);

const getPrefixosNivelGerencial = async (usuarioLogado) => {
  const isNivelGerencial = await isComissaoNivelGerencial(
    usuarioLogado.cod_funcao
  );

  return isNivelGerencial ? [usuarioLogado.prefixo] : [];
};
/**
 *
 *   Recupera os prefixos aonde o usuário tem acesso para aprovar solicitações. O acesso pode ser tanto no prefixo atual quanto em outros do fluxo
 *
 *
 */

const getPrefixosComAcessoParaAprovar = async (usuarioLogado) => {
  // Por hora, o único tipo de autorização implementado é o de "Membro do Comitê", ou seja,
  // o campo idTipoAutorizacao da tabela solicitacoesFluxoUtilizado está sendo ignorado.
  const comitesAdministracao = await getListaComitesByMatricula(
    usuarioLogado.matricula
  );

  const prefixosComitesAdministracao = comitesAdministracao.map((comite) =>
    prefixoIntToString(comite.PREFIXO)
  );
  const prefixosNivelGerencial = await getPrefixosNivelGerencial(usuarioLogado);
  const prefixosAcessoTemporario = await getPrefixosAcessoTemporarioAprovar(
    usuarioLogado.chave
  );

  return [
    ...prefixosComitesAdministracao,
    ...prefixosNivelGerencial,
    ...prefixosAcessoTemporario,
  ];
};

module.exports = getPrefixosComAcessoParaAprovar;
