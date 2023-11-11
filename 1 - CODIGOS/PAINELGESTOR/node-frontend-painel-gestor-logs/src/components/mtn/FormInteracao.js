import React, { Component } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Form } from "@ant-design/compatible";
import "@ant-design/compatible/assets/index.css";
import { Spin, Upload, Input, Button, message,Popconfirm } from "antd";

const { TextArea } = Input;

class FormInteracao extends Component {
  state = {
    loading: false,
    txt: "",
    fileList: [],
  };

  /** FILE HANDLERS **/

  removeFile = (file) => {
    this.setState((state) => {
      const index = this.state.fileList.indexOf(file);
      const newFileList = this.state.fileList.slice();
      newFileList.splice(index, 1);
      this.setState({ fileList: newFileList });
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

  submitForm = () => {
    if (this.state.txt === "") {
      message.error("Favor preencha o campo de texto");
      return;
    }

    this.setState({ loading: true }, () => {
      this.props
        .submitFunc({
          txt: this.state.txt,
          fileList: this.state.fileList,
          identificador: this.props.identificador,
        })
        .then(() => {
          if (this.props.onSucess) {
            this.props.onSucess();
          }
        })
        .catch((error) => {
          if (this.props.onError) {
            this.props.onError();
          }
        })
        .then(() => {
          this.setState({ loading: false });
        });
    });
  };

  render() {
    const uploadProps = {
      onRemove: this.removeFile,
      beforeUpload: this.addFile,
      fileList: this.state.fileList,
    };

    return (
      <Spin spinning={this.state.loading}>
        <Form>
          <Form.Item label={this.props.title}>
            <TextArea
              onChange={(evt) => this.setState({ txt: evt.target.value })}
              value={this.state.txt}
              rows={8}
            />
          </Form.Item>
          <Popconfirm
            title="Deseja salvar a resposta? Esta operação é irreversível!"
            onConfirm={() => this.submitForm()}
            okText="Confirmar"
            cancelText="Não"
          >
            <Button
              type="primary"
              style={{ marginBottom: "15px", marginRight: "10px" }}
            >
              {this.props.saveButtonTxt
                ? this.props.saveButtonTxt
                : "Salvar Parecer"}
            </Button>
          </Popconfirm>
          <Upload {...uploadProps}>
            <Button>
              <UploadOutlined /> Incluir Arquivo
            </Button>
          </Upload>
        </Form>
      </Spin>
    );
  }
}

export default FormInteracao;
