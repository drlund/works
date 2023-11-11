import {
  Button,
  Checkbox,
  Col,
  Modal,
  Row,
  Typography
} from 'antd';
import React, { useState } from 'react';

/**
 * @param {Object} props
 * @param {boolean} props.buttonDisabled - Disable trigger button
 * @param {Function} props.cb - função chamada ao confirmar modal
 */
export const FinalizarMinutaModal = ({
  buttonDisabled = true,
  cb = () => { },
}) => {
  const [visible, setVisible] = useState(false);
  const [termosAceitos, setTermosAceitos] = useState(false);

  const handleOk = () => {
    cb();
    setVisible(false);
  };

  const handleCheckbox = (/** @type {import('antd/lib/checkbox').CheckboxChangeEvent} */ e) => {
    setTermosAceitos(e.target.checked);
  };

  const handleTriggerButton = () => {
    setTermosAceitos(false);
    setVisible(true);
  };

  return (
    <>
      <Button
        type="primary"
        onClick={handleTriggerButton}
        disabled={buttonDisabled}
        style={{ zIndex: 100 }}
      >
        Registrar Minuta
      </Button>
      <Modal
        title={
          <h2 style={{ textAlignLast: 'center', fontSize: '3rem', color: 'orange', marginTop: '0.5em' }}>
            Atenção
          </h2>
        }
        open={visible}
        onOk={handleOk}
        okText="Finalizar Cadastro de Minuta"
        cancelText="Cancelar"
        width="clamp(600px,50%,800px)"
        centered
        onCancel={() => setVisible(false)}
        okButtonProps={{
          disabled: !termosAceitos
        }}
      >
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <Typography.Paragraph>
              É responsabilidade do 1º Gestor da dependência a inclusão do substabelecimento de procuração assinado, em até 5 dias úteis da emissão da Minuta.
            </Typography.Paragraph>
            <Typography.Paragraph>
              Após assinatura, o registro é realizado no Módulo Cadastro desta ferramenta a partir da minuta emitida.
            </Typography.Paragraph>
            <Typography.Paragraph>
              O sistema indicará a pendência até que ocorra a inclusão dos dados e upload do documento.
            </Typography.Paragraph>
          </Col>
          <Checkbox
            onChange={handleCheckbox}
            checked={termosAceitos}
          >
            Estou de acordo com os termos acima e me comprometo a fazer o <span style={{ fontStyle: 'italic' }}>upload</span> do substabelecimento de procuração assinado.
          </Checkbox>
        </Row>
      </Modal>
    </>
  );
};
