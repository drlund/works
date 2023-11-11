import React from 'react';
import { connect } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Upload, Button, Modal } from 'antd';
import { fillUploadedFile } from 'services/ducks/CtrlDisciplinar/Gedip.ducks';
const {confirm} = Modal;


class UploadFile extends React.Component {

  state = {
    uploading: false,
    selectedFile: null
  }

  handleSubmit = () => {
    console.log('handling submit: ', );

    this.setState({
      uploading: true,
    }, () => {
      let dados = {
        id_gedip: this.props.id_gedip,
        file: this.state.selectedFile
      }

      this.submitUpload(dados);
    });
  }

  submitUpload = (dados) => {
    const funct = this.props.onConfirmModalOK;
    const functCancel = this.onCancelConfirm;

    confirm({
      title: 'Confirma o envio do Documento?',
      content: '',
      confirmLoading: true,
      onOk() {
        funct(dados)
        functCancel()
      },
      onCancel() {
        functCancel()
      },
    });
  }

  onCancelConfirm = () => {
    this.setState({
      uploading: false
    });
  }

  beforeUpload = (file) => {
    this.setState({ selectedFile: file});
    return false;
  }

  onRemoveFile = (file) => {
    this.setState({ selectedFile: null, uploading: false});
  }

  render () {
    const { uploading, selectedFile } = this.state;

    return (
      <React.Fragment>
        <Form.Item>
          <Upload
              accept=".pdf"
              style={{width: "100%", textAlign: "center"}}
              beforeUpload={this.beforeUpload}
              onRemove={this.onRemoveFile}
              multiple={false}
          >
            <Button>
              <UploadOutlined /> Selecionar Documento Digitalizado
            </Button>
          </Upload>
        </Form.Item>
        <div style={{textAlign: "right"}}>
          <Button
            type="primary"
            onClick={this.handleSubmit}
            disabled={selectedFile === null}
            loading={uploading}
          >
              {uploading ? 'Enviando...' : 'Enviar Documento'}
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

export default connect(null,
  {
    fillUploadedFile
  }
)(UploadFile);