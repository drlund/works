/**
 * @typedef {{
 *  custo: number;
 * } & {
 *  [k: string]: Date| number | boolean;
 * }} GerenciarForm
 */
export function returnErrors(/** @type {import('antd').FormInstance<GerenciarForm>} */ form) {
  const empty = Object.entries(form.getFieldsValue())
    // deixar validacao do custo para o custo form items
    .filter(([key]) => key !== 'custo')
    // se não boolean e for falsy, retorna no filter
    .filter(([, v]) => typeof v !== 'boolean' && Boolean(!v))
    // mostra o nome do campo
    .map(([key]) => `${key.toUpperCase()} é obrigatório.`);

  // mostra erros pegos mais erros de campos vazios
  return /** @type {string[]} */ (form.getFieldsError().map((f) => f.errors).flat(Infinity))
    .concat(empty);
}
