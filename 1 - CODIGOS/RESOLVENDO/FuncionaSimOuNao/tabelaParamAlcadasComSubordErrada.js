import React, { useState, useEffect } from 'react';
import { toggleSideBar } from 'services/actions/commons';
import SearchTable from 'components/searchtable/SearchTable';
import './TableHead.scss';
import {
  PlusOutlined,
  RedoOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import {
  Card,
  Tooltip,
  Button,
  Row,
  Col,
  Space,
  Divider,
  Modal,
  Input,
  message,
} from 'antd';
import history from 'history.js';
import { confirmarExclusao } from 'pages/projetos/Helpers/CommonsFunctions';
import { connect, useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
import {
  getParametros,
  delParametro,
  getJurisdicoesSubordinadas,
} from './apiCalls/apiParamAlcadas';

function ParamAlcadasTable({ ...props }) {
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);

  const { idParametro } = parseInt(props.id, 10);
  const [fetching, setFetching] = useState(true);
  const [parametros, setParametros] = useState([{}]);

  const [showModal, setShowModal] = useState(false);
  const [observacao, setObservacao] = useState('');

  const [selectedRecord, setSelectedrecord] = useState(null);

  const [subordinada, setSubordinada] = useState([]);

  useEffect(() => {
    if (
      permissao.includes('PARAM_ALCADAS_ADMIN') ||
      permissao.includes('PARAM_ALCADAS_USUARIO')
    ) {
      setFetching(true);
      Promise.all([obterParametros(), obterSubordinada()]) // Modificado: Chama as funções obterParametros e obterSubordinada em Promise.all()
        .catch(() => 'Erro ao obter parâmetros!')
        .finally(() => {
          setFetching(false);
        });
    }
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    // {
    //   title: 'Subordinada',
    //   dataIndex: 'subordinada',
    //   render: (prefixo) => String(prefixo || subordinada).padStart(4, '0'),
    // },
    {
      title: 'Prefixo Destino',
      dataIndex: 'prefixoDestino',
      render: (prefixo) => String(prefixo).padStart(4, '0'),
    },
    {
      title: 'Nome Prefixo',
      dataIndex: 'nomePrefixo',
    },
    {
      title: 'Comissão Destino',
      dataIndex: 'comissaoDestino',
    },
    {
      title: 'Nome Comissão Destino',
      dataIndex: 'nomeComissaoDestino',
    },
    {
      title: 'Prefixo Comitê',
      dataIndex: 'comite',
    },
    {
      title: 'Nome Prefixo Comitê',
      dataIndex: 'nomeComite',
    },
    {
      title: 'Ações',
      width: '10%',
      align: 'center',
      render: (text, record) => (
        <span>
          <Tooltip title="Editar">
            <EditOutlined
              className="link-color link-cursor"
              onClick={() =>
                history.push({
                  pathname: '/movimentacoes/editar-parametros/',
                  state: record,
                })
              }
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Excluir Parametro">
            <DeleteOutlined
              className="link-color link-cursor"
              loading={fetching}
              onClick={() => {
                setSelectedrecord(record);
                setShowModal(true);
              }}
            />
          </Tooltip>
        </span>
      ),
    },
  ];

  const obterParametros = () => {
    if (permissao.includes('PARAM_ALCADAS_ADMIN')) {
      // Permissão de administrador, obtém todos os parâmetros
      return Promise.all([getParametros(idParametro)])
        .then(([onRow]) => {
          setParametros(onRow);
          getJurisdicoesSubordinadas(authState).then((subordinadaData) => {
            setSubordinada(subordinadaData);
          });
        })
        .catch(() => 'Falha ao obter parâmetros!');
    }
    if (permissao.includes('PARAM_ALCADAS_USUARIO')) {
      // Permissão de usuário, obtém somente os parâmetros relacionados ao prefixo do usuário
      const prefixoDestinoUsuario = getJurisdicoesSubordinadas(authState);
      return Promise.all([
        getParametros(idParametro, prefixoDestinoUsuario),
        getJurisdicoesSubordinadas(authState),
      ])
        .then(([onRow, subordinadaData]) => {
          setParametros(onRow);
          setSubordinada(subordinadaData);
        })
        .catch(() => 'Falha ao obter parâmetros!');
    }
  };

  const removerParametro = (id) => {
    delParametro({ id, observacao })
      .then(() => {
        setShowModal(false);
        setObservacao('');
        return obterParametros();
      })
      .catch(() => message.error('Falha ao excluir parâmetro!'));
  };

  const obterSubordinada = async () => {
    try {
      const subordinadaData = await getJurisdicoesSubordinadas();
      setSubordinada(subordinadaData);
    } catch (error) {
      console.error('Falha ao obter subordinada:', error);
    }
  };

  const renderActionButtons = () => (
    <Row style={{ marginBottom: '15px' }}>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() =>
            history.push({
              pathname: '/movimentacoes/inclusao-de-parametros/',
              state: { idParametro, novo: true },
            })
          }
        >
          Incluir Alçada
        </Button>
        <Tooltip title="Atualizar lista">
          <Button
            icon={<RedoOutlined />}
            loading={fetching}
            style={{ marginLeft: '15px' }}
            onClick={() => obterParametros()}
          />
        </Tooltip>
      </Col>
    </Row>
  );

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Row>
        <Col span={24}>
          <Card title="Parametrização das Alçadas do Portal de Movimentações">
            {renderActionButtons()}
            <SearchTable
              className="styledTableHead"
              columns={columns}
              dataSource={parametros}
              rowKey="id"
              size="small"
              pagination={{ showSizeChanger: true }}
              bordered
            />
          </Card>
        </Col>
      </Row>
      <Modal
        className="custom-modal"
        title="Justificar exclusão"
        open={showModal}
        onCancel={() => setShowModal(false)}
        onOk={() => {
          setShowModal(false);
          if (selectedRecord) {
            confirmarExclusao(
              selectedRecord.id,
              removerParametro,
              'Confirmar exclusão do parâmetro?',
              observacao,
            );
          }
        }}
      >
        <Input.TextArea
          className="text-area"
          rows={4}
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />
      </Modal>
    </Space>
  );
}

export default connect(null, { toggleSideBar })(ParamAlcadasTable);