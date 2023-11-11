import {
  Avatar,
  Button,
  Card,
  ConfigProvider,
  Empty,
  List,
  Skeleton
} from 'antd';
import styled from 'styled-components';

import { getProfileURL } from '@/utils/Commons';

import { usePeopleCost } from '../../PeopleCostContext';
import { CardTitleAndTotals } from './CardTitleAndTotals';
import { isFunciError } from './isFunciError';
import { isFunciLoading } from './isFunciLoading';
import { ListaItem } from './ListaItem';

/**
 * @param {{
 *  handleRemove?: (email: string) => void,
 * }} props
 */
export function ListaPorEmail({ handleRemove }) {
  const { source } = usePeopleCost();

  /**
   * @param {PeopleCost.PesquisaOk} props
   */
  const maybeNome = ({ nome }) => (nome) ? ` - ${nome}` : '';

  return (
    <Card
      type="inner"
      title={<CardTitleAndTotals />}
      style={{ height: '100%' }}
      bodyStyle={{ padding: 0 }}
    >
      <ConfigProvider
        renderEmpty={
          () => <Empty style={{ marginTop: '5em' }} description="Nenhum funci ainda..." />
        }
      >
        <StyledList
          itemLayout="horizontal"
          dataSource={source}
          rowKey={(item) => item.email + /** @type {PeopleCost.PesquisaLoading} */(item).loading}
          renderItem={(item) => (
            <List.Item
              actions={[
                handleRemove ? (
                  <Button
                    key='remover'
                    type='dashed'
                    danger
                    size='small'
                    disabled={isFunciLoading(item)}
                    onClick={() => handleRemove(item.email)}
                  >
                    Remover
                  </Button>
                ) : null
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
                      <Avatar
                        src={getProfileURL(/** @type {PeopleCost.PesquisaOk} */(item).matricula)}
                        alt={/** @type {PeopleCost.PesquisaOk} */(item).nome || `Funci ${item.email}`}
                      />
                    }
                    title={
                      <span style={{ color: isFunciError(item) ? 'red' : undefined }}>
                        {`${item.email.toLowerCase()}${maybeNome(/** @type {PeopleCost.PesquisaOk} */(item))}`}
                      </span>
                    }
                    description={
                      isFunciError(item)
                        ? <span style={{ color: 'red' }}>{item.error}</span>
                        : <ListaItem item={item} />
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

const StyledList = styled(/** @type {typeof List<PeopleCost.Pesquisa>} */(List))`
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
