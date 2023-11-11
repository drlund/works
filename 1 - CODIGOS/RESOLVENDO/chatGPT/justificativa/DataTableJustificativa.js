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
import { Card, Tooltip, Button, Row, Col, Space, Divider, message, Modal, Input } from 'antd';
import history from 'history.js';
import { confirmarExclusao } from 'pages/projetos/Helpers/CommonsFunctions';
import { connect } from 'react-redux';
import { getParametros, delParametro } from './apiCalls/apiParamAlcadas';

function ParamAlcadasTable({ ...props }) {
  const { idParametro } = parseInt(props.id, 10);
  const [fetching, setFetching] = useState(true);
  const [parametros, setParametros] = useState([{}]);
  const [excluiParametro, setExcluiParametro] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [observacao, setObservacao] = useState('');

  useEffect(() => {
    setFetching(true);
    Promise.all([obterParametros(idParametro), getParametros(idParametro)])
      .catch(() => 'Erro ao obter parâmetros!')
      .finally(() => {
        setFetching(false);
      });
  }, []);

  const columns = [
    // ...resto do código das colunas
  ];

  const obterParametros = () => {
    getParametros(idParametro)
      .then((onRow) => setParametros(onRow))
      .catch(() => 'Falha ao obter parâmetros!');
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

  const handleExcluirParametro = () => {
    // Realizar a exclusão do parâmetro com a observação
    const id = excluiParametro.id; // Ou qualquer outra forma de obter o ID do parâmetro a ser excluído
    const observacaoExclusao = observacao; // Armazene a observação digitada pelo usuário
  
    // Realizar as operações necessárias para excluir o parâmetro com a observação
    // Exemplo:
    delParametro({ id, observacao: observacaoExclusao })
      .then(() => {
        // Exclusão bem-sucedida, atualize a lista de parâmetros
        getParametros(idParametro)
          .then((onRow) => setParametros(onRow))
          .catch(() => message.error('Falha ao obter parâmetros após exclusão!'));
      })
      .catch(() => message.error('Falha ao excluir parâmetro!'));
  
    // Após a exclusão, feche a modal
    setShowDeleteModal(false);
  };

  const renderActionButtons = () => (
    // ...resto do código dos botões de ação
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
        title="Excluir Parametro"
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onOk={handleExcluirParametro}
      >
        <Input.TextArea
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
          placeholder="Digite uma observação"
        />
      </Modal>
    </Space>
  );
}

export default connect(null, { toggleSideBar })(ParamAlcadasTable);