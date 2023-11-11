import { WarningTwoTone } from '@ant-design/icons';
import {
  Button,
  Popconfirm,
  message
} from 'antd';

import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';

/**
 * @param {{
 *  handleCallback: () => void,
 *  id: number,
 *  isRevogacaoParticular?: boolean
 * }} props
 */
export function ConfirmarPedido({ handleCallback, id, isRevogacaoParticular = false }) {
  const handleConfirmar = () => fetch(
    FETCH_METHODS.PATCH,
    `procuracoes/solicitacoes/pedido/${id}`,
    { isRevogacaoParticular },
  )
    .then(() => {
      message.success('Pedido confirmado com sucesso');
      handleCallback();
    })
    .catch(() => message.error('Erro ao confirmar pedido'));

  if (isRevogacaoParticular) {
    return (
      <Popconfirm
        icon={<WarningTwoTone twoToneColor='red' />}
        title="Revogar Procuração Particular?"
        onConfirm={handleConfirmar}
        okText="Confirmar"
        cancelText="Cancelar"
      >
        <Button type="primary">Revogar Procuração Particular</Button>
      </Popconfirm>
    );
  }

  return (
    <Popconfirm
      title="Confirma este pedido?"
      onConfirm={handleConfirmar}
      okText="Confirmar"
      cancelText="Cancelar"
    >
      <Button type="primary">Confirmar</Button>
    </Popconfirm>
  );
}
