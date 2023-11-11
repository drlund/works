import { FileAddOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Button, Divider } from 'antd';
import styled from 'styled-components';

import CardSecao from 'components/CardSecao';
import { useHistoryPushWithQuery } from 'hooks/useHistoryPushWithQuery';

import { PermissionGuard } from 'components/PermissionGuard';
import ProcuracoesContext from '../contexts/ProcuracoesContext';
import { useProcuracoesMassificado } from '../hooks/useProcuracoesMassificado';
import { fluxosProcessos } from '../innerComponents/SelecionarTipoFluxo/helpers/fluxosProcessos';
import { ListaDeMassificado } from './innerComponents/ListaDeMassificado';


function Massificado() {
  const historyPush = useHistoryPushWithQuery();
  const massificadoPermission = useProcuracoesMassificado();

  return <PermissionGuard
    guard={massificadoPermission}
  >
    <div style={{ display: 'flex', justifyContent: 'left', gap: '1em' }}>
      <MassificadoButton
        // @ts-ignore
        type="button"
        onClick={() => historyPush(`/procuracoes/massificado/minuta`)}
      >
        <FileDoneOutlined className="icon" />
        <div>Minuta Massificada</div>
      </MassificadoButton>
      <MassificadoButton
        // @ts-ignore
        type="button"
        onClick={() => historyPush(`/procuracoes/massificado/cadastro`)}
        disabled
      >
        <FileAddOutlined className="icon" />
        <div>Cadastro Massificado</div>
      </MassificadoButton>
    </div>
    <div style={{ marginTop: '4em' }}>
      <Divider />
      <CardSecao
        title='Lista de Massificados'
        headStyle={{ backgroundColor: '#f0f0f5' }}
        bodyStyle={{ backgroundColor: '#fafaff' }}
      >
        <ListaDeMassificado />
      </CardSecao>
    </div>
  </PermissionGuard>;
}

export default () => (
  <ProcuracoesContext
    fluxoProcesso={fluxosProcessos.massificadoMinuta}
  >
    <Massificado />
  </ProcuracoesContext>
);

const MassificadoButton = styled(Button)`
  border-radius: 0.5rem;
  align-items: center;
  cursor: pointer;
  display: flex;
  flex-flow: column;
  font-size: 16px;
  height: 200px;
  justify-content: center;
  margin: 10px;
  padding: 10px 24px;
  text-align: center;
  min-width: 280px;
  border: 0;
  background-color: #f0f0f5;

  &:hover {
    background-color: #1890ff;
    color: white;
    transition-duration: 300ms;
    transition-property: background-color;
  }

  & .icon {
    font-size: 45px;
    margin-bottom: 20px;
    min-height: 50px;
  }
`;
