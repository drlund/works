import React, {
  useCallback,
  useMemo
} from 'react';
import { useCadastroProcuracao } from '../../contexts/ProcuracoesContext';
import { matriculaParcialRegex } from '../shared/matriculaParcialRegex';
import { TableMinutas } from './TableMinutas';

/**
 * @param {{
 *  activeData: import('./useListaMinutasCall').DataMapType,
 *  activePanel: string,
 *  getListaMinutas: ({ matricula, prefixo }:{ matricula?: string; prefixo?: string;}) => Promise<void>,
 *  showMassificado: boolean,
 * }} props
 */
export function useTabItems({ activeData, activePanel, getListaMinutas, showMassificado }) {
  const { fluxos } = useCadastroProcuracao();

  const Tab = useCallback(() => {
    if (/** @type {{error: string}} */ (activeData)?.error) {
      return (
        <TableMinutas
          error={/** @type {{error: string}} */ (activeData).error}
        />
      );
    }

    return (
      <TableMinutas
        fluxos={fluxos}
        source={/** @type {import('./useListaMinutasCall').MinutaLista} */ (activeData)}
        showMassificado={showMassificado}
      />
    );
  }, [fluxos, activeData, showMassificado]);

  return useMemo(() => ([
    {
      label: 'Meu Prefixo',
      key: "0",
      children: <Tab key={0} />
    },
    {
      label: 'Consultar por Matrícula',
      key: "1",
      children: <Tab key={1} />,
      placeholder: 'pesquisar por matrícula',
      /** @type {(matricula: string) => ReturnType<getListaMinutas>} */
      onSearch: (matricula) => getListaMinutas({ matricula }),
      /** @param {string} matricula */
      validator: (matricula) => matriculaParcialRegex.test(matricula),
    },
    {
      label: 'Consultar por Prefixo',
      key: "2",
      children: <Tab key={2} />,
      placeholder: 'pesquisar por prefixo',
      /** @type {(prefixo: string) => ReturnType<getListaMinutas>} */
      onSearch: (prefixo) => getListaMinutas({ prefixo }),
      /** @param {string} prefixo */
      validator: (prefixo) => /^\d{0,4}$/.test(prefixo)
    },
  ]), [activeData, activePanel, showMassificado]);
}
