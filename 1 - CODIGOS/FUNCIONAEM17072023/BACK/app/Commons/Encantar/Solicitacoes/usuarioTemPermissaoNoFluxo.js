//CONSTANTES
const { EncantarConsts } = use("Constants");
const { CAMINHO_COMMONS, CAMINHO_MODELS } = EncantarConsts;
const isAdmEncantar = use(`${CAMINHO_COMMONS}/isAdmEncantar`);

const isFuncaoGerencialNoPrefixo = use(
  "App/Commons/Arh/isFuncaoGerencialNoPrefixo"
);

/** @type {typeof import('./getPrefixosAcessoTemporarioAprovar')} */
const getPrefixosAcessoTemporarioAprovar = use(
  `${CAMINHO_COMMONS}/getPrefixosAcessoTemporarioAprovar`
);

const prefixoIntToString = use(`App/Commons/prefixoIntToString`);

const { getListaComitesByMatricula, getListaComitesAdm } = use(
  "App/Commons/Arh/dadosComites"
);

/**
 *
 *    Verifica se um usuário pode aprovar uma solicitação, levando em consideração o fluxo atual da mesma.
 *
 */

const usuarioTemPermissaoNoFluxo = async (usuarioLogado, fluxo) => {
  const comitesAdministracao = await getListaComitesByMatricula(
    usuarioLogado.chave
  );
  const prefixosMembroComite = comitesAdministracao.map((dependencia) =>
    prefixoIntToString(dependencia.PREFIXO)
  );

  const prefixosAcessoTemporario = await getPrefixosAcessoTemporarioAprovar(
    usuarioLogado.chave
  );

  let temPermissao =
    prefixosAcessoTemporario.includes(fluxo.prefixoAutorizador) ||
    (await isAdmEncantar(usuarioLogado)) ||
    (await isFuncaoGerencialNoPrefixo(
      usuarioLogado,
      fluxo.prefixoAutorizador
    )) ||
    prefixosMembroComite.includes(fluxo.prefixoAutorizador);

  return temPermissao;
};

module.exports = usuarioTemPermissaoNoFluxo;
