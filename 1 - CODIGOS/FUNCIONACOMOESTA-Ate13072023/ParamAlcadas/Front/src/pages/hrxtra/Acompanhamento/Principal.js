import React, { useEffect, useState } from 'react';
import { Button, Card, Col, message, Row, Tooltip, Drawer, Typography } from 'antd';
import TabelaAcomp from 'pages/hrxtra/Acompanhamento/TabelaAcomp';
import SelectStatus from 'pages/hrxtra/Acompanhamento/SelectStatus';
import SelectPeriodo from 'pages/hrxtra/Acompanhamento/SelectPeriodo';
import SelectRegionais from 'pages/hrxtra/Acompanhamento/SelectRegionais';
import NovaSolicitacao from 'pages/hrxtra/NovaSolicitacao';
import { getPeriodoEstados} from 'services/ducks/HoraExtra.ducks';
import { RedoOutlined } from '@ant-design/icons';
import PageLoading from 'components/pageloading/PageLoading';
import moment from 'moment';
import _ from 'lodash';

const {Title} = Typography;

function Principal(props) {

  const [status, setStatus] = useState(null);
  const [periodo, setPeriodo] = useState(null);
  const [estados, setEstados] = useState(null);
  const [periodos, setPeriodos] = useState(null);
  const [regionais, setRegionais] = useState(null);
  const [regional, setRegional] = useState(null);
  const [drawrVisible, setDrawrVisible] = useState(false);
  const [perEstRegDone, setPerEstRegDone] = useState(false);

  const atualizaLista = () => {
    getPeriodoEstados()
      .then((result) => {
        setEstados(prev => result.estados);
        setPeriodos(prev => result.periodos);
        setRegionais(prev => result.regionais);
        setPerEstRegDone(true);
      })
      .catch((error) => message.error(error))
  };

  const zerar = () => {
    setEstados(prev => null);
    setStatus(prev => null);
    setPeriodos(prev => null);
    setPeriodo(prev => null);
    setRegionais(prev => null);
    setRegional(prev => null);
  }

  useEffect(() => {
    let isMounted = true;
    getPeriodoEstados()
      .then((result) => {
        isMounted && setEstados(prev => result.estados);
        isMounted && setPeriodos(prev => result.periodos);
        isMounted && setRegionais(prev => result.regionais);
        isMounted && setPerEstRegDone(prev => true);
      })
      .catch((error) => message.error(error))

    return () => isMounted = false;
  }, [setEstados, setPeriodos, setRegionais, setPerEstRegDone]);

  const resetar = () => {
    zerar();
    atualizaLista();
  }

  const mudarStatus = (status) => {
    setStatus(prev => status);
  }

  const mudarPeriodo = (periodo) => {
    setPeriodo(prev => periodo);
  }

  const mudarRegional = (regional) => {
    setRegional(prev => regional);
  }

  const openDrawr = () => {
    setDrawrVisible(prev => true);
  }

  const closeDrawr = () => {
    setDrawrVisible(prev => false);
  }

  return (
    <>
      <Card bodyStyle={{padding: '5px'}}>
        <Card>
          <Row gutter={5}>
            {
              !_.isEmpty(regionais) &&
              <Col span={4}>
                <SelectRegionais mudarRegional={mudarRegional} regionais={regionais} />
              </Col>
            }
            <Col span={4}>
              {estados && <SelectStatus mudarStatus={mudarStatus} estados={estados} />}
            </Col>
            <Col span={4}>
              {periodos && <SelectPeriodo mudarPeriodo={mudarPeriodo} periodos={periodos} />}
            </Col>
            {
              _.isEmpty(regionais) ? <Col span={12}></Col> : <Col span={8}></Col>
            }
            <Col span={2}>
              {props.podeSolicitar && <Button block type="primary" onClick={openDrawr}>Solicitar HE</Button>}
            </Col>
            <Col span={1}></Col>
            <Col span={1}>
              <Tooltip title="Resetar tabela">
                <Button block onClick={resetar}><RedoOutlined /></Button>
              </Tooltip>
            </Col>
          </Row>
        </Card>
        <Row><Col></Col></Row>
        <Card bodyStyle={{padding: '5px'}}>
          {
            status && periodo && !_.isNil(regionais)
            ?
              <TabelaAcomp key={moment().valueOf()} update={perEstRegDone} data={{status, periodo, regional}} />
            :
              <PageLoading />
          }
        </Card>
      </Card>
      <Drawer
          key='drawer'
          title={<Row><Col span={24} style={{textAlign: "center"}}><Title level={3}>Solicitação e Planejamento de Horas Extras</Title></Col></Row>}
          placement="right"
          visible={drawrVisible}
          width="80%"
          destroyOnClose
          onClose={closeDrawr}
          footer={[
            <Row key={1}><Col span={24} style={{textAlign: "center"}}><Button key="close" onClick={closeDrawr}>Fechar</Button></Col></Row>
          ]}
        >
          <NovaSolicitacao key={moment().valueOf()} />
        </Drawer>
    </>
  );
}

export default React.memo(Principal);
