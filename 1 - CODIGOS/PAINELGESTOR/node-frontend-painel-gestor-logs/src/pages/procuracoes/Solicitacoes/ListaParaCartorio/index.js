import { Col } from 'antd';
import React, { useEffect, useState } from 'react';

import { useSpinning } from '@/components/SpinningContext';
import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';

import { useCartorios } from '../../contexts/CartorioContext';
import { EmailParaEnvio } from './EmailParaEnvio';
import { CartorioNaoAchado } from './CartorioNaoAchado';
import { StyledEmpty } from '../StyledEmpty';

export function ListaParaCartorio() {
  const [lista, setLista] = useState(/** @type {Procuracoes.SolicitacoesListaCartorio.ListaReturn|null} */(null));
  const [error, setError] = useState(false);
  const { lista: listaCartorios, shouldLoading } = useCartorios();
  const { setLoading } = useSpinning();

  useEffect(() => {
    const shouldSpin = shouldLoading
      || (lista === null && error === false);

    setLoading(shouldSpin);
  }, [shouldLoading, lista, error]);

  useEffect(() => {
    fetch(FETCH_METHODS.GET, '/procuracoes/solicitacoes/cartorio')
      .then(setLista)
      .catch(setError);
  }, []);

  if (error || (listaCartorios === null && !shouldLoading)) {
    return (
      <StyledEmpty
        description={
          listaCartorios === null
            ? "Erro ao recuperar lista de cartórios"
            : "Erro ao recuperar lista de solicitações"
        }
      />
    );
  }

  if (lista === null || listaCartorios === null) {
    return (
      <StyledEmpty
        description="Carregando solicitações para envio..."
      />
    );
  }

  const toArray = Object.entries(lista);

  if (toArray.length === 0) {
    return (
      <StyledEmpty
        description="Nenhuma solicitação pendente."
      />
    );
  }

  const handleConfirmarEnvioCB = (/** @type {number} */ cartorio) => () => setLista((old) => {
    Reflect.deleteProperty(/** @type {NonNullable<typeof old>} */(old), cartorio);
    return { ...old };
  });

  return (
    <Col span={24} style={{ display: 'flex', gap: '1em', flexDirection: 'column' }}>
      {
        toArray.map(([cartorioId, data]) => {
          const idCartorio = Number(cartorioId);
          const nomeCartorio = listaCartorios.find((c) => c.id === idCartorio)?.nome;

          if (!nomeCartorio) {
            return (
              <CartorioNaoAchado
                key={cartorioId}
                cartorioId={cartorioId}
                data={data}
              />
            );
          }

          return (
            <EmailParaEnvio
              key={cartorioId}
              cartorio={nomeCartorio}
              envelopes={data.envelopes}
              items={data.items}
              cbEnviado={handleConfirmarEnvioCB(idCartorio)}
            />
          );
        })
      }
    </Col>
  );
}
