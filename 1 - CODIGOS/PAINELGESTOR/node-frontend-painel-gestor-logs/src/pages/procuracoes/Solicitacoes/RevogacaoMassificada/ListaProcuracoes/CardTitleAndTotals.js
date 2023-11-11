import { Divider } from 'antd';
import { isFunciLoading } from './isFunciLoading';
import { isFunciError } from './isFunciError';

/**
 * @param {{ source: import('..').Pesquisa[] }} props
 */
export function CardTitleAndTotals({ source }) {
  const isLoading = source?.filter((o) => isFunciLoading(o)).length;
  const hasError = source?.filter((o) => isFunciError(o)).length;

  return <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <h3 style={{ margin: 0 }}>Procurações</h3>
    {(source.length > 0) && (
      <div>
        <span>Total: {source.length}</span>
        <Divider type='vertical' />
        <span style={{ color: 'green' }}>Ok: {source.length - hasError - isLoading}</span>
        {(hasError > 0) && (
          <>
            <Divider type='vertical' />
            <span style={{ color: 'red' }}>Erro: {hasError}</span>
          </>
        )}
      </div>
    )}
  </div>;
}
