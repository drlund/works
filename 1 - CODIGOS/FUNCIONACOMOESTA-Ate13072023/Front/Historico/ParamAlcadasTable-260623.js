/* eslint-disable consistent-return */
/* eslint-disable no-undef */
// @ts-nocheck
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
import useUsuarioLogado from 'hooks/useUsuarioLogado';

import {
  getParametros,
  delParametro,
  getJurisdicoesSubordinadas,
} from './apiCalls/apiParamAlcadas';

function ParamAlcadasTable({ ...props }) {
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  const dadosDoUsuario = useUsuarioLogado();

  const { prefixo } = dadosDoUsuario;

  const { idParametro } = parseInt(props.id, 10);
  const [fetching, setFetching] = useState(true);
  const [parametros, setParametros] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [observacao, setObservacao] = useState('');

  const [selectedRecord, setSelectedrecord] = useState(null);

  useEffect(() => {
    if (
      permissao.includes('PARAM_ALCADAS_ADMIN') ||
      permissao.includes('PARAM_ALCADAS_USUARIO')
    ) {
      setFetching(true);
      Promise.all([obterParametros(idParametro), getParametros(idParametro)])
        .catch(() => 'Erro ao obter parâmetros!')
        .finally(() => {
          setFetching(false);
        });
    }
  }, []);

  const getPrefixoDestino = (parametro) => {
    if (permissao.includes('PARAM_ALCADAS_ADMIN')) {
      return parametro.prefixoDestino;
    }
    if (permissao.includes('PARAM_ALCADAS_USUARIO')) {
      return parametro.prefixoDestino === prefixo
        ? parametro.prefixoDestino
        : 'prefixo_subordinada';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Prefixo Destino',
      dataIndex: 'prefixoDestino',
      render: (prefixoDestino) => String(prefixoDestino).padStart(4, '0'),
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
      return getParametros(idParametro)
        .then((onRow) => setParametros(onRow))
        .catch(() => 'Falha ao obter parâmetros!');
    }
    if (permissao.includes('PARAM_ALCADAS_USUARIO')) {
      const prefixoDestinoUsuario = getJurisdicoesSubordinadas(authState);
      return getParametros(idParametro, prefixoDestinoUsuario)
        .then((onRow) => {
          const parametrosFiltrados = onRow.filter(
            (parametro) => parametro.prefixoDestino === prefixo,
          );
          setParametros(parametrosFiltrados);
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

  const renderActionButtons = () => (
    <Row style={{ marginBottom: '15px' }}>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() =>
            history.push({
              pathname: '/movimentacoes/inclusao-de-parametros/',
              state: { idParametro, prefixoDestino, novo: true },
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
              dataSource={parametros.map((parametro) => ({
                ...parametro,
                prefixoDestino: getPrefixoDestino(parametro),
              }))}
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