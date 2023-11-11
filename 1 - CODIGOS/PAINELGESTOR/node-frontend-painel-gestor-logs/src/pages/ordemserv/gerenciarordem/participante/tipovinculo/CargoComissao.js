import React, { Component } from 'react'
import { connect } from 'react-redux';
import { fetchComissoesByPrefixo } from 'services/ducks/OrdemServ.ducks';
import { fetchDependencia } from 'services/ducks/Arh.ducks';
import { HandleErrorResponse } from 'utils/Commons';
import { BankOutlined, SearchOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Select, Button, message, Card, Avatar } from 'antd';
import MaskedInput from 'react-text-mask';
import StyledCard from 'components/styledcard/StyledCard';
import { TIPOS_VINCULOS } from 'pages/ordemserv/Types';
import _ from 'lodash';

class CargoComissao extends Component {

  state = {
    prefixoIncluindo: "",
    comissaoSelecionada: "",
    listaComissoes: [],
    dadosDependencia: {},
    searching: false
  }

  componentDidMount() {
    let { prefixo, cargoComissao } = this.props.participante;
    
    if (prefixo) {
      this.setState({ 
        prefixoIncluindo: prefixo,
        comissaoSelecionada: cargoComissao
      }, () => {
        this.onSearchDependencia()
      })
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
    this.setState({ prefixoIncluindo, dadosDependencia: {}, listaComissoes: [], comissaoSelecionada: "" }, () => {
      this.validateData();
    })
  }

  validateData = () => {
    let { dadosDependencia } = this.state;

    if (_.isEmpty(dadosDependencia) || !this.state.comissaoSelecionada.trim().length) {
      this.props.onUpdateParent({}, false);
    } else {
      this.props.onUpdateParent({
        ...this.props.participante,
        prefixo: dadosDependencia.prefixo,
        nomeDependencia: dadosDependencia.nome,
        tipoVinculo: TIPOS_VINCULOS.CARGO_COMISSAO.id, 
        nomeTipoVinculo: TIPOS_VINCULOS.CARGO_COMISSAO.titulo,
        cargoComissao: this.state.comissaoSelecionada
      }, true);
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
      this.onSearchComissoes(dadosDependencia.prefixo)
    })
  }

  onFetchError = (what) => {
    message.error(what);
    this.setState({ dadosDependencia: {}, listaComissoes: [], searching: false })
  }

  onSearchComissoes = (prefixo) => {
    this.setState({ searching: true, listaComissoes: []}, () => {
      this.props.fetchComissoesByPrefixo(prefixo, {
        successCallback: this.onFetchedCommisoes,
        errorCallback: this.onFetchComissoesError
      })
    })
  }

  onFetchedCommisoes = (listaComissoes) => {
    this.setState({ listaComissoes, searching: false})
  }

  onFetchComissoesError = (what) => {
    message.error(what);
    this.setState({ listaComissoes: [], searching: false })
  }

  renderListaComissoes = () => {
    return (
      this.state.listaComissoes.map( elem => {
        return <Select.Option value={elem.nome_funcao}>{elem.nome_funcao}</Select.Option>
      })
    )
  }

  onComissaoSelected = (value) => {
    this.setState({ comissaoSelecionada: value || ""}, () => {
      this.validateData();
    })
  }

  render() {

    let defValue = this.state.comissaoSelecionada.length ? {defaultValue: this.state.comissaoSelecionada} : {};

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

              <div>
                {this.renderDependenciaSelecionada()}
              </div>
              
              {(this.state.listaComissoes.length > 0) &&
                <div style={{ marginTop: '20px'}}>
                  <Form layout="vertical">
                    <Form.Item label="Cargo/Comissão">
                      <Select
                        style={{ width: "100%" }} 
                        placeholder="Selecione uma função/comissão"
                        allowClear
                        onChange={this.onComissaoSelected}
                        {...defValue}
                      >
                        {this.renderListaComissoes()}
                      </Select>
                    </Form.Item>
                  </Form> 
                </div>            
              }
            </div>

          </Col>
          
          <Col sm={{span: 24}} md={{ span: 12}} lg={{span: 12}}>
            <StyledCard title="Informações">
              Todos os funcionários do prefixo que ocuparem o cargo/comissão informado serão incluídos na lista de designados.<br />
              <strong>Obs.:</strong> Exceto os designantes cadastrados para o prefixo selecionado.
            </StyledCard>
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(null, {
  fetchDependencia,
  fetchComissoesByPrefixo
})(CargoComissao);