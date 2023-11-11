import { Card, Tabs, Row, Col, Tag, Button, Divider, Descriptions, List, Modal, message } from 'antd';
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import _ from 'lodash';
import Constants from 'pages/hrxtra/Helpers/Constants';
import Historico from 'pages/hrxtra/Acompanhamento/Historico';
import ModalDespacho from 'pages/hrxtra/Acompanhamento/ModalDespacho';
import ResumoGeral from 'pages/hrxtra/NovaSolicitacao/ResumoGeral';
import { getDadosResumoHEGG } from 'services/ducks/HoraExtra.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import Spinning from 'components/spinning/Spinning';

const { TabPane } = Tabs;

const COLOR = {
  1: 'orange',
  2: 'orange',
  3: 'green',
  4: 'red'
};

const isTrue = (numero) => {

  const dadosARetornar = {
    0: {
      color: 'magenta',
      valor: false,
      nome: 'nao'
    },
    1: {
      color: 'blue',
      valor: true,
      nome: 'sim'
    }
  };

  return dadosARetornar[numero];
}

function ModalConsulta({solicitacao}) {

  const [modalVisible, setModalVisible] = useState(false);
  const [dadosHE, setDadosHE] = useState(null);
  const [isDespachavel, setIsDespachavel] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getDadosResumoHEGG(solicitacao.mat_dest, solicitacao.pref_dep, solicitacao.id)
    .then(dados => {
      isMounted && setDadosHE(dados);
      isMounted && setIsDespachavel(prev => dados.despachavel);
    })
    .catch(error => message.error(error));

    return () => isMounted = false;

  }, [solicitacao.id, solicitacao.mat_dest, solicitacao.pref_dep, setDadosHE]);

  const abrirModal = () => {
    setModalVisible(prev => true);
  }

  const fecharModal = () => {
    setModalVisible(prev => false);
  }

  const destruirTodasModais = () => {
    Modal.destroyAll();
  }

  return (
    <>
      <Tabs defaultActiveKey="1" type="card" centered size="large">
        <TabPane tab="DADOS DA SOLICITAÇÃO" key="1">
          <Row>
            <Col span={12}>
              <Card
                title="Solicitação de HE"
                headStyle={{
                  textAlign: "center",
                  backgroundColor: "#002D4B",
                  color: "white",
                }}
              >
                <Row>
                  <Col span={12}>
                    <Row>
                      <Col span={12}>Status Atual:</Col>
                      <Col span={12}><Tag color={COLOR[solicitacao.status]}>{solicitacao.statusNome}</Tag></Col>
                    </Row>
                  </Col>
                  <Col span={12} style={{textAlign: 'right'}}>
                    {
                      isDespachavel && <Button type="primary" onClick={abrirModal}>Efetuar Despacho</Button>
                    }
                  </Col>
                </Row>
                <Divider />
                <Descriptions title="Dados da Solicitação" column={2}>
                  <Descriptions.Item label="Protocolo da Solicitação"><Tag>{solicitacao.protocolo}</Tag></Descriptions.Item>
                  <Descriptions.Item colon={false} label="Funcionário Aderiu ao Banco de Horas?"><Tag color={isTrue(solicitacao.adesaoBHInt).color}>{solicitacao.adesao_banco_horas}</Tag></Descriptions.Item>
                </Descriptions>
                <Descriptions column={1}>
                  <Descriptions.Item label="Saldo do Banco de Horas"><Tag color='warning'>{solicitacao.saldo_banco_horas} h</Tag></Descriptions.Item>
                  <Descriptions.Item label="Qtd. Horas Vencendo no Mês Atual"><Tag color='red' style={{padding: '3px', fontSize: '1.8rem'}}>{(dadosHE && dadosHE.dadosAdesao ) ? dadosHE.dadosAdesao.mesAtual : <Spinning />} h</Tag></Descriptions.Item>
                  <Descriptions.Item label="Quantidade de Horas Solicitadas"><Tag color='blue' style={{fontSize: '1.1rem'}}>{solicitacao.qtd_horas_sol} h</Tag></Descriptions.Item>
                  {solicitacao.qtd_horas_aut && <Descriptions.Item label="Quantidade de Horas Autorizadas"><Tag color='green' style={{fontSize: '1.3rem'}}>{solicitacao.qtd_horas_aut} h</Tag></Descriptions.Item>}
                </Descriptions>
                { (solicitacao.adesao_banco_horas === 'NÃO') &&
                  <>
                    <Divider />
                    <Descriptions layout="vertical" column={1}>
                      <Descriptions.Item label="Justificativa para Não Adesão ao BH">
                          <Tag style={{whiteSpace: 'break-spaces'}}>{solicitacao.justificativa_n_bh}</Tag>
                      </Descriptions.Item>
                    </Descriptions>
                  </>
                }
                <Divider />
                <Descriptions layout="vertical" column={2}>
                  <Descriptions.Item label="Data da Solicitação Inicial"><Tag>{moment(solicitacao.data_evento).format("DD/MM/YYYY, [às] HH:mm")}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Dependência"><Tag>{solicitacao.nome_dep}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Super"><Tag>{solicitacao.nome_sup}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Matrícula a Autorizar"><Tag>{solicitacao.mat_dest}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Nome do Funcionário"><Tag>{solicitacao.nome_dest.substring(0,37)}</Tag></Descriptions.Item>
                  <Descriptions.Item label="Comissão"><Tag>{solicitacao.comissao_dest.substring(0,45)}</Tag></Descriptions.Item>
                </Descriptions>
                <Divider />
                <Descriptions layout="vertical" column={1}>
                  <Descriptions.Item label="Justificativa"><Tag style={{whiteSpace: 'break-spaces'}}>{solicitacao.justificativa_sol}</Tag></Descriptions.Item>
                </Descriptions>
                <Divider />
                <List
                  header="Forma de Compensação das Horas Extras:"
                  grid={{ gutter: 16, column: 3 }}
                  dataSource={solicitacao.compensacao}
                  renderItem={item => (
                    <List.Item key={item.dataCompensacao}>
                      <Card>
                        <Row>
                          <Col span={12}>Forma:</Col>
                          <Col span={12}><Tag>{!_.isEmpty(item.tipoCompensacao) && Constants.OPCOESTIPOCOMPENSACAO.filter(intEl => intEl.key === item.tipoCompensacao).map(intEl => intEl.label).reduce(acc => acc)}</Tag></Col>
                        </Row>
                        <Row>
                          <Col span={12}>Data:</Col>
                          <Col span={12}><Tag style={{whiteSpace: 'break-spaces'}}>{item.dataCompensacao}</Tag></Col>
                        </Row>
                        <Row>
                          <Col span={12}>Horas:</Col>
                          <Col span={12}><Tag>{item.qtdeHoras}</Tag></Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col span={12}>
              {dadosHE ?
                <ResumoGeral
                  dadosHE={dadosHE}
                  prefixo={solicitacao.pref_dep}
                  nomePrefixo={solicitacao.nome_dep}
                />
                : <PageLoading />
              }
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="HISTÓRICO DOS DESPACHOS" key="2">
          <Historico key={moment().valueOf()} solicitacao={{...solicitacao}} />
        </TabPane>
      </Tabs>
      <Modal
        visible={modalVisible}
        title="Despachar"
        onCancel={fecharModal}
        destroyOnClose
        closable={false}
        maskClosable={false}
        footer={null}
      >
        <ModalDespacho dadosHE={dadosHE} solicitacao={solicitacao} status={solicitacao.status} fecharModal={destruirTodasModais} />
      </Modal>
    </>
  )
}

export default React.memo(ModalConsulta);
