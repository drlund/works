/**
 * @typedef {Object} UsuarioLogado
 * @property {string} bb_token
 * @property {string} celular
 * @property {string} chave
 * @property {string} cod_funcao - 14011
 * @property {string} dependencia
 * @property {string} email
 * @property {string} matricula
 * @property {string} nome_funcao
 * @property {string} nome_guerra
 * @property {string} nome_regional 
 * @property {string} nome_super
 * @property {string} nome_usuario
 * @property {string} pref_diretoria
 * @property {string} pref_regional 
 * @property {string} pref_super
 * @property {string} prefixo
 * @property {Array}  roles 
 * @property {string} telefone
 * @property {string} uf
 * @property {string} uor
 * @property {string} uor_trabalho
*/

 /**
 * Returns a coordinate from a given mouse or touch event
 * @return {UsuarioLogado} 
 *        Usuário logado
 */

 var getUsrFromSession = function(session){
   return session.get("currentUserAccount");
}

module.exports = getUsrFromSession;