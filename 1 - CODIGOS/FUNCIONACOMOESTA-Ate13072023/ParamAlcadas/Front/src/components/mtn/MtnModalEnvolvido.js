import React, { Component } from "react";
import {
  Button,
  Modal,
  Spin,
  Form,
  Col,
  Row,
  List,
  Avatar,
  message,
} from "antd";
import MaskedInput from "react-text-mask";
import { DefaultGutter } from "utils/Commons";
import { PlusOutlined } from "@ant-design/icons";
import { LoadingOutlined, DeleteOutlined } from "@ant-design/icons";
import { getProfileURL } from "utils/Commons";
import { fetchFunci } from "services/ducks/Arh.ducks";
import { connect } from "react-redux";
import styled from "styled-components";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const DadosFunci = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70%;
`;

const initialState = {
  loading: false,
  listaFuncionarios: [],
  matriculaIncluindo: "",
};

class MtnModalEnvolvido extends Component {
  state = {
    ...initialState,
  };

  onRemoveFunci = (matricula) => {
    const newLista = this.state.listaFuncionarios.filter(
      (funci) => funci.matricula !== matricula
    );
    if (newLista.length === this.state.listaFuncionarios) {
      message.error("Funcionário não encontrado");
      return;
    }
    this.setState({ listaFuncionarios: newLista });
  };

  onAddFunci = () => {
    if (
      this.state.matriculaIncluindo === "" ||
      this.state.matriculaIncluindo.length !== 8 ||
      this.state.matriculaIncluindo.search("_") >= 0
    ) {
      message.error("Matrícula com formato inválido");
      this.setState({ matriculaIncluindo: "" });
      return;
    }

    if (
      this.props.matriculasEnvolvidos.includes(this.state.matriculaIncluindo)
    ) {
      message.error("Funcionário já é envolvido nesta ocorrência");
      this.setState({ matriculaIncluindo: "" });
      return;
    }

    const index = this.state.listaFuncionarios.findIndex(
      (funci) => funci.matricula === this.state.matriculaIncluindo
    );

    if (index >= 0) {
      message.error("Funcionário já incluído");
      this.setState({ matriculaIncluindo: "" });
      return;
    }

    this.setState({ loading: true }, () => {
      this.props
        .fetchFunci(this.state.matriculaIncluindo)
        .then((dadosFunci) => {
          this.setState({
            loading: false,
            listaFuncionarios: [...this.state.listaFuncionarios, dadosFunci],
            matriculaIncluindo: "",
          });
        })
        .catch((error) => {
          this.setState({ loading: false });
          message.error("Funcionário não encontrado");
        });
    });
  };

  incluirEnvolvidos = () => {
    this.setState({ loading: true }, () => {
      this.props
        .handleOk(this.state.listaFuncionarios, this.props.idMtn)
        .then(() => {
          this.setState({ ...initialState }, () => {
            this.props.refreshEnvolvidos();
          });
        })
        .catch((errorList) => {
          for (let error of errorList) {
            message.error(error);
          }
          this.setState({ loading: false });
        });
    });
  };

  render() {
    return (
      <Modal
        title={"Incluir envolvido"}
        visible={this.props.visibleModal}
        footer={[
          <Button loading={this.state.loading} key="cancel" type="danger" onClick={this.props.handleCancel}>
            Cancelar
          </Button>,
          <Button loading={this.state.loading} key="submit" type="primary" onClick={this.incluirEnvolvidos}>
            Salvar
          </Button>,
        ]}
        onOk={this.props.handleOk}
        onCancel={this.props.handleCancel}
      >
        <Spin spinning={this.state.loading} indicator={antIcon}>
          <Row gutter={DefaultGutter}>
            <Col span={24}>
              <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 14 }}
                layout="horizontal"
                size={"middle"}
              >
                <Row gutter={DefaultGutter}>
                  <Col span={8}>
                    <MaskedInput
                      className="ant-input"
                      value={this.state.matriculaIncluindo}
                      mask={["F", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                      placeholder="F0000000"
                      onChange={(event) =>
                        this.setState({
                          matriculaIncluindo: event.target.value,
                        })
                      }
                    />
                  </Col>
                  <Col span={1}>
                    <Button
                      onClick={() => {
                        this.onAddFunci();
                      }}
                      type="primary"
                      shape="circle"
                      icon={<PlusOutlined />}
                    ></Button>
                  </Col>
                </Row>
              </Form>
            </Col>
            <Col span={24}>
              <List
                bordered={true}
                size="small"
                itemLayout="horizontal"
                dataSource={this.state.listaFuncionarios}
                style={{ marginTop: 15 }}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <DeleteOutlined
                        onClick={() => this.onRemoveFunci(item.matricula)}
                        style={{ color: "red" }}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={getProfileURL(item.matricula)} />}
                      title={
                        <DadosFunci style={{ width: "100%" }}>
                          <a
                            href={
                              "https://humanograma.intranet.bb.com.br/" +
                              item.matricula
                            }
                          >
                            {item.nome}
                          </a>{" "}
                        </DadosFunci>
                      }
                    />
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </Spin>
      </Modal>
    );
  }
}
export default connect(null, { fetchFunci })(MtnModalEnvolvido);
