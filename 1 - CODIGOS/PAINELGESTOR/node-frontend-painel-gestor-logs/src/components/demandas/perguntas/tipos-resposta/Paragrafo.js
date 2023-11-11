import React, { Component } from 'react';
import { Input, Row, Col } from 'antd';
import _ from 'lodash';
import { DefaultGutter } from 'utils/Commons';
import StringValidate from '../validacoes/StringValidate';
import OptionValidate, { getValidQuestions } from '../validacoes/OptionValidate';
import "@/App.css";
class Paragrafo extends Component {

  onUpdateStateToParent = (value) => {
    this.setState({ ...value}, () => this.props.onUpdateStateToParent({ validacao: {...value} }));
  }

  onUpdateFluxoValidacaoToParent = (value) => {
    this.setState({ ...value}, () => this.props.onUpdateStateToParent({ fluxoValidacao: {...value} }));
  }
  
  render() {
    let initialState = _.isEmpty(this.props.initialState.validacao) ? {} : this.props.initialState.validacao;
    
    return (
      <div>
      <Row gutter={DefaultGutter}>
        <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{paddingBottom: '12px'}}>
          <Input.TextArea 
            placeholder="Parágrafo - O usuário poderá digitar um texto de várias linhas" 
            disabled 
            rows={3}
            autoSize={{ minRows: 3, maxRows: 3 }}
          />
        </Col>

        { this.props.showFluxoValidacao && 
          <Col xs={24} sm={24} md={24} lg={8} xl={8}>
            <OptionValidate 
              idPergunta={this.props.idPergunta}
              questionsList={getValidQuestions(this.props.idPergunta, this.props.idsList)}
              initialState={this.props.initialState.fluxoValidacao}
              onUpdateStateToParent={this.onUpdateFluxoValidacaoToParent}
            /> 
          </Col>
        }
      </Row>

      { this.props.showValidacao &&
        <React.Fragment>
          <Row gutter={DefaultGutter}>
            <Col span={24} style={{paddingBottom: '8px'}}>
                <label className="title-text">Validação</label>
            </Col>
          </Row>
            
          <Row>
            <Col span={24}>
              <StringValidate 
                onUpdateStateToParent={this.onUpdateStateToParent} 
                initialState={initialState}
              />
            </Col>
          </Row>
        </React.Fragment>
      }
    </div>
    )
  }
}

export default Paragrafo;
