import React, { Component } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Button, message, Card, Avatar } from 'antd';
import MaskedInput from 'react-text-mask';
import StyledCard from 'components/styledcard/StyledCard';
import { fetchFunciByTipoParticipante } from 'services/ducks/OrdemServ.ducks';
import { TIPOS_VINCULOS, TIPO_PARTICIPANTE } from 'pages/ordemserv/Types';
import { connect } from 'react-redux';
import _ from 'lodash';

class MatriculaIndividual extends Component {

  state = {
    matriculaIncluindo: "",
    dadosFunci: {},
    searching: false
  }

  componentDidMount() {
    let { matricula } = this.props.participante;
    
    if (matricula) {
      this.setState({ matriculaIncluindo: matricula}, () => {
        this.onSearchFunci()
      })
    }
  }

  onSearchFunci = () => {
    var patt = /^F\d{7}/i;
    let { matriculaIncluindo } = this.state;

    if (!matriculaIncluindo.length) {
      message.error("Informe a matrícula do funcionário!")
      return;
    }

    if (matriculaIncluindo.length < 8 || !patt.exec(matriculaIncluindo)) {
      message.error("Formato da matrícula incorreto!")
      return;
    }

    this.setState({ searching: true }, () => {
      this.props.fetchFunciByTipoParticipante(
        matriculaIncluindo,
        this.props.participante.tipoParticipante,          
        { successCallback: this.onFetchSuccess,
          errorCallback: this.onFetchError
        },
      )
    })
  }

  onFetchSuccess = (dadosFunci) => {
    this.setState({ dadosFunci, searching: false}, () => {
      this.validateData()
    })
  }

  onFetchError = (what) => {
    message.error(what);
    this.setState({ dadosFunci: {}, searching: false }, () => {
      this.validateData();
    })
  }

  validateData = () => {
    let { dadosFunci } = this.state;

    if (_.isEmpty(dadosFunci)) {
      this.props.onUpdateParent({}, false);
    } else {         
      this.props.onUpdateParent({
        ...this.props.participante,
        prefixo: dadosFunci.prefixo,
        nomeDependencia: dadosFunci.nome_prefixo,
        tipoVinculo: TIPOS_VINCULOS.MATRICULA_INDIVIDUAL.id, 
        nomeTipoVinculo: TIPOS_VINCULOS.MATRICULA_INDIVIDUAL.titulo,
        matricula: dadosFunci.matricula,
        nomeFunci: dadosFunci.nome
      }, true);
    }
  }

  renderFunciSelecionado = () => {
    if (!_.isEmpty(this.state.dadosFunci)) {
      let {dadosFunci} = this.state;
      let imgProportions = 67;

      return (
        <Card style={{marginLeft: 10, marginRight: 10}}>
          <Card.Grid style={{ width: "33%"}}>
            <Avatar src={dadosFunci.img} style={{width: imgProportions, height: imgProportions, lineHeight: imgProportions}} />
          </Card.Grid>

          <Card.Grid style={{ width: "67%"}}>
            <div>
              <div style={{fontWeight: "bold"}}>{dadosFunci.nomeGuerra}</div>
              <div style={{fontSize: "9px"}}>{dadosFunci.nome}</div>
              <div style={{fontSize: "11px"}}>{dadosFunci.cargo}</div>
              <div style={{fontSize: "11px"}}>{`${dadosFunci.prefixo}-${dadosFunci.nome_prefixo}`}</div>
            </div>            
          </Card.Grid>
        </Card>
      )
    }

    return null;
  }

  onMatriculaChange = (value) => {
    this.setState({ matriculaIncluindo: value, dadosFunci: {} }, () => {
      this.validateData();
    })
  }

  render() {
    return (
      <div>
        <Row>
          <Col sm={{span: 24}} md={{ span: 12}} lg={{span: 12}}>
            <div style={{paddingLeft: 10, paddingRight: 10}}>
            <Form 
              layout="horizontal" 
              labelCol={{ sm: { span: 24 }, md: { spam: 6}, lg: { span: 6} }} 
              wrapperCol={{ span: 12 }} 
              labelAlign="left"
              colon={false}
            >
              <Form.Item label="Matrícula">
                <MaskedInput
                  className="ant-input"
                  style={{ width: 100, marginRight: 15}}
                  defaultValue={this.state.matriculaIncluindo}
                  guide={false}
                  mask={['F',/\d/, /\d/, /\d/,/\d/, /\d/, /\d/, /\d/]}
                  placeholder="F0000000"
                  onChange={(event) => this.onMatriculaChange(event.target.value)}
                  onKeyUp={
                    (e) => {
                      if (e.keyCode === 13) {
                        this.onSearchFunci()
                      }
                    }
                  }
                />

                <Button 
                  onClick={this.onSearchFunci}
                  type="primary" 
                  shape="circle" 
                  icon={<SearchOutlined />} 
                  loading={this.state.searching}
                />

              </Form.Item>
            </Form>
            </div>
            <div>
              {this.renderFunciSelecionado()}
            </div>
          </Col>
          
          <Col sm={{span: 24}} md={{ span: 12}} lg={{span: 12}}>
            <StyledCard title="Informações">
              A matrícula informada será incluída na lista.
              { this.props.participante.tipoParticipante === TIPO_PARTICIPANTE.DESIGNANTE && 
                <span><br/><strong>Atenção:</strong> Designante deve possuir nível gerencial.</span>
              }
            </StyledCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(null, {
  fetchFunciByTipoParticipante
})(MatriculaIndividual);