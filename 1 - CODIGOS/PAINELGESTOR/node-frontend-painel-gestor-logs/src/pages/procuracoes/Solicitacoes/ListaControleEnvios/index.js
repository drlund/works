import { Col, List } from 'antd';
import { useEffect, useState } from 'react';

import { useSpinning } from '@/components/SpinningContext';
import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';

import { useCartorios } from '../../contexts/CartorioContext';
import { StyledEmpty } from '../StyledEmpty';
import { ListaControleItem } from './ListaControleItem';

export function ListaControleEnvios() {
  const [lista, setLista] = useState(/** @type {Procuracoes.SolicitacoesListaControle.ListaControle[]|null} */(null));
  const [error, setError] = useState(false);
  const { setLoading } = useSpinning();
  const { lista: listaCartorios, shouldLoading } = useCartorios();

  useEffect(() => {
    const shouldSpin = shouldLoading
      || (lista === null && error === false);

    setLoading(shouldSpin);
  }, [shouldLoading, lista, error]);

  useEffect(() => {
    fetch(FETCH_METHODS.GET, '/procuracoes/solicitacoes/controle')
      .then(setLista)
      .catch(setError);
  }, []);

  if (error || (listaCartorios === null && !shouldLoading)) {
    return (
      <StyledEmpty
        description={
          listaCartorios === null
            ? "Erro ao recuperar lista de cartórios"
            : "Erro ao recuperar lista dos envios"
        }
      />
    );
  }


  if (lista === null || listaCartorios === null || lista.length === 0) {
    return (
      <StyledEmpty
        description={lista === null
          ? "Carregando solicitações enviadas..."
          : "Nenhuma solicitação pendente."
        }
      />
    );
  }

  const handleCallback = (/** @type {number} */ id) => (/** @type {() => void} */ modalCb) => {
    setLista((old) =>
      /** @type {NonNullable<typeof old>} */(old).filter((s) => s.id !== id)
    );

    modalCb();
  };

  return (
    <Col span={24} style={{ display: 'flex', gap: '1em', flexDirection: 'column' }}>
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        dataSource={lista}
        rowKey='id'
        renderItem={(item) => (
          <ListaControleItem
            item={item}
            handleCallback={handleCallback(item.id)}
          />
        )}
      />
    </Col>
  );
}
