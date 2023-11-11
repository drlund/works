import React, { Component } from 'react'
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Select, Row, Col } from 'antd';
import { TIPOS_VINCULOS, TIPO_PARTICIPANTE } from 'pages/ordemserv/Types';
import TipoVinculo from './tipovinculo/TipoVinculo';

const { Option } = Select;

const participanteDefaults = {
  prefixo: "",
  nomeDependencia: "",
  nomeTipoVinculo: "",
  matricula: "",
  nomeFunci: "",
  cargoComissao: "",
  codigoComite: 0,
  nomeComite: "",
  quorumMinimo: 0
}

class ParticipanteForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      participante: {...this.props.participante}
    }
  }

  renderListaVinculos = () => {
    let vinculos = Object.values(TIPOS_VINCULOS);

    return (
      vinculos
        .filter( elem => 
          elem.tipoParticipante === this.props.participante.tipoParticipante ||
          elem.tipoParticipante === TIPO_PARTICIPANTE.AMBOS
        )
        .map( (elem) => {
          return (
            <Option value={elem.id} key={elem.id}>{elem.titulo}</Option>
          )
        })
    )
  }

  onTipoChange = (value) => {
    let newPartic = {...participanteDefaults};
    newPartic.tipoParticipante = this.state.participante.tipoParticipante;
    newPartic.tipoVinculo = value;
    this.setState({ participante: {...newPartic}}, () => {
      this.props.onUpdateParent({}, false);
    });
  }

  onUpdateDadosParticpante = (dadosParticipante, valid) => {
    this.setState({ participante: {...this.state.participante, ...dadosParticipante}}, () => {
      let tmpParticipante = { ...this.state.participante};
      //remove o tipoParticipante - nao deve alterar
      delete tmpParticipante.tipoParticipante;

      this.props.onUpdateParent(tmpParticipante, valid);
    });
  }

  render() {
    return (
      <div>
        <Form layout="vertical">
          <Form.Item label="Tipo de Vínculo">
            <Select 
              style={{ width: "100%" }} 
              placeholder="Selecione um tipo de vínculo"
              onChange={this.onTipoChange}
              defaultValue={this.state.participante.tipoVinculo}
              allowClear
            >
              {this.renderListaVinculos()}
            </Select>
          </Form.Item>            
        </Form>

        <Row>
          <Col span={24}>
            <div style={{ minHeight: 220}}>
              <TipoVinculo 
                participante={this.state.participante} 
                onUpdateParent={this.onUpdateDadosParticpante}
              />
            </div>
          </Col>
        </Row>

      </div>
    )
  }
}

export default ParticipanteForm;