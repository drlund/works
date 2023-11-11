import React, { useState, useEffect } from 'react';
import { toggleSideBar } from 'services/actions/commons';
import SearchTable from 'components/searchtable/SearchTable';
import './TableHead.scss';
import { Card, Row, Col, Space } from 'antd';
import { connect, useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';

import moment from 'moment';
import { getLogAcessos } from './apiCalls/Logs';

/**
 * @typedef {Object} Props
 * @property {string} id
 */

/**
 * @param {Object} props
 * @param {object} props.match
 * @param {Props} props.match.params
 */

function LogAcessosTable({ match }) {
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Painel do Gestor', authState);
  const id = parseInt(match.params.id, 10);
  const [acessos, setAcessos] = useState([]);
  const formatarData = (/** @type {moment.MomentInput} */ data) =>
    moment(data).format('DD/MM/YYYY - HH:mm:ss');

  useEffect(() => {
    getLogAcessos(id)
      .then((data) => {
        setAcessos(data);
      })
      .catch(() => 'Erro ao obter acessos!')
      .finally(() => {});
  }, [id]);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
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
    {
      title: 'Comissão',
      dataIndex: 'codigoComissao',
      align: 'center',
    },
    {
      title: 'Nome Comissão',
      dataIndex: 'nomeComissao',
    },
    {
      title: 'Prefixo',
      dataIndex: 'prefixo',
      align: 'center',
    },
    {
      title: 'Nome Prefixo',
      dataIndex: 'nomePrefixo',
    },
    {
      title: 'UOR',
      dataIndex: 'uor',
    },
    {
      title: 'Prefixo Consultado',
      dataIndex: 'prefixoConsultado',
      align: 'center',
    },
    {
      title: 'Subordinada Consultada',
      dataIndex: 'subordinadaConsultada',
      align: 'center',
    },
    {
      title: 'Data',
      dataIndex: 'createdAt',
      align: 'center',
      render: (/** @type {Date} */ data) => formatarData(data),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Row>
        <Col span={24}>
          {permissao.includes('ADM_LOGS') ? (
            <Card title="Log Acessos">
              <SearchTable
                className="styledTableHead"
                columns={columns}
                dataSource={acessos.map((logAcessos) => ({
                  ...logAcessos,
                }))}
                rowKey="id"
                size="small"
                pagination={{
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                  defaultPageSize: 10,
                }}
                bordered
              />
            </Card>
          ) : (
            <span style={{ fontSize: '35px', fontWeight: 'bold' }}>
              Funcionário sem acesso à tabela de Log de Acessos.
            </span>
          )}
        </Col>
      </Row>
    </Space>
  );
}

export default connect(null, { toggleSideBar })(LogAcessosTable);
