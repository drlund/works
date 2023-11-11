import { useVerifyPermission } from 'hooks/useVerifyPermission';
import { useLocation } from 'react-router-dom';

/**
 * @param {Object} [props]
 * @param {import('.').FeatureFlagProps['flagName']} [props.flagName] nome da flag necessária para a feature
 * @param {import('.').FeatureFlagProps['use']} [props.use] 'any' (default) para qualquer um, 'both' se precisa
 * da query e da permissao, 'query' para considerar apenas a query e 'permission' para considerar apenas a permissao
 *
 * Considere trocar e utilizar o `useHistoryPushWithQuery` em vez do `history.push`
 * já que ele mantém as flags entre direcionamentos
 */
export function useFeatureFlag({
  flagName = 'dev',
  use = 'any',
} = {}) {
  const hasFlag = getFlag();
  const hasPermission = getPermission();

  // em caso de 'both', se verifica se tem permission e flag
  // 'any', 'query', 'permission' se verifica um ou outro
  // sendo que em casos de 'query', permission sempre será falso
  // e casos de 'permission', a flag sempre sera falso
  // como isso já é feito ao buscar cada um, ao usar "OR" (||) cobrimos os 3 outros casos.
  return (use === 'both' ? (hasPermission && hasFlag) : (hasPermission || hasFlag));

  function getFlag() {
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const flag = query.getAll('flag').includes(/** @type {string} */(flagName));

    // permission considera apenas permission, o que deixa esta flag falsa
    // outros casos, se verifica a flag
    return use !== 'permission' && flag;
  }

  function getPermission() {
    const permission = useVerifyPermission({
      ferramenta: 'FeatureFlags',
      permissoesRequeridas: /** @type {string} */ (flagName),
    });

    // query considera apenas query, o que deixa esta permission falsa
    // outros casos, se verifica a permission
    return use !== 'query' && permission;
  }
}
