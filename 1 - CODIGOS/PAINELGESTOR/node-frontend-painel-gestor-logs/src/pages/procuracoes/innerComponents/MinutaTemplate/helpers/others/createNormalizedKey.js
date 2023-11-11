/**
 * replace o bang(!) inicial que mostra uma informação que não pode ser alterada
 * replace o question(?) inicial que mostra uma informação é opcional
 * @param {string} key
 * @returns {[string, boolean]} [normalizedKey, blockedToEdit]
 */
export function createNormalizedKey(key) {
  if (key.startsWith('!')) {
    return [
      key.replace(/^!/, ''),
      true
    ];
  }

  return [
    key.replace(/^\?/, ''),
    false
  ];
}
