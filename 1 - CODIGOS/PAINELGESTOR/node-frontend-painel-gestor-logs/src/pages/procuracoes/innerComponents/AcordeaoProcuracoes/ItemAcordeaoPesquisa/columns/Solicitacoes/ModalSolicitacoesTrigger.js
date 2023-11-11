import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';

/**
 * @typedef {{
 *  onClick: () => void,
 *  disabled: boolean,
 *  loading: boolean,
 * }} ModalTriggerProps
 */

/**
 * @param {ModalTriggerProps} props
 */
export function PesquisaSolicitacoesTrigger({
  onClick,
  disabled,
  loading,
}) {
  return (
    <Button
      size="small"
      type="primary"
      ghost
      disabled={disabled}
      loading={loading}
      style={{ backgroundColor: 'white' }}
      icon={<ShoppingCartOutlined />}
      onClick={onClick}
    >
      Solicitações
    </Button>
  );
}

/**
 * @param {ModalTriggerProps & { label?: string, ghost?: boolean }} props
 */
export function EditarSolicitacoesTrigger({
  onClick,
  disabled,
  loading,
  label = 'Editar e Confirmar Pedido',
  ghost = false,
}) {
  return (
    <Button
      type="primary"
      ghost={ghost}
      disabled={disabled}
      loading={loading}
      style={ghost ? { backgroundColor: 'white' } : {}}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
