import React, { Component } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Row, Col, Button, Tooltip, Popconfirm } from 'antd';
import ListaPerguntas from 'components/demandas/perguntas/ListaPerguntas';
import { connect } from 'react-redux';
import InfoLabel from 'components/infolabel/InfoLabel';
import { updateFormData, clearQuestionErrorStatus } from 'services/actions/demandas';
import _ from 'lodash';
import "@/App.css";
import styled from 'styled-components';

const Title = styled.h4`
  margin-left: 10px;
  display: inline-block;
  padding-right: 15px;
`;

const CountPerguntas = styled.span`
  color: #52c41a;
`;

class PerguntasForm extends Component {
  static propName = 'perguntas';

  constructor(props) {
    super(props);

    if (!this.props.perguntasCount) {
      this.props.updateFormData(PerguntasForm.propName, []);
    }
  }

  onClearAll = () => {
    this.props.updateFormData(PerguntasForm.propName, []);
    this.props.clearQuestionErrorStatus();
  }

  getCountPerguntas = () => {
    if ( !this.props.perguntasCount) {
      return null;      
    }

    return (
      <React.Fragment>
        <CountPerguntas>
          {`(${this.props.perguntasCount}) pergunta(s)`}
        </CountPerguntas>

        { (!_.isEmpty(this.props.errorsList) && !this.props.errorsList.erros) &&
          <InfoLabel type="error" showicon style={{marginLeft: '20px'}}>
            Existem perguntas com erro(s) de validação.
          </InfoLabel> 
        }
      </React.Fragment>
    )
  }

  render() {  
    return (
      <div>
        <Row>
          <Col span={12}>
            <Title className="title-text">
              Edição das Perguntas
            </Title>
            { this.getCountPerguntas()}
          </Col>
          <Col span={12} type="flex" align="right">
            <div className={this.props.perguntasCount ? '' : 'hidden'}>
              <Tooltip title="Remover Todas as Perguntas" placement="bottomLeft">
                <Popconfirm title="Remover todas as perguntas?" placement="leftBottom" onConfirm={() => this.onClearAll()}>
                  <Button icon={<DeleteOutlined />} type="default" style={{fontSize: '18px', marginRight: '25px'}} />
                </Popconfirm>
              </Tooltip>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ListaPerguntas />
          </Col>
        </Row>
    </div>
    );
  }
}

const mapStateToProperties = state => {
  return { perguntasCount: state.demandas.demanda_atual.perguntas ? state.demandas.demanda_atual.perguntas.length : 0,
           errorsList: state.demandas.demanda_erros.perguntas
         }
}

export default connect(mapStateToProperties, { 
  updateFormData,
  clearQuestionErrorStatus
})(PerguntasForm);