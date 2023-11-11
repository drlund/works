import React, { Component } from 'react';
import { BankOutlined, SearchOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Row, Col, Button, message, Card, Avatar, Select } from 'antd';
import MaskedInput from 'react-text-mask';
import StyledCard from 'components/styledcard/StyledCard';
import { fetchDependencia, fetchListaComites, fetchMembrosComite } from 'services/ducks/Arh.ducks';
import { HandleErrorResponse } from 'utils/Commons';
import TabelaMembrosComite from './TabelaMembrosComite';
import InfoLabel from 'components/infolabel';
import { connect } from 'react-redux';
import _ from 'lodash';

class Comite extends Component {

  state = {
    prefixoIncluindo: "",
    dadosDependencia: {},
    searching: false,
    listaComites: [],
    codTipoComite: 0,
    nomeComite: "",
    searchingMembros: false,
    membrosComite: []
  }

  componentDidMount() {
    let { prefixo, codigoComite, nomeComite } = this.props.participante;
    
    if (prefixo) {
      this.setState({ prefixoIncluindo: prefixo, codTipoComite: codigoComite, nomeComite }, () => {
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
    this.setState({ dadosDependencia, searching: false, searchingMembros: true}, () => {
      this.onSearchListaComites(dadosDependencia.prefixo)
    })
  }

  onFetchError = (what) => {
    message.error(what);
    this.setState({ dadosDependencia: {}, listaComites: [], membrosComite: [], searching: false }, () => {
      this.validateData();
    })
  }

  onSearchListaComites = (prefixo) => {
    this.setState({ listaComites: [], membrosComite: [], searching: true, searchingMembros: true}, () => {
      this.props.fetchListaComites(prefixo)
        .then( (listaComites) => {
          this.setState({ listaComites, searching: false, searchingMembros: false}, () => {
            if (this.state.codTipoComite) {
              this.onComiteSelected({ key: this.state.codTipoComite, label: this.state.nomeComite});
            }
          })
        })
        .catch( (error) => {
          this.setState({ searching: false, searchingMembros: false});
          message.error(error);
        })
    })
  }

  validateData = () => {
    let { dadosDependencia, codTipoComite, nomeComite } = this.state;

    if (!this.state.codTipoComite) {
      this.props.onUpdateParent({}, false);
    } else {         
      this.props.onUpdateParent({
        ...this.props.participante,
        prefixo: dadosDependencia.prefixo,
        nomeDependencia: dadosDependencia.nome,
        tipoVinculo: this.props.tipoVinculo.id, 
        nomeTipoVinculo: this.props.tipoVinculo.titulo,
        codigoComite: codTipoComite,
        nomeComite
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

  renderListaComites = () => {
    return this.state.listaComites.map(elem => {
      return <Select.Option value={elem.codTipoComite} key={elem.codTipoComite}>{elem.nomeComite}</Select.Option>
    })
  }

  onPrefixoChange = (value) => {
    let  prefixoIncluindo = String(value).padStart(4 , '0');
    this.setState({ prefixoIncluindo, 
      dadosDependencia: {}, 
      codTipoComite: 0, 
      nomeComite: "",
      listaComites: [],
      membrosComite: [] }, () => {
      this.validateData();
    })
  }

  onComiteSelected = (value) => {
    if (!value) {
      this.setState({ codTipoComite: 0, nomeComite: "", searchingMembros: false, membrosComite: []}, () => {
        this.validateData();
      });
      return;
    }

    //desabilita o bota de salvar ate obter a lista de membros do comite.
    this.props.onUpdateParent({}, false);

    this.setState({ codTipoComite: value.key, nomeComite: value.label, membrosComite: [], searchingMembros: true}, () => {      
      this.props.fetchMembrosComite(this.state.dadosDependencia.prefixo, value.key)
      .then( (membrosComite) => {
        this.setState({ membrosComite, searchingMembros: false}, () => {
          this.validateData();
        })
      })
      .catch( (error) => {
        this.setState({ searchingMembros: false}, () => {
          this.validateData();
        });
        message.error(error);
      })    
    });

  }

  render() {

    let defValue = this.state.codTipoComite ? {defaultValue: {key: this.state.codTipoComite, label: this.state.nomeComite}} : {};

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
                  guide={false}
                  mask={[/\d/, /\d/, /\d/,/\d/]}
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
            Os integrantes do <strong>{`${this.props.tipoVinculo.titulo}`}</strong> selecionado serão incluídos na lista de <strong>{`${this.props.participante.tipoParticipante}`}s</strong>. 
            O vínculo só será validado após a assinatura do quorum mínimo exigido e assinatura do(s) membro(s) obrigatório(s).
            </StyledCard>
          </Col>
        </Row>

        { (this.state.listaComites.length > 0) &&
          <Row>
            <Col span={24} style={{paddingLeft: 10, paddingRight: 10}}>
                <Form layout="vertical">
                  <Form.Item label={<span>Lista de Comitês - <InfoLabel type="error" showIcon={false}>Caso seja necessário, verifique a composição do comitê no alçadas 31.</InfoLabel></span>}>
                    <Select
                      style={{ width: "100%" }} 
                      placeholder="Selecione um comitê"
                      allowClear
                      labelInValue
                      onChange={this.onComiteSelected}
                      loading={this.state.searchingMembros}
                      {...defValue}
                    >
                      {this.renderListaComites()}
                    </Select>
                  </Form.Item>
                </Form> 
            </Col>
          </Row>
        }

        {
          this.state.membrosComite.length > 0 &&
          <Row>
            <Col span={24} style={{paddingLeft: 10, paddingRight: 10}}>
              <Form layout="vertical">
                <Form.Item label="Membros do Comitês" style={{marginBottom: 0}}>
                  <TabelaMembrosComite dados={this.state.membrosComite} />
                </Form.Item>
              </Form>
            </Col>
          </Row>
        }
      </div>
    );
  }
}

export default connect(null, {
  fetchDependencia,
  fetchListaComites,
  fetchMembrosComite
})(Comite);