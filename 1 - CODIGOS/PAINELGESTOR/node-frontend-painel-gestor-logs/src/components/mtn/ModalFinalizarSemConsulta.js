import React, { useState } from 'react';
import { Modal, Spin, Typography, Result } from 'antd';

const { Text } = Typography;

function ModalFinalizarSemConsulta({ open, onConfirmar, onCancel }) {
  const [loading, setLoading] = useState(false);

  return (
    <Modal
      title="Deseja confirmar?"
      open={open}
      maskClosable={!loading}
      closable={!loading}
      onOk={() => onConfirmar()}
      onCancel={() => {
        onCancel();
      }}
      okButtonProps={{ loading, danger: true }}
      cancelButtonProps={{ loading }}
      okText="Finalizar sem consulta à Dedip"
      cancelText="Cancelar"
    >
      <Spin spinning={loading}>
        <Result
          status="warning"
          title="Api de consulta à Dedip não está respondendo."
        />
        <Text type="danger">
          Todos os registros incluídos tanto pelos analistas quanto pelo
          envolvido serão consideradas como histórico. Deseja finalizar a
          análise realizando a consulta manual a dedip?
        </Text>
      </Spin>
    </Modal>
  );
}

export default ModalFinalizarSemConsulta;
