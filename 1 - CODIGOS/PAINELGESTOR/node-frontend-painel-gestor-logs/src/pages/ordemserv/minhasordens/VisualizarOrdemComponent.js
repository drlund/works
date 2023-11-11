import React, { Component } from "react";
import { connect } from 'react-redux';
import styled from "styled-components";
import _ from "lodash";
import { EyeOutlined } from "@ant-design/icons";
import { Modal, Tooltip, Switch, Row, Col } from "antd";
import {
  TIPOS_VINCULOS,
  TIPO_PARTICIPANTE,
  MATRIZ_COR_ESTADOS,
  ESTADOS
} from "pages/ordemserv/Types";
import FunciWatermark from "components/watermark/FunciWatermark";
import PageLoading from "components/pageloading/PageLoading";
import VisualizarOrdemPdf from './VisualizarOrdemPdf'
import ReactHtmlParser from "react-html-parser";
import ButtonPrintPdf from 'components/buttonprintpdf'

const Section = styled.div`
  border: 2px solid #bbb;
  padding: 8px;
  margin-bottom: 10px;
`;

const TableContainer = styled.table`
  width: 100%;
  margin-bottom: 5px;
  color: rgba(0, 0, 0, 0.85);
`;

const TDLabel = styled.td`
  background-color: ${props => (props.isOrdemEstoque ? "#ddd" : "#96b2c8")};
  color: ${props => (props.isOrdemEstoque ? "#5b5151" : "#fff")};
  font-weight: bold;
  padding: 3px;
  padding-left: 7px;
`;

const TextoWrapper = styled.span`
  padding: 3px 10px 3px 10px;
`;

const TH = styled.th`
  border-bottom: 2px solid #919191;
  background-color: #c6c6c6;
  padding: 4px;
  padding-left: 0;
`;

const TR = styled.tr`
  background-color: ${props => (props.odd ? "#e3eef7" : "#f0f0f0")};
  border-bottom: 1px solid ${props => (props.odd ? "#b2c2ce" : "#c8c8c8")};
`;

const InnerTableStyle = {
  width: "100%",
  marginBottom: "5px",
  borderBottom: "1px solid #999",
  color: "rgba(0,0,0,.85)"
};

const TextSpanStyle = {
  color: "rgba(0,0,0,.85)"
};

const LineData = props => {
  let labelWidth = props.labelWidth || "15%";
  let textWidth = props.textWidth || "85%";
  let textStyle = props.textStyle || {};
  let bodyStyle = props.bodyStyle || {};
  let labelTDProps = props.labelTDProps || {};
  let textTDProps = props.textTDProps || {};

  return (
    <TableContainer>
      <tbody style={{ ...bodyStyle }}>
        <tr>
          {props.label && (
            <TDLabel {...labelTDProps} isOrdemEstoque={props.isOrdemEstoque} width={labelWidth}>
              {props.label}
            </TDLabel>
          )}
          {props.text && (
            <td {...textTDProps} width={textWidth} style={{ ...textStyle }}>
              <TextoWrapper>{props.text}</TextoWrapper>
            </td>
          )}
        </tr>
      </tbody>
    </TableContainer>
  );
};

class VisualizarOrdemComponent extends Component {
  constructor(props) {
    super(props);

    let {
      mostrarDesignantes,
      mostrarDesignados,
      modoEdicaoDesignados,
      modoEdicaoDesignantes
    } = props.config;

    this.pdfContainerRef = React.createRef();

    this.state = {
      mostrarDesignantes,
      mostrarDesignados,
      modoEdicaoDesignantes,
      modoEdicaoDesignados,
      loadingExibicao: false,
      printLayout: 'landscape',
      printingPdf: false,
      isOrdemEstoque: !_.isNil(this.props.dataHistoricoOrdem)
    };
  }

  renderDadosBasicos = () => {
    let { dadosBasicos } = this.props.dadosOrdem;
    let validadeOrdem =
      dadosBasicos.tipoValidade === "Determinada"
        ? dadosBasicos.dataValidade
        : dadosBasicos.tipoValidade;

    if (dadosBasicos.tipoValidade !== "Determinada") {
      validadeOrdem = validadeOrdem.toUpperCase();
    }

    let descricao = ReactHtmlParser(
      dadosBasicos.descricao.split("\n").join("<br />")
    );

    let nomeEstado = dadosBasicos.nomeEstado.toUpperCase();
    let dataRefEstado = { label: '', value: null};

    switch (dadosBasicos.estado) {
      case ESTADOS.VIGENTE: 
        dataRefEstado = { label: "Início Vigência:", value: dadosBasicos.dataVigRevog }
        break;

      case ESTADOS.REVOGADA:
        dataRefEstado = { label: "Data Revogação:", value: dadosBasicos.dataVigRevog }
        break;

      case ESTADOS.VIGENTE_PROVISORIA: 
        dataRefEstado = { label: "Dt. Lim. Vigência: ", value: dadosBasicos.dataLimVigenciaTemp }
        break;
      default:
        dataRefEstado = { label: '', value: null};
    }

    return (
      <Section>
        { this.state.isOrdemEstoque &&
          <LineData 
            label={`ATENÇÃO: ESTA É UMA ORDEM DE SERVIÇO ESTOQUE REFERENTE A DATA DE ${this.props.dataHistoricoOrdem}`} 
            labelTDProps={{ colSpan: "2", style: {backgroundColor: '#f2261c', textAlign: 'center'} }} />
        }

        { !_.isNil(dadosBasicos.numero) &&
          <LineData
            label="Número:"
            text={dadosBasicos.numero}
            textStyle={{ fontWeight: "bold" }}
            isOrdemEstoque={this.state.isOrdemEstoque}
          />
        }

        <LineData
          label="Estado Atual:"
          text={nomeEstado}
          textStyle={{
            fontWeight: "bold",
            color: MATRIZ_COR_ESTADOS[dadosBasicos.estado]
          }}
          isOrdemEstoque={this.state.isOrdemEstoque}
        />

        { !_.isNil(dataRefEstado.value) &&
          <LineData
            label={dataRefEstado.label}
            text={dataRefEstado.value}
            isOrdemEstoque={this.state.isOrdemEstoque}
          />
        }

        <LineData label="Validade:" text={validadeOrdem} isOrdemEstoque={this.state.isOrdemEstoque} />
        <LineData 
          label="Confidencial:" text={dadosBasicos.confidencial === 1 ? "Sim": "Não"} 
          textStyle={{ fontWeight: 'bold'}}
          isOrdemEstoque={this.state.isOrdemEstoque}
        />
        <LineData label="Título:" text={dadosBasicos.titulo} isOrdemEstoque={this.state.isOrdemEstoque} />
        <LineData label="Descrição:" labelTDProps={{ colSpan: "2" }} isOrdemEstoque={this.state.isOrdemEstoque} />
        <LineData
          text={descricao}
          textTDProps={{ colSpan: "2" }}
          textStyle={{ padding: "0 10px 10px 10px" }}
          bodyStyle={{ backgroundColor: "#f0f0f0" }}
          isOrdemEstoque={this.state.isOrdemEstoque}
        />
      </Section>
    );
  };

  renderInstrucoesNormativas = () => {
    let odd = false;

    let listaINS = this.props.dadosOrdem.instrucoesNorm.map((elem, index) => {
      odd = !odd;
      return (
        <TR odd={odd} key={index}>
          <td style={{ paddingLeft: 10 }}>{elem.nroINC}</td>
          <td>{elem.titulo}</td>
          <td>{elem.item}</td>
          <td>{elem.tipoNormativo}</td>
          <td>{elem.versao}</td>
          <td style={{ paddingLeft: 12 }}>
            <Tooltip title="Visualizar Texto">
              <EyeOutlined
                style={{ fontSize: "16px" }}
                className="link-color link-cursor"
                onClick={() =>
                  this.onVisualizarInstrucao(
                    elem.nroINC + "-" + elem.codTipoNormativo + "-" + elem.item
                  )
                }
              />
            </Tooltip>
          </td>
        </TR>
      );
    });

    return (
      <Section>
        <LineData label="Instruções Normativas" isOrdemEstoque={this.state.isOrdemEstoque} />
        <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
          <table style={InnerTableStyle}>
            <thead>
              <tr>
                <TH width="5%">Nro.</TH>
                <TH width="35%">Título</TH>
                <TH width="10%">Item</TH>
                <TH width="30%">Tipo</TH>
                <TH width="10%">Versão</TH>
                <TH width="10%">Ações</TH>
              </tr>
            </thead>
            <tbody>{listaINS}</tbody>
          </table>
        </div>
      </Section>
    );
  };

  onVisualizarInstrucao = id => {
    let record = this.props.dadosOrdem.instrucoesNorm.filter(elem => {
      return elem.nroINC + "-" + elem.codTipoNormativo + "-" + elem.item === id;
    });

    record = record[0];

    Modal.info({
      title:
        "[IN-" +
        record.nroINC +
        "] - " +
        ReactHtmlParser(record.titulo) +
        " - Vrs: " +
        record.versao,
      content: (
        <div>
          <h5>{record.tipoNormativo}</h5>
          <span style={TextSpanStyle}>
            {record.item} {ReactHtmlParser(record.textoItem)}
          </span>
        </div>
      ),
      width: 800,
      centered: true
    });
  };

  //Obtem a lista de matriculas do modo edicao
  renderMatriculasEdicao = tipoParticipante => {
    let { participantes } = this.props.dadosOrdem;

    let vinculosMatricula = participantes.filter(
      elem =>
        elem.tipoVinculo === TIPOS_VINCULOS.MATRICULA_INDIVIDUAL.id &&
        elem.tipoParticipante === tipoParticipante
    );

    let listaMatriculas = null;

    if (vinculosMatricula.length) {
      let odd = false;
      let registros = vinculosMatricula.map((elem, index) => {
        let vinculoColor =
          elem.resolvido === "Sim" ? "rgb(70, 155, 28)" : "rgb(244, 41, 55)";
        odd = !odd;

        return (
          <TR odd={odd} key={index}>
            <td>{elem.prefixo}</td>
            <td>{elem.nomeDependencia}</td>
            <td>{elem.matricula}</td>
            <td>{elem.nomeFunci}</td>
            <td
              style={{
                paddingLeft: 45,
                fontWeight: "bold",
                color: vinculoColor
              }}
            >
              {elem.resolvido}
            </td>
          </TR>
        );
      });

      listaMatriculas = (
        <React.Fragment>
          <LineData text="Matrícula(s):" textStyle={{ fontWeight: "bold" }} isOrdemEstoque={this.state.isOrdemEstoque} />
          <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            <table style={InnerTableStyle}>
              <thead>
                <tr>
                  <TH width="10%">Prefixo</TH>
                  <TH width="30%">Dependência</TH>
                  <TH width="10%">Matrícula</TH>
                  <TH width="40%">Nome</TH>
                  <TH width="10%">Vínculo Resolvido</TH>
                </tr>
              </thead>
              <tbody>{registros}</tbody>
            </table>
          </div>
        </React.Fragment>
      );
    }

    return listaMatriculas;
  };

  //Obtem a lista de comites do modo edicao.
  renderComitesEdicao = tipoParticipante => {
    let { participantes } = this.props.dadosOrdem;

    let vinculosComite = participantes.filter(
      elem =>
        elem.tipoVinculo === TIPOS_VINCULOS.COMITE.id &&
        elem.tipoParticipante === tipoParticipante
    );

    let listaComites = null;

    if (vinculosComite.length) {
      let odd = false;
      let registros = vinculosComite.map((elem, index) => {
        let vinculoColor =
          elem.resolvido === "Sim" ? "rgb(70, 155, 28)" : "rgb(244, 41, 55)";
        odd = !odd;

        return (
          <TR odd={odd} key={index}>
            <td>{elem.prefixo}</td>
            <td>{elem.nomeDependencia}</td>
            <td>{elem.nomeComite}</td>
            <td
              style={{
                paddingLeft: 45,
                fontWeight: "bold",
                color: vinculoColor
              }}
            >
              {elem.resolvido}
            </td>
          </TR>
        );
      });

      listaComites = (
        <React.Fragment>
          <LineData text="Comitês(s):" textStyle={{ fontWeight: "bold" }} isOrdemEstoque={this.state.isOrdemEstoque} />
          <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            <table style={InnerTableStyle}>
              <thead>
                <tr>
                  <TH width="10%">Prefixo</TH>
                  <TH width="40%">Dependência</TH>
                  <TH width="40%">Comitê</TH>
                  <TH width="10%">Vínculo Resolvido</TH>
                </tr>
              </thead>
              <tbody>{registros}</tbody>
            </table>
          </div>
        </React.Fragment>
      );
    }

    return listaComites;
  };

  //Obtem a lista de prefixos do modo edicao.
  renderPrefixosEdicao = tipoParticipante => {
    let { participantes } = this.props.dadosOrdem;

    let listaVinculos = participantes.filter(
      elem =>
        elem.tipoVinculo === TIPOS_VINCULOS.PREFIXO.id &&
        elem.tipoParticipante === tipoParticipante
    );

    let linhas = null;

    if (listaVinculos.length) {
      let odd = false;
      let registros = listaVinculos.map((elem, index) => {
        let vinculoColor =
          elem.resolvido === "Sim" ? "rgb(70, 155, 28)" : "rgb(244, 41, 55)";
        odd = !odd;

        return (
          <TR odd={odd} key={index}>
            <td>{elem.prefixo}</td>
            <td>{elem.nomeDependencia}</td>
            <td
              style={{
                paddingLeft: 45,
                fontWeight: "bold",
                color: vinculoColor
              }}
            >
              {elem.resolvido}
            </td>
          </TR>
        );
      });

      linhas = (
        <React.Fragment>
          <LineData text="Prefixo(s):" textStyle={{ fontWeight: "bold" }} isOrdemEstoque={this.state.isOrdemEstoque} />
          <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            <table style={InnerTableStyle}>
              <thead>
                <tr>
                  <TH width="10%">Prefixo</TH>
                  <TH width="80%">Dependência</TH>
                  <TH width="10%">Vínculo Resolvido</TH>
                </tr>
              </thead>
              <tbody>{registros}</tbody>
            </table>
          </div>
        </React.Fragment>
      );
    }

    return linhas;
  };

  //Obtem a lista de prefixos do modo edicao.
  renderCargoComissoesEdicao = () => {
    let { participantes } = this.props.dadosOrdem;

    let listaVinculos = participantes.filter(
      elem =>
        elem.tipoVinculo === TIPOS_VINCULOS.CARGO_COMISSAO.id &&
        elem.tipoParticipante === TIPO_PARTICIPANTE.DESIGNADO
    );

    let linhas = null;

    if (listaVinculos.length) {
      let odd = false;
      let registros = listaVinculos.map((elem, index) => {
        let vinculoColor =
          elem.resolvido === "Sim" ? "rgb(70, 155, 28)" : "rgb(244, 41, 55)";
        odd = !odd;

        return (
          <TR odd={odd} key={index}>
            <td>{elem.prefixo}</td>
            <td>{elem.nomeDependencia}</td>
            <td>{elem.cargoComissao}</td>
            <td
              style={{
                paddingLeft: 45,
                fontWeight: "bold",
                color: vinculoColor
              }}
            >
              {elem.resolvido}
            </td>
          </TR>
        );
      });

      linhas = (
        <React.Fragment>
          <LineData text="Cargo/Comissão:" textStyle={{ fontWeight: "bold" }} isOrdemEstoque={this.state.isOrdemEstoque} />
          <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            <table style={InnerTableStyle}>
              <thead>
                <tr>
                  <TH width="10%">Prefixo</TH>
                  <TH width="35%">Dependência</TH>
                  <TH width="45%">Cargo/Comissão</TH>
                  <TH width="10%">Vínculo Resolvido</TH>
                </tr>
              </thead>
              <tbody>{registros}</tbody>
            </table>
          </div>
        </React.Fragment>
      );
    }

    return linhas;
  };

  /**
   * Edição - Lista dos Tipo de Vinculo dos Designantes.
   */
  renderDesignantesEdicao = () => {
    return (
      <Section>
        <LineData label="Designantes" isOrdemEstoque={this.state.isOrdemEstoque} />
        {this.renderMatriculasEdicao(TIPO_PARTICIPANTE.DESIGNANTE)}
        {this.renderComitesEdicao(TIPO_PARTICIPANTE.DESIGNANTE)}
      </Section>
    );
  };

  /**
   * Edição - Lista dos Tipo de Vinculo dos Designados.
   */
  renderDesignadosEdicao = () => {
    return (
      <Section>
        <LineData label="Designados" isOrdemEstoque={this.state.isOrdemEstoque} />
        {this.renderMatriculasEdicao(TIPO_PARTICIPANTE.DESIGNADO)}
        {this.renderComitesEdicao(TIPO_PARTICIPANTE.DESIGNADO)}
        {this.renderPrefixosEdicao(TIPO_PARTICIPANTE.DESIGNADO)}
        {this.renderCargoComissoesEdicao()}
      </Section>
    );
  };

  //Obtem a lista de participantes da ordem com data da assinatura
  renderAssinaturas = tipoParticipante => {
    let { participantes } = this.props.dadosOrdem;

    let vinculosParticipante = participantes.filter(
      elem => elem.tipoParticipante === tipoParticipante
    );

    //busca a lista de participantes expandidos
    let listaPartExpand = [];

    for (const part of vinculosParticipante) {
      if (part.participanteExpandido) {
        for (const expand of part.participanteExpandido) {
          if (expand.naoPassivelAssinatura === false) {
            if (
              part.tipoVinculo === TIPOS_VINCULOS.COMITE &&
              part.resolvido === "Sim"
            ) {
              if (expand.assinou) {
                //se for vinculo do tipo comite e estiver resolvido, adiciona apenas os
                //participantes que ja assinaram a ordem. Evita listar participantes que nao tem
                //mais a obrigacao de assinar pelo comite.
                listaPartExpand.push({
                  ...expand,
                  nomeDependencia: part.nomeDependencia
                });
              }
            } else {
              //adiciona apenas os funcis que sao passiveis de assinatura desta ordem.
              listaPartExpand.push({
                ...expand,
                nomeDependencia: part.nomeDependencia
              });
            }
          }
        }
      }
    }

    let listaRegistros = null;

    if (listaPartExpand.length) {
      let odd = false;

      let registros = listaPartExpand.map((elem, index) => {
        odd = !odd;
        return (
          <TR odd={odd} key={index}>
            <td style={{ paddingLeft: 8 }}>{elem.prefixo}</td>
            <td>{elem.nomeDependencia}</td>
            <td>{elem.matricula}</td>
            <td>{elem.nomeFunci}</td>
            <td>{elem.dataAssinatura}</td>
          </TR>
        );
      });

      listaRegistros = (
        <React.Fragment>
          <LineData text="Assinatura(s):" textStyle={{ fontWeight: "bold" }} isOrdemEstoque={this.state.isOrdemEstoque} />
          <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            <table style={InnerTableStyle}>
              <thead>
                <tr>
                  <TH width="10%">Prefixo</TH>
                  <TH width="30%">Dependência</TH>
                  <TH width="6%">Matrícula</TH>
                  <TH width="40%">Nome</TH>
                  <TH width="14%">Data Assinatura</TH>
                </tr>
              </thead>
              <tbody>{registros}</tbody>
            </table>
          </div>
        </React.Fragment>
      );
    }

    let label = _.capitalize(tipoParticipante) + "s";

    if (!listaRegistros) {
      let notFoundText = "Nenhuma assinatura até o momento.";

      if (tipoParticipante === TIPO_PARTICIPANTE.DESIGNADO) {
        notFoundText =
          "Nenhuma assinatura até o momento. Os Designados só serão notificados para ciência após todos os Designantes assinarem e a Ordem estar Vigente.";
      }

      listaRegistros = (
        <React.Fragment>
          <LineData text="Assinatura(s):" textStyle={{ fontWeight: "bold" }} />
          <div style={{ paddingLeft: "10px", paddingRight: "10px" }}>
            <span style={TextSpanStyle}>{notFoundText}</span>
          </div>
        </React.Fragment>
      );
    }

    return (
      <Section>
        <LineData label={label} isOrdemEstoque={this.state.isOrdemEstoque} />
        {listaRegistros}
      </Section>
    );
  };

  onModoChange = checked => {
    this.setState({ loadingExibicao: true }, () => {
      setTimeout(() => {
        this.setState(
          {
            modoEdicaoDesignantes: !this.state.modoEdicaoDesignantes,
            modoEdicaoDesignados: !this.state.modoEdicaoDesignados
          },
          () => {
            this.setState({ loadingExibicao: false });
          }
        );
      }, 1000);
    });
  };

  render() {
    let sectionDesignantes = null;
    let sectionDesignados = null;
    
    let {
      mostrarDesignantes,
      mostrarDesignados,
      modoEdicaoDesignados,
      modoEdicaoDesignantes
    } = this.state;

    let mostrarAssinaturas =
      modoEdicaoDesignantes || modoEdicaoDesignados ? false : true;

    if (mostrarDesignantes) {
      sectionDesignantes = modoEdicaoDesignantes
        ? this.renderDesignantesEdicao()
        : this.renderAssinaturas(TIPO_PARTICIPANTE.DESIGNANTE);
    }

    if (mostrarDesignados) {
      sectionDesignados = modoEdicaoDesignados
        ? this.renderDesignadosEdicao()
        : this.renderAssinaturas(TIPO_PARTICIPANTE.DESIGNADO);
    }

    let numero = this.props.dadosOrdem.dadosBasicos.numero ? this.props.dadosOrdem.dadosBasicos.numero : 'RASCUNHO';
    let matricula = this.props.authState.sessionData['chave'];
    const modoExibicao = mostrarAssinaturas ? "assinaturas" : "resumo";

    return (
      <div>
        <Row>
          <Col span={24}>
            <div style={{ textAlign: "right", marginBottom: "10px" }}>
              <span style={{ marginRight: "10px", fontWeight: "bold" }}>
                Modo Exibição:
              </span>

              <span style={{ marginRight: "10px" }}>Resumo</span>
              <Switch
                onChange={this.onModoChange}
                defaultChecked={mostrarAssinaturas}
              />
              <span style={{ paddingLeft: "10px", paddingRight: "15px" }}>
                Assinaturas
              </span>

              { this.props.permiteImpressaoPdf && 
                <span style={{ paddingLeft: "10px", paddingRight: "15px" }}>
                  <ButtonPrintPdf 
                    document={(orientation) =>
                      <VisualizarOrdemPdf 
                        dadosOrdem={this.props.dadosOrdem} 
                        matricula={matricula} 
                        modoExibicao={modoExibicao}
                        orientation={orientation}
                        dataHistoricoOrdem={this.props.dataHistoricoOrdem}
                        isOrdemEstoque={this.state.isOrdemEstoque}
                      />
                    } 
                    filename={'ordem-' + _.snakeCase(numero)}
                  />
                </span>
              }
            </div>
          </Col>
        </Row>

        {this.state.loadingExibicao && (
          <div style={{ minHeight: 650 }}>
            <PageLoading />
          </div>
        )}

        {!this.state.loadingExibicao && (
          <FunciWatermark>
            {this.renderDadosBasicos()}
            {this.renderInstrucoesNormativas()}
            {sectionDesignantes}
            {sectionDesignados}
          </FunciWatermark>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authState: state.app.authState
  }
};

export default connect(mapStateToProps)(VisualizarOrdemComponent);
