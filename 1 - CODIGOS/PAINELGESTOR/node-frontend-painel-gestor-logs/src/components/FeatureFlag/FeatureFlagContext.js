import React, {
  createContext,
  useContext
} from 'react';
import { useFeatureFlag } from './FeatureFlagHook';

const FlagContext = createContext(false);

/**
 * @param {Omit<import('.').FeatureFlagProps, 'fallback'>} props
 */
export function FeatureFlagContext({
  children,
  flagName = 'dev',
  use = 'any'
}) {
  const flagActive = useFeatureFlag({ flagName, use });

  return (
    <FlagContext.Provider value={flagActive}>
      {children}
    </FlagContext.Provider>
  );
}

/**
 * If it always returns false, you might be outside of the context scope.
 */
export function useFeatureFlagContext() {
  return useContext(FlagContext);
}
