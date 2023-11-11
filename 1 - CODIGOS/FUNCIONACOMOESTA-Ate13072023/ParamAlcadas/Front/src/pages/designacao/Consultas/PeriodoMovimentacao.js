import React from 'react';
import { Card, Row, Col, DatePicker } from 'antd';
// import moment from 'moment';
import { DefaultGutter } from 'utils/Commons';

const { RangePicker } = DatePicker;

function PeriodoMovimentacao(props) {


  // const [inicio, setInicio] = useState();
  // const [fim, setFim] = useState();

  // function iniciaDatas(dtInicio = null, dtFim = null) {
  //   if (dtInicio || dtFim) {
  //     if (dtInicio > fim) {
  //       dtFim = dtInicio;
  //     }
  //     dtInicio && setInicio(moment(dtInicio));
  //     dtFim && setFim(moment(dtFim));
  //   } else {
  //     setInicio(moment(props.inicio));
  //     setFim(moment(props.fim));
  //   }
  // }

  // const changeDatas = useCallback(() => {
  //   if (!props.inicio || !props.fim) {
  //     return;
  //   }

  //   setThinking(true);

  //   (inicio && fim && props.prefixo) &&
  //     getDiasTotaisUteis({ inicio: inicio, fim: fim, prefixo: props.prefixo })
  //       .then(dias => {
  //         setDiasTotais(diasTotais => dias.qtdeDias);
  //         setDiasUteis(diasUteis => dias.qtdeDiasUteis);
  //       })
  //       .catch(error => message.error(error))
  //       .then(() => {
  //         setThinking(false)
  //       });
  // }, [inicio, fim, props])

  // Recebe as datas início e fim
  // useEffectOnce(() => {
  //   iniciaDatas();
  // });

  // const { onChange } = props;

  // useEffect(() => {
  //   if (inicio && fim) {
  //     onChange(inicio, fim)
  //   }
  // }, [inicio, fim, onChange]);

  // const confirm = () => {
  //   props.changePeriodo({
  //     inicio: inicio,
  //     fim: fim,
  //     dias_totais: diasTotais,
  //     dias_uteis: diasUteis
  //   });
  // }

  // function mudaDataInicio(date, dateString) {
  //   iniciaDatas(moment(date), null);
  // }

  // function mudaDataFim(date, dateString) {
  //   iniciaDatas(null, moment(date));
  // }

  // function disabledDataInicio(current) {
  //   return current < moment().startOf('day');
  // }

  // function disabledDataFim(current) {
  //   return current < moment(inicio).startOf('day');
  // }

  const renderPicker = () => {
    return (
      <Card>
        <Row gutter={DefaultGutter}>
          <Col>
            <RangePicker
              format="DD/MM/YYYY"
              onChange={props.onChange}
              disabled={props.disabled}
            />
          </Col>
        </Row>
      </Card>
    )
  }

  return renderPicker();
}

export default React.memo(PeriodoMovimentacao);