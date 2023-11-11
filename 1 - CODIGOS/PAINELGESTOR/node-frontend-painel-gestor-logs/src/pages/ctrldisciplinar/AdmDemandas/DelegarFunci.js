import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Button, message } from 'antd';
import _ from 'lodash';
import Title from 'antd/lib/skeleton/Title';
import Text from 'antd/lib/typography/Text';
import MaskedInput from 'react-text-mask';


class DelegarFunci extends React.Component {

  handleFunciDelegado = (event) => {
    event.preventDefault();

    this.props.form.validateFields((err, valorCampos) => {
      if(!err) {
        const values = {
          'chave_funci_resp': valorCampos['funci'],
          'id_gedip': this.props.registro.id_gedip,
          'id_funci_resp': this.props.registro.id_funci_resp || '',
        }

        let errorsList = [];

        if (_.isEmpty(values.chave_funci_resp)) {
          errorsList.push('Necessário informar a matrícula do Funci, no formato FXXXXXXX!');
        }

        if (errorsList.length) {
          message.error("Preencha todos os campos!");
        } else {
          this.props.submitFunciDelegado(values)
        }
      }
    });
  }

  render () {

    const formItemLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10 },
    };
    const formTailLayout = {
      labelCol: { span: 10 },
      wrapperCol: { span: 10, offset: 12 },
    };


    const { getFieldDecorator } = this.props.form;

    return (
      <React.Fragment>
        <div>
          <Title level={3}>Delegação do Funcionário Responsável por acolher a assinatura e Enviar os Documentos Digitalizados</Title>
        </div>
        <div>
        {
          !!this.props.registro.chave_funci_resp &&
          <h3><Text strong>{this.props.registro.chave_funci_resp} - {this.props.registro.nome_funci_resp}</Text><br />ESTÁ CADASTRADO COMO RESPONSÁVEL PARA APLICAR A MEDIDA.</h3>
        }
        </div>
        <div>
          <Form.Item {...formItemLayout} label="No. da GEDIP">
            {getFieldDecorator('id_gedip', {
              rules: [
                {
                  required: false,
                },
              ],
            })(<Input
                  disabled={true}
                  placeholder={this.props.registro.nm_gedip}
                />)
            }
          </Form.Item>
          </div>
        <div>
          <Form.Item {...formItemLayout} label="Funci a ser Delegado para esta Gedip">
            {getFieldDecorator('funci', {
              rules: [
                {
                  required: true,
                  message: 'Digite a Matrícula do Funcionário a ser Delegado',
                },
                {
                  pattern: /^F\d{7}$/gm,
                  message: 'Digite a Matrícula do Funcionário a ser Delegado corretamente!'
                }
              ]
            })(
              <MaskedInput
                className="ant-input"
                mask={['F', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                placeholder="F0000000"
              />
            )}
          </Form.Item>
        </div>
        <div>
          <Form.Item {...formTailLayout}>
            <Button type="primary" onClick={this.handleFunciDelegado}>
              Delegar
            </Button>
          </Form.Item>
        </div>
      </React.Fragment>
    );
  }
}

export const WrappedDelegFunci = Form.create({name: 'delegar_funci'})(DelegarFunci);

export default WrappedDelegFunci;