import { FormOutlined } from '@ant-design/icons';
import { Button, Modal } from 'antd';
import React, { useState } from 'react';

import { FeatureFlag } from 'components/FeatureFlag';
import { SpinningContext } from 'components/SpinningContext';
import useUsuarioLogado from 'hooks/useUsuarioLogado';
import { usePesquisa } from 'pages/procuracoes/Pesquisar/PesquisaContext';
import { ProcuracaoFlags } from 'pages/procuracoes/hooks/ProcuracaoFlags';

import { CopiaAutenticadaForm } from './CopiaAutenticadaForm';
import { ManifestoForm } from './ManifestoForm';
import { RevogacaoForm } from './RevogacaoForm';

/**
 * @param {{
 *  procuracaoId: number,
 *  record: import('../../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion,
 * }} props
 */
export function Gerenciar({ procuracaoId, record }) {
  const funci = useUsuarioLogado();
  const { prefixosComAcessoEspecial } = usePesquisa();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const acessoGerenciar = prefixosComAcessoEspecial?.some((p) => Number(p) === Number(funci.prefixo));

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button
        size="small"
        type="primary"
        ghost
        icon={<FormOutlined />}
        disabled={!acessoGerenciar}
        onClick={showModal}
      >
        Gerenciar
      </Button>
      <Modal
        title={(
          <span style={{ fontSize: '1.2em' }}>
            Gerenciar
          </span>
        )}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="70%"
        footer={[
          <Button
            type="primary"
            key="ok"
            onClick={handleOk}>
            Ok
          </Button>
        ]}
      >
        <SpinningContext>
          <div>
            <p>
              Utilize esta funcionadade para atualizar a data do
              Manifesto de Assinaturas (Certidão de procuração)
              ou para registrar Cópia Autenticada.
            </p>
            <p>
              Lembre-se de que esta opção não impacta
              na data de vencimento da procuração.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
            <ManifestoForm
              key={`manifesto-${procuracaoId}`}
              idProcuracao={procuracaoId}
              cartorioId={record.cartorioId}
            />
            <CopiaAutenticadaForm
              key={`copia-${procuracaoId}`}
              idProcuracao={procuracaoId}
              cartorioId={record.cartorioId}
            />
            <FeatureFlag
              fallback={null}
              flagName={ProcuracaoFlags.revogacao}
            >
              <RevogacaoForm
                key={`copia-${procuracaoId}`}
                idProcuracao={procuracaoId}
                cartorioId={record.cartorioId}
              />
            </FeatureFlag>
          </div>
        </SpinningContext>
      </Modal>
    </>
  );
}
