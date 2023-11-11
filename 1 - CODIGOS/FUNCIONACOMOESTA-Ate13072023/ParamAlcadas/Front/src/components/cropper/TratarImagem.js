import React, { Component } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Row, Col, Typography, Modal, Button, Upload, Avatar } from 'antd';
import { 
  UploadOutlined, 
  ArrowUpOutlined, 
  ArrowDownOutlined,  
  ArrowLeftOutlined, 
  ArrowRightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons';

const { Title } = Typography;
const src = ''; // a imagem inicial

class TratarImagem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      src,
      cropResult: null,
      visible: false
    };
    this.cropImage = this.cropImage.bind(this);
    this.addFile = this.addFile.bind(this);
  }

  /**
   * transforma o arquivo para ser tratado pelo crop
   */
  addFile = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      this.setState({ src: reader.result });
    };
    reader.readAsDataURL(file);
  };

  /**
   * intermediário entre o upload do antd e o arquivo
   */
  onChange = {
    beforeUpload: this.addFile,
    fileList: src,
  };

  cropImage() {
    if (typeof this.cropper.getCroppedCanvas() === 'undefined') {
      return;
    }

    if (this.props.onCrop) {
      this.props.onCrop(this.cropper.getCroppedCanvas({fillColor:'#fff'}).toDataURL(this.props.imageType, this.props.quality))
      this.setState({ visible: true })
    }
  }

  render() {
    return (
        <Row style={{ flexFlow: 'row nowrap' }}>
          <Col flex='0 1 60%' style={{ padding: 8, flexDirection: 'column', maxWidth: '60%' }}>
            <Row type='flex' style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Title level={3}>Imagem Original</Title>
              <Upload {...this.onChange}>
                <Button>
                  <UploadOutlined /> Incluir Imagem
                </Button>
              </Upload>
              <Col flex='1 2 100%' style={{ margin: 8, textAlign: 'center' }}>
                <Cropper
                  viewMode={0} // impede a area do cropper para fora da imagem
                  dragMode='move' // impede o redimensionamento da area do cropper
                  cropBoxResizable={false} // impede o redimensionamento do cropper
                  responsive={true}
                  style={{ maxHeight: 600, maxWidth: 600 }} // tamanho do box do cropper
                  aspectRatio={this.props.aspect} // o formato da area do cropper (16/9, 4/3, etc) 1 é quadrado
                  minWidth={600} // a altura mínima da área da imagem
                  minHeight={600} // a largura máxima da área da imagem
                  minCropBoxWidth={this.props.cropWidth} // o altura do box do cropper
                  minCropBoxHeight={this.props.cropHeight} // o largura do box do cropper
                  preview=".img-preview" // a classe usada para a preview
                  guides={false} // não exibe as linhas guias na imagem
                  src={this.state.src} // o caminho da imagem
                  ref={cropper => { this.cropper = cropper; }}
                />
                <div>
                  <Button onClick={()=>{this.cropper.move(0, -2)}} type="primary" shape="circle" icon={<ArrowUpOutlined />} />
                  <Button onClick={()=>{this.cropper.move(0, 2)}} type="primary" shape="circle" icon={<ArrowDownOutlined />} />
                  <Button onClick={()=>{this.cropper.move(-2, 0)}} type="primary" shape="circle" icon={<ArrowLeftOutlined />} />
                  <Button onClick={()=>{this.cropper.move(2, 0)}} type="primary" shape="circle" icon={<ArrowRightOutlined />} />
                  <Button onClick={()=>{this.cropper.zoom(0.1)}} type="primary" shape="circle" icon={<ZoomInOutlined />} />
                  <Button onClick={()=>{this.cropper.zoom(-0.1)}} type="primary" shape="circle" icon={<ZoomOutOutlined />} />
                </div>
              </Col>
            </Row>
          </Col>
          <Col flex='0 1 40%' style={{ padding: 8, flexDirection: 'column', maxWidth: '40%' }}>
            <Row type='flex' style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Title level={3}>Imagem Ajustada</Title>
              <Button type="primary" onClick={this.cropImage}>
                Cortar Imagem
              </Button>
              <Col flex='1 1 100%' style={{ marginTop: 8}}>
                <Row justify='center' style={{  }} align='center'>
                  <Avatar shape="square" size={300} className="img-preview"/>
                </Row>
              </Col>
            </Row>
          </Col>
          <Modal
            title="Imagem Salva"
            visible={this.state.visible && this.props.showAlerts}
            size="sm"
            footer={[
              <Button key="back" danger onClick={ () => { this.setState({ visible: false }); }}>
                Fechar
              </Button>
            ]}
          >
            <p>A imagem foi ajustada.</p>
          </Modal>
       </Row>
    );
  }
}

TratarImagem.defaultProps = {
  aspect: 16/9, // o formato do cropper, ex. pode ser 16 / 9 ou 4 / 3 ou 1
  cropWidth: 800, // a largura do box do cropper
  cropHeight: 600, // a altura do box do cropper
  imageType: 'image/jpeg',
  quality: 0.95,
  showAlerts: true
}

export default TratarImagem;