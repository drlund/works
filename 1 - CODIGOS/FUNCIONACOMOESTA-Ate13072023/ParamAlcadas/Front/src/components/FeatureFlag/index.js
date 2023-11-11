import PageNotFound from 'pages/errors/PageNotFound';
import { FeatureFlagContext, useFeatureFlagContext } from './FeatureFlagContext';


/**
 * @typedef {Object} FeatureFlagProps
 * @property {import('react').ReactNode} children
 * @property {import('react').ReactNode} [fallback] componente a ser renderizado em caso de não permissão, default pra 404 page
 * @property {'dev'| Omit<string, 'dev'>} [flagName='dev'] nome da flag necessária, defaulta para 'dev',
 * por padrão procura ou permissão ou query parameter (passar como '?flag=flagName')
 * @property {'query'|'permission'|'both'|'any'} [use='any'] 'any' (default) if anything goes,
 * 'both' if both are needed, 'permission' for only permission needed, 'query' for only query needed
 */

/**
 * @param {Pick<FeatureFlagProps, 'children' | 'fallback'>} props
 * If already inside a FeatureFlagContext, then you can use
 */
export function FeatureFlagComponent({
  children,
  fallback = <PageNotFound />,
}) {
  const flagActive = useFeatureFlagContext();

  if (flagActive) {
    return /** @type {JSX.Element} */ (children);
  }

  return /** @type {JSX.Element} */ (fallback);
}


/**
 * @param {FeatureFlagProps} props
 */
export function FeatureFlag({
  children,
  fallback,
  flagName = 'dev',
  use = 'any'
}) {
  return (
    <FeatureFlagContext
      flagName={flagName}
      use={use}
    >
      <FeatureFlagComponent fallback={fallback}>
        {children}
      </FeatureFlagComponent>
    </FeatureFlagContext>
  );
}
