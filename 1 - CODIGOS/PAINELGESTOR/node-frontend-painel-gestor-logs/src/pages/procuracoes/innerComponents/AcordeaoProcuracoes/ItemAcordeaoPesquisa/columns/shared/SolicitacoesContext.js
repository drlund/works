import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';


/**
 * @typedef {Object} SolicitacoesContext
 * @property {Record<number, {
 *  copia: number;
 *  manifesto: number;
 *  revogacao: boolean;
 *  pedido: boolean;
 * }>|null} solicitacoes lembrar de verificar porque pode ser null
 * @property {boolean} loading
 */

const Solicitacoes = createContext(/** @type {SolicitacoesContext} */({ solicitacoes: null, loading: false }));

/**
 * @param {{
 *  children: React.ReactNode,
 *  idProcuracao: number,
 *  idPedido?: number | null,
 * }} props
 */
export function SolicitacoesContext({ children, idProcuracao, idPedido = null }) {
  const [solicitacoes, setSolicitacoes] = useState(/** @type {SolicitacoesContext['solicitacoes']} */(null));
  const filter = idPedido ? ({ pedidoFilter: String(idPedido) }) : {};

  useEffect(() => {
    fetch(
      FETCH_METHODS.GET,
      `procuracoes/solicitacoes/${idProcuracao}`,
      filter
    )
      .then(setSolicitacoes)
      .catch(() => setSolicitacoes({}));
  }, [idProcuracao]);

  const values = useMemo(() => ({
    solicitacoes,
    loading: solicitacoes === null,
  }), [solicitacoes]);

  return (
    <Solicitacoes.Provider value={values}>
      {children}
    </Solicitacoes.Provider>
  );
}

export function useSolicitacoes() {
  return useContext(Solicitacoes);
}
