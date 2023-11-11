import React, { useState } from 'react';
import { Col, Modal, Row, Switch, Tag, Typography, message } from 'antd';
/* 
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'; */
import { patchFerramenta } from '../../apiCalls/ferramentaCall';
import Constants from '../../helpers/constantes';

const { Paragraph } = Typography;

function AtivoSwitch({ codigoStatus, record, refreshStatus, disabled }) {
  const [desativadaCheck, setDesativadaChecked] = useState(
    codigoStatus == 3 ? true : false,
  );
  const [openPopup, setOpenPopUp] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const alterarStatus = () => {
    const ferramenta = {
      id: record.id,
      statusAnterior: record.codigoStatus,
      novoStatus:
        record.codigoStatus == Constants.desativada
          ? Constants.emManutencao
          : Constants.desativada,
    };

    patchFerramenta(ferramenta)
      .then(() => {
        refreshStatus();
        setOpenPopUp(false);
      })
      .catch((err) => {
        message.error('Não foi possível atualizar este pedido.');
        setOpenPopUp(false);
      });
  };

  const handleSituacaoChecker = () => {
    setConfirmMessage(
      desativadaCheck
        ? `A aplicação ${record.nome}  encontra-se desativada no momento no momento, deseja reativa-la?`
        : `A aplicação ${record.nome}  encontra-se ativa no momento, deseja desativa-la?`,
    );
    setOpenPopUp(true);
  };

  return (
    <>
      <Modal
        title="Gerenciar disponibilidade"
        open={openPopup}
        onOk={alterarStatus}
        okText={
          desativadaCheck ? 'Reativar ferramenta' : 'Desativar ferramenta'
        }
        cancelText="Cancelar"
        width={700}
        onCancel={() => setOpenPopUp(false)}
      >
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <Paragraph>{confirmMessage}</Paragraph>
          </Col>
        </Row>
      </Modal>
      <Switch
        style={{
          backgroundColor: desativadaCheck ? '' : '#87d068',
          marginRight: '10px',
        }}
        disabled={disabled}
        checked={!desativadaCheck}
        onChange={handleSituacaoChecker}
      />
      {desativadaCheck && (
        <Tag color="#f50" style={{ fontWeight: 'bolder' }}>
          DESATIVADA
        </Tag>
      )}
      {!desativadaCheck && <Tag color="#87d068">ATIVA</Tag>}
    </>
  );
}

export default AtivoSwitch;
