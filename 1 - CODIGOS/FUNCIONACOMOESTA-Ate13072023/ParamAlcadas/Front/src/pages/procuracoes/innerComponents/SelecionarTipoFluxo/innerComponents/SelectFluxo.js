import { message, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import uuid from 'uuid/v4';

import { useSpinning } from 'components/SpinningContext';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import { fetch, FETCH_METHODS } from 'services/apis/GenericFetch';

import { useCadastroProcuracao } from '../../../contexts/ProcuracoesContext';
import { fluxosProcessos, verificarProcesso } from '../helpers/fluxosProcessos';

const { Option } = Select;

/**
 * @typedef {Procuracoes.Fluxo & { idFluxo: string }} FluxoSelecionado
 */

export function useSelectFluxo() {
  const [fluxoSelecionado, setFluxoSelecionando] = useState(/** @type {FluxoSelecionado} */(null));
  const [dadosMinuta, setDadosMinuta] = useState(/** @type {Partial<Procuracoes.DadosMinuta>} */({}));
  const { fluxos, fluxoProcesso } = useCadastroProcuracao();
  const { prefixo: prefixoUser } = useUsuarioLogado();
  const { setLoading } = useSpinning();

  verificarProcesso(fluxoProcesso);

  useEffect(() => {
    if (
      [fluxosProcessos.minuta, fluxosProcessos.massificadoMinuta].includes(fluxoProcesso)
      && fluxoSelecionado !== null
    ) {
      setLoading(true);
      fetch(FETCH_METHODS.GET, `procuracoes/minutas/template/${fluxoSelecionado.idFluxo}`)
        .then((dados) => {
          setDadosMinuta({
            ...dados,
          });

          resetMinuta();
        })
        .catch(message.error)
        .finally(() => setLoading(false));
    }
  }, [fluxoProcesso, fluxoSelecionado]);

  const resetMinuta = () => {
    // @ts-ignore
    setDadosMinuta((dm) => ({
      ...dm,
      idMinuta: uuid(),
      customData: {
        cartorio: {
          monthToday: Intl.DateTimeFormat('pt-br', { month: 'long' }).format(new Date()),
          dayToday: new Date().getDate(),
          yearToday: new Date().getFullYear(),
        },
      }
    }));
  };

  return {
    fluxoSelecionado,
    dadosMinuta,
    resetMinuta,
    SelectFluxo: () => (
      <Select
        value={fluxoSelecionado?.idFluxo}
        onChange={(key) => setFluxoSelecionando({
          idFluxo: key,
          ...fluxos[key]
        })}
        style={{ width: '100%' }}
      >
        {fluxos && Object.entries(fluxos)
          .filter(([, { visibilidade }]) => {
            if (!visibilidade) {
              return true;
            }
            return visibilidade.includes(prefixoUser)
              || String(prefixoUser) === String(visibilidade);
          })
          .filter(([, { fluxo }]) => {
            if (fluxoProcesso === fluxosProcessos.minuta) {
              return fluxo !== "SUBSIDIARIA";
            }

            if ([
              fluxosProcessos.massificadoMinuta,
              fluxosProcessos.massificadoCadastro
            ].includes(fluxoProcesso)) {
              return fluxo === "PUBLICA";
            }

            return true;
          })
          .map(([key, { minuta }]) => (
            <Option key={key} value={key}>
              {minuta}
            </Option>
          ))}
      </Select>
    ),
  };
}
