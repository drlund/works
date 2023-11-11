/**
 * @param {{
*  revogado: boolean|string|Date,
*  ativo: boolean|number,
* }} props
*/
export function getRevogadoInativoColor({ revogado, ativo }) {
  if (revogado) {
    return 'RGBA(255, 0, 0, 0.2)';
  }
  if (!ativo) {
    return 'RGBA(255, 255, 0, 0.2)';
  }
  return null;
}
