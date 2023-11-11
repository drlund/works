import React from 'react';
import {
  Row, DatePicker, TimePicker, Col
} from 'antd';
import { DefaultGutter } from 'utils/Commons';
import locale from 'antd/lib/date-picker/locale/pt_BR';
import moment from 'moment';
import 'moment/locale/pt-br';

function disabledDate(current) {
  return current < moment().endOf('day').subtract(1, 'days');
}

function disabledHours() {
  return [0, 1, 2, 3, 4, 5, 6, 7, 19, 20, 21, 22, 23];
}

const format = {
  DATA: 'DD/MM/YYYY',
  HORA: 'HH:mm'
}

export default class dateTimePicker extends React.Component {
  state = {
    date: moment().startOf('days'),
    time: moment('08:00', 'HH:mm')
  }

  handleDateChange = (data) => {
    const date = moment(data, format.DATA).startOf('day');
    if (!date) {
      return;
    }
    this.triggerChange('date', date);
  }

  handleTimeChange = (hora) => {
    const hour = moment(hora, format.HORA);
    if (!hour) {
      return;
    }
    this.triggerChange('time', hour);
  }

  triggerChange = (campo, valor) => {
    const { onChange, value } = this.props;
    if (onChange) {
      onChange({
        ...value,
        [campo]: valor,
      });
    }
    this.setState({ [campo]: valor });
  }

  render() {
    return (
      <Row gutter={DefaultGutter}>
        <Col span={16}>
          <DatePicker
            value={this.state.date}
            locale={locale}
            format="DD/MM/YYYY"
            showToday={false}
            disabledDate={disabledDate}
            onChange={this.handleDateChange}
            placeholder="Data"
            style={{ width: '100%' }}
          />
        </Col>
        <Col span={8}>
          <TimePicker
            value={this.state.time}
            locale={locale}
            format="HH:mm"
            disabledHours={disabledHours}
            hideDisabledOptions
            minuteStep={5}
            onChange={this.handleTimeChange}
            placeholder="Hora"
            style={{ width: '100%' }}
          />
        </Col>
      </Row>
    );
  }
}
