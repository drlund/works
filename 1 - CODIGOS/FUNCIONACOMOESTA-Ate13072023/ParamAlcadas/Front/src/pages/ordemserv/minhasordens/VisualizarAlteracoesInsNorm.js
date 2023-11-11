import React, { Component } from "react";
import { Row, Col } from "antd";
import ReactHtmlParser from "react-html-parser";
// import Diff from 'react-diff-component';

class VisualizarAlteracoesInsNorm extends Component {
  render() {
    let {
      tipoNormativo,
      item,
      versao,
      textoItem,
      novaVersao,
      textoItemAlterado
    } = this.props.dadosInstrucao;

    const commonDivStyle = {
      padding: 10,
      border: "1px solid #ccc",
      marginBottom: 15,
      color: "rgba(0, 0, 0, 0.65)"
    };

    return (
      <div>
        <Row style={{ marginBottom: 15 }}>
          <Col span={24}>
            <h5>
              <strong>{item}</strong> {tipoNormativo}
            </h5>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <h5>
              VERSÃO ANTERIOR: <strong>{versao}</strong>
            </h5>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <div
              style={{
                ...commonDivStyle,
                backgroundColor: "rgb(255, 238, 240)"
              }}
            >
              <h4>{ReactHtmlParser(textoItem)}</h4>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <h5>
              NOVA VERSÃO: <strong>{novaVersao}</strong>
            </h5>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <div
              style={{
                ...commonDivStyle,
                backgroundColor: "rgb(205, 255, 216)"
              }}
            >
              <h4>{ReactHtmlParser(textoItemAlterado)}</h4>
            </div>
          </Col>
        </Row>

        {/* <Row>
          <Col span={24}>
            <h5>DIFERENÇAS: <strong>{versao}</strong> > <strong>{novaVersao}</strong></h5>
          </Col>
        </Row>

        <div style={{marginTop: 5, border: '1px solid #ccc'}}>
          <Diff inputA={textoItem} inputB={textoItemAlterado} type={Diff.types.wordsWithSpace} />
        </div> */}
      </div>
    );
  }
}

export default VisualizarAlteracoesInsNorm;
