import { useHistory } from 'react-router-dom';

/**
 * Hook que cria um push que mantem os query params
 *
 * Util para usar junto com feature flags
 *
 * @example de uso
 * ```js
 *  const historyPush = useHistoryPushWithQuery();
 *  historyPush("/teste");
 * ```
 */
export function useHistoryPushWithQuery() {
  const history = useHistory();

  /**
   * @param {string} path
   */
  return (path) => {
    history.push(`${path}${history.location.search}`);
  };
}
