import React, { useEffect, useState } from 'react';
import {
  Card, Row, Col, DatePicker, Typography, Tooltip, Button, message, Spin
} from 'antd';

import { DefaultGutter } from 'utils/Commons';
import moment from 'moment';
import useEffectOnce from 'utils/useEffectOnce';
import { getQtdeDias } from 'services/ducks/Designacao.ducks';

const { RangePicker } = DatePicker;
const { Text } = Typography;

function PerMovimentacao(props) {
  const [valor, setValor] = useState([null, null]);
  const [qtdeDias, setQtdeDias] = useState([0, 0]);

  const [thinking, setThinking] = useState(false);

  useEffectOnce(() => {
    setValor(props.valores);
  });

  useEffect(() => {
    setValor(props.valores);
  }, [props.valores]);

  const onChange = (arrMoment) => {
    setValor(arrMoment);
  };

  useEffect(() => {
    if (valor[0] && valor[1] && props.prefixo) {
      setThinking(true);

      getQtdeDias({ inicio: valor[0], fim: valor[1], prefixo: props.prefixo })
        .then((dias) => {
          setQtdeDias([dias.qtdeDias, dias.qtdeDiasUteis]);
        })
        .catch((error) => message.error(error))
        .then(() => setThinking(false));
    }
  }, [valor, props]);

  useEffect(() => {
    props.onChange({ id: props.id, arrMoment: valor, qtdeDias });
  }, [valor, qtdeDias, props]);

  const disabledData = (current) => (props.dataFim
    ? moment(current).isBefore(moment(props.dataFim))
    : null);

  const onDelete = () => props.deletePeriodo({ id: props.id });

  const renderPicker = () => (
    <Card>
      <Row gutter={DefaultGutter} justify="space-around" align="middle">
        <Col span={12}>
          <Text>
            Motivo da Ausência:
            {' '}
            {props.codAusencia.label.toString().replace(/,/g, '')}
          </Text>
          <br />
          <RangePicker
            format="DD/MM/YYYY"
            onCalendarChange={onChange}
            disabled={props.disabled}
            value={valor}
            disabledDate={disabledData}
          />
        </Col>
        <Col span={8}>
          <Row gutter={DefaultGutter}>
            <Col span={12}>
              <Text>Dias Corridos:</Text>
              <br />
              <Text>Dias Úteis:</Text>
            </Col>
            <Col span={12}>
              {
                thinking
                  ? <Spin />
                  : (
                    <>
                      <Text>{qtdeDias[0]}</Text>
                      <br />
                      <Text>{qtdeDias[1]}</Text>
                    </>
                  )
              }
            </Col>
          </Row>
        </Col>
        <Col span={4}>
          <Tooltip title="Clique para excluir esta ausência.">
            <Button type="primary" onClick={onDelete}>Excluir</Button>
          </Tooltip>
        </Col>
      </Row>
    </Card>
  );

  return renderPicker();
}

export default React.memo(PerMovimentacao);
