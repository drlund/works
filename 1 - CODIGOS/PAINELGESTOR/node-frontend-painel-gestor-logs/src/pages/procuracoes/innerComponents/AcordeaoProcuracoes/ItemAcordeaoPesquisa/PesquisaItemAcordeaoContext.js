import { createContext, useContext } from 'react';

const PesquisaItemAcordeaoContext = createContext(/** @type {Procuracoes.Outorgante} */(/** @type {unknown} */(null)));

/**
 * @param {{
 *  children: React.ReactNode,
 *  outorgado: Procuracoes.Outorgante,
 * }} props
*/
export function PesquisaItemAcordeaoContextWrapper({
  children,
  outorgado,
}) {
  return <PesquisaItemAcordeaoContext.Provider value={outorgado}>
    {children}
  </PesquisaItemAcordeaoContext.Provider>;
}


export function usePesquisaItemAcordeaoContext() {
  return useContext(PesquisaItemAcordeaoContext);
}
