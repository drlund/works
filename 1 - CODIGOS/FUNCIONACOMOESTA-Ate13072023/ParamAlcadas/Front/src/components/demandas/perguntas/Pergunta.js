import React from 'react';
import PropTypes from 'prop-types';
import "@/App.css";
import { CheckOutlined, CopyOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import {
  Form,
  Row,
  Col,
  Select,
  Divider,
  Button,
  Switch,
  Tooltip,
  Popconfirm,
  Dropdown,
  Menu,
  message,
} from 'antd';
import { DefaultGutter, isOptionValidateType } from 'utils/Commons';
import AlertList from 'components/alertlist/AlertList';
import RichEditor from 'components/richeditor/RichEditor';
import styled from 'styled-components';
import _ from 'lodash';
import TipoResposta, { renderOptionsList } from './tipos-resposta/TipoResposta';

const PerguntaContainer = styled.div`
  border: 1px solid #e8e8e8;
  background-color: #fff;
  padding: 15px;
  border-radius: 2px;
  box-shadow: 0px 5px 5px 0px rgba(0,0,0,.16),0px 10px 20px -10px rgba(0,0,0,.12);
  margin: 10px;
  margin-bottom: 20px;
  margin-top: 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top-width: 0;
`;

const Contador = styled.div`
  background-color: #467193;
  background-color: ${props => props.hasErrors && "#F42937"}  
  line-height: 28px;
  height: 36px;
  border-radius: 50%;
  width: 36px;
  text-align: center;
  color: #fff;
  font-size: 18px;
  border: 3px solid #799ebb;
  border-color: ${props => props.hasErrors && "#E8C5CB"}
`;

const InlineEditorContainer = styled.div`
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  -webkit-transition: all 0.3s;
  transition: all 0.3s;
  padding-left: 10px;
  padding-right: 10px;
  line-height: 1.9rem;

  &:hover {
    border-color: #40a9ff;
    border-right-width: 1px !important;
  }
`;


const errorsListChanged = (newList, actualList) => {
  if ((newList.length !== actualList.length) || 
      !_.isEqual(newList, actualList)) {
    return true;
  }

  return false;
}

class Pergunta extends React.Component {

  state = { ...this.props.initialState};

  constructor(props) {
    super(props);
    this.titleRef = null;
  }

  //lifecycle metodo para decidir se o componente deve ou nao ser atualizado
  shouldComponentUpdate(nextProps, nextState) {

    //executa algumas verificacoes para certificar a real necessidade de renderizar novamente a pergunta
    switch (nextProps.lastEvent) {
      case 'questionUpdate':
        //verifica se a lista de erros de validacao mudou
        if (errorsListChanged(nextProps.errorsList, this.props.errorsList)) {
          return true;
        }
   
        if (nextProps.lastUpdatedQuestionId === this.props.idPergunta) {
          if (nextProps.initialState.dadosResposta.noUpdate && !this.state.showValidacao) {
            //flag indicativo para nao atualizar. 
            //especifico dos componentes que possuem opcoes com drag and drop e nao estao com
            //a opcao de validacao habilitada.
            return false;
          }

          //self update
          return true;
        }

        //questionUpdate com id diferente do atual, nao atualiza.
        return false;

      case 'addQuestion': 
      case 'removeQuestion':
      case 'duplicateQuestion':
      case 'reorderQuestions':
        if ( isOptionValidateType(this.state.tipoResposta) && this.state.showValidacao) {
              //tipo de resposta de validacao dinamica, deve renderizar.
              return true;
            }
        
        if ( !isOptionValidateType(this.state.tipoResposta) && this.state.showFluxoValidacao) {
          //outro tipo de resposta de validacao dinamica, deve renderizar.
          return true;
        }

        if (nextProps.number !== this.props.number) {
          //numero da pergunta diferente do numero da atual.
          return true;
        }

        //verifica se a lista de erros de validacao mudou
        if (errorsListChanged(nextProps.errorsList, this.props.errorsList)) {
          return true;
        }

        //nao precisa renderizar nos demais casos.
        return false;

      case 'childrenDrop':
        //reordenamento de lista interna da pergunta, nao precisa atualizar.
        return false;

      default:
        //nao atendendeu a nenhuma regra anterior. atualiza.
        return true;
    }

  }

  /**
   * Wrapper do metodo setState para alteracoes dos dados essenciais da pergunta.
   */
  onSetState = (newState) => {
    this.setState({...newState}, () => this.props.onUpdateStateToParent({...this.state}));
  }

  onTipoRespostaChange = (value) => {
    this.onSetState({ 
      tipoResposta: value, 
      dadosResposta : [], 
      showValidacao: false,
      showFluxoValidacao: false,
      ordenarAleatoriamente: false 
    });
  }

  onChangeTitle = (value) => {
    this.onSetState({texto: value});
  }

  onChangeDescription = (value) => {
    this.onSetState({descricao: value});
  }

  onObrigatoriaChange = (checked) => {
    if (checked === false) {
      if (this.state.showValidacao || this.state.showFluxoValidacao) {
        message.warning("Se houver fluxo de decisão, a resposta deve ser obrigatória!");
        return;
      }
    }

    this.onSetState({ obrigatoria: checked });
  }

  /**
   * Substitui toda a lista de opcoes. Utilizada apos uma chamada ao metodo setState do
   * componente de tipo de resposta selecionado.
   */
  onTipoRespostaUpdate = (newStateData) => {
    this.onSetState({ dadosResposta: { ...this.state.dadosResposta, ...newStateData} });
  }

  handleMenuClick = (e) => {
    switch (e.key) {
      case '1':
        this.onSetState({ showDescricao: !this.state.showDescricao });
        return;

      case '2': {
        let obrigatoria = this.state.obrigatoria;

        if (this.state.showValidacao === false) {
          //vai trocar para true, entao verifica a obrigatoriedade para sempre se true
          if (obrigatoria === false) {
            message.warning("Se houver fluxo de decisão, a resposta deve ser obrigatória!");
            obrigatoria = true;
          }
        }

        this.onSetState({ showValidacao: !this.state.showValidacao, obrigatoria});

        return;
      }

      case '3': {
        let obrigatoria = this.state.obrigatoria;

        if (this.state.showFluxoValidacao === false) {
          //vai trocar para true, entao verifica a obrigatoriedade para sempre se true
          if (obrigatoria === false) {
            message.warning("Se houver fluxo de decisão, a resposta deve ser obrigatória!");
            obrigatoria = true;
          }
        }

        this.onSetState({ showFluxoValidacao: !this.state.showFluxoValidacao, obrigatoria});
        return;
      }

      case '4':
        this.onSetState({ ordenarAleatoriamente: !this.state.ordenarAleatoriamente});
        return;
      default:
        return null;
    }    
  }

  /**
   * Metodo que retorna o submenu de acordo com o tipo de
   * resposta selecionado.
   */
  getValidationSubMenu = () => {
    switch (this.state.tipoResposta) {
      case 'respostaCurta':
      case 'paragrafo':
          return (
            <Menu.Item key="2">
              { this.state.showValidacao && <CheckOutlined />}
              Validação da resposta
            </Menu.Item>
          );
      case 'multiplaEscolha':
      case 'listaSuspensa':
        return (
          <Menu.Item key="2">
            { this.state.showValidacao && <CheckOutlined />}
            Ir para pergunta a partir da resposta
          </Menu.Item>
        );
      default:
        return null;      
    }
  }

  getValidationFluxoSubMenu = () => {
    switch (this.state.tipoResposta) {
      case 'respostaCurta':
      case 'paragrafo':
        return (
          <Menu.Item key="3">
            { this.state.showFluxoValidacao && <CheckOutlined />}
            Ir para pergunta a partir da resposta
          </Menu.Item>
        );
      default:
        return null;
    }
  }

  getOrdenarSubMenu = () => {
    switch (this.state.tipoResposta) {      
      case 'multiplaEscolha':
      case 'caixasSelecao':
        return (
          <Menu.Item key="4">
            { this.state.ordenarAleatoriamente && <CheckOutlined />}
            Ordenar Aleatóriamente
          </Menu.Item>
        );

      default:
        return null;
    }
  }

  getMenuItems = () => { 
    return (
      <Menu onClick={this.handleMenuClick}>
        <Menu.Item key="1">
          { this.state.showDescricao && <CheckOutlined />}
          Descrição
        </Menu.Item>

        {this.getValidationSubMenu()}
        {this.getValidationFluxoSubMenu()}
        {this.getOrdenarSubMenu()}
      </Menu>
    );
  }

  setTitleRef = (node) => {
    this.titleRef = node;
  }

  renderDescription = () => {
    if (this.state.showDescricao) {
      return (
        <Row>
          <Col span={24}>
            <Form.Item label="Descrição">
              <InlineEditorContainer>
                <RichEditor
                  inline={true}
                  onBlur={(e) => this.onChangeDescription(e.target.getContent())}
                  initialValue={this.state.descricao}
                />
              </InlineEditorContainer>
            </Form.Item>
          </Col>
        </Row>
      )
    }
  }

  render() {
    return (
      <PerguntaContainer>
        <Form layout="vertical">
            <Row gutter={DefaultGutter}>
              <Col xs={24} sm={24} md={24} lg={16} xl={16}>
                <Row type="flex" justify="space-around" align="middle">
                  <Col span={2} style={{paddingTop: '5px'}}>
                    <Contador title={`Pergunta ${this.props.number}`} hasErrors={this.props.errorsList.length}>
                      {this.props.number} 
                    </Contador> 
                  </Col>
                  <Col span={22}>
                    <Form.Item label="Texto da Pergunta">
                      <InlineEditorContainer>
                        <RichEditor
                          inline={true}
                          menubar={false}
                          onBlur={(e) => this.onChangeTitle(e.target.getContent())}
                          toolbar="emoticons | bold italic underline strikethrough | alignleft aligncenter alignright | forecolor backcolor"
                          initialValue={this.state.texto}
                          dontWrapContent
                        />
                      </InlineEditorContainer>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                <Form.Item label="Tipo da Resposta">
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Selecione um tipo"
                    onChange={this.onTipoRespostaChange}
                    value={this.state.tipoResposta}
                  >
                  {renderOptionsList()}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            { this.renderDescription()}

            <Row>
              <Col span={24}>
                <TipoResposta 
                  tipo={this.state.tipoResposta} 
                  initialState={this.state.dadosResposta} 
                  idPergunta={this.props.idPergunta}
                  idsList={this.props.idsList}
                  showValidacao={this.state.showValidacao}
                  showFluxoValidacao={this.state.showFluxoValidacao}
                  onUpdateStateToParent={this.onTipoRespostaUpdate}
                />
              </Col>
            </Row>

            <Row>
              <Col span={24} style={{paddingTop: '20px'}}>
                <AlertList title="Erros Encontrados" messagesList={this.props.errorsList}  />
              </Col>
            </Row>

            <Divider />

            <Row style={{paddingRight: '25px'}}>
              <Col span={13} type="flex" align="right" style={{paddingRight: '22px'}}>
                <Tooltip title="Nova Pergunta">
                  <Button 
                    icon={<PlusOutlined />} 
                    type="primary" 
                    shape="circle" 
                    style={{fontSize: '18px'}}
                    onClick={() => this.props.onAddClick(this.state.id)}
                  />
                </Tooltip>
              </Col>
              <Col span={11} type="flex" align="right">
                <Tooltip title="Duplicar Pergunta">
                  <Button 
                    icon={<CopyOutlined />} 
                    style={{fontSize: '18px', marginRight: '10px'}}
                    onClick={() => this.props.onDuplicateClick(this.state.id)}
                  />
                </Tooltip>

                <Tooltip placement="bottom" title="Excluir Pergunta">
                  <Popconfirm 
                    title="Confirma a exclusão desta pergunta?" 
                    onConfirm={() => this.props.onRemoveClick(this.state.id)}
                  >
                    <Button icon={<DeleteOutlined />} type="danger" style={{fontSize: '18px', marginRight: '10px'}} />
                  </Popconfirm>
                </Tooltip>

                <Divider type="vertical"/>

                <label style={{marginRight: '10px'}}>Obrigatória</label>
                <Switch 
                  style={{marginRight: '10px'}}
                  checkedChildren={<CheckOutlined />} 
                  defaultChecked={this.state.obrigatoria}
                  checked={this.state.obrigatoria}
                  onChange={this.onObrigatoriaChange}
                />

                <Dropdown.Button overlay={this.getMenuItems()} >
                  Exibir
                </Dropdown.Button>
              </Col>
            </Row>
        </Form>
      </PerguntaContainer>
    );
  }
}

Pergunta.propTypes = {
  initialState: PropTypes.object.isRequired
}

export default Pergunta;