import React,{Component} from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Row, Col, Card } from 'antd';
import StyledCard from 'components/styledcard/StyledCard';
import {DefaultGutter} from 'utils/Commons';
import RichEditor from 'components/richeditor/RichEditor';

class Notificacao extends Component {
  render() {
    return(
      <StyledCard>
        <Row gutter={DefaultGutter}>
          <Col span={18}>
              <Form>
                <Form.Item label="Título do notificação">
                  <Input 
                      name = 'titulo'                        
                      onBlur={(evt) => this.props.onTextChange(evt.target.value, this.props.tipoNotificacao, evt.target.name )}
                      defaultValue={this.props.defaultTitle}
                  />
                </Form.Item>
                <Form.Item label="Conteúdo da notificação">
                  <RichEditor 
                    height={350} 
                    onBlur={(evt) => this.props.onTextChange(evt.target.getContent(), this.props.tipoNotificacao, 'conteudo')}
                    initialValue={this.props.defaultContent}
                    customRootDir="demandas"
                  />
                </Form.Item>
              </Form>
          </Col>

          <Col span={6}>
            <Card title="Descrição">
                {this.props.description()}
            </Card>              
          </Col>
        </Row>
      </StyledCard>
    );
  }
}


export default Notificacao;