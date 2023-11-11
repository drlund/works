import React, { useEffect } from 'react';
import { Button, Layout, Modal, Space, Tag, message } from 'antd';
const { Content } = Layout;

import SearchTable from '@/components/searchtable/SearchTable';

import OnlineSwitch from './components/OnlineSwitch';
import AtivoSwitch from './components/AtivoSwitch';

import './index.css';
import { getFerramentas } from '../apiCalls/ferramentaCall';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import CadastrarFerramentaModal from './components/CadastrarFerramentaModal';

function GerenciadorDisponibilidade() {
  const authState = useSelector(({ app }) => app.authState);
  const isGerente = /GUT/.test(authState?.sessionData.ref_org);

  const [listaFerramentas, setListaFerramentas] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const refreshListaFerramentas = () => {
    getFerramentas()
      .then((acoes) => {
        setListaFerramentas(acoes);
      })
      .catch(() => {
        message.error(
          'Não foi possível obter a lista das ferramentas cadastradas.',
        );
      });
  };

  useEffect(() => {
    refreshListaFerramentas();
  }, []);

  let columns = [
    /*   {
      title: 'Id',
      dataIndex: 'id',
      width: '5%',
    }, */
    {
      title: 'Ferramenta',
      dataIndex: 'nome',
      width: '40%',
    },
    {
      title: 'Host',
      dataIndex: 'host',
      align: 'center',
      width: '10%',
      render: (text, record) => {
        if (text == 'php') {
          return <Tag color="green">PHP</Tag>;
        }
        if (text == 'v8') {
          return <Tag color="blue">V8</Tag>;
        }
      },
    },
    {
      title: 'Online',
      dataIndex: 'codigoStatus',
      width: '10%',
      align: 'center',
      key: 'online',
      render: (text, record) => {
        return (
          <OnlineSwitch
            codigoStatus={text}
            record={record}
            refreshStatus={refreshListaFerramentas}
          />
        );
      },
    },
    {
      title: 'Situação',
      width: '15%',
      align: 'center',
      key: 'situacao',
      dataIndex: 'codigoStatus',
      render: (text, record) => {
        return (
          <AtivoSwitch
            disabled={!isGerente}
            codigoStatus={text}
            record={record}
            refreshStatus={refreshListaFerramentas}
          />
        );
      },
    },
  ];

  return (
    <>
      {/*  <BBSpining spinning={loading}> */}

      <Layout style={{ backgroundColor: 'white' }}>
        <Content
          style={{
            padding: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Space
            direction="vertical"
            style={{
              minWidth: '80%',
              textAlign: 'center',
              borderRadius: 15,
              padding: 50,
              boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)',

              /*  alignItems: 'center', */
            }}
          >
            <Space style={{ margin: 10 }}>
              {/*          <ControlOutlined style={{ fontSize: '150%', color: '#002D4B' }} /> */}
              <h1 style={{ fontSize: '22px' }}>Ferramentas Cadastradas</h1>
            </Space>
            <div
              style={{ display: 'flex', justifyContent: 'end', width: '100%' }}
            >
              <Button type="primary" onClick={() => setIsModalVisible(true)}>Cadastrar Ferramenta</Button>
            </div>

            <SearchTable
              pagination={{ showSizeChanger: true }}
              columns={columns}
              dataSource={listaFerramentas}
            />
            <CadastrarFerramentaModal open={isModalVisible} onClose={() => setIsModalVisible(false)} refreshStatus={refreshListaFerramentas}/>
          </Space>
        </Content>
      </Layout>

      {/*     </BBSpining> */}
    </>
  );
}

export default GerenciadorDisponibilidade;
