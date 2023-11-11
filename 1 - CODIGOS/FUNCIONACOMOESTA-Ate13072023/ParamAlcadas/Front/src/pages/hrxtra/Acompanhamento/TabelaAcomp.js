import React, { useEffect, useState } from 'react';
import { message, Skeleton, Table, Tooltip, Button, Row, Col, Tag, Drawer, Typography } from 'antd';
import {getSolicitacoes} from 'services/ducks/HoraExtra.ducks';
import ModalConsulta from 'pages/hrxtra/Acompanhamento/ModalConsulta';
import { SearchOutlined, WarningOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'pages/hrxtra/Acompanhamento/Acompanhamento.css';
import PageLoading from 'components/pageloading/PageLoading';

const {Title} = Typography;


function TabelaAcomp(props) {
  const [loading, setLoading] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [componenteModal, setComponenteModal] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    let isLoading = true;

    setLoading(prev => true);

    if (props.update)
      getSolicitacoes(props.data.periodo, props.data.status, props.data.regional)
        .then(resultado => {
          isLoading && setSolicitacoes(prev => resultado)
        })
        .catch(error => {
          message.error(error);
        })
        .then(() => isLoading && setLoading(prev => false));

    return () => isLoading = false;
  }, [props.data.periodo, props.data.status, props.data.regional, props.update, setSolicitacoes, setLoading]);

  const openModalConsulta = (solicitacao) => {
    setComponenteModal(prev => (<ModalConsulta solicitacao={solicitacao} />));
    setModalVisible(prev => true);
  };

  const closeModalConsulta = () => {
    setModalVisible(prev => false);
  }

  const colunas = () => {
    return [
      {
        title: "Protocolo",
        dataIndex: "protocolo",
        key: "protocolo",
        render: (text, record) => {
          return (<Tag>{text}</Tag>)
        }
      },
      {
        title: 'Dt. Ult. Atualiz.',
        dataIndex: 'dtAtualiz',
        key: 'dtAtualiz',
        render: (text, record) =>  {
          return (
            <Tooltip title={record.mtvAtualiz}>
              {record.dtAtualiz}
            </Tooltip>
          )
        }
      },
      {
        title: 'Regional',
        dataIndex: 'regional',
        key: 'regional',
        render: (text, record) =>  {
          return text
        }
      },
      {
        title: 'Pref. Dep',
        dataIndex: 'pref_dep',
        key: 'pref_dep',
        render: (text, record) =>  {
          return (
            <Tooltip title={record.nome_dep}>
              {record.pref_dep}
            </Tooltip>
          )
        }
      },
      {
        title: 'Funcionário',
        dataIndex: 'funci',
        key: 'funci',
        render: (text, record) =>  {
          return (
            <Tooltip title={record.nome_dest}>
              {record.mat_dest}
            </Tooltip>
          )
        }
      },
      {
        title: 'Comissão',
        dataIndex: 'comissao_dest',
        key: 'comissao_dest',
        render: (text, record) =>  {
          return (
            <Tooltip title={record.comissao_dest.split('-')[1]}>
              {record.comissao_dest.split('-')[0]}
            </Tooltip>
          )
        }
      },
      {
        title: 'Status',
        dataIndex: 'statusReduzido',
        key: 'statusReduzido',
        render: (text, record) =>  {
          const color = {
            1: 'orange',
            2: 'orange',
            3: 'green',
            4: 'red'
          };

          return <Tooltip title={record.statusNome}>
                   <Tag color={color[record.status]}>{text}</Tag>
                 </Tooltip>
        }
      },
      {
        title: 'HE Solic. (Pref)',
        dataIndex: 'horasSolPref',
        key: 'horasSolPref',
        render: (text, record) =>  {
          return text + ' h'
        }
      },
      {
        title: 'HE Autoriz. (Pref)',
        dataIndex: 'horasAutPref',
        key: 'horasAutPref',
        render: (text, record) =>  {
          return text + ' h'
        }
      },
      {
        title: 'HE Solic. (Funci)',
        dataIndex: 'horasSolFunci',
        key: 'horasSolFunci',
        render: (text, record) =>  {
          return text + ' h'
        }
      },
      {
        title: 'HE Autoriz. (Funci)',
        dataIndex: 'horasAutFunci',
        key: 'horasAutFunci',
        render: (text, record) =>  {
          return text + ' h'
        }
      },
      {
        title: 'Ações',
        dataIndex: 'acoes',
        key: 'acoes',
        width: '2%',
        align: 'center',
        render: (text, record) => {

          const componenteAcao = record.tipoUnidade === 'UN' ? <WarningOutlined style={{color: 'orange'}} size="small" /> : <Button shape="circle" danger type="text" size="small" onClick={() => openModalConsulta(record)} icon={<WarningOutlined />} />;

          return (
            <Row style={{whiteSpace: 'nowrap'}}>
              <Col span={10}>
                <Tooltip title="Dados da Solicitação">
                  <Button shape="circle" type="link" size="small" onClick={() => openModalConsulta(record)} icon={<SearchOutlined />} />
                </Tooltip>
              </Col>
              {
                [1,2].includes(record.status) &&
                <Col span={10} offset={4}>
                  <Tooltip title="Falta DE ACORDO">
                    {componenteAcao}
                  </Tooltip>
                </Col>
              }
            </Row>
          )
        }
      }
    ]
  }

  return (
    <React.Fragment key={moment().valueOf()}>
      <Table
        key='table'
        bordered
        dataSource={solicitacoes}
        rowKey="id"
        columns={colunas()}
        locale={{
            emptyText: loading  && <><Skeleton active /><Skeleton active /><Skeleton active /></>
          }}
        size="small"
        loading={
          loading ? { spinning: loading, indicator: <PageLoading customClass="flexbox-row" /> } : false
          }
      />
      <Drawer
        key='drawer'
        title={<Row><Col span={24} style={{textAlign: "center"}}><Title level={3}>Solicitação de Horas Extras</Title></Col></Row>}
        placement="right"
        visible={modalVisible}
        width="85%"
        destroyOnClose
        onClose={closeModalConsulta}
        footer={[
          <Row key={1}><Col span={24} style={{textAlign: "center"}}><Button key="close" onClick={closeModalConsulta}>Fechar</Button></Col></Row>
        ]}
      >
        {componenteModal}
      </Drawer>
    </React.Fragment>
  )
}

export default React.memo(TabelaAcomp);
