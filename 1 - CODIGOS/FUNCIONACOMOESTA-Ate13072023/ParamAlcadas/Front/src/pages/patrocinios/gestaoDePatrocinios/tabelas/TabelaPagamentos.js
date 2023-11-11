// @ts-nocheck
import {
  Card,
  Col,
  message,
  Row,
  Tooltip,
  Divider,
  Button
}
  from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import history from 'history.js';
import { EditOutlined, CloseSquareOutlined } from '@ant-design/icons';

import { toggleSideBar } from 'services/actions/commons';
import SearchTable from 'components/searchtable/SearchTable';
import AlfaSort from 'utils/AlfaSort';
import FloatSort from 'utils/FloatSort';
import IntegerSort from 'utils/IntegerSort';
import { confirmarExclusao } from 'pages/projetos/Helpers/CommonsFunctions';

import DateBrSort from 'utils/DateBrSort';

import {
  getOpcoesFormulario,
  getPagamentos,
  deletePagamento,
} from '../../apiCalls/apiCalls';

import '../../TableHead.scss';

function TabelaPagamentos({ match }) {
  const idProjeto = parseInt(match.params.idSolicitacao, 10);
  const idSolicitacao = parseInt(match.params.idSolicitacao, 10);
  const [dados, setDados] = useState([]);
  const [excluiDadoPag, setExcluiDadoPag] = useState({});
  const [nomeEvento, setNomeEvento] = useState(null);

  useEffect(() => {
    Promise.all([
      obterPagamentos(idProjeto),
      getOpcoesFormGestao(idProjeto),
    ]).catch(() => 'Erro ao obter Pagamentos ou Opções!');
  }, []);

  const obterPagamentos = () => {
    getPagamentos(idProjeto)
      .then((onRow) => setDados(onRow))
      .catch(() => 'Falha ao obter a lista de pagamentos!');
  };

  const getOpcoesFormGestao = () => {
    getOpcoesFormulario(idProjeto)
      .then((opcoesForm) => setNomeEvento(opcoesForm.nomeEvento))
      .catch(() => message.error('Falha ao obter lista de opções!'));
  };

  const removerPagamento = (id) => {
    deletePagamento({ id })
      .then((onRow) => setExcluiDadoPag(onRow))
      .then(() => obterPagamentos(idProjeto))
      .catch(() => message.error('Problema ao excluir pagamento!'));
    return excluiDadoPag;
  };

  const columns = [
    {
      dataIndex: 'id',
      title: 'Id',
      width: '1%',
      align: 'center',
      sorter: (a, b) => IntegerSort(a.id, b.id),
    },
    {
      dataIndex: 'dataDoPagamento',
      title: 'Data do Pagamento',
      width: '3%',
      render: (dataDoPagamento) => <>{moment(dataDoPagamento).format('DD/MM/YYYY')}</>,
      sorter: (a, b) => DateBrSort(a.dataDoPagamento, b.dataDoPagamento),
    },
    {
      dataIndex: 'valorPagamento',
      title: 'Valor do Pagamento',
      width: '2%',
      align: 'left',
      sorter: (a, b) => FloatSort(a.valorPagamento, b.valorPagamento),
      render: (valorPagamento) => Number(valorPagamento).toLocaleString(
        'PT-br',
        {
          style: 'currency',
          currency: 'BRL',
        }
      ),
    },
    {
      dataIndex: 'observacao',
      title: 'Observação',
      width: '7%',
      sorter: (a, b) => AlfaSort(a.nomeSolicitante, b.nomeSolicitante),
    },
    {
      dataIndex: 'nomeResponsavel',
      title: 'Nome do Responsável',
      width: '10%',
      sorter: (a, b) => AlfaSort(a.nomeResponsavel, b.nomeResponsavel),
    },
    {
      title: 'Ações',
      width: '5%',
      align: 'center',
      render: (text, record) => (
        <>
          <Tooltip title="Editar">
            <EditOutlined
              className="link-color link-cursor"
              onClick={() => history.push({
                pathname: '/patrocinios/gerenciar-pagamentos-patrocinios/',
                state: record,
              })}
          />
            <Divider type="vertical" />
          </Tooltip>
          <Tooltip title="Excluir Pagamento">
            <CloseSquareOutlined
              className="link-color link-cursor"
              onClick={() => confirmarExclusao(
                record.id,
                removerPagamento,
                'Confirmar exclusão do pagamento?',
              )}
          />
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <Card>
        <Row>
          <Col span={8}>{`Projeto:  ${idSolicitacao}`}</Col>
          <Col span={8}>{`Nome do Projeto: ${nomeEvento}`}</Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button
              type="button"
              style={{ borderRadius: 3, background: ' #06b539', color: 'white' }}
              name="voltar"
              size="large"
              onClick={() => history.goBack()}
                  >
              Voltar
            </Button>
          </Col>
          <Col span={4} style={{ textAlign: 'right' }}>
            <Button
              type="primary"
              style={{ borderRadius: 3 }}
              size="large"
              onClick={() => history.push({
                pathname: '/patrocinios/gerenciar-pagamentos-incluir/',
                state: { idSolicitacao, idProjeto, novo: true },
              })}
            >
              Incluir
            </Button>
          </Col>
        </Row>
      </Card>
      <SearchTable
        className="styledTableHead"
        columns={columns}
        dataSource={dados}
        size="large"
        rowKey="id"
        bordered
      />
    </>
  );
}

export default connect(null, { toggleSideBar })(TabelaPagamentos);
