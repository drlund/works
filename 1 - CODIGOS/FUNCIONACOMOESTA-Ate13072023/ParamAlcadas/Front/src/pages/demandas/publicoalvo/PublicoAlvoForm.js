import React, { Component } from "react";
import { connect } from "react-redux";

import { updateFormData } from "services/actions/demandas";
import { LoadingOutlined } from "@ant-design/icons";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Row, Col, Spin, Select } from "antd";

import InfoLabel from "components/infolabel/InfoLabel";
import { DefaultGutter } from "utils/Commons";
import _ from "lodash";
import StyledCard from "components/styledcard/StyledCard";
import PageLoading from "components/pageloading/PageLoading";
import ListaSimples from "../publicoalvo/ListaSimples";
import FormPlanilha from "../publicoalvo/FormPlanilha";

//ALIAS do AntDesign
const { Option } = Select;

/**
 *
 *   Caso queira acrescentar um novo tipo de público, deve-se incluir os dados no objeto abaixo, implementar função com o nome constante na cahve renderFunc e incluir uma nova entrada
 *   no Switch case do método is publicos preenchidos
 *
 */
const tiposPublico = {
  publicos: {
    value: "publicos",
    displayName: "Lista Simples",
    renderFunc: "renderListaSimples",
  },
  lista: {
    value: "lista",
    displayName: "Planilha",
    renderFunc: "renderPlanilha",
  },
};

class PublicoAlvoForm extends Component {
  static propName = "publicoAlvo";

  constructor(props) {
    super(props);
    //Seletor para permitir a limpeza do textarea

    if (_.isEmpty(this.props.publicoAlvo)) {
      let initialState = {
        tipoPublico: tiposPublico.publicos.value,
        multiplaPorPrefixo: false,
        respostaUnica: true,
        publicos: {
          prefixos: [],
          matriculas: [],
        },
      };

      this.props.updateFormData(PublicoAlvoForm.propName, initialState);
    }

    this.state = {
      loading: false,
    };
  }

  setLoading = (value) => {
    this.setState({ loading: value });
  };

  handleSelectChange = (value) => {
    this.props.updateFormData(PublicoAlvoForm.propName, { tipoPublico: value });
  };

  showModalMudancaTipo = (value) => {
    this.setState({ showModal: true });
  };

  renderListaSimples = () => {

    return (
      <ListaSimples
        jaRespondida={this.props.jaRespondida}
        loadingFunc={this.setLoading}
        respostaUnica={
          this.props.publicoAlvo.respostaUnica !== undefined ? this.props.publicoAlvo.respostaUnica : true
        }
        multiplaPorPrefixo={this.props.publicoAlvo.multiplaPorPrefixo}
        publicoAlvo={this.props.publicoAlvo.publicos}
        updateFormData={this.props.updateFormData}
      />
    );
  };

  renderPlanilha = () => {
    return (
      <FormPlanilha
        loadingFunc={this.setLoading}
        data={this.props.publicoAlvo.lista}
        updateFormData={this.props.updateFormData}
      />
    );
  };

  renderFormDadosPublico = () => {
    return this[tiposPublico[this.props.publicoAlvo.tipoPublico].renderFunc]();
  };

  getOptions = () => {
    let options = [];
    for (let tipo of Object.keys(tiposPublico)) {
      options.push(
        <Option key={tiposPublico[tipo].value} value={tiposPublico[tipo].value}>
          {" "}
          {tiposPublico[tipo].displayName}{" "}
        </Option>
      );
    }
    return options;
  };

  render = () => {
    //Caso a a propriedade ainda não esteja carregada no REDUX, deve-se mostrar a página de loading
    if (!this.props.publicoAlvo.tipoPublico) {
      return <PageLoading />;
    }

    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const options = this.getOptions();

    /** Executa a função responsável por renderizar o formulário referente ao tipo de público */

    return (
      <div>
        <Spin indicator={antIcon} spinning={this.state.loading}>
          <StyledCard title="Tipo de Público Alvo">
            <Row gutter={DefaultGutter} type="flex">
              <Col span={12}>
                <Row gutter={DefaultGutter} type="flex">
                  <Col span={24} style={{ marginBottom: 15 }}>
                    <InfoLabel showIcon={true} type="warning">
                      Caso o tipo de público alvo seja alterado e demanda for
                      salva, todas as respostas serão apagadas.
                    </InfoLabel>
                  </Col>
                  <Col span={24}>
                    <Form layout="vertical">
                      <Form.Item label="Selecione o tipo de público alvo desejado">
                        <Select
                          placeholder="Tipos"
                          style={{ width: 400 }}
                          value={this.props.publicoAlvo.tipoPublico}
                          onChange={this.handleSelectChange}
                        >
                          {options}
                        </Select>
                      </Form.Item>
                    </Form>
                  </Col>
                </Row>
              </Col>
              {/* <Col span={12}>
                <Row gutter={DefaultGutter}>
                  <Col span={24}>     
                    <h4> Instruções para o tipo: <b>{tiposPublico[this.props.publicoAlvo.tipoPublico].displayName}</b> </h4>
                    <p> aslçkdjlakj dlkasjdlkas dkajsldkjalkdlkasjdlkasjdlkasj dlkasj dlkj alksdj lkas dlkj aslkdjalksdjlkasjdlkasjlkdjlkasjdlkasjdlkasldjasd lkasj dlkajalkjsdlkaj</p>
                  </Col>
                </Row>
              </Col>            */}
            </Row>
          </StyledCard>

          <StyledCard title="Dados do Público Alvo">
            {this.renderFormDadosPublico()}
          </StyledCard>
        </Spin>
      </div>
    );
  };
}

const mapStateToProps = (state) => {
  return {
    authState: { ...state.app.authState },
    publicoAlvo: { ...state.demandas.demanda_atual.publicoAlvo },
    jaRespondida:  state.demandas.demanda_atual.jaRespondida ,
    errorsList: [...state.demandas.demanda_erros.publicoAlvo],
  };
};

export default connect(mapStateToProps, { updateFormData })(PublicoAlvoForm);
