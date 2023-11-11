import React, { useState, useEffect } from 'react';
import { toggleSideBar } from 'services/actions/commons';
import DateBrSort from 'utils/DateBrSort';
import BBSpining from 'components/BBSpinning/BBSpinning';
import SearchTable from 'components/searchtable/SearchTable';
import './TableHead.scss';
import { Card, Row, Col, Space, Button, DatePicker } from 'antd';
import { connect, useSelector } from 'react-redux';

import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';

import moment from 'moment';
import { getLogAtualizacoes } from './apiCalls/Logs';

/**
 * @typedef {Object} Props
 * @property {string} id
 */

/**
 * @param {Object} props
 * @param {object} props.match
 * @param {Props} props.match.params
 */

function LogAtualizacoesTable({ match }) {
  const { RangePicker } = DatePicker;
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Painel do Gestor', authState);

  const id = parseInt(match.params.id, 10);
  const [atualizacoes, setAtualizacoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [carregando, setCarregando] = useState(false);

  const formatarData = (/** @type {moment.MomentInput} */ data) =>
    moment(data).format('DD/MM/YYYY - HH:mm:ss');

  const adicionarNovosDados = (novosDados) => {
    setAtualizacoes([...atualizacoes, ...novosDados]);
  };

  const carregarMaisDados = () => {
    setCarregando(true);
    const nextPage = page + 1;
    getLogAtualizacoes(id, nextPage, pageSize)
      .then((data) => {
        if (data.length > 0) {
          adicionarNovosDados(data);
          setPage(nextPage);
        }
      })
      .catch(() => 'Erro ao obter atualizacoes!')
      .finally(() => {
        setCarregando(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    getLogAtualizacoes(id, page, pageSize)
      .then((data) => {
        if (data.length > 0) {
          adicionarNovosDados(data);
          setPage(nextPage);
        }
      })
      .catch(() => 'Erro ao obter atualizações!')
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: 'Atualização',
      dataIndex: 'ts_atualizacao',
      align: 'center',
      sorter: (
        /** @type {{ ts_atualizacao: Date; }} */ a,
        /** @type {{ ts_atualizacao: Date; }} */ b,
      ) => DateBrSort(a.ts_atualizacao, b.ts_atualizacao),
      render: (/** @type {Date} */ data) => formatarData(data),
    },
    {
      title: 'Histórico',
      dataIndex: 'historico',
    },
    {
      title: 'Matrícula',
      dataIndex: 'matricula',
      align: 'center',
      render: (/** @type {string} */ matricula) =>
        String(matricula).padStart(4, '0'),
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <RangePicker />
      <Row>
        <Col span={24}>
          {permissao.includes('ADM_LOGS') ? (
            <Card title="Log de Atualizações">
              <BBSpining spinning={isLoading}>
                <SearchTable
                  className="styledTableHead"
                  columns={columns}
                  dataSource={atualizacoes.map((logAtualizacoes) => ({
                    ...logAtualizacoes,
                  }))}
                  size="small"
                  pagination={{
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50'],
                    defaultPageSize: 10,
                  }}
                  bordered
                />
              </BBSpining>
              <Button
                type="primary"
                style={{ float: 'right' }}
                onClick={() => {
                  carregarMaisDados();
                }}
                disabled={carregando}
              >
                {carregando ? 'Carregando...' : 'Carregar Mais!'}
              </Button>
            </Card>
          ) : (
            <span style={{ fontSize: '35px', fontWeight: 'bold' }}>
              Funcionário sem acesso à tabela de Log de Atualizações.
            </span>
          )}
        </Col>
      </Row>
    </Space>
  );
}

export default connect(null, { toggleSideBar })(LogAtualizacoesTable);
