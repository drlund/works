/**
 * Pega uma string em `kebab-case` e transforma para `kebabCase` (camelCase)
 * @param {string} s
 */
export function kebabToCamel(s) {
  return s.replace(/-./g, (x) => x[1].toUpperCase());
}
