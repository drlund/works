import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Divider, Modal } from 'antd';
import React, { useState } from 'react';
import { TimelineWrapper } from './TimelineWrapper';
import { DadosProcuracaoHistorico } from './DadosProcuracaoHistorico';

/**
 * @param {{
 *  procuracaoId: number,
 *  record: import('../../../helpers/extractAcordeaoItemData').ExtractedDataSourceUnion,
 * }} props
 */
export function Historico({ procuracaoId, record }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [historico, setHistorico] = useState(null);

  const showModal = () => {
    // console.log('🚀 ~ Historico ~ record', record);
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
        style={{ backgroundColor: 'white' }}
        icon={<ClockCircleOutlined />}
        onClick={showModal}
      >
        Histórico
      </Button>
      <Modal
        title={(
          <span style={{ fontSize: '1.2em' }}>
            Histórico
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
        <DadosProcuracaoHistorico procuracao={record} />
        {/*
        <Divider style={{ marginTop: '2em', marginBottom: '2em' }} />
        <TimelineWrapper
          procuracao={procuracao}
          onData={setHistorico}
          historico={historico}
        />
        */}
      </Modal>
    </>
  );
}
