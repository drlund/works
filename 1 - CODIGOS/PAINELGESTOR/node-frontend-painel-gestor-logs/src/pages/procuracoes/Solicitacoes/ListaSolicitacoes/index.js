import {
  Col,
  Divider,
  Empty,
  List,
  message,
} from 'antd';
import React, { useEffect, useState } from 'react';

import { useSpinning } from '@/components/SpinningContext';
import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';

import { SolicitacoesEditar } from '../../innerComponents/AcordeaoProcuracoes/ItemAcordeaoPesquisa/columns/Solicitacoes';
import { BlocoFunciOutorgado } from './BlocoFunciOutorgado';
import { BlocoFunciRegistro } from './BlocoFunciRegistro';
import { CancelarPedido } from './CancelarPedido';
import { ConfirmarPedido } from './ConfirmarPedido';
import { InfoProcuracaoPedido } from './InfoProcuracaoPedido';
import { SolicitacaoObservacao } from './SolicitacaoObservacao';
import { SolicitacaoPedido } from './SolicitacaoPedido';
import { isRevogacao, isRevogacaoDeParticular } from './isRevogacao';

export function ListaSolicitacoes() {
  const [lista, setLista] = useState(/** @type {Procuracoes.SolicitacoesLista.Pedido[]} */([]));
  const { loading, setLoading } = useSpinning();

  useEffect(() => {
    setLoading(true);
    fetch(FETCH_METHODS.GET, `procuracoes/solicitacoes`)
      .then(setLista)
      .catch(() => message.error('Erro ao carregar lista de solicitações.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCallback = (/** @type {number} */ id) => () => {
    setLista((l) => l.filter((i) => i.id !== id));
  };

  const styleBase = /** @type {React.CSSProperties} */({
    border: '1px solid lightgray',
    padding: '2em',
    borderRadius: '1em',
    marginBottom: '1em',
    boxShadow: 'rgba(0, 0, 0, 0.15) 8px 8px 8px 0px',
  });

  return (
    <Col span={24} style={{ minHeight: '20vh', width: '100%' }}>
      {
        (lista.length === 0)
          ? (
            <Empty
              description={loading ? 'Carregando...' : 'Nenhuma solicitação encontrada.'}
              style={styleBase}
            />
          )
          : (
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                pageSize: 5,
                hideOnSinglePage: true,
              }}
              dataSource={lista}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  // por list item, pega outros items
                  data-testid='solicitacao-item'
                  actions={[
                    <ConfirmarPedido
                      key='confirmar'
                      handleCallback={handleCallback(item.id)}
                      id={item.id}
                      isRevogacaoParticular={isRevogacaoDeParticular(item)}
                    />,
                    <SolicitacoesEditar
                      key='editar'
                      idProcuracao={item.procuracao.id}
                      idPedido={item.id}
                      items={item.solicitacaoItems}
                      handleCallback={handleCallback(item.id)}
                    />,
                    <CancelarPedido
                      key='cancelar'
                      handleCallback={handleCallback(item.id)}
                      id={item.id}
                    />,
                  ].filter(
                    // if revogacao, dont show editar
                    (_, i) => isRevogacao(item) ? i !== 1 : true
                  )}
                  extra={<InfoProcuracaoPedido procuracao={item.procuracao} />}
                  style={{
                    ...styleBase,
                    // pedidos de reevogação sempre vem sozinhos (apenas um item)
                    backgroundColor: revogacaoBgColor(item),
                  }}
                >
                  <BlocoFunciRegistro funciRegistro={item.funciRegistro} />

                  <BlocoFunciOutorgado outorgado={item.procuracao.outorgado} />

                  <SolicitacaoObservacao observacao={item.observacao} />

                  <SolicitacaoPedido item={item} />

                  <Divider />
                </List.Item>
              )}
            />
          )
      }
    </Col>
  );
}

function revogacaoBgColor(/** @type {Procuracoes.SolicitacoesLista.Pedido} */ item) {
  if (isRevogacaoDeParticular(item)) {
    return '#ffbaba';
  }

  return isRevogacao(item) ? '#fff5f5' : 'white';
}
