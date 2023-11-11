import {
  Card, Col, message, Row, Tooltip, Divider, Button
} from 'antd';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import history from 'history.js';
import { EditOutlined, CloseSquareOutlined } from '@ant-design/icons';

import AlfaSort from 'utils/AlfaSort';
import DateBrSort from 'utils/DateBrSort';
import IntegerSort from 'utils/IntegerSort';
import FloatSort from 'utils/FloatSort';
import { toggleSideBar } from 'services/actions/commons';
import SearchTable from 'components/searchtable/SearchTable';

import { confirmarExclusao } from 'pages/projetos/Helpers/CommonsFunctions';
import {
  getOpcoesFormulario,
  getProvisao,
  deleteProvisao,
} from '../../apiCalls/apiCalls';

import '../../TableHead.scss';

function TabelaProvisao({ match }) {
  const idProjeto = parseInt(match.params.idSolicitacao, 10);
  const idSolicitacao = parseInt(match.params.idSolicitacao, 10);
  const [dados, setDados] = useState([]);
  const [excluiDado, setExcluiDado] = useState({});
  const [nomeEvento, setNomeEvento] = useState(null);

  useEffect(() => {
    Promise.all([
      obterProvisoes(idProjeto),
      getOpcoesFormGestao(idProjeto)
    ])
      .catch(() => 'Erro ao obter Provisões ou Opções!');
  }, []);

  const obterProvisoes = () => {
    getProvisao(idProjeto)
      .then((onRow) => setDados(onRow))
      .catch(() => 'Falha ao obter a lista de provisões!');
  };

  const getOpcoesFormGestao = () => {
    getOpcoesFormulario(idProjeto)
      .then((opcoesForm) => setNomeEvento(opcoesForm.nomeEvento))
      .catch(() => message.error('Falha ao obter lista de opções!'));
  };

  const removerProvisao = (id) => {
    deleteProvisao({ id })
      .then((onRow) => setExcluiDado(onRow))
      .then(() => obterProvisoes(idProjeto))
      .catch(() => message.error('Problema ao excluir provisão!'));
    return excluiDado;
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
      dataIndex: 'valorProvisao',
      title: 'Valor da Provisão',
      width: '3%',
      sorter: (a, b) => FloatSort(a.valorProvisao, b.valorProvisao),
      render: (valorProvisao) => Number(valorProvisao).toLocaleString('PT-br', {
        style: 'currency',
        currency: 'BRL',
      }),
    },
    {
      dataIndex: 'competenciaProvisao',
      title: 'Competência',
      width: '2%',
      align: 'center',
      render: (competenciaProvisao) => <>{moment(competenciaProvisao).format('MM/YYYY')}</>,
      sorter: (a, b) => DateBrSort(a.competenciaProvisao, b.competenciaProvisao),
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
      sorter: (a, b) => AlfaSort(a.nomeEvento, b.nomeEvento),
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
                pathname: '/patrocinios/gerenciar-provisao-patrocinios/',
                state: record,
              })}
              />
            <Divider type="vertical" />
          </Tooltip>
          <Tooltip title="Excluir Provisão">
            <CloseSquareOutlined
              className="link-color link-cursor"
              onClick={() => confirmarExclusao(
                record.id,
                removerProvisao,
                'Confirmar exclusão da provisão?'
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
                pathname: '/patrocinios/gerenciar-provisao-incluir/',
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

export default connect(null, { toggleSideBar })(TabelaProvisao);
