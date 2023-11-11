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

import { useCadastroProcuracao } from '@/pages/procuracoes/contexts/ProcuracoesContext';
import { getProfileURL } from '@/utils/Commons';
import { dateToBRTimezoneString } from '@/utils/dateToBRTimezoneString';

import { CardTitleAndTotals } from './CardTitleAndTotals';
import { isFunciError } from './isFunciError';
import { isFunciLoading } from './isFunciLoading';

/**
 * @param {{
 *  listas: import('..').ListaRevogacaoMassificada,
 *  handleRemove?: (matricula: string, idProcuracao: number) => void,
 * }} props
 */
export function ListaProcuracoes({ listas, handleRemove }) {
  const { fluxos } = useCadastroProcuracao();

  const fetching = /** @type {import('..').PesquisaLoading[]} */(
    Object
      .values(listas.fetchingMatriculas)
      .flat()
      .map((m) => ({ matricula: m, loading: true }))
  );
  const source = /** @type {import('..').Pesquisa[]} */([Object.values(listas.outorgados), fetching].flat(Infinity))
    .filter((p) => handleRemove ? true : !/** @type {import('..').PesquisaError} */(p).error);

  /**
   * sorting por matricula
   * no entanto deixando entradas com erro primeiro
   */
  source.sort((a, b) => {
    if (/** @type {import('..').PesquisaError} */ (a).error && !/** @type {import('..').PesquisaError} */ (b).error) {
      return -1;
    }
    if (!/** @type {import('..').PesquisaError} */ (a).error && /** @type {import('..').PesquisaError} */ (b).error) {
      return 1;
    }

    return (a.matricula < b.matricula) ? -1 : 1;
  });

  /**
   * @param {import('..').PesquisaOk} props
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
          () => <Empty style={{ marginTop: '5em' }} description="Nenhuma procuração ainda..." />
        }
      >
        <StyledList
          itemLayout="horizontal"
          dataSource={source}
          rowKey={(item) => item.matricula + /** @type {import('..').PesquisaOk} */(item).idProcuracao}
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
                    onClick={() => handleRemove(item.matricula, /** @type {import('..').PesquisaOk} */(item).idProcuracao)}
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
                        src={getProfileURL(item.matricula)}
                        alt={/** @type {import('..').PesquisaOk} */(item).nome || `Funci ${item.matricula}`}
                      />
                    }
                    title={
                      <span style={{ color: isFunciError(item) ? 'red' : undefined }}>
                        {`${item.matricula.toUpperCase()}${maybeNome(/** @type {import('..').PesquisaOk} */(item))}`}
                      </span>
                    }
                    description={
                      isFunciError(item)
                        ? <span style={{ color: 'red' }}>{item.error}</span>
                        : (
                          <div>
                            <div>
                              {`Tipo: ${fluxos?.[item.idFluxo]?.minuta || 'Minuta não encontrada.'}`}
                            </div>
                            <div>
                              {`Emissão: ${dateToBRTimezoneString(item.dataEmissao)} - Vencimento: ${dateToBRTimezoneString(item.dataVencimento)}`}
                            </div>
                          </div>
                        )
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

const StyledList = styled(/** @type {typeof List<import('..').Pesquisa>} */(List))`
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
