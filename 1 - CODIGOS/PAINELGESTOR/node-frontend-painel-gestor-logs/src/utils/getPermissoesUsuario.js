import CryptoJS from 'crypto-js';
/**
 * Retorna um  array com todos os perfis de acesso cadastrado para a ferramenta.
 * @param {String} nomeFerramenta que se deseja buscar o array de perfis de acesso
 * @return Array de perfis de acesso do usuario logado
 */
const getPermissoesUsuario = (nomeFerramenta, authState) => {
  // gerar a lista de perfis de acesso
  const bytes = CryptoJS.AES.decrypt(authState.perms, authState.token);
  const listaGeralPermissoes = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  let permissaoFerramenta;
  if(listaGeralPermissoes.length){
    permissaoFerramenta = listaGeralPermissoes.find( permissao => permissao.ferramenta === nomeFerramenta)
  }

  if(permissaoFerramenta) {
    return permissaoFerramenta.permissoes;
  }
  return [];
}

export {
  getPermissoesUsuario,
};