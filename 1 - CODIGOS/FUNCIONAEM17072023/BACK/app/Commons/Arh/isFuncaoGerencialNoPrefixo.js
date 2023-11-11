const isComissaoNivelGerencial = use(
  "App/Commons/Arh/isComissaoNivelGerencial"
);

/**
 *
 * Verifica se um funcionário tem função gerencial em um prefixo específico
 *
 */

const isFuncaoGerencialNoPrefixo = async (usuarioLogado, prefixo) => {
  
  const comissaoNivelGerencial = await isComissaoNivelGerencial(
    usuarioLogado.cod_funcao
  );
  const funciNoPrefixo = usuarioLogado.prefixo === prefixo;

  return comissaoNivelGerencial && funciNoPrefixo;
};

module.exports = isFuncaoGerencialNoPrefixo;
