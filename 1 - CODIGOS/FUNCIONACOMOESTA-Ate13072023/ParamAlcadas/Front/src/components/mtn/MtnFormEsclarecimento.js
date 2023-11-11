import React, { Component } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Button, Upload, Input, Spin, message, Popconfirm } from "antd";
import { connect } from "react-redux";
import { salvarEsclarecimento } from "services/ducks/Mtn.ducks";
const { TextArea } = Input;

class MtnFormEsclarecimento extends Component {
  state = {
    loading: false,
    fileList: [],
    uploading: false,
    txtEsclarecimento: "",
  };

  salvarEsclarecimento = () => {
    this.setState({ loading: true }, () => {
      if (this.state.txtEsclarecimento === "") {
        message.error("Preencha o campo de esclarecimento.");
        return;
      }
      this.props.salvarEsclarecimento({
        idEsclarecimento: this.props.idEsclarecimento,
        txtEsclarecimento: this.state.txtEsclarecimento,
        arquivos: this.state.fileList,
        responseHandler: {
          successCallback: () =>
            this.setState(
              { loading: false, txtEsclarecimento: "", fileList: [] },
              () => message.success("Esclarecimento respondido com sucesso")
            ),
          errorCallback: () =>
            this.setState({ loading: false }, () =>
              message.error("Erro ao salvar o parecer. Favor tentar novamente")
            ),
        },
      });
    });
  };

  /** FILE HANDLERS **/

  removeFile = (file) => {
    this.setState((state) => {
      const index = state.fileList.indexOf(file);
      const newFileList = state.fileList.slice();
      newFileList.splice(index, 1);
      return {
        fileList: newFileList,
      };
    });
  };

  addFile = (file) => {
    if (file.size / 1000000 > 3) {
      message.error("O tamanho máximo são 3mb.");
      return;
    }
    this.setState((state) => ({
      fileList: [...state.fileList, file],
    }));
    return false;
  };

  /** RENDER METHODS */

  render() {
    const { fileList } = this.state;

    const uploadProps = {
      onRemove: this.removeFile,
      beforeUpload: this.addFile,
      fileList,
    };

    return (
      <Spin spinning={this.state.loading}>
        <Form>
          <Form.Item label="Esclarecimento dado pelo funcionário">
            <TextArea
              disabled={this.state.loading || this.props.loadingEsclarecimento}
              onChange={(evt) =>
                this.setState({ txtEsclarecimento: evt.target.value })
              }
              value={this.state.txtEsclarecimento}
              rows={8}
            />
          </Form.Item>

          <Popconfirm
            title="Deseja responder o esclarecimento? Esta operação é irreversível!"
            onConfirm={this.salvarEsclarecimento}
            okText="Confirmar"
            cancelText="Não"
          >
            <Button
              type="primary"
              loading={this.state.loading || this.props.loadingEsclarecimento}
              style={{ marginBottom: "15px", marginRight: "10px" }}
            >
              Responder Esclarecimento
            </Button>
          </Popconfirm>
          <Upload {...uploadProps}>
            <Button
              loading={this.state.loading || this.props.loadingEsclarecimento}
            >
              <UploadOutlined /> Incluir Arquivo
            </Button>
          </Upload>
        </Form>
      </Spin>
    );
  }
}

export default connect(null, { salvarEsclarecimento })(MtnFormEsclarecimento);
