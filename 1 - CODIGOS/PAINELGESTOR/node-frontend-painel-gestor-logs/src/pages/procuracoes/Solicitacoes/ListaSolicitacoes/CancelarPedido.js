import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';
import { WarningTwoTone } from '@ant-design/icons';
import {
  Button,
  Input,
  Popover,
  message
} from 'antd';
import { useState } from 'react';

/**
 * @param {{
*  handleCallback: () => void,
*  id: number,
* }} props
*/
export function CancelarPedido({ handleCallback, id }) {
  const [open, setOpen] = useState(false);
  const [justificativa, setJustificativa] = useState(/** @type {string|null} */(null));

  const hide = () => {
    handleOpenChange(false);
  };

  const handleOpenChange = (/** @type {boolean} */ newOpen) => {
    setOpen(newOpen);
  };

  const handleConfirmarCancelar = () => {
    fetch(FETCH_METHODS.DELETE,
      `procuracoes/solicitacoes/pedido/${id}`,
      undefined,
      undefined,
      undefined,
      {
        data: {
          justificativa,
        },
      }
    )
      .then(() => {
        message.success('Pedido cancelado');
        handleCallback();
      })
      .catch(() => message.error('Erro ao cancelar pedido'));
  };

  const dirtyJustificativa = justificativa !== null;
  const validJustificativa = dirtyJustificativa && justificativa.length > 10;

  const content = (
    <>
      <div>
        <div>Justificativa do cancelamento:</div>
        <Input.TextArea
          onChange={(e) => setJustificativa(e.target.value)}
          onBlur={(e) => setJustificativa(e.target.value)}
          value={/** @type {string} */(justificativa)}
        />
        {
          (dirtyJustificativa && !validJustificativa)
          && <span style={{ color: 'red', fontSize: '0.8em' }}>O campo deve ter no mínimo 10 caracteres.</span>
        }
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1em' }}>
        <Button onClick={hide}>Cancelar</Button>
        <Button danger onClick={handleConfirmarCancelar} disabled={!validJustificativa}>Excluir pedido</Button>
      </div>
    </>
  );

  return (
    <Popover
      content={content}
      title={(
        <div>
          <WarningTwoTone twoToneColor="red" style={{ marginRight: '0.5em' }} />
          Confirma cancelamento do pedido?
        </div>
      )}
      trigger='click'
      open={open}
      onOpenChange={handleOpenChange}
      overlayStyle={{ minWidth: '30em' }}
    >
      <Button danger>Cancelar</Button>
    </Popover>
  );
}
