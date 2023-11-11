import {
  Avatar,
  Button,
  Card,
  ConfigProvider,
  Empty,
  List,
  Skeleton
} from 'antd';
import React from 'react';
import styled from 'styled-components';
import { getProfileURL } from 'utils/Commons';
import { CardTitleAndTotals } from './CardTitleAndTotals';
import { isFunciError } from './isFunciError';
import { isFunciLoading } from './isFunciLoading';

/**
 * @typedef {{matricula: string; loading: true;}} FunciLoading
 * @typedef {Procuracoes.FetchedFunci | FunciLoading} FunciListaOutorgados
 */

/**
 * @param {{
 *  listas: Procuracoes.DadosProcuracao['outorgadoMassificado'],
 *  handleRemove: (matricula: string) => void,
 * }} props
 */
export function ListaOutorgados({ listas, handleRemove }) {
  const source = listas.listaDeMatriculas?.map((m) =>
    listas.outorgados[m] || /** @type {FunciLoading} */ ({ matricula: m, loading: true })
  ) ?? [];

  /**
   * sorting por matricula
   * no entanto deixando entradas com erro primeiro
   */
  source.sort((a, b) => {
    if (/** @type {Procuracoes.FunciError} */ (a).error && !/** @type {Procuracoes.FunciError} */ (b).error) {
      return -1;
    }
    if (!/** @type {Procuracoes.FunciError} */ (a).error && /** @type {Procuracoes.FunciError} */ (b).error) {
      return 1;
    }

    return (a.matricula < b.matricula) ? -1 : 1;
  });

  /**
   * @param {Procuracoes.FetchedFunci} props
   */
  const maybeNome = ({ nome }) => (nome) ? ` - ${nome}` : '';

  return (
    <Card
      type="inner"
      title={<CardTitleAndTotals source={source} />}
      style={{ height: '100%' }}
      bodyStyle={{ padding: 0 }}
    >
      <ConfigProvider
        renderEmpty={
          () => <Empty style={{ marginTop: '5em' }} description="Nenhum outorgado ainda..." />
        }
      >
        <StyledList
          itemLayout="horizontal"
          dataSource={source}
          rowKey='matricula'
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  key='remover'
                  type='dashed'
                  danger
                  size='small'
                  disabled={isFunciLoading(item)}
                  onClick={() => handleRemove(item.matricula)}
                >Remover</Button>
              ]}
            >
              <Skeleton
                active
                avatar
                title={false}
                loading={isFunciLoading(item)}
              >
                {(!isFunciLoading(item)) && (
                  <List.Item.Meta
                    avatar={
                      <Avatar src={getProfileURL(item.matricula)} alt={item.nome || `Funci ${item.matricula}`} />
                    }
                    title={
                      <span style={{ color: isFunciError(item) ? 'red' : undefined }}>
                        {`${item.matricula.toUpperCase()}${maybeNome(item)}`}
                      </span>
                    }
                    description={
                      isFunciError(item)
                        ? <span style={{ color: 'red' }}>{item.error}</span>
                        : `${item.prefixoLotacao} - ${item.dependencia?.municipio}/${item.dependencia?.uf}`
                    }
                  />
                )}
              </Skeleton>
            </List.Item>
          )}
        />
      </ConfigProvider>
    </Card>
  );
}

const StyledList = styled(/** @type {typeof List<FunciListaOutorgados>} */(List))`
  ul.ant-list-items {
    li.ant-list-item {
      padding: 0.5em 1em;

      .ant-list-item-meta {
        align-items: center;
      }

      &:nth-child(even) {
        background-color: #f5f5f580;
      }
    }
  }
`;
