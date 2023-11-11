import { useSelector } from 'react-redux';

export default function useUsuarioLogado() {
  return /** @type {UsuarioLogado} */(useSelector((state) => ({
    // @ts-ignore
    ...state.app.authState.sessionData,
  })));
}

/**
 * @typedef {Object} UsuarioLogado
 *
 * @property {string} chave ex: "F1234567"
 * @property {string} matricula ex: "F1234567"
 * @property {string} nome_usuario nome completo
 * @property {string} nome_guerra nome de guerra, UPPERCASE
 * @property {string} email email@bb.com.br
 * @property {string} prefixo [@deprecated - usar `prefixo_virtual`] - ex: "0001"
 * @property {string} prefixo_efetivo ex: "0001" (usar ao inves de `prefixo`, retorna o `prefixo_virtual` ou `prefixo` conforme o caso)
 * @property {string} prefixo_virtual ex: "0001" somente para os funcis da tabela superadm.funcis_regionais
 *                                    - são casos onde o prefixo que aparece não é o efetivo onde esta lotado
 *                                    - é possível utilizar `prefixo_virtual` caso precise saber se o funci é da regional
 *                                    - utilize diretamente o `prefixo_efetivo` caso apenas precise do prefixo
 * @property {string} dependencia nome do prefixo
 * @property {string|number} pref_regional prefixo da regional
 * @property {string} nome_regional nome do prefixo da reginal
 * @property {string|number} pref_super prefixo da super
 * @property {string} nome_super nome do prefixo da super
 * @property {string|number} pref_diretoria prefixo da diretoria
 * @property {number} cod_funcao codigo da funcao
 * @property {string} nome_funcao nome da função, UPPERCASE
 * @property {string} telefone ex: "DDD 3123456789" (ddd sem 0)
 * @property {string} celular ex: "DDD 9123456789" (ddd sem 0)
 * @property {string} uf UF em UPPERCASE
 * @property {string} uor ex: "000123456" string com tamanho 9 e leading zeros quando necessario
 * @property {string} uor_trabalho ex: "000123456" string com tamanho 9 e leading zeros quando necessario
 * @property {string} bb_token token
 * @property {string[]} roles roles
 */
