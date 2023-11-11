import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Space, message } from 'antd';
import constantes from 'pages/flexCriterios/helpers/constantes';

export default function ModalAvocar({
  isModalAvocarOpen,
  setIsModalAvocarOpen,
  gravarManifestacao,
  idPedidoFlex,
}) {
  const [formAvocar] = Form.useForm();

  useEffect(() => {
    if (!isModalAvocarOpen) {
      formAvocar.setFieldValue('texto', '');
    }
  }, [isModalAvocarOpen]);

  const onOkPress = () => {
    const textWritten = formAvocar.getFieldsValue().texto;

    if (textWritten.length === 0) {
      message.error(
        'Necessário informar uma justificativa para este encerramento',
      );
    } else {
      gravarManifestacao({
        idSolicitacao: idPedidoFlex,
        idAcao: constantes.acaoAvocar,
        ...formAvocar.getFieldsValue(),
        parecer: constantes.desfavoravel,
        idDispensa: constantes.dispensaAvocada,
      });
    }
  };

  return (
    <Modal
      title="Avocar"
      open={isModalAvocarOpen}
      closable={false}
      footer={null}
    >
      <p>
        Esta ação dispensa por avocação as manifestações pendentes deste pedido
        de flexibilização, e altera o pedido da etapa atual para etapa de
        análise.
      </p>
      <p>Deseja realmente realizar a avocação?</p>
      <p>Justificativa:</p>
      <Form form={formAvocar} onFinish={() => onOkPress()}>
        <Form.Item
          name="texto"
          rules={[
            {
              required: true,
              message: 'Escreva uma justificativa para realizar esta ação.',
            },
          ]}
        >
          <Input.TextArea autoSize={{ minRows: 6 }} />
        </Form.Item>

        <Form.Item>
          <Space style={{ justifyContent: 'end', width: '100%' }}>
            <Button
              onClick={() => setIsModalAvocarOpen(false)(false)}
              htmlType="reset"
            >
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Avocar
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}
