import { PlusOutlined } from '@ant-design/icons';
import { Upload, Modal } from 'antd';
import React, {Component} from 'react';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class UploadImages extends React.Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: []  
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };


  handleUpload = (file) => {
    return true;
  }

  handleChange = ({ fileList }) => this.setState({ fileList }, () => this.props.updateListaImagens(this.state.fileList));

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
          action={this.handleUpload}
          beforeUpload={() => false}
          listType="picture-card"
          fileList={this.props.listaImagens}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 30 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default UploadImages;