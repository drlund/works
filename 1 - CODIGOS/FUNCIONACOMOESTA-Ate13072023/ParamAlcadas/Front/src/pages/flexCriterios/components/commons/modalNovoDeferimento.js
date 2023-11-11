import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Select, Space, Typography, message } from 'antd';
import { getEscaloes } from 'pages/flexCriterios/apiCalls/flexTipoDadosAPICall';
import { inserirDespacho } from 'pages/flexCriterios/apiCalls/flexPedidosAPICall';

export default function ModalNovoDeferimento({
  isModalEncerrarOpen,
  closeModal,
  diretoria,
  idFlex,
}) {
  const [form] = Form.useForm();
  const [escalaoSelecionado, setEscalaoSelecionado] = useState(null);
  const [escaloes, setEscaloes] = useState([]);

  /*  useEffect(() => {
    if (!isModalEncerrarOpen) {
      form.setFieldValue('texto', '');
    }
  }, [isModalEncerrarOpen]); */
  useEffect(() => {
    getEscaloes(0, idFlex)
      .then((resposta) => {
        setEscaloes(resposta);
      })
      .catch(() => {
        message.error('Não foi possível obter a lista de escalões.');
      });
  }, []);

  const gravarDespacho = () => {
    let despacho = {
      idSolicitacao: idFlex,
      idEscalao: null,
      diretoria,
      coordenador: null,
      quorum: null,
      matricula: null,
      force: true,
    };
    despacho = { ...despacho, ...form.getFieldsValue() };
    inserirDespacho(despacho)
      .then(() => {
        message.success('Novo deferidor incluido com sucesso.');
        closeModal();
        /*   history.push(`/flex-criterios/`); */
      })
      .catch((resposta) => {
        message.error(resposta);
        /*  closeModal() */
      });
  };

  return (
    <Modal
      title={<span>Inserir novo deferidor</span>}
      open={isModalEncerrarOpen}
      closable={false}
      footer={null}
    >
      <Form form={form} onFinish={gravarDespacho}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Typography.Text strong>Selecione o Escalão</Typography.Text>
          <Form.Item name="idEscalao">
            <Select
              style={{
                width: 220,
              }}
              onChange={(selecao) => setEscalaoSelecionado(selecao)}
              options={escaloes?.map((escalao) => ({
                value: escalao.id,
                label: escalao.nome,
              }))}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button htmlType="reset" onClick={() => closeModal()}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                Despachar
              </Button>
            </Space>
          </Form.Item>
        </Space>
      </Form>
    </Modal>
  );
}
