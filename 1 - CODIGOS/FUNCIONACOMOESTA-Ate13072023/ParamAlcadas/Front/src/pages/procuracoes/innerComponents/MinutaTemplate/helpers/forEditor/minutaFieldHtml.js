/**
 * Cria os campos no template escondendo os valores dentro do dataset do html gerado.
 *
 * @param {string} key chave para buscar nos dados
 * @param {string} value valor que aparece no template
 * @param {boolean} [blocked] se é possível editar o campo ou não
 * @returns html like string para o campo
 */
export const minutaFieldHtml = (key, value, blocked = false) => {
  const displayText = String(value).toLocaleUpperCase();
  return `<strong style="color:${blocked ? 'green' : 'red'}" data-display="${displayText}" data-minuta${blocked ? '-blocked' : ''}="${key}">&lt;${displayText}&gt;</strong>`;
};
