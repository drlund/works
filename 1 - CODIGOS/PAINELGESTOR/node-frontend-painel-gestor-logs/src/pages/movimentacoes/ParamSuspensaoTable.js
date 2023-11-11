/* eslint-disable no-shadow */
// @ts-nocheck
import moment from 'moment';
import { useHistory } from 'react-router-dom';
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
import { confirmarExclusao } from 'pages/projetos/Helpers/CommonsFunctions';
import { connect, useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';
import {
  getSuspensoesView,
  getTipoSuspensao,
  deleteSuspensao,
} from './apiCalls/apiParamSuspensao';

/**
 * @typedef {Object} Props
 * @property {string} id
 */

/**
 * @param {Object} props
 * @param {object} props.param
 * @param {Props} props.param.location
 */

const formatarData = (data) => moment(data).format('DD/MM/YYYY');

function ParamSuspensaoTable({ ...props }) {
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Movimentações', authState);
  const history = useHistory();

  const idSuspensao = parseInt(props.id, 10);

  const [fetching, setFetching] = useState(true);
  const [suspensoes, setSuspensoes] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [observacao, setObservacao] = useState('');

  const [selectedRecord, setSelectedrecord] = useState(null);

  const [erroObservacao, setErroObservacao] = useState('');
  const [tipoSuspensaoDados, setTipoSuspensaoDados] = useState([]);

  useEffect(() => {
    if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
      setFetching(true);
      Promise.all([obterSuspensoes(), getSuspensoesView(idSuspensao)])
        .then(([, getSuspensoesResultado]) => {
          setSuspensoes(Object.values(getSuspensoesResultado));
        })
        .catch(() => {
          message.error('Erro ao obter suspensões!');
        })
        .finally(() => {
          setFetching(false);
        });
    }
  }, []);

  useEffect(() => {
    if (tipoSuspensaoDados.length === 0) {
      getTipoSuspensao()
        .then((tipoSuspensaoDados) => {
          setTipoSuspensaoDados(tipoSuspensaoDados);
        })
        .catch((error) => {
          message.error('Erro ao buscar os dados do tipo de suspensão:', error);
        });
    }
  }, []);

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
    },
    {
      title: 'Valor',
      dataIndex: 'valor',
    },
    {
      title: 'Tipo Suspensão',
      dataIndex: 'tipoSuspensao',
      render: (data) => {
        const tipoSuspensaoItem = tipoSuspensaoDados.find(
          (item) => item.id === data,
        );
        return tipoSuspensaoItem ? tipoSuspensaoItem.mensagem : '';
      },
    },
    {
      title: 'Validade',
      dataIndex: 'validade',
      render: (data) => formatarData(data),
    },
    {
      title: 'Matrícula Responsável',
      dataIndex: 'matriculaResponsavel',
      align: 'center',
    },
    {
      title: 'Ações',
      width: '10%',
      align: 'center',
      render: (/** @type {any} */ record) => (
        <span>
          <Tooltip title="Editar">
            <EditOutlined
              className="link-color link-cursor"
              onClick={() =>
                history.push({
                  pathname: `/movimentacoes/editar-suspensao/${record.id}`,
                  state: {
                    id: record.id,
                    tipo: record.valor,
                    tipoSuspensao: record.tipoSuspensao,
                    validade: record.validade,
                  },
                })
              }
            />
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip title="Excluir Suspensão">
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

  const obterSuspensoes = () =>
    getSuspensoesView(idSuspensao)
      .then((getSuspensoesResultado) =>
        setSuspensoes(Object.values(getSuspensoesResultado)),
      )
      .catch(() => message.error('Falha ao obter parâmetros!'));

  const removerSuspensao = (/** @type {number} */ id) => {
    deleteSuspensao({ id, observacao })
      .then(() => {
        setShowModal(false);
        setObservacao('');
        return obterSuspensoes();
      })
      .catch(() => message.error('Falha ao excluir suspensão!'));
  };

  const renderActionButtons = () => (
    <Row style={{ marginBottom: '15px' }}>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() =>
            history.push({
              pathname: '/movimentacoes/incluir-suspensao/',
              state: { idSuspensao, novo: true },
            })
          }
        >
          Incluir Suspensão
        </Button>
        <Tooltip title="Atualizar lista">
          <Button
            icon={<RedoOutlined />}
            loading={fetching}
            style={{ marginLeft: '15px' }}
            onClick={() => obterSuspensoes()}
          />
        </Tooltip>
      </Col>
    </Row>
  );

  return (
    <Space direction="vertical" size="large" style={{ display: 'flex' }}>
      <Row>
        <Col span={24}>
          <Card title="Parametrização das Suspensões do Portal de Movimentações">
            {renderActionButtons()}
            <SearchTable
              className="styledTableHead"
              columns={columns}
              dataSource={suspensoes.map((suspensao) => ({
                ...suspensao,
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
        onCancel={() => {
          setShowModal(false);
          setErroObservacao('');
        }}
        onOk={() => {
          if (!observacao) {
            setErroObservacao('Preencha o campo observação.');
            return;
          }

          setShowModal(false);
          if (selectedRecord) {
            confirmarExclusao(
              selectedRecord.id,
              removerSuspensao,
              'Confirmar exclusão da suspensão?',
            );
          }
        }}
      >
        <Input.TextArea
          required
          className="text-area"
          rows={4}
          value={observacao}
          onChange={(e) => setObservacao(e.target.value)}
        />
        {erroObservacao && <p className="error-message">{erroObservacao}</p>}
      </Modal>
    </Space>
  );
}

export default connect(null, { toggleSideBar })(ParamSuspensaoTable);
