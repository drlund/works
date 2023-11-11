import React from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Checkbox } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 },
};

export const CheckBoxAdicionalInfo = props => {
  return(
    <Form.Item {...formItemLayout} label=" ">
      {props.getFieldDecorator('gestor_envolvido', {
        rules: [
          {
            required: false
          }
        ]
      })(<Checkbox>1o. Gestor do Funci envolvido na GEDIP?</Checkbox>)}
    </Form.Item>
  );
}

export const InputValor = props => {
  return(
    <Form.Item {...formItemLayout} label="Valor (em R$)">
      {props.getFieldDecorator('valor_gedip', {
        rules: [
          {
            required: true,
            message: 'Digite o valor da Responsabilidade Pecuniária',
          },
        ],
      })(<Input placeholder="Digite o valor da Responsabilidade Pecuniária" />)}
    </Form.Item>
  );
}

export const InputDiasSuspensao = props => {
  return(
    <Form.Item {...formItemLayout} label="Quantidade de dias">
      {props.getFieldDecorator('qtde_dias_suspensao', {
        rules: [
          {
            required: true,
            message: 'Digite a Quantidade de dias de Suspensão',
          },
        ],
      })(<Input placeholder="Digite a Quantidade de dias de Suspensão" />)}
    </Form.Item>
  );
}

export const ComplementoForm = props => {
  return(
    <React.Fragment>
      <Form.Item {...formItemLayout} label="Instância de Apuração (Comitê)">
        {props.getFieldDecorator('comite', {
          rules: [
            {
              required: true,
              message: 'Informe a Instância de Apuração (Comitê)',
            },
          ],
        })(<Input placeholder="Informe a Instância de Apuração (Comitê)" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Descrição da participação do Funci">
        {props.getFieldDecorator('desc_ocorrencia', {
          rules: [
            {
              required: true,
              message: 'Digite de forma sucinta a participação do funci',
            },
          ],
        })(<TextArea rows={4} placeholder="Digite de forma sucinta a participação do funci" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Normativos Descumpridos">
        {props.getFieldDecorator('norm_descumpridos', {
          rules: [
            {
              required: true,
              message: 'Digite os Normativos Descumpridos',
            },
          ],
        })(<Input placeholder="Digite os Normativos Descumpridos" />)}
      </Form.Item>
      <Form.Item {...formItemLayout} label="Dependência do Funci à Época da Irregularidade">
        {props.getFieldDecorator('dp_funci_gedip', {
          rules: [
            {
              required: true,
              message: 'Digite a Quantidade de dias de Suspensão',
            },
          ],
        })(<Input placeholder="Digite a Quantidade de dias de Suspensão" />)}
      </Form.Item>
    </React.Fragment>
);
}



export default {
  CheckBoxAdicionalInfo,
  InputValor,
  InputDiasSuspensao,
  ComplementoForm
};