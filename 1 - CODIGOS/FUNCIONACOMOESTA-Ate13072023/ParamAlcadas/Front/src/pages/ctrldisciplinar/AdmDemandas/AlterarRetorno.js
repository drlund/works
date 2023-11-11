import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { DatePicker, Button, message, Typography } from 'antd';
import _ from 'lodash';
import locale from 'antd/lib/date-picker/locale/pt_BR';
import moment from 'moment';
import 'moment/locale/pt-br';

const { Text } = Typography;


function disabledDate(current) {
  return current < moment().endOf('day').subtract(1, 'days');
}

class AlterarRetorno extends Component {

  alterarDtRetorno = event => {
    event.preventDefault();

    this.props.form.validateFields((err, valorCampos) => {
      if (!err) {
        let values = {
          dt_retorno: valorCampos['dt_retorno'].format('YYYY-MM-DD')
        }

        let errorsList = [];

        if (_.isEmpty(values.dt_retorno)) {
          errorsList.push('Necessário informar a nova data de retorno!');
        }

        if (errorsList.length) {
          message.error("Preencha todos os campos!");
        } else {
          this.props.alterarRetorno(values)
        }
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
    };
    const formTailLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10, offset: 12 },
    };

    return (
      <React.Fragment>
        <div>
          <Form.Item {...formItemLayout} label="Data de Retorno Cadastrada">
            <div><Text strong>{moment(this.props.gedip.dt_retorno).format("DD/MM/YYYY")}</Text></div>
          </Form.Item>
          <Form.Item {...formItemLayout} label="Data do Retorno">
            {getFieldDecorator('dt_retorno', {
              rules: [
                {
                  required: true,
                  message: 'Informe a data do Retorno do Funci',
                },
              ],
            })(<DatePicker
              locale={locale}
              format="DD/MM/YYYY"
              showToday={false}
              disabledDate={disabledDate}
              style={{ width: '100%' }}
            />)}
          </Form.Item>
        </div>
        <div>
          <Form.Item {...formTailLayout}>
            <Button type="primary" onClick={this.alterarDtRetorno}>
              Alterar
            </Button>
          </Form.Item>
        </div>
      </React.Fragment>
    );
  }
}
export const WrappedAlterarRetorno = Form.create({ name: 'alterar_retorno' })(AlterarRetorno);

export default WrappedAlterarRetorno;