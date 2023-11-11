import { Button, Card, Popconfirm, message } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';
import { useCreateEmailTemplate } from './useCreateEmailTemplate';

/**
 * @param {{
 *  cartorio: string,
 *  cbEnviado: () => void,
 * } & Procuracoes.SolicitacoesListaCartorio.ListaReturn[number]} props
*/
export function EmailParaEnvio({ cartorio, envelopes, items, cbEnviado }) {
  const { CopyButton, template } = useCreateEmailTemplate(envelopes);
  const [show, setShow] = useState(false);
  const [wasCopied, setWasCopied] = useState(false);

  const itemsText = new Intl.PluralRules('pt-br').select(items.length) === 'one' ? 'item' : 'itens';

  const handleConfirmarEnvio = () => {
    fetch(FETCH_METHODS.POST, `/procuracoes/solicitacoes/envio-cartorio`, {
      items
    })
      .then(() => {
        message.success('Envio realizado com sucesso!');
        cbEnviado();
      }).catch(() => {
        message.error('Erro ao confirmar envio!');
      });
  };

  return (
    <HideableCard
      title={`Para: ${cartorio}`}
      extra={(
        <div style={{ display: 'flex', gap: '1em', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '1.2em' }}>{`Total: ${items.length} ${itemsText}`}</span>

          <div style={{ display: 'flex', gap: '1em' }}>
            <CopyButton
              cb={() => setWasCopied(true)}
            />
            <Popconfirm
              title="Confirma?"
              okText="Sim"
              cancelText="Não"
              onConfirm={handleConfirmarEnvio}
              disabled={!wasCopied}
            >
              <Button
                type='ghost'
                disabled={!wasCopied}
              >
                Confirmar Envio
              </Button>
            </Popconfirm>
          </div>

          <Button
            onClick={() => setShow(s => !s)}
          >
            {show ? 'Esconder Email' : 'Ver Email'}
          </Button>
        </div>
      )}
      style={{ width: '100%' }}
      show={show ? true : undefined}
    >
      {template}
    </HideableCard>
  );
}

const HideableCard = /** @type {import('styled-components').ThemedStyledFunction<Card, any, { show?: boolean}>} */(styled(Card))`
  & .ant-card-head-wrapper {
    flex-direction: column;

    & .ant-card-extra {
      width: 100%;
    }
  }

  & .ant-card-body {
    ${({ show }) => (show ? '' : 'display: none')};
  }
`;
