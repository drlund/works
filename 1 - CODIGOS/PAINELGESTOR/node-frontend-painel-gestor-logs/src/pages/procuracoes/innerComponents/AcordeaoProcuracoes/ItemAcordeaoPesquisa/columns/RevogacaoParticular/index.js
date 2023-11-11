import { WarningOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Modal,
  Popconfirm,
  message
} from 'antd';
import React, { useState } from 'react';

import { PermissionGuard } from '@/components/PermissionGuard';
import useUsuarioLogado from '@/hooks/useUsuarioLogado';
import { useUsuarioPertenceAPrefixo, useUsuarioSuper } from '@/pages/procuracoes/hooks/useUsuarioPertenceAPrefixo';
import { FETCH_METHODS, fetch } from '@/services/apis/GenericFetch';
import { usePesquisaItemAcordeaoContext } from '../../PesquisaItemAcordeaoContext';
import { StyledRequiredSpan } from '../shared/StyledRequiredSpan';

/**
 * @param {{
 *  procuracaoId: number,
 *  record: import('../../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion,
 * }} props
 */
export function RevogacaoParticular({ procuracaoId, record }) {
  const { prefixo: prefixoOutorgado, procuracao, matricula: matriculaOutorgado } = usePesquisaItemAcordeaoContext();
  const { matricula: matriculaUser, nome_funcao: funcaoUser } = useUsuarioLogado();

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
      `/procuracoes/solicitacoes/revogacao-particular/${procuracaoId}`,
      { observacao },
    ).then(() => {
      message.success('Revogação realizada com sucesso.');
      setIsSent(true);
      handleOk();
    }).catch((err) => {
      message.error(err);
    });

  const observacaoNull = observacao === null;
  const observacaoError = observacaoNull || observacao.length < 20;

  const isInativa = Boolean(record.revogacao) || !record.procuracaoAtiva;

  const userSuper = useUsuarioSuper();

  const mesmoPrefixoOutorgado = useUsuarioPertenceAPrefixo(Number(prefixoOutorgado));
  const matriculaOutorgante = procuracao[0]?.outorgado.matricula;

  const userPodePedir =
    // é o outorgado
    matriculaUser === matriculaOutorgado
    // é o outorgante
    || matriculaUser === matriculaOutorgante
    // é gerente do mesmo prefixo
    || (mesmoPrefixoOutorgado && funcaoUser.includes('GER'));

  const prefixoPodePedir = userSuper || userPodePedir;

  // particular tem agregada e não tem cartório
  const isParticular = Boolean(procuracao[0]?.procuracaoAgregada) && !procuracao[0]?.procuracaoAgregada?.cartorioId;

  return (
    <PermissionGuard
      fallback={null}
      guard={isParticular && prefixoPodePedir}
    >
      <Button
        size="small"
        type="primary"
        danger
        ghost
        disabled={isSent || isInativa}
        style={{ backgroundColor: 'white' }}
        icon={<WarningOutlined />}
        onClick={showModal}
      >
        Revogação de Procuração Particular
      </Button>
      <Modal
        title={(
          <span style={{ fontSize: '1.2em' }}>
            Revogação de Procuração Particular
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
                Confirmar Revogação
              </Button>
            </Popconfirm>
          </div>
        ]}
      >
        <div>
          <div>TODO: avisos sobre a revogação</div>
          <StyledRequiredSpan>Observação</StyledRequiredSpan>
          <Input.TextArea
            placeholder={
              `Coloque aqui a razão da revogação desta procuração.\nAviso: este processo não pode ser desfeito.`
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
