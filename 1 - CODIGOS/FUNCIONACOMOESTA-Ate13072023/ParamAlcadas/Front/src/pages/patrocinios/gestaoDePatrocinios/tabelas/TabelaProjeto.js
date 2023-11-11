import {
  Card, Col, message, Row, Table, Tooltip, Divider
} from 'antd';
import React, { useEffect, useState } from 'react';
import { toggleSideBar } from 'services/actions/commons';
import { connect } from 'react-redux';
import history from 'history.js';
import { Redirect } from 'react-router-dom';
import {
  ProjectOutlined,
  FundViewOutlined,
  FormOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import '../../TableHead.scss';
import AlfaSort from 'utils/AlfaSort';
import DateBrSort from 'utils/DateBrSort';
import IntegerSort from 'utils/IntegerSort';
import FloatSort from 'utils/FloatSort';
import { getOpcoesFormulario, getGestaoTotal } from '../../apiCalls/apiCalls';

function TabelaProjeto({ match }) {
  const idSolicitacao = parseInt(match.params.idSolicitacao, 10);
  const [dados, setDados] = useState([]);
  const [, setSituacaoDoProjeto] = useState([]);
  const [, setSituacaoDaProvisao] = useState([]);
  const [redirect] = useState(false);
  const [nomeEvento, setNomeEvento] = useState(null);

  useEffect(() => {
    const montado = true;
    getGestaoTotal(idSolicitacao)
      .then(getOpcoesFormGestao(idSolicitacao))
      .then((onRow) => {
        if (montado) {
          setDados(onRow);
        }
      })
      .catch((erro) => `Não carregou!${erro}`);
  }, []);

  const getOpcoesFormGestao = async (id) => {
    getOpcoesFormulario(id)
      .then((opcoesForm) => {
        setNomeEvento(opcoesForm.nomeEvento);
        setSituacaoDoProjeto(opcoesForm.opcoesFormGestao);
        setSituacaoDaProvisao(opcoesForm.opcoesFormProvisao);
      })
      .catch(() => message.error('Falha ao obter lista de opções!'));
  };

  if (redirect) {
    return (
      <Redirect to="/patrocinios/gerenciar-projetos-tabela/" />
    );
  }
  return (
    <>
      <Card>
        <Row>
          <Col span={12}>{`Projeto:  ${idSolicitacao}`}</Col>
          <Col span={12}>{`Nome do Projeto: ${nomeEvento}`}</Col>
        </Row>
      </Card>
      <Table
        className="styledTableHead"
        columns={columns}
        dataSource={dados.map((onRow) => onRow)}
        rowKey="id"
      />
    </>
  );
}

const columns = [
  {
    dataIndex: 'idSolicitacao',
    title: 'Id',
    width: '1%',
    align: 'center',
    sorter: (a, b) => IntegerSort(a.idSolicitacao, b.idSolicitacao),
  },
  {
    title: 'Data SAC',
    dataIndex: 'dataSac',
    width: '2%',
    render: (dataSac) => <>{moment(dataSac).format('DD/MM/YYYY')}</>,
    sorter: {
      DateBrSort: (a, b) => a.datSac - b.dataSac,
      multiple: 1,
    },
  },
  {
    dataIndex: 'notaTecnicaAssinada',
    title: 'Nota Técnica Assinada',
    width: '4%',
    sorter: (a, b) => AlfaSort(a.notaTecnicaAssinada, b.notaTecnicaAssinada),
    render: (text, record) => `${record.notaTecnicaAssinada}`,
  },
  {
    dataIndex: 'idSituacaoProjeto',
    title: 'Situação do Projeto',
    width: '4%',
    sorter: (a, b) => AlfaSort(a.nomeEvento, b.nomeEvento),
  },
  {
    dataIndex: 'idSituacaoProvisao',
    title: 'Situação do Provisionamento',
    width: '3%',
    sorter: (a, b) => AlfaSort(a.nomeEvento, b.nomeEvento),
  },
  {
    dataIndex: 'publicoProjeto',
    title: 'Público alvo',
    width: '2%',
    align: 'center',
    sorter: (a, b) => DateBrSort(a.dataInicioEvento, b.dataInicioEvento),
  },
  {
    dataIndex: 'matriculaResponsavel',
    title: 'Matrícula',
    width: '2%',
    align: 'center',
    sorter: (a, b) => FloatSort(a.valorEvento, b.valorEvento),
  },
  {
    dataIndex: 'nomeResponsavel',
    title: 'Nome do Resposável',
    width: '4%',
    align: 'center',
    sorter: (a, b) => FloatSort(a.valorEvento, b.valorEvento),
  },
  {
    title: 'Ações',
    width: '5%',
    align: 'center',
    render: (text, record) => (
      <>
        <Tooltip title="Gerenciar Projeto">
          <ProjectOutlined
            className="link-color link-cursor"
            onClick={() => history.push(
              `/patrocinios/gerenciar-projeto-patrocinios/${record.idSolicitacao}`,
            )}
              />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="Gerenciar Orçamento">
          <FormOutlined
            className="link-color link-cursor"
              />
        </Tooltip>
        <Divider type="vertical" />
        <Tooltip title="Gerenciar Provisão">
          <FundViewOutlined
            className="link-color link-cursor"
              />
        </Tooltip>
      </>
    )

  },
];

export default connect(null, { toggleSideBar })(TabelaProjeto);
