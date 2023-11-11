import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const PesquisaContext = createContext(/** @type {{ prefixosComAcessoEspecial: string[]}} */(null));

/**
 * @param {{
 *  children: React.ReactNode
 * }} props
 */
export function PesquisasContext({
  children,
}) {
  const [prefixosComAcessoEspecial, setPrefixosComAcessoEspecial] = useState(/** @type {string[]} */(null));

  const contextValue = useMemo(() => ({ prefixosComAcessoEspecial }), [prefixosComAcessoEspecial]);

  useEffect(() => {
    fetch(FETCH_METHODS.GET, 'procuracoes/gerenciar/acessos').then(setPrefixosComAcessoEspecial);
  }, []);

  return (
    <PesquisaContext.Provider value={contextValue}>
      {children}
    </PesquisaContext.Provider>
  );
}

export function usePesquisa() {
  return useContext(PesquisaContext);
}
