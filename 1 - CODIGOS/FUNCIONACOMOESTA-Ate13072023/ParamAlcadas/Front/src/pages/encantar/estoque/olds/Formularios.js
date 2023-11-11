import React, { Component } from 'react';
import { 
  Row, 
  Col, 
  Button, 
  Avatar, 
  Input,
  InputNumber,
  Modal
} from 'antd';

import Img from 'components/cropper/TratarImagem';

const { TextArea } = Input;

class Formularios extends Component {
  state={
    showModalCropper: false,
  }
  render() {
    return (
      <>
        {(this.props.acao === 'novo') && 
          <Row style={{ flexFlow: 'row nowrap', paddingTop: 15 }}>
            <Col flex='0 1 20%' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              { this.props.croppedImage !== null &&
                <Avatar shape="square" size={200} src={this.props.croppedImage}/>
              }
              <Button style={{ marginTop: 10 }} onClick={() => {this.setState({showModalCropper: true})}}>
                Escolher Imagem
              </Button>
            </Col>
            <Col style={{ paddingInline: 15 }}>
              <Row style={{ flexFlow: 'row' }}>
                <Col span={5}>
                  Título
                </Col>
                <Col>
                  <Input 
                    value={this.props.novoTitulo}
                    onChange={(e) => (this.props.setNovoTitulo(e.target.value))}
                  />
                </Col>
              </Row>
              <Row style={{ flexFlow: 'row', marginTop: 8 }}>
                <Col span={5}>
                  Descrição
                </Col>
                <Col>
                  <Input 
                    value={this.props.novaDescricao}
                    onChange={(e) => {this.props.setNovaDescricao(e.target.value)}}
                  />
                </Col>
              </Row>
              <Row style={{ flexFlow: 'row', marginTop: 8 }}>
                <Col span={5}>
                  Quantidade
                </Col>
                <Col>
                  <InputNumber
                    min={1}
                    type='number'
                    value={this.props.novaQtde}
                    onChange={(valor) => {
                      this.props.setNovaQtde('incluir', valor)
                    }}
                  />
                </Col>
              </Row>
              <Modal
                bodyStyle={{ padding: 0 }}
                title="Incluir Imagem do Brinde"
                visible={this.state.showModalCropper}
                onCancel={() => {this.setState({showModalCropper: false})}}
                width={800}
                
                footer={[
                  <Button key="back" danger onClick={() => {this.setState({showModalCropper: false})}}>
                    Fechar
                  </Button>
                ]}
              >
                <Img
                  aspect= {1}
                  cropWidth= {600}
                  cropHeight= {600}
                  onCrop={this.props.getCroppedImage}
                />
              </Modal>
            </Col>
          </Row>
        }
      {(this.props.acao === 'excluir' || this.props.acao === 'incluir') &&
        <>
          <Row style={{ flexFlow: 'row' }}>
            <Col span={7}>
              Título
            </Col>
            <Col>
              <Input 
                value={this.props.titulo}
                disabled
                />
            </Col>
          </Row>
          <Row style={{ flexFlow: 'row', marginTop: 8 }}>
            <Col span={7}>
              Descrição
            </Col>
            <Col>
              <Input 
                value={this.props.descricao}
                disabled
                />
            </Col>
          </Row>
          <Row style={{ flexFlow: 'row', marginTop: 8 }}>
            {this.props.acao === 'excluir' ?
            <>
              <Col span={7}>
                Quantidade atual
              </Col>
              <Col>
                <InputNumber
                  value={this.props.quantidade}
                  disabled
                />
              </Col>      
            </>
              :
            <>
              <Col span={7}>
                Quantidade
              </Col>
              <Col>
                <InputNumber
                  min={1}
                  type='number'
                  value={this.props.novaQtde}
                  onChange={(valor) => {
                    this.props.setNovaQtde('incluir', valor)
                  }}
                />
              </Col>      
            </>
            }
            </Row>
          {this.props.acao === 'excluir' &&
            <>
            <Row style={{ flexFlow: 'row', marginTop: 8 }}>
              <Col span={7}>
                Quantidade a excluir
              </Col>
              <Col>
                <InputNumber
                  min={1}
                  max={this.props.quantidade}
                  type='number'
                  value={this.props.qtdeExcluir}
                  onChange={(valor) => {
                    this.props.setNovaQtde('excluir', null, valor, this.props.quantidade)
                  }}
                />
              </Col>      
            </Row>
            <Row style={{ flexFlow: 'row', marginTop: 8 }}>
              <Col span={7}>
                Saldo
              </Col>
              <Col>
                <InputNumber
                  value={this.props.novaQtde}
                  disabled
                  />
              </Col>      
            </Row>
            </>
          }
          <Row style={{ flexFlow: 'row', marginTop: 8 }}>
            <Col span={7}>
              Justificativa
            </Col>
            <Col>
              <TextArea
                value={this.props.justificativa}
                onChange={(e) => (this.props.setJustificativa(e.target.value))}
              />
            </Col>
          </Row>
        </>
      }
      </>
    )
  }
}

export default Formularios;