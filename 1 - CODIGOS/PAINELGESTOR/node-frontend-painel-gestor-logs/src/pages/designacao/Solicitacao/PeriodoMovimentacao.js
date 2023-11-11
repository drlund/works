import React, { useEffect, useState, useCallback } from 'react';
import {
  message, Card, Row, Col, DatePicker, Form, Typography, Button
} from 'antd';
import moment from 'moment';
import _ from 'lodash';

import { DefaultGutter } from 'utils/Commons';

import { getDiasTotaisUteis } from 'services/ducks/Designacao.ducks';

import PageLoading from 'components/pageloading/PageLoading';

import { getDiasNaoUteis } from 'pages/designacao/apiCalls/fetch';
import Constants from 'pages/designacao/Commons/Constants';
import isDiaNaoUtil from '../Commons/isDIaNaoUtil';

const { Text } = Typography;

const { TIPOS } = Constants();

function PeriodoMovimentacao(props) {
  const [thinking, setThinking] = useState(false);

  const [inicio, setInicio] = useState();
  const [fim, setFim] = useState();

  const [diasTotais, setDiasTotais] = useState();
  const [diasUteis, setDiasUteis] = useState();

  const [diasNaoUteis, setDiasNaoUteis] = useState('');

  const iniciaDatas = useCallback((dtInicio = null, dtFim = null) => {
    if (dtInicio || dtFim) {
      const dataInicio = dtInicio;
      let dataFim = dtFim;
      if (dataInicio > fim) {
        dataFim = dtInicio;
      }
      if (dataInicio) setInicio(moment(dataInicio));
      if (dataFim) setFim(moment(dataFim));
    } else {
      setInicio(moment(props.inicio));
      setFim(moment(props.fim));
    }
  });

  const changeDatas = useCallback(() => {
    if (!props.inicio || !props.fim) return;

    const startThinking = () => setThinking(true);
    const stopThinking = () => setThinking(false);

    const mudarDiasTotais = (thisDiasTotais) => setDiasTotais(thisDiasTotais);
    const mudarDiasUteis = (thisDiasUteis) => setDiasUteis(thisDiasUteis);

    startThinking();

    if (inicio && fim && props.prefixo) {
      getDiasTotaisUteis({ inicio, fim, prefixo: props.prefixo })
        .then((dias) => {
          mudarDiasTotais(dias.qtdeDias);
          mudarDiasUteis(dias.qtdeDiasUteis);
          stopThinking();
        })
        .catch((error) => {
          message.error(error);
          stopThinking();
        });
    }
  }, [inicio, fim, props.prefixo]);

  useEffect(() => {
    getDiasNaoUteis()
      .then((datasNaoUteis) => setDiasNaoUteis(datasNaoUteis))
      .catch(() => setDiasNaoUteis([]));
  }, []);

  useEffect(() => {
    if (_.isNil(inicio) && _.isNil(fim)) iniciaDatas();
    changeDatas();
  }, [inicio, fim]);

  const confirm = () => {
    props.changePeriodo({
      inicio,
      fim,
      dias_totais: diasTotais,
      dias_uteis: diasUteis
    });
  };

  const mudaDataInicio = useCallback((date) => {
    iniciaDatas(moment(date), null);
  });

  const mudaDataFim = useCallback((date) => {
    iniciaDatas(null, moment(date));
  });

  const disabledDataInicio = (current) => {
    switch (props.tipo) {
      case TIPOS.DESIGNACAO:
        return current < moment(props.inicio).startOf('day')
          || current > moment(props.fim).endOf('day')
          || isDiaNaoUtil(current, diasNaoUteis);
      case TIPOS.ADICAO:
        return current < moment().startOf('day')
          || isDiaNaoUtil(current, diasNaoUteis);
      default:
        return null;
    }
  };

  const disabledDataFim = (current) => {
    switch (props.tipo) {
      case TIPOS.DESIGNACAO:
        return current < moment(inicio).startOf('day')
          || current > moment(props.fim).endOf('day');
      case TIPOS.ADICAO:
        return current < moment(inicio).startOf('day')
          || current > moment(inicio).endOf('day').add(59, 'day');
      default:
        return null;
    }
  };

  function render() {
    return (
      <Card>
        <Row gutter={DefaultGutter}>
          <Col span={8}>
            <Form.Item label="Data do início">
              <DatePicker
                defaultValue={moment(props.inicio)}
                value={moment(inicio)}
                format="DD/MM/YYYY"
                disabledDate={disabledDataInicio}
                showToday={false}
                onChange={mudaDataInicio}
                disabled={props.disabled}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Data do fim">
              <DatePicker
                defaultValue={moment(props.fim)}
                value={moment(fim)}
                format="DD/MM/YYYY"
                disabledDate={disabledDataFim}
                showToday={false}
                onChange={mudaDataFim}
                disabled={props.disabled}
              />
            </Form.Item>
          </Col>
          {
            thinking
              ? <PageLoading customClass="flexbox-row" />
              : (
                <>
                  <Col span={4} style={{ marginTop: 45 }}>
                    <Text strong>{diasTotais}</Text>
                    <Text>{diasTotais > 1 ? ' dias corridos' : ' dia corrido'}</Text>
                  </Col>
                  <Col span={4} style={{ marginTop: 45 }}>
                    <Text strong>{diasUteis}</Text>
                    <Text>{diasUteis > 1 ? ' dias úteis' : ' dia útil'}</Text>
                  </Col>
                </>
              )
          }
        </Row>
        <Row style={{ marginTop: '30' }}>
          <Col style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              onClick={confirm}
            >
              Validar Funci
            </Button>
          </Col>
        </Row>
      </Card>
    );
  }

  return render();
}

export default React.memo(PeriodoMovimentacao);
