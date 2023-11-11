import { useSelector } from "react-redux";

export default function useUsuarioLogado() {
  const usuarioLogado = useSelector((state) => ({
    // @ts-ignore
    ...state.app.authState.sessionData,
  }));
  return /** @type {UsuarioLogado} */ (usuarioLogado);
}

/**
 * @typedef {Object} UsuarioLogado
 *
 * @property {string} chave ex: "F1234567"
 * @property {string} matricula ex: "F1234567"
 * @property {string} nome_usuario nome completo
 * @property {string} nome_guerra nome de guerra, UPPERCASE
 * @property {string} email email@bb.com.br
 * @property {string} prefixo ex: "0001"
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
