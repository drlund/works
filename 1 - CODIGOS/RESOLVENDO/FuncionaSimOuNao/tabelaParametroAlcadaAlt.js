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
  let subordinada = ''; // Variável local para armazenar o valor de 'subordinada'

  useEffect(() => {
    if (
      permissao.includes('PARAM_ALCADAS_ADMIN') ||
      permissao.includes('PARAM_ALCADAS_USUARIO')
    ) {
      setFetching(true);
      Promise.all([obterParametros()]) // Removida a chamada a 'obterSubordinada'
        .catch(() => 'Erro ao obter parâmetros!')
        .finally(() => {
          setFetching(false);
        });
    }
  }, []);

  const columns = [
    // Restante das colunas...

    {
      title: 'Subordinada',
      dataIndex: 'subordinada',
      render: (prefixo) => String(prefixo || subordinada).padStart(4, '0'),
    },

    // Restante das colunas...
  ];

  const obterParametros = () => {
    if (permissao.includes('PARAM_ALCADAS_ADMIN')) {
      // Permissão de administrador, obtém todos os parâmetros
      return Promise.all([getParametros(idParametro)])
        .then(([onRow]) => {
          setParametros(onRow);
          subordinada = getJurisdicoesSubordinadas(authState); // Obtém o valor de 'subordinada'
        })
        .catch(() => 'Falha ao obter parâmetros!');
    }
    if (permissao.includes('PARAM_ALCADAS_USUARIO')) {
      // Permissão de usuário, obtém somente os parâmetros relacionados ao prefixo do usuário
      const prefixoDestinoUsuario = getJurisdicoesSubordinadas(authState);
      return Promise.all([
        getParametros(idParametro, prefixoDestinoUsuario),
      ])
        .then(([onRow]) => {
          setParametros(onRow);
          subordinada = getJurisdicoesSubordinadas(authState); // Obtém o valor de 'subordinada'
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
        {/* Restante do código... */}
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
      {/* Restante do código... */}
    </Space>
  );
}

export default connect(null, { toggleSideBar })(ParamAlcadasTable);