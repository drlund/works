import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Popconfirm,
  Select,
  Space,
  Typography,
  message,
} from 'antd';
import { getEscaloes } from 'pages/flexCriterios/apiCalls/flexTipoDadosAPICall';
import history from 'history.js';
import { CardResponsivo } from 'pages/flexCriterios/styles';
import { inserirDespacho } from '../../apiCalls/flexPedidosAPICall';
import constantes from '../../helpers/constantes';
import { DeleteOutlined } from '@ant-design/icons';
import ModalNovoDeferimento from './modalNovoDeferimento';

export default function AnaliseDespacho({
  idFlex,
  totalMembrosComite,
  diretoria,
}) {
  const [escalaoSelecionado, setEscalaoSelecionado] = useState(null);
  const [escaloes, setEscaloes] = useState([]);
  const [isModalEncerrarOpen, setIsModalEncerrarOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    getEscaloes(diretoria[0], idFlex)
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
      diretoria: null,
      coordenador: null,
      quorum: null,
      matricula: null,
    };
    despacho = { ...despacho, ...form.getFieldsValue() };
    inserirDespacho(despacho)
      .then(() => {
        message.success('Despacho Realizado.');
        history.push(`/flex-criterios/`);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  const dispensarDespacho = () => {
    const despacho = {
      idSolicitacao: idFlex,
      diretoria,
      idAcao: constantes.acaoDispensar,
      idEscalao: 4,
    };

    inserirDespacho(despacho)
      .then(() => {
        message.success('Despacho Realizado.');
        history.push(`/flex-criterios/`);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  /*  <Button onClick={() => avancarDespacho()}>
  Avançar Etapa{' '}
</Button>

  const avancarDespacho = () => {
    const despacho = {
      idSolicitacao: idFlex,
      avancar: true,
    };

    inserirDespacho(despacho)
      .then(() => {
        message.success('Despacho Realizado.');
        history.push(`/flex-criterios/`);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  }; */

  const removerDeferidorExistente = () => {
    const despacho = {
      idSolicitacao: idFlex,
      diretoria: diretoria[0],
      remover: true,
    };

    inserirDespacho(despacho)
      .then(() => {
        message.success('Despacho Realizado.');
        history.push(`/flex-criterios/`);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  function renderComponent(selecao) {
    let componente = null;
    switch (selecao) {
      case constantes.comite:
        componente = (
          <>
            <Typography.Text>
              <Typography.Text strong>Total de membros</Typography.Text>
              {/* atributo do pedidoFlex (inteiro) */}: {totalMembrosComite}
            </Typography.Text>
            <Form.Item name="coordenador" initialValue valuePropName="checked">
              <Checkbox>Voto do Coordenador é obrigatório</Checkbox>
            </Form.Item>
            <Space>
              <Typography.Text strong>
                Alterar Quantidade(opcional):
              </Typography.Text>
              <Form.Item name="quorum" initialValue="3">
                <Input
                  type="number"
                  min="2"
                  max={totalMembrosComite}
                  style={{ width: 100 }}
                />
              </Form.Item>
            </Space>
          </>
        );
        break;
      case constantes.administrador:
        componente = (
          <Typography.Text>
            Ao escolher esta opção, somente o administrador do prefixo poderá realizar o deferimento.
          </Typography.Text>
        );
        break;
      case constantes.membroComite:
        componente = (
          <Typography.Text>
           Ao escolher esta opção, qualquer funcionário que seja membro do comitê vinculado ao prefixo poderá realizar o deferimento.
          </Typography.Text>
        );
        break;
      case constantes.matricula:
        componente = (
          <Space>
            <Typography.Text strong>Informe a matrícula:</Typography.Text>
            <Form.Item name="matricula">
              <Input style={{ width: 200 }} />
            </Form.Item>
          </Space>
        );
        break;
      default:
        break;
    }
    return componente;
  }

  const closeModal = () => setIsModalEncerrarOpen(false);

  return (
    <>
      <ModalNovoDeferimento
        isModalEncerrarOpen={isModalEncerrarOpen}
        closeModal={closeModal}
        diretoria={diretoria}
        idFlex={idFlex}
      />
      <Form form={form} onFinish={gravarDespacho}>
        <CardResponsivo
          style={{ height: '100%' }}
          title={`Despacho - ${diretoria[2]}`}
          actions={[
            <Form.Item>
              {escaloes[0]?.selecionado === true ? null : (
                <Space>
                  <Button htmlType="reset">Cancelar</Button>
                  <Button type="primary" htmlType="submit">
                    Despachar
                  </Button>
                </Space>
              )}
            </Form.Item>,
          ]}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Typography.Text strong>Diretoria:</Typography.Text>
              <Form.Item name="diretoria" initialValue={diretoria} />
              <Typography.Text>{`${diretoria[0]} - ${diretoria[1]}`}</Typography.Text>
            </Space>
            {escaloes[0]?.selecionado === true ? (
              <>
                <Typography.Text strong>
                  Escalão Selecionado : {escaloes[0]?.nome}{' '}
                </Typography.Text>

                <Popconfirm
                  title="Esta ação removerá o deferidor escolhido e se já registrado apagará o registro do banco de dados, deseja realmente substituir o deferidor?"
                  placement="right"
                  onConfirm={() => removerDeferidorExistente()}
                >
                  <Button>
                    Substituir Deferidor Escolhido{' '}
                    <DeleteOutlined className="link-color" />{' '}
                  </Button>
                </Popconfirm>
                <Button onClick={() => setIsModalEncerrarOpen(true)}>
                  Solicitar Novo Deferimento Desta Diretoria{' '}
                  <DeleteOutlined className="link-color" />{' '}
                </Button>
              </>
            ) : (
              <>
                <Typography.Text strong>Selecione o Escalão</Typography.Text>
                <Form.Item name="idEscalao">
                  <Select
                    style={{
                      width: 220,
                    }}
                    onChange={(selecao) => setEscalaoSelecionado(selecao)}
                    options={escaloes.map((escalao) => ({
                      value: escalao.id,
                      label: escalao.nome,
                    }))}
                  />
                </Form.Item>
                <Button onClick={() => dispensarDespacho()}>
                  Dispensar Diretoria
                </Button>
              </>
            )}

            <Space direction="vertical">
              {escalaoSelecionado && renderComponent(escalaoSelecionado)}
            </Space>
          </Space>
        </CardResponsivo>
      </Form>
    </>
  );
}
