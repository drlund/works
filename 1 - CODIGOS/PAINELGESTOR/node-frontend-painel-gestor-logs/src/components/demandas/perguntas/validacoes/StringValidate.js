import React, { Component } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Form, Row, Col, Select, Input, InputNumber } from 'antd';
import { DefaultGutter } from 'utils/Commons';
import _ from 'lodash';

const Option = Select.Option;

const tiposValidacoes = [
  {key: 'comprimento', text: 'Comprimento'},
  {key: 'texto', text: 'Texto'},
  {key: 'regex', text: 'Exp. Regular'}
];

const condicoes = {
  comprimento: [
    { key: 'maximo', text: 'Nro. Máximo de Caracteres'},
    { key: 'minimo', text: 'Nro. Mínimo de Caracteres'}
  ],

  texto: [
    { key: 'contem', text: 'Contém'},
    { key: 'nao_contem', text: 'Não Contém'}
  ],

  regex: [
    { key: 'corresponde', text: 'Corresponde'},
    { key: 'nao_corresponde', text: 'Não Corresponde'},
  ]
}

class StringValidate extends Component {
  constructor(props) {
    super(props);

    this.expressaoRef = null;
    this.mensagemErroRef = null;

    if (! _.isEmpty(this.props.initialState)) {
      this.state = { ...this.props.initialState };
    } else {
      this.state = { 
        tipoValidacao: tiposValidacoes[0].key, 
        condicao: condicoes[tiposValidacoes[0].key][0].key,
        expressao: 1
      }
      this.props.onUpdateStateToParent(this.state);
    }
  }

  onSetState = (newState) => {
    this.setState(newState, () => this.props.onUpdateStateToParent(this.state));    
  }

  onTipoValidacaoChange = (value) => {
    this.onSetState({ 
      tipoValidacao: value, 
      condicao: condicoes[value][0].key,
      expressao: value === 'comprimento' ? 1 : ''
    });
  }

  onCondicaoChange = (value) => {
    this.onSetState({ condicao: value });
  }

  onExpressaoChange = (value) => {
    this.onSetState({ expressao: value });
  }

  onMensagemErroChange = (value) => {
    this.onSetState({ mensagemErro: value });
  }

  render() {
    const isTipoNumerico = this.state.tipoValidacao === "comprimento";

    return (
      <div>
        <Row gutter={DefaultGutter}>
          <Col xs={24} sm={24} md={24} lg={4} xl={4}>
            <Form.Item label="Tipo de Validação">
              <Select 
                key={this.state.tipoValidacao}
                defaultValue={this.state.tipoValidacao}
                onChange={this.onTipoValidacaoChange}
              >
                { tiposValidacoes.map(tipo => <Option key={tipo.key} value={tipo.key}>{tipo.text}</Option>)}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={5} xl={5}>
            <Form.Item label="Condição">
              <Select 
                key={this.state.condicao} 
                value={this.state.condicao}
                onChange={this.onCondicaoChange}
              >
                { condicoes[this.state.tipoValidacao].map(cond => <Option key={cond.key} value={cond.key}>{cond.text}</Option>)}
              </Select>          
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={isTipoNumerico ? 2 : 6} xl={isTipoNumerico ? 2 : 6} >
            <Form.Item label={ !isTipoNumerico ? 'Expressão' : 'Quantidade'}>
              { 
                !isTipoNumerico && 
                <Input 
                  placeholder="Digite a expressão"
                  autoComplete="off"
                  defaultValue={this.state.expressao}
                  ref={(node) => this.expressaoRef = node}
                  onBlur={() => {
                      if (this.expressaoRef.input.value !== this.state.expressao) {
                        this.onExpressaoChange(this.expressaoRef.input.value)
                      }
                    }
                  }
                />
              }

              { 
                isTipoNumerico && 
                <InputNumber 
                  min={1}
                  defaultValue={ _.isInteger(this.state.expressao) ? this.state.expressao : 1 }
                  onChange={this.onExpressaoChange}
                />
              }

            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={9} xl={9}>
            <Form.Item label="Mensagem de Erro">
              <Input 
                placeholder="Digite uma mensagem de erro caso a validação falhe"
                autoComplete="off"
                defaultValue={this.state.mensagemErro}
                ref={(node) => this.mensagemErroRef = node}
                onBlur={() => {
                    if (this.mensagemErroRef.input.value !== this.state.mensagemErro) {
                      this.onMensagemErroChange(this.mensagemErroRef.input.value)
                    }
                  }
                }
              />
            </Form.Item>
          </Col>

        </Row>
      </div>
    )
  }
}

export default StringValidate;
