import set from 'lodash/set';

/**
 * @param {Object} into
 * @param {string} path
 * @param {unknown} value
 * @returns {void}
 */
export function put(into, path, value) {
  return set(into, path, value);
}
