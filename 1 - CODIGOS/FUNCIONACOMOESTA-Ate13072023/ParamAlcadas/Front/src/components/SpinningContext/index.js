import { BBSpinning } from 'components/BBSpinning/BBSpinning';
import React, {
  createContext, useCallback, useContext, useMemo, useState
} from 'react';

export const LoadingContext = createContext(/**
* @type {{
*  loading: boolean,
*  setLoading: React.Dispatch<React.SetStateAction<boolean>>
* }}
*/ (null));
LoadingContext.displayName = 'SpinningContext';

/**
 * Context para mostrar o spinning de carregamento.
 *
 * Use o `useSpinning` para obter o contexto.
 *
 * @param {{children: React.ReactNode}} props
 */
export function SpinningContext({ children }) {
  const [loading, setLoading] = useState(false);

  const memoSetLoading = useCallback(setLoading, []);

  const contextValues = useMemo(() => ({
    loading,
    setLoading: memoSetLoading
  }), [loading]);

  return (
    <LoadingContext.Provider value={contextValues}>
      <BBSpinning spinning={loading}>
        {children}
      </BBSpinning>
    </LoadingContext.Provider>
  );
}

/**
 * Hook para obter o contexto do `SpinningContext`.
 */
export function useSpinning() {
  return useContext(LoadingContext);
}
