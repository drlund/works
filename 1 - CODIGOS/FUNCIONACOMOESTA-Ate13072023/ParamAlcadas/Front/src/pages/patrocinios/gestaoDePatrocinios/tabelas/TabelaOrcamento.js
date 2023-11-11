// @ts-nocheck
import {
  Card,
  Col,
  Button,
  message,
  Row,
  Tooltip,
  Divider
} from 'antd';
import React, { useEffect, useState } from 'react';
import { toggleSideBar } from 'services/actions/commons';
import { connect } from 'react-redux';
import history from 'history.js';
import SearchTable from 'components/searchtable/SearchTable';
import AlfaSort from 'utils/AlfaSort';
import IntegerSort from 'utils/IntegerSort';
import FloatSort from 'utils/FloatSort';
import {
  EditOutlined,
  CloseSquareOutlined,
} from '@ant-design/icons';
import { confirmarExclusao } from 'pages/projetos/Helpers/CommonsFunctions';
import { getOpcoesFormulario, getOrcamento, deleteOrcamento } from '../../apiCalls/apiCalls';

import '../../TableHead.scss';

function TabelaOrcamento({ match }) {
  const idProjeto = parseInt(match.params.idSolicitacao, 10);
  const idSolicitacao = parseInt(match.params.idSolicitacao, 10);
  const [dados, setDados] = useState([]);
  const [excluiDadoOrc, setExcluiDadoOrc] = useState({});
  const [nomeEvento, setNomeEvento] = useState(null);

  useEffect(() => {
    Promise.all([
      obterOrcamentos(idSolicitacao),
      getOpcoesFormGestao(idSolicitacao)
    ])
      .catch(() => 'Erro ao obter Orçamentos ou Opções!');
  }, []);

  const obterOrcamentos = () => {
    getOrcamento(idSolicitacao)
      .then((onRow) => setDados(onRow))
      .catch(() => 'Falha ao obter a lista de orçamentos!');
  };

  const getOpcoesFormGestao = (id) => {
    getOpcoesFormulario(id)
      .then((opcoesForm) => setNomeEvento(opcoesForm.nomeEvento))
      .catch(() => message.error('Falha ao obter lista de opções!'));
  };

  const removerOrcamento = (id) => {
    deleteOrcamento({ id })
      .then((onRow) => setExcluiDadoOrc(onRow))
      .then(() => obterOrcamentos(idSolicitacao))
      .catch(() => message.error('Problema ao excluir orçamento!'));
    return excluiDadoOrc;
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
      dataIndex: 'prefixoOrigem',
      title: 'Prefixo',
      width: '2%',
    },
    {
      dataIndex: 'nomePrefixoOrigem',
      title: 'Nome',
      width: '4%',
      sorter: (a, b) => AlfaSort(a.nomePrefixoOrigem, b.nomePrefixoOrigem),
    },
    {
      dataIndex: 'incluidoOrcMkt',
      title: 'Incluído Orç. MKT',
      width: '3%',
    },
    {
      dataIndex: 'valorOrcamento',
      title: 'Valor',
      width: '2%',
      align: 'left',
      sorter: (a, b) => FloatSort(a.valorOrcamento, b.valorOrcamento),
      render: (valorOrcamento) => Number(valorOrcamento).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' }),
    },
    {
      dataIndex: 'observacao',
      title: 'Observação',
      width: '9%',
      align: 'left',
      sorter: (a, b) => AlfaSort(a.observacao, b.observacao),
    },
    {
      dataIndex: 'matriculaResponsavel',
      title: 'Matrícula',
      width: '3%',
    },
    {
      dataIndex: 'nomeResponsavel',
      title: 'Responsável',
      width: '7%',
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
              name="editar"
              className="link-color link-cursor"
              onClick={() => history.push({
                pathname: '/patrocinios/gerenciar-orcamento-patrocinios/',
                state: record
              })}
                  />
            <Divider type="vertical" />
          </Tooltip>
          <Tooltip title="Excluir Orçamento">
            <CloseSquareOutlined
              className="link-color link-cursor"
              onClick={() => confirmarExclusao(
                record.id,
                removerOrcamento,
                'Confirmar exclusão do orçamento?'
              )}
                />
          </Tooltip>
        </>
      )
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
              name="incluir"
              size="large"
              onClick={() => history.push({
                pathname: '/patrocinios/gerenciar-orcamento-incluir/',
                state: { idSolicitacao, idProjeto, novo: true }
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
        rowKey="id"
        size="large"
        bordered
      />
    </>
  );
}

export default connect(null, { toggleSideBar })(TabelaOrcamento);
