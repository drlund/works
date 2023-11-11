import { Button, Popconfirm } from 'antd';
import React from 'react';

/**
 * @param {{
 *  cart: import('./SolicitacoesBase').SolicitacaoCart,
 *  handleCancel: () => void,
 *  handleConfirm: () => Promise<void>,
 *  observacaoError: boolean,
 *  solicitacaoType: import('./SolicitacoesBase').SolicitacaoType,
 * }} props
 */
export function ModalFooter({
  cart, handleConfirm, handleCancel, observacaoError, solicitacaoType,
}) {
  const manifestoTotal = cart.manifesto.length;
  const copiaTotal = cart.copia.length;
  const totalItems = manifestoTotal + copiaTotal;

  const disableConfirm = totalItems === 0 || observacaoError;

  const itemsText = new Intl.PluralRules('pt-br').select(totalItems) === 'one' ? 'item' : 'itens';

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', flexGrow: 1, gap: '1em', alignItems: 'center' }}>
        <div>Certidões: {manifestoTotal}</div>
        <div>Cópias: {copiaTotal}</div>
      </div>
      <div style={{ display: 'flex', gap: '0.5em', justifyContent: 'space-between' }}>
        <Button
          type="default"
          onClick={handleCancel}>
          Cancelar
        </Button>
        <Popconfirm
          title={`Confirma ${solicitacaoType === 'nova' ? 'este pedido' : 'esta alteração'}?`}
          onConfirm={handleConfirm}
          okText="Sim"
          cancelText="Não"
          disabled={disableConfirm}
        >
          <Button
            type="primary"
            disabled={disableConfirm}
          >
            {`Confirmar ${totalItems} ${itemsText}`}
          </Button>
        </Popconfirm>
      </div>
    </div>
  );
}
