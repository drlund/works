import React, { useEffect } from 'react';
import { Button, Form, Input, Modal, Space } from 'antd';
import constantes from 'pages/flexCriterios/helpers/constantes';
import { message } from 'antd';

export default function ModalEncerrar({
  isModalEncerrarOpen,
  setIsModalEncerrarOpen,
  gravarManifestacao,
  idPedidoFlex,
}) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isModalEncerrarOpen) {
      form.setFieldValue('texto', '');
    }
  }, [isModalEncerrarOpen]);

  const onOkPress = () => {
    const textWritten = form.getFieldsValue().texto;

    if (textWritten.length === 0) {
      message.error(
        'Necessário informar uma justificativa para este encerramento',
      );
    } else {
      gravarManifestacao({
        idSolicitacao: idPedidoFlex,
        idAcao: constantes.acaoCancelar,
        ...form.getFieldsValue(),
        parecer: constantes.desfavoravel,
        idDispensa: constantes.dispensaEncerrado,
      });
    }
  };

  return (
    <Modal
      title={<span>Encerrar o Pedido de Flexibilização</span>}
      open={isModalEncerrarOpen}
      /* okButtonProps={{ style: { display: 'none' } }}
      cancelButtonProps={{ style: { display: 'none' } }} */
      closable={false}
      footer={null}
    >
      <p>
        Esta ação cancela definitivamente este pedido de flexibilização,
        dispensando todas as manifestações pendentes por encerramento antecipado
        sendo necessário abertura de novo pedido!
      </p>
      <p>Deseja realmente realizar o encerramento?</p>
      <p>Motivo do Encerramento:</p>
      <Form form={form} onFinish={() => onOkPress()}>
        <Form.Item
          name="texto"
          rules={[
            {
              required: true,
              message: 'O motivo do encerramento deve ser informado.',
            },
          ]}
        >
          <Input.TextArea autoSize={{ minRows: 6 }} />
        </Form.Item>
        <Form.Item>
          <Space
            style={{
              justifyContent: 'end',
              width: '100%',
            }}
          >
            <Button
              onClick={() => setIsModalEncerrarOpen(false)}
              htmlType="reset"
            >
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit">
              Encerrar
            </Button>
          </Space>
        </Form.Item>
        ,
      </Form>
    </Modal>
  );
}
