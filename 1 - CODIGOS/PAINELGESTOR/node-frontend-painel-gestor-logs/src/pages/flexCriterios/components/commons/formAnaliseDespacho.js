import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  Form,
  Input,
  Popconfirm,
  Select,
  Divider,
  Space,
  Typography,
  message,
  Card,
  Tooltip,
} from 'antd';
import { getEscaloes } from 'pages/flexCriterios/apiCalls/flexTipoDadosAPICall';
import history from 'history.js';
import { CardResponsivo } from 'pages/flexCriterios/styles';
import {
  CheckCircleOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { inserirDespacho } from '../../apiCalls/flexPedidosAPICall';
import constantes from '../../helpers/constantes';
import ModalNovoDeferimento from './modalNovoDeferimento';
import { reloadUserPermissions } from '@/services/actions/commons';

export default function AnaliseDespacho({
  idFlex,
  totalMembrosComite,
  diretoria,
}) {
  const [escalaoSelecionado, setEscalaoSelecionado] = useState(null);
  const [escaloes, setEscaloes] = useState([]);
  const [isModalEncerrarOpen, setIsModalEncerrarOpen] = useState(false);
  const [form] = Form.useForm();
  const [selecionado, setSelecionado] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  console.log('escaloes', escaloes);

  useEffect(() => {
    getEscaloes(diretoria[0], idFlex)
      .then((resposta) => {
        setEscaloes(resposta);
      })
      .catch(() => {
        message.error('Não foi possível obter a lista de escalões.');
      });
  }, [refresh]);

  const gravarDespacho = () => {
    setIsButtonDisabled(true);
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
        /*  dispatch(reloadUserPermissions()); */
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
        /*      dispatch(reloadUserPermissions()); */
        history.push(`/flex-criterios/`);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  const revalidarDeferidor = (id) => {
    const despacho = {
      idSolicitacao: idFlex,
      diretoria: diretoria[0],
      idManifestacao: id,
      revalidar: true,
    };

    inserirDespacho(despacho)
      .then(() => {
        message.success('Despacho Realizado.');
        /*      dispatch(reloadUserPermissions()); */
        const ultimoEscalao = escaloes.filter((e) => e.validado == 0);
        if (ultimoEscalao.length > 1) {
          setRefresh((old) => old + 1);
        } else {
          history.push(`/flex-criterios/`);
        }
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  const removerDeferidor = (id) => {
    const despacho = {
      idSolicitacao: idFlex,
      diretoria: diretoria[0],
      idManifestacao: id,
      remover: true,
    };

    inserirDespacho(despacho)
      .then(() => {
        message.success('Despacho Realizado.');
        /*     dispatch(reloadUserPermissions()); */
        setRefresh((old) => old + 1);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  };

  const PendingIndicator = ({ validado }) => (
    <>
      {validado == '1' ? (
        <Tooltip title="Tudo certo.">
          <CheckCircleOutlined
            style={{ color: '#7FFF00', fontSize: '30px', marginRight: '5px' }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Deferimento pendente de validação.">
          <CheckCircleOutlined
            style={{ color: '#808080', fontSize: '30px', marginRight: '5px' }}
          />
        </Tooltip>
      )}
    </>
  );

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
            Ao escolher esta opção, somente o administrador do prefixo poderá
            realizar o deferimento.
          </Typography.Text>
        );
        break;
      case constantes.membroComite:
        componente = (
          <Typography.Text>
            Ao escolher esta opção, qualquer funcionário que seja membro do
            comitê vinculado ao prefixo poderá realizar o deferimento.
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

  const closeModal = () => {
    setIsModalEncerrarOpen(false);
    setRefresh((old) => old + 1);
  };

  return (
    <>
      <ModalNovoDeferimento
        isModalEncerrarOpen={isModalEncerrarOpen}
        closeModal={closeModal}
        diretoria={diretoria}
        idFlex={idFlex}
      />
      <Form
        form={form}
        onFinish={gravarDespacho}
        style={{ marginBottom: '40px' }}
      >
        <CardResponsivo
          style={{ height: '100%' }}
          title={`Despacho - ${diretoria[2]}`}
          actions={[
            <Form.Item>
              {escaloes[0]?.selecionado === true ? null : (
                <Space>
                  {/*  <Button htmlType="reset">Cancelar</Button> */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!selecionado || isButtonDisabled}
                  >
                    Despachar
                  </Button>
                </Space>
              )}
            </Form.Item>,
          ]}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space
              style={{
                justifyContent: 'space-around',
              }}
            >
              <Space>
                <Typography.Text strong>Diretoria:</Typography.Text>
                <Form.Item name="diretoria" initialValue={diretoria} />
                <Typography.Text>{`${diretoria[0]} - ${diretoria[1]}`}</Typography.Text>
              </Space>
              {escaloes[0]?.selecionado === true &&
              escaloes[0]?.id_situacao === constantes.situacaoRegistrada /* &&
              escaloes[0]?.invalidado == '0' */ ? (
                <Button onClick={() => setIsModalEncerrarOpen(true)}>
                  Solicitar Novo Deferimento Desta Diretoria{' '}
                  <PlusCircleOutlined className="link-color" />{' '}
                </Button>
              ) : null}
            </Space>

            {escaloes[0]?.selecionado === true ? (
              <>
                <Space style={{ justifyContent: 'center', width: '100%' }}>
                  <Typography.Text strong>
                    DEFERIMENTOS VIGENTES
                  </Typography.Text>
                  <Divider />
                </Space>

                {escaloes.map((elem) => (
                  <Card
                    headStyle={{
                      /*       textAlign: 'center', */
                      backgroundColor: '#002D4B',
                      color: 'white',
                    }}
                    title={`DEFERIMENTO #${elem?.id}`}
                    extra={[<PendingIndicator validado={elem.validado} />]}
                  >
                    <Space direction="vertical">
                      <Typography.Text strong>
                        Id Manifestação : {elem?.id}{' '}
                      </Typography.Text>
                      <Typography.Text strong>
                        Situação :{' '}
                        {elem.id_situacao == 1
                          ? 'Pendente'
                          : elem.id_situacao == 2
                          ? 'Registrado'
                          : 'Indefinido'}
                      </Typography.Text>

                      <Typography.Text strong>
                        Texto Registrado : {elem?.texto}{' '}
                      </Typography.Text>

                      <Typography.Text strong>
                        Escalão Selecionado :{' '}
                        {elem?.nome
                          ? elem?.nome
                          : elem.id_escalao == 2
                          ? 'Administrador'
                          : elem.id_escalao == 3
                          ? 'Membro Comitê'
                          : elem.id_escalao == 4
                          ? ' Matricula'
                          : 'outro'}
                      </Typography.Text>

                      <Popconfirm
                        title="Esta ação removerá o deferidor escolhido e se já registrado apagará o registro do banco de dados, deseja realmente substituir o deferidor?"
                        placement="right"
                        onConfirm={() => removerDeferidor(elem.id)}
                        style={{ justifySelf: 'end' }}
                      >
                        <Button>
                          Remover Deferidor Escolhido{' '}
                          <DeleteOutlined className="link-color" />{' '}
                        </Button>
                      </Popconfirm>

                      {elem?.validado === '0' && (
                        <Button
                          style={{
                            marginBottom: '20px',
                            background: '#1890ff',
                            color: '#ffffff',
                          }}
                          onClick={() => revalidarDeferidor(elem.id)}
                        >
                          Revalidar deferimento.
                        </Button>
                      )}
                    </Space>
                  </Card>
                ))}
              </>
            ) : (
              <>
                <Typography.Text strong>Selecione o Escalão</Typography.Text>
                <Form.Item name="idEscalao">
                  <Select
                    style={{
                      width: 400,
                    }}
                    onChange={(selecao) => {
                      setEscalaoSelecionado(selecao);
                      setSelecionado(true);
                    }}
                    options={escaloes.map((escalao) => ({
                      value: escalao.id,
                      label: escalao.nome,
                    }))}
                  />
                </Form.Item>
                <Button
                  icon={<StopOutlined />}
                  onClick={() => dispensarDespacho()}
                >
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
