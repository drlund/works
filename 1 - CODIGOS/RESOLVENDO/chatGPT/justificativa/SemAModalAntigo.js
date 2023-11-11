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
import { Card, Tooltip, Button, Row, Col, Space, Divider, message } from 'antd';
import history from 'history.js';
import { confirmarExclusao } from 'pages/projetos/Helpers/CommonsFunctions';
import { connect } from 'react-redux';
import { getParametros, delParametro } from './apiCalls/apiParamAlcadas';

function ParamAlcadasTable({ ...props }) {
  const { idParametro } = parseInt(props.id, 10);
  const [fetching, setFetching] = useState(true);
  const [parametros, setParametros] = useState([{}]);
  const [excluiParametro, setExcluiParametro] = useState({});

  useEffect(() => {
    setFetching(true);
    Promise.all([obterParametros(idParametro), getParametros(idParametro)])
      .catch(() => 'Erro ao obter parâmetros!')
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
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
              onClick={() =>
                confirmarExclusao(
                  record.id,
                  removerParametro,
                  'Confirmar exclusão do parâmetro?',
                )
              }
            />
          </Tooltip>
        </span>
      ),
    },
  ];

  const obterParametros = () => {
    getParametros(idParametro)
      .then((onRow) => setParametros(onRow))
      .catch(() => 'Falha ao obeter parâmetros!');
    return getParametros;
  };

  const removerParametro = (id) => {
    setExibirJustificativa(true);
    delParametro({ id })
      .then((onRow) => setExcluiParametro(onRow))
      .then(() => getParametros(id))
      .catch(() => message.error('Falha ao excluir parâmetro!'));
    return excluiParametro;
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
    </Space>
  );
}

export default connect(null, { toggleSideBar })(ParamAlcadasTable);