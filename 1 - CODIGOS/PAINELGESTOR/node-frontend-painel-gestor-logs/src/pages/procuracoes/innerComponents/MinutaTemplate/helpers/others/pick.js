import get from 'lodash/get';

/**
 * @param {string} path
 * @param {Object} from
 * @param {unknown} defaultsTo
 * @returns {unknown}
 */
export function pick(path, from, defaultsTo) {
  return get(from, path, defaultsTo);
}
