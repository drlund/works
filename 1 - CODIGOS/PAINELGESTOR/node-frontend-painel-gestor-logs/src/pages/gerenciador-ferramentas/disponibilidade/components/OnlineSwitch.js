import React, { useState } from 'react';
import { Col, Modal, Row, Switch, Typography, message } from 'antd';

import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { patchFerramenta } from '../../apiCalls/ferramentaCall';
import Constants from '../../helpers/constantes';

const { Paragraph } = Typography;

function OnlineSwitch({ codigoStatus, record, refreshStatus }) {
  const isOnline = codigoStatus == 1 ? true : false;
  const isDisabled = codigoStatus == 3 ? true : false;

  const [onlineChecked, setOnlineChecked] = useState(isOnline);
  const [openPopup, setOpenPopUp] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const alterarStatus = () => {
    const ferramenta = {
      id: record.id,
      statusAnterior: record.codigoStatus,
      novoStatus:
        record.codigoStatus == Constants.ativa
          ? Constants.emManutencao
          : Constants.ativa,
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

    //
    //setOnlineChecked(!onlineChecked);
  };

  const handleOnlineChecker = () => {
    setConfirmMessage(
      onlineChecked
        ? `A aplicação ${record.nome}  encontra-se online no momento, deseja colocá-la em manutenção(offline)?`
        : `A aplicação ${record.nome}  encontra-se em manutenção(offline) no momento, deseja coloca-la no ar novamente?`,
    );
    setOpenPopUp(true);
  };

  return (
    <>
      <Modal
        title="Gerenciar disponibilidade"
        open={openPopup}
        onOk={alterarStatus}
        okText={isOnline ? 'Colocar em manutenção' : 'Colocar no ar '}
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
        disabled={isDisabled}
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
        checked={onlineChecked}
        onChange={handleOnlineChecker}
      />
    </>
  );
}

export default OnlineSwitch;
