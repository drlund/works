import {
  Checkbox,
  Col,
  Divider,
  Input,
  Modal,
  Row,
  Tooltip,
  message
} from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { PermissionGuard } from '@/components/PermissionGuard';
import { useUsuarioPertenceAPrefixo, useUsuarioSuper } from '@/pages/procuracoes/hooks/useUsuarioPertenceAPrefixo';
import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';
import { useModalControls } from '../../../../shared/useModal';
import { usePesquisaItemAcordeaoContext } from '../../PesquisaItemAcordeaoContext';
import { useSolicitacoes } from '../shared/SolicitacoesContext';
import { StyledRequiredSpan } from '../shared/StyledRequiredSpan';
import { ModalFooter } from './ModalFooter';
import { ModalHeader } from './ModalHeader';
import { relativeDateFromToday } from './relativeDateFromToday';
import { useSolicitacoesProcuracoes } from './useSolicitacoesProcuracoes';

/**
 * @typedef {{
 *  manifesto: number[];
 *  copia: number[];
 *  observacao: string|null;
 *  idPedido?: number;
 * }} SolicitacaoCart
 *
 * @typedef {'nova' | 'edit'} SolicitacaoType
 */
/**
 * @param {{
 *  procuracaoId: number,
 *  record: Pick<import('../../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion, 'revogacao'|'procuracaoAtiva'>,
 *  defaultCart: SolicitacaoCart,
 *  solicitacaoType: SolicitacaoType,
 *  observacaoPlaceholder: string,
 *  modalTrigger: (props: import('./ModalSolicitacoesTrigger').ModalTriggerProps) => JSX.Element,
 *  handleCallback?: () => void,
 * }} props
 */

export function SolicitacoesBase({
  procuracaoId,
  record,
  defaultCart,
  solicitacaoType,
  observacaoPlaceholder,
  modalTrigger: ModalTrigger,
  handleCallback = () => { },
}) {
  const procuracoes = useSolicitacoesProcuracoes();
  const { solicitacoes, loading: loadingSolicitacoes } = useSolicitacoes();
  const { prefixo: prefixoOutorgado } = usePesquisaItemAcordeaoContext();

  const { closeModal, showModal, isModalVisible } = useModalControls();

  const [isSent, setIsSent] = useState(false);

  const [cart, setCart] = useState(defaultCart);

  const handleConfirm = () => {
    if (
      JSON.stringify({
        manifesto: [...cart.manifesto].sort(),
        copia: [...cart.copia].sort(),
      }) === JSON.stringify({
        manifesto: [...defaultCart.manifesto].sort(),
        copia: [...defaultCart.copia].sort(),
      })
    ) {
      message.warn('Nenhuma alteração feita.');
      return /** @type {Promise<void>} */(/** @type {unknown} */(null));
    }

    return fetch(
      FETCH_METHODS.POST,
      `/procuracoes/solicitacoes/${solicitacaoType}/${procuracaoId}`,
      { cart }
    ).then(() => {
      message.success(`Solicitação ${solicitacaoType === 'nova' ? 'enviada' : 'alterada'} com sucesso.`);
      setIsSent(true);
      handleCallback();
      closeModal();
    }).catch((err) => {
      message.error(err);
    });
  };

  /** @param {{ target: { value: string  }}} event */
  const handleObservacao = ({ target: { value } }) => {
    setCart(old => ({ ...old, observacao: value }));
  };

  /**
   * @param {Exclude<keyof cart, 'observacao'|'idPedido'>} key
   * @param {number} checkId
   */
  const handleCheckbox = (key, checkId) =>
    /** @param {{ target: { checked: boolean } }} event */
    ({ target: { checked } }) => {
      setCart(old => ({
        ...old,
        [key]: checked
          ? [...old[key], checkId]
          : old[key].filter(id => id !== checkId),
      }));
    };

  const observacaoNull = cart.observacao === null;
  const observacaoError = observacaoNull || /** @type {number} */ (cart.observacao?.length) < 10;

  const isInativa = Boolean(record.revogacao) || !record.procuracaoAtiva;

  const hasPedidoAtivo = solicitacoes?.[procuracaoId]?.pedido;

  const userSuper = useUsuarioSuper();
  const mesmoPrefixoOutorgado = useUsuarioPertenceAPrefixo(Number(prefixoOutorgado));

  const prefixoPodePedir = userSuper || mesmoPrefixoOutorgado;

  const disableWithPedido = hasPedidoAtivo && !userSuper;
  const disableButton = isSent || isInativa || disableWithPedido || !prefixoPodePedir;

  return (
    <PermissionGuard
      fallback={null}
      guard={prefixoPodePedir}
    >
      <Tooltip
        title={disableWithPedido ? 'Existe solicitação já em andamento' : null}
      >
        <ModalTrigger
          disabled={disableButton}
          loading={loadingSolicitacoes}
          onClick={showModal}
        />
      </Tooltip>
      <Modal
        title={(
          <span style={{ fontSize: '1.2em' }}>
            {solicitacaoType === 'nova' ? 'Solicitações' : 'Alterar e Confirmar Pedido'}
          </span>
        )}
        open={isModalVisible}
        onOk={closeModal}
        onCancel={closeModal}
        width="70%"
        footer={[
          <ModalFooter
            key='footer'
            cart={cart}
            handleCancel={closeModal}
            handleConfirm={handleConfirm}
            observacaoError={observacaoError}
            solicitacaoType={solicitacaoType}
          />
        ]}
      >
        <ModalHeader />
        <Divider type='horizontal' style={{ margin: '1em 0' }} />
        {procuracoes.map((p, i) => (
          <Row
            gutter={[16, 16]}
            key={p.id}
            style={{
              padding: '0.5em 0',
              backgroundColor: i % 2 === 0 ? 'white' : '#EEEEEE55'
            }}
          >
            <Col span={10}>
              <div>{p.nome}</div>
              {solicitacoes?.[p.id]?.pedido && (
                <div style={{ color: 'gray', fontSize: '0.8em' }}>
                  <span style={{ color: 'orange' }}>Atenção:</span> Existe Pedido em Andamento
                </div>
              )}
            </Col>
            {p.cartorio ? (
              <>
                <Col span={7} style={{ textAlign: 'center' }}>
                  <StyleCheckbox
                    checked={cart.manifesto.includes(p.id)}
                    onChange={handleCheckbox('manifesto', p.id)}
                  >
                    {`Adicionar certidão para ${p.nome}`}
                  </StyleCheckbox>
                  {Boolean(solicitacoes?.[p.id]?.manifesto) && (
                    <div>{`(${relativeDateFromToday(solicitacoes?.[p.id]?.manifesto)})`}</div>
                  )}
                </Col>
                <Col span={7} style={{ textAlign: 'center' }}>
                  <StyleCheckbox
                    checked={cart.copia.includes(p.id)}
                    onChange={handleCheckbox('copia', p.id)}
                  >
                    {`Adicionar cópia para ${p.nome}`}
                  </StyleCheckbox>
                  {Boolean(solicitacoes?.[p.id]?.copia) && (
                    <div>{`(${relativeDateFromToday(solicitacoes?.[p.id]?.copia)})`}</div>
                  )}
                </Col>
              </>
            ) : (
              <Col span={14} style={{ textAlign: 'center' }}>
                Não é possível fazer o pedido para procurações particulares.
              </Col>
            )}
          </Row>
        ))}
        <Divider type='horizontal' style={{ margin: '1em 0' }} />
        <div>
          <StyledRequiredSpan>Observação</StyledRequiredSpan>
          <Input.TextArea
            placeholder={observacaoPlaceholder}
            required
            aria-label='Observação'
            onBlur={handleObservacao}
            onChange={handleObservacao}
          />
          {!observacaoNull && observacaoError && (
            <span style={{ color: 'red' }}>
              Observação inválida, deve ter no mínimo 10 caracteres.
            </span>
          )}
        </div>
      </Modal>
    </PermissionGuard>
  );
}

const StyleCheckbox = styled(Checkbox)`
  & > :not(.ant-checkbox) {
    display: none;
  }
`;
