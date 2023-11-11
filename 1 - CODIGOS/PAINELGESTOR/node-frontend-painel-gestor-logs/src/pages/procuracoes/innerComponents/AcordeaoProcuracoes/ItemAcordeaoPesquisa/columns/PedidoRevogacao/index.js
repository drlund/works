import { WarningOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  Tooltip,
  message
} from 'antd';
import React, { useState } from 'react';

import { PermissionGuard } from '@/components/PermissionGuard';
import { useUsuarioSuper } from '@/pages/procuracoes/hooks/useUsuarioPertenceAPrefixo';
import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';
import { useSolicitacoes } from '../shared/SolicitacoesContext';
import { StyledRequiredSpan } from '../shared/StyledRequiredSpan';

/**
 * @param {{
 *  procuracaoId: number,
 *  record: import('../../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion,
 * }} props
 */
export function PedirRevogacao({ procuracaoId, record }) {
  const { solicitacoes, loading: loadingSolicitacoes } = useSolicitacoes();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const [observacao, setObservacao] = useState(/** @type {string|null} */(null));

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleConfirm = () =>
    fetch(
      FETCH_METHODS.POST,
      `/procuracoes/solicitacoes/revogacao/${procuracaoId}`,
      { observacao },
    ).then(() => {
      message.success('Solicitação enviada com sucesso.');
      setIsSent(true);
      handleOk();
    }).catch((err) => {
      message.error(err);
    });

  const observacaoNull = observacao === null;
  const observacaoError = observacaoNull || observacao.length < 20;

  const isInativa = Boolean(record.revogacao) || !record.procuracaoAtiva;

  const userSuper = useUsuarioSuper();

  const prefixoPodePedir = userSuper;

  const hasRevogacaoPedido = solicitacoes?.[procuracaoId]?.revogacao;

  return (
    <PermissionGuard
      fallback={null}
      guard={prefixoPodePedir}
    >
      <Tooltip
        title={hasRevogacaoPedido ? 'Pedido de revogação em andamento' : null}
      >
        <Button
          size="small"
          type="primary"
          danger
          ghost
          disabled={isSent || isInativa || hasRevogacaoPedido}
          loading={loadingSolicitacoes}
          style={{ backgroundColor: 'white' }}
          icon={<WarningOutlined />}
          onClick={showModal}
        >
          Pedir Revogação
        </Button>
      </Tooltip>
      <Modal
        title={(
          <span style={{ fontSize: '1.2em' }}>
            Pedir Revogação de Procuração
          </span>
        )}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="70%"
        footer={[
          <div
            key="footer"
            style={{ display: 'flex', gap: '0.5em', justifyContent: 'flex-end' }}
          >
            <Button
              type="default"
              onClick={handleCancel}>
              Cancelar
            </Button>
            <Popconfirm
              title="Confirma querer a revogação desta procuração?"
              onConfirm={handleConfirm}
              okText="Sim"
              cancelText="Não"
              disabled={observacaoError}
            >
              <Button
                type="primary"
                disabled={observacaoError}
              >
                Confirmar Pedido de Revogação
              </Button>
            </Popconfirm>
          </div>
        ]}
      >
        <div>
          <StyledRequiredSpan>Observação</StyledRequiredSpan>
          <Input.TextArea
            placeholder={
              `Coloque aqui a razão do pedido de revogação desta procuração.\nAviso: o pedidos será verificado e pode ser cancelado.`
            }
            required
            onBlur={(e) => setObservacao(e.target.value)}
            onChange={(e) => setObservacao(e.target.value)}
          />
          {
            !observacaoNull && observacaoError && (
              <span style={{ color: 'red' }}>
                Observação inválida, deve ter no mínimo 20 caracteres.
              </span>
            )
          }
        </div>
      </Modal>
    </PermissionGuard>
  );
}
