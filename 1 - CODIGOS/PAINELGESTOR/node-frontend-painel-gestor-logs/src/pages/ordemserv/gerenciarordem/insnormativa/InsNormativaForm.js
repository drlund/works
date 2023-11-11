import React, { Component } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Tabs, Row, Col, Button, Tree, Divider, message, Radio, Tag } from "antd";
import StyledCard from "components/styledcard/StyledCard";
import PageLoading from "components/pageloading/PageLoading";
import InputINC from "components/inputsBB/InputINC";
import TabelaInsNormativas from "./TabelaInsNormativas";
import { DefaultGutter } from 'utils/Commons';
import ReactHtmlParser from "react-html-parser";
import { connect } from "react-redux";
import { fetchINCNodes } from "services/ducks/OrdemServ.ducks";
import OrdensAnalisadas from "../../minhasordens/OrdensAnalisadasComponent";
import uuid from 'uuid/v4';
import "./InsNormativaForm.css";

const { TabPane } = Tabs;

const { TreeNode } = Tree;
const NomesSecoes = [
  "Informações Auxiliares",
  "Disposições Normativas",
  "Procedimentos"
];

const DEFAULT_MESSAGE_TIMEOUT = 8;

class InsNormativaForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      nroINC: "",
      lastNroINC: "",
      tituloINC: "",
      tipoNorm: 1,
      versaoTipNorm: "",
      versaoAssunto: "",
      searching: false,
      treeData: [],
      treeKey: uuid(),
      lastTipoNorm: 1,
      itensSelecionados: [...this.props.initialState.itensSelecionados]
    };
  }

  onTextChange = value => {
    this.setState({ nroINC: value });
  };

  onTipoNormChange = value => {
    this.setState({ tipoNorm: value });
  };

  showError(errorMessage) {
    message.error(errorMessage, DEFAULT_MESSAGE_TIMEOUT);
  }

  onSearchRootNodes = () => {
    let { nroINC, tipoNorm } = this.state;

    this.setState(
      { treeData: [], lastTipoNorm: tipoNorm, lastNroINC: "", searching: true },
      async () => {
        try {
          let treeData = await this.props.fetchINCNodes({
            nroINC,
            codTipoNormativo: tipoNorm
          });

          if (!treeData.length) {
            this.setState({ searching: false });
            this.showError("Instrução não encontrada para esta consulta!");
            return;
          }

          let lastNroINC = treeData[0].CD_ASNT;
          let versaoTipNorm = treeData[0].NR_VRS_CTU_ASNT;
          let versaoAssunto = treeData[0].NR_VRS_ASNT;
          let tituloINC =
            "[IN-" + treeData[0].CD_ASNT + "] - " + treeData[0].TX_TIT_ASNT;
          this.setState({
            treeData,
            lastNroINC,
            versaoTipNorm,
            versaoAssunto,
            tituloINC,
            searching: false
          });
        } catch (error) {
          this.setState({ searching: false });
          this.showError(error);
        }
      }
    );
  };

  onSearchNodes = treeNode => {
    return new Promise(async resolve => {
      if (treeNode.props.children) {
        resolve();
        return;
      }

      let { nroINC, tipoNorm } = this.state;

      try {
        let childNodes = await this.props.fetchINCNodes({
          nroINC,
          codTipoNormativo: tipoNorm,
          baseItem: treeNode.props.dataRef.CD_NVL_PRGF_CTU
        });

        if (!childNodes.length) {
          this.showError("Nenhuma seção filha encontrada.");
          resolve();
          return;
        }

        treeNode.props.dataRef.children = childNodes;
        this.setState({ treeData: [...this.state.treeData] });
        resolve();
      } catch (error) {
        this.showError(error);
      }
    });
  };

  renderTreeNodes = data => {
    return data.map(item => {
      if (item.children) {
        return (
          <TreeNode
            title={
              <strong>
                {ReactHtmlParser(item.CD_NVL_PRGF_CTU + " " + item.TX_PRGF_CTU)}
              </strong>
            }
            key={
              item.CD_ASNT +
              "-" +
              item.CD_TIP_CTU_ASNT +
              "-" +
              item.CD_NVL_PRGF_CTU
            }
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      //deixando em negrito quando recupera apenas os root nodes.
      let title =
        item.CD_TIP_PRGF_CTU === 1 ? (
          <strong>
            {ReactHtmlParser(item.CD_NVL_PRGF_CTU + " " + item.TX_PRGF_CTU)}
          </strong>
        ) : (
          ReactHtmlParser(item.CD_NVL_PRGF_CTU + " " + item.TX_PRGF_CTU)
        );

      return (
        <TreeNode
          title={title}
          key={
            item.CD_ASNT +
            "-" +
            item.CD_TIP_CTU_ASNT +
            "-" +
            item.CD_NVL_PRGF_CTU
          }
          dataRef={item}
          isLeaf={item.CD_TIP_PRGF_CTU === 2}
        />
      );
    });
  };

  renderItensSelecionados = () => {
    return (
      <StyledCard
        style={{
          marginBottom: 5,
          minHeight: 718,
          maxHeight: 718,
          overflowY: "auto"
        }}
        bodyStyle={{
          paddingBottom: 0,
          paddingTop: 12
        }}
      >
        <TabelaInsNormativas
          dadosTabela={this.state.itensSelecionados}
          onRemoverRegistro={this.onRemoverItem}
          estadoOrdem={this.props.estadoOrdem}
          defaultPageSize={15}
        />
      </StyledCard>
    );
  };

  renderListaSugestoes = () => {
    return (
      <StyledCard
        style={{
          marginBottom: 5,
          minHeight: 718,
          // maxHeight: 718,
          overflowY: "auto"
        }}
        bodyStyle={{
          paddingBottom: 0,
          paddingTop: 12
        }}
      >
        <OrdensAnalisadas 
          defaultPageSize={5} 
          onSelectedItem={this.onAddSugestao}
          withAddAction={true}
        />
      </StyledCard>
    );
  }

  renderPesquisarInstrucao = () => {
    return (
      <div>
        <StyledCard style={{ marginBottom: 5 }}>
          <Row gutter={DefaultGutter}>
            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
              <Form layout="vertical">
                <Form.Item label="Instrução Normativa" style={{ marginBottom: 0, paddingBottom: 0}}>
                  <div style={{ display: 'flex', flexDirection: 'column'}}>
                    <InputINC onChange={this.onTextChange} />

                    <Button 
                      type="link" 
                      target="_blank" 
                      style={{ textAlign: 'left', paddingLeft: 0}}
                      href="https://intranet1.bb.com.br/inc"
                    >
                      Consultar INC
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Col>

            <Col xs={24} sm={24} md={24} lg={10} xl={10}>
              <Form layout="vertical">
                <Form.Item label="Tipo de Normativo">
                  <Radio.Group
                    onChange={e => this.onTipoNormChange(e.target.value)}
                    defaultValue={1}
                    style={{ paddingTop: 5 }}
                  >
                    <Radio value={1}>Disposição Normativa</Radio>
                    <Radio value={2}>Procedimentos</Radio>
                    <Radio value={0}>Informações Auxiliares</Radio>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </Col>

            <Col 
              xs={24} sm={24} md={24} lg={4} xl={4}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
              <Button
                onClick={this.onSearchRootNodes}
                type="primary"
                icon={<SearchOutlined />}
                loading={this.state.searching}
              >
                Pesquisar
              </Button>
            </Col>
          </Row>
        </StyledCard>
      </div>
    );
  };

  renderTreeContainer = () => {
    let defaultCheckedKeys = this.state.itensSelecionados.map(elem => {
      return elem.nroINC + "-" + elem.codTipoNormativo + "-" + elem.item;
    });

    return (
      <div>
        <StyledCard style={{ marginBottom: 5, minHeight: 580, maxHeight: 580 }}>
          <Row>
            <Col span={24}>
              {this.state.treeData.length > 0 && (
                <Divider style={{ margin: 0 }}>
                  <h4>
                    {this.state.tituloINC} - 
                    <Button 
                      type="link" 
                      target="_blank" 
                      style={{ textAlign: 'left', paddingLeft: 5}}
                      href={`https://intranet1.bb.com.br/inc/conteudoAssunto.ctr?comando=visualizarConteudo&codigoAssunto=${this.state.nroINC}&versaoAssunto=${this.state.versaoAssunto}&idiomaAssunto=POR`}
                    >
                      Acessar INC
                    </Button>
                  </h4>
                </Divider>
              )}

              {this.state.treeData.length > 0 && (
                <Row>
                  <Col span={12}>
                    <h3 style={{ textDecoration: "underline" }}>
                      {`${NomesSecoes[this.state.lastTipoNorm]} - Seções`}
                    </h3>
                  </Col>
                  <Col span={12}>
                    <div
                      style={{
                        width: "100%",
                        textAlign: "right",
                        paddingRight: 15,
                        fontSize: "14px"
                      }}
                    >
                      <strong>Versão: {this.state.versaoTipNorm}</strong>
                    </div>
                  </Col>
                </Row>
              )}

              {this.state.treeData.length === 0 && (
                <div style={{ width: "100%", fontSize: "13px" }}>
                  Nenhuma seção a exibir.
                </div>
              )}

              <div
                style={{ minHeight: 463, maxHeight: 463, overflowY: "auto" }}
              >
                <Tree
                  loadData={this.onSearchNodes}
                  defaultCheckedKeys={defaultCheckedKeys}
                  defaultExpandedKeys={defaultCheckedKeys}
                  showLine
                  checkable
                  checkStrictly
                  multiple
                  key={this.state.treeKey}
                  selectable={false}
                  onCheck={this.onCheckItem}
                >
                  {this.renderTreeNodes(this.state.treeData)}
                </Tree>
              </div>
            </Col>
          </Row>
        </StyledCard>
      </div>
    );
  };

  onCheckItem = (checkedKeys, e) => {
    let { dataRef, eventKey } = e.node.props;

    if (e.checked) {
      //incluindo um novo item selecionado
      let newItem = {
        id: dataRef.CD_NVL_PRGF_CTU,
        key: eventKey,
        nroINC: dataRef.CD_ASNT,
        titulo: dataRef.TX_TIT_ASNT,
        codTipoNormativo: dataRef.CD_TIP_CTU_ASNT,
        tipoNormativo: dataRef.TX_TIP_CTU_ASNT,
        versao: dataRef.NR_VRS_CTU_ASNT,
        item: dataRef.CD_NVL_PRGF_CTU,
        textoItem: dataRef.TX_PRGF_CTU
      };

      this.setState(
        { itensSelecionados: [...this.state.itensSelecionados, newItem] },
        () => {
          this.props.onUpdateParent(this.state.itensSelecionados);
          message.success("Item selecionado com sucesso.");
        }
      );
    } else {
      //removendo um item selecionado
      let novaLista = this.state.itensSelecionados.filter(
        elem => elem.key !== eventKey
      );
      this.setState({ itensSelecionados: [...novaLista] }, () => {
        this.props.onUpdateParent(this.state.itensSelecionados);
        message.success("Item removido da seleção com sucesso.");
      });
    }
  };

  onRemoverItem = key => {
    let novaLista = this.state.itensSelecionados.filter(
      elem => elem.key !== key
    );

    let extraProps = {}
    let currentKey = this.state.nroINC + '-' + this.state.tipoNorm; 

    if (String(key).includes(currentKey)) {
      //so muda a key caso o usuario ainda esteja na mesma arvore
      //evita redesenhar a arvore caso o usuario tenha pesquisado outra
      //instrucao ou outro tipo de normativo.
      extraProps = { treeKey: uuid() }
    }

    this.setState({ itensSelecionados: [...novaLista], ...extraProps }, () => {
      this.props.onUpdateParent(this.state.itensSelecionados);
      message.success("Item removido da seleção com sucesso.");
    });
  };

  onAddSugestao = ({nroINC, titulo, codTipoNormativo, tipoNormativo, versao, item, textoItem}) => {
    let found = false;

    for (let reg of this.state.itensSelecionados) {
      if (reg.nroINC === nroINC && reg.codTipoNormativo === codTipoNormativo && reg.item === item) {
        found = true;
        break;
      }
    }

    if (found) {
      message.warn("Este item já encontra-se na lista dos selecionados!")
      return;
    }

    let key = nroINC + "-" + codTipoNormativo + "-" + item;
    let newItem = {
      id: item,
      key,
      nroINC,
      titulo,
      codTipoNormativo,
      tipoNormativo,
      versao,
      item,
      textoItem
    };

    this.setState(
      { itensSelecionados: [...this.state.itensSelecionados, newItem] },
      () => {
        this.props.onUpdateParent(this.state.itensSelecionados);
        message.success("Item selecionado com sucesso.");
      }
    );
  }

  render() {
    return (
      <Tabs type="card">
        <TabPane key="1" tab="Pesquisar Instrução">
          {this.renderPesquisarInstrucao()}
          {this.state.searching && (
            <StyledCard
              style={{ marginBottom: 5, minHeight: 580, maxHeight: 580 }}
            >
              <PageLoading style={{ position: "absolute" }} />
            </StyledCard>
          )}

          {!this.state.searching && this.renderTreeContainer()}
        </TabPane>
        <TabPane
          key="2"
          tab={`Itens Selecionados (${this.state.itensSelecionados.length})`}
        >
          {this.renderItensSelecionados()}
        </TabPane>
        <TabPane key="3" tab={<span>Sugestões <Tag color="gold">Novo</Tag></span>}>
          {this.renderListaSugestoes()}
        </TabPane>
      </Tabs>
    );
  }
}

export default connect(null, {
  fetchINCNodes
})(InsNormativaForm);
