import React, { Component } from 'react';
import { BankOutlined, SearchOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Button, message, Card, Avatar } from 'antd';
import MaskedInput from 'react-text-mask';
import StyledCard from 'components/styledcard/StyledCard';
import { fetchDependencia } from 'services/ducks/Arh.ducks';
import { TIPOS_VINCULOS } from 'pages/ordemserv/Types';
import { HandleErrorResponse } from 'utils/Commons';
import { connect } from 'react-redux';
import _ from 'lodash';

class VinculoPrefixo extends Component {

  state = {
    prefixoIncluindo: "",
    dadosDependencia: {},
    searching: false
  }

  componentDidMount() {
    let { prefixo } = this.props.participante;
    
    if (prefixo) {
      this.setState({ prefixoIncluindo: prefixo}, () => {
        this.onSearchDependencia()
      })
    }
  }

  onSearchDependencia = () => {
    var patt = /^\d+/;
    let { prefixoIncluindo } = this.state;

    if (!prefixoIncluindo) {
      message.error("Informe um prefixo!")
      return;
    }

    if (!patt.exec(prefixoIncluindo)) {
      message.error("Formato do prefixo incorreto!")
      return;
    }

    this.setState({ searching: true }, () => {
      this.onFetchDependencia(prefixoIncluindo)
    })
  }

  onFetchDependencia = (prefixoIncluindo) => {
    this.props.fetchDependencia(prefixoIncluindo)
      .then( (dadosDependencia) => {
        this.onFetchSuccess(dadosDependencia);
      })
      .catch( (error) => {
        HandleErrorResponse(error, this.onFetchError)
      })
  }

  onFetchSuccess = (dadosDependencia) => {
    this.setState({ dadosDependencia, searching: false}, () => {
      this.validateData()
    })
  }

  onFetchError = (what) => {
    message.error(what);
    this.setState({ dadosDependencia: {}, searching: false }, () => {
      this.validateData();
    })
  }

  validateData = () => {
    let { dadosDependencia } = this.state;

    if (_.isEmpty(dadosDependencia)) {
      this.props.onUpdateParent({}, false);
    } else {         
      this.props.onUpdateParent({
        ...this.props.participante,
        prefixo: dadosDependencia.prefixo,
        nomeDependencia: dadosDependencia.nome,
        tipoVinculo: TIPOS_VINCULOS.PREFIXO.id, 
        nomeTipoVinculo: TIPOS_VINCULOS.PREFIXO.titulo
      }, true);
    }
  }

  renderDependenciaSelecionada = () => {
    if (!_.isEmpty(this.state.dadosDependencia)) {
      let {dadosDependencia} = this.state;

      return (
        <Card style={{marginLeft: 10, marginRight: 10}}>
          <Card.Grid style={{ width: "25%", verticalAlign: "middle"}}>
            <Avatar icon={<BankOutlined />} />
          </Card.Grid>

          <Card.Grid style={{ width: "75%", verticalAlign: "middle", height: "80px"}}>
            <div style={{fontWeight: "bold", fontSize: "0.8rem"}}>{`${dadosDependencia.prefixo}-${dadosDependencia.nome}`}</div>
          </Card.Grid>
        </Card>
      );
    }

    return null;
  }

  onPrefixoChange = (value) => {
    let prefixoIncluindo = String(value).padStart(4, '0');
    this.setState({ prefixoIncluindo, dadosDependencia: {} }, () => {
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
              <Form.Item label="Prefixo">
                <MaskedInput
                  className="ant-input"
                  style={{ width: 100, marginRight: 15}}
                  defaultValue={this.state.prefixoIncluindo}
                  mask={[/\d/, /\d/, /\d/,/\d/]}
                  guide={false}
                  placeholder="0000"
                  onChange={(event) => this.onPrefixoChange(event.target.value)}
                  onKeyUp={
                    (e) => {
                      if (e.keyCode === 13) {
                        this.onSearchDependencia()
                      }
                    }
                  }
                />

                <Button 
                  onClick={this.onSearchDependencia}
                  type="primary" 
                  shape="circle" 
                  icon={<SearchOutlined />} 
                  loading={this.state.searching}
                />

              </Form.Item>
            </Form>
            </div>
            <div>
              {this.renderDependenciaSelecionada()}
            </div>
          </Col>
          
          <Col sm={{span: 24}} md={{ span: 12}} lg={{span: 12}}>
            <StyledCard title="Informações">
              Todos os funcionários do prefixo serão incluídos na lista.<br />
              <strong>Obs.:</strong> Exceto os designantes cadastrados para este prefixo.
            </StyledCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(null, {
  fetchDependencia
})(VinculoPrefixo);