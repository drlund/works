import React, { PureComponent } from 'react';
import {
  Row, Col, Form, DatePicker, Tooltip, Button, Typography, message
} from 'antd';
import { DefaultGutter } from 'utils/Commons';
import moment from 'moment';
import { connect } from 'react-redux';
import _ from 'lodash';

import 'moment/locale/pt-br';

import { getQtdeDias, getDiaUtil } from 'services/ducks/Designacao.ducks';
import { getDiasNaoUteis } from 'pages/designacao/apiCalls/fetch';
import isDiaNaoUtil from 'pages/designacao/Commons/isDIaNaoUtil';

const { Text } = Typography;

const QUANDO = {
  PROXIMO: 1,
  ANTERIOR: 0
};

class Ausencia extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      codAusencia: '',
      dataInicio: '',
      dataFim: '',
      periodo: '',
      tipoAusencia: '',
      qtdeDiasUteis: '',
      diasNaoUteis: '',
    };
  }

  componentDidMount() {
    const {
      id,
      dataInicio,
      dataFim,
      codAusencia,
      prefixo
    } = this.props;
    const dia = dataFim || moment();

    getDiasNaoUteis()
      .then((diasNaoUteis) => this.setState({ diasNaoUteis }))
      .catch(() => this.setState({ diasNaoUteis: [] }));

    if (dataInicio) {
      this.setState({
        id,
        dataInicio: moment(dataInicio),
        dataFim: dia,
        tipoAusencia: codAusencia.label,
        codAusencia: codAusencia.value
      }, this.onDataChange);
    } else {
      getDiaUtil({ data: dia, prefixo, quando: QUANDO.PROXIMO })
        .then((day) => this.setState({
          id,
          dataInicio: moment(day),
          dataFim: moment(day),
          tipoAusencia: codAusencia.label,
          codAusencia: codAusencia.value
        }, this.onDataChange))
        .catch((error) => message.error(error));
    }
  }

  /**
   * ? Métodos onChange
   */

  // quando muda a data inicial
  onDataInicioChange = (dataInicio) => {
    const { dataFim } = this.state;
    if (dataInicio) {
      this.setState({
        dataInicio: moment(dataInicio).startOf('day'),
        dataFim: moment(dataFim).isBefore(dataInicio) ? moment(dataInicio).startOf('day') : moment(dataFim).startOf('day')
      }, this.onDataChange);
    } else {
      this.setState({ dataInicio: moment().startOf('day') }, () => this.onDataChange());
    }
  };

  // quando muda a data final
  onDataFimChange = (dataFim) => {
    if (dataFim) {
      this.setState({ dataFim: moment(dataFim).startOf('day') }, () => this.onDataChange());
    } else {
      this.setState({ dataFim: moment().startOf('day') }, () => this.onDataChange());
    }
  };

  // executado quando mudar alguma das datas
  onDataChange = () => {
    const { dataInicio, dataFim } = this.state;
    const { prefixo, changeDatas } = this.props;
    const inicio = moment(dataInicio).startOf('day');
    const fim = moment(dataFim).startOf('day');

    getQtdeDias({ inicio, fim, prefixo })
      .then((dias) => this.setState({ periodo: dias.qtdeDias, qtdeDiasUteis: dias.qtdeDiasUteis }))
      .catch(() => message.error('Não foi possível calcular a quantidade de dias entre as datas informadas!'))
      .then(() => changeDatas(this.state));
  };

  // executado quando se exclui o próprio
  onDelete = () => {
    const { deletePeriodo } = this.props;
    deletePeriodo(this.state);
  };

  disabledDate = (current) => {
    const { dataInicio } = this.state;
    return current < moment(dataInicio);
  };

  disabledInicialDate = (current) => {
    const { dataInicio, diasNaoUteis } = this.state;
    const { dataFim } = this.props;
    if (!dataFim) {
      return isDiaNaoUtil(current, diasNaoUteis);
    }
    return current !== moment(dataInicio)
      || isDiaNaoUtil(current, diasNaoUteis);
  };

  DatePickers = () => {
    const { dataInicio, dataFim } = this.state;

    return (
      <>
        <Col span={6}>
          <Form.Item label="Data do início">
            <DatePicker
              value={moment(dataInicio)}
              defaultValue={moment(dataInicio)}
              format="DD/MM/YYYY"
              disabledDate={this.disabledInicialDate}
              showToday={false}
              onChange={this.onDataInicioChange}
            />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="Data do fim">
            <DatePicker
              defaultValue={moment(dataFim)}
              value={moment(dataFim)}
              format="DD/MM/YYYY"
              disabledDate={this.disabledDate}
              showToday={false}
              onChange={this.onDataFimChange}
            />
          </Form.Item>
        </Col>
      </>
    );
  };

  ShowDatas = () => {
    const { periodo, qtdeDiasUteis } = this.state;
    return (
      <>
        <Col span={4} style={{ marginTop: 45 }}>
          <Text>{`${periodo} dia${periodo > 1 ? 's' : ''} corrido${periodo > 1 ? 's' : ''}`}</Text>
        </Col>
        <Col span={4} style={{ marginTop: 45 }}>
          <Text>{`${qtdeDiasUteis} dia${qtdeDiasUteis > 1 ? 's' : ''} ${qtdeDiasUteis > 1 ? 'úteis' : 'útil'}`}</Text>
        </Col>
      </>
    );
  };

  ButtonExcluir = () => (
    <Col span={4} style={{ marginTop: 45 }}>
      <Tooltip title="Clique para excluir essa opção de ausência.">
        <Button type="primary" onClick={this.onDelete}>Excluir</Button>
      </Tooltip>
    </Col>
  );

  render() {
    const { tipoAusencia } = this.state;
    if (_.isEmpty(tipoAusencia)) {
      return null;
    }

    return (
      <>
        <Row>
          <Col span={8}>
            <Text>{tipoAusencia}</Text>
          </Col>
        </Row>
        <Row gutter={DefaultGutter}>
          {this.DatePickers()}
          {this.ShowDatas()}
          {this.ButtonExcluir()}
        </Row>
      </>
    );
  }
}

export default connect(null, { getQtdeDias })(Ausencia);
