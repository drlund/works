import useUsuarioLogado from '@/hooks/useUsuarioLogado';
import { message } from 'antd';
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const PesquisaContext = createContext(/** @type {{ prefixosComAcessoEspecial: string[], acessoGerenciar: boolean }} */(null));

/**
 * @param {{
 *  children: React.ReactNode
 * }} props
 */
export function PesquisasContext({
  children,
}) {
  const [prefixosComAcessoEspecial, setPrefixosComAcessoEspecial] = useState(/** @type {string[]} */(null));
  const funci = useUsuarioLogado();

  const acessoGerenciar = prefixosComAcessoEspecial?.some((p) => Number(p) === Number(funci.prefixo));

  const contextValue = useMemo(() => ({ prefixosComAcessoEspecial, acessoGerenciar }), [prefixosComAcessoEspecial]);

  useEffect(() => {
    fetch(FETCH_METHODS.GET, 'procuracoes/gerenciar/acessos')
      .then(setPrefixosComAcessoEspecial)
      .catch(() => {
        message.error('Não foi possível carregar os prefixos com acesso especial.');
      });
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
