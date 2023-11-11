import React from 'react'
import Icon, { CloseOutlined } from '@ant-design/icons';
import { Input, Row, Col, Button } from 'antd';
import { DefaultGutter, ReorderDnD } from 'utils/Commons';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import _ from 'lodash';
import OptionValidate, { getValidQuestions } from '../validacoes/OptionValidate';
import uuid from 'uuid/v4';
import styled from 'styled-components';
import { DragHandleVertical } from 'components/draghandles/DragHandles';
import DragEndContext from 'components/demandas/perguntas/DragEndContext';
import "@/App.css";

const listStyle = {
  display: 'inline-flex',
  height: '30px',
  lineHeight: '30px',
  marginBottom: '10px'
};

/** Componente com a lista de todas options */
const OptionContainer = styled.div`
  background-color: ${props => props.isDraggingOver ? 'lightgray' : '!important'}
`;

/** Componente que encapsula uma option individual  */
const OptionTemplate = styled.div``;

/** Titulo explicativo do componente multipla escolha */
const Title = styled.label`
  color: rgba(0, 0, 0, 0.85);
`;

/** Template da link para Adicionar novas opcoes  */
const AddOptionTemplate = props => {
  return (
    <div {...props}>
      <label style={{marginRight: '10px'}}>{props.id}.</label>
      <Button 
        className="link-button"                    
        onClick={props.onClick}
      >
        Adicionar uma opção
      </Button>
    </div>
  )
}

const HandleContainer = styled.label`
  line-height: 25px;
`;

class InnerList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.inputsRef = {};
  }

  /**
   * Cria um Ref para cada input separadamente pelo ID.
   */
  setRef = (node, id) => {
    this.inputsRef[id] = node;
  }

  render() {
    const { optionsList } = this.props;

    return optionsList.map((option, index) => {
      return (
        <Draggable draggableId={option.id} key={option.id} index={index}>
          { (provided) => (
              <OptionTemplate 
                {...provided.draggableProps}
                ref={provided.innerRef}
              >
                <Row>
                  <Col 
                    s={20} 
                    sm={20} 
                    md={20} 
                    style={{display: 'inline-flex'}} 
                    lg={this.props.showValidacao ? 16: 17} 
                    xl={this.props.showValidacao ? 16 : 17}  
                  >
                    <HandleContainer {...provided.dragHandleProps} >
                      <Icon 
                        component={() => 
                          <DragHandleVertical 
                            style={{verticalAlign: 'middle'}}                          
                          />
                        }                   
                      />
                    </HandleContainer>

                    <div style={{...listStyle, width: '90%'}} key={option.id}>
                        <label style={{marginRight: '10px'}}>{index+1}.</label>
                        <Input 
                          style={{marginRight: '10px'}} 
                          autoComplete="off"
                          ref={(node) => this.setRef(node, option.id)}
                          onBlur={() => {
                              if (this.inputsRef[option.id].input.value !== option.text) {
                                this.props.handleChangeOption(option.id, {text: this.inputsRef[option.id].input.value})
                              }
                            }
                          }
                          placeholder="Digite a opção"
                          defaultValue={option.text}
                          allowClear
                        />
                        <Button 
                          icon={<CloseOutlined />} 
                          onClick={() => this.props.onRemoveOption(option.id)} 
                        />
                    </div>
                  </Col>

                  { this.props.showValidacao && 
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                      <OptionValidate 
                        idPergunta={this.props.idPergunta}
                        questionsList={getValidQuestions(this.props.idPergunta, this.props.idsList)}
                        initialState={option.validation}
                        onUpdateStateToParent={ (value) => this.props.handleChangeOption(option.id, { validation: { ...value}})}
                      /> 
                    </Col>
                  }

                </Row>
              </OptionTemplate>
          )}
        </Draggable>
      );
    });
  }
}

class ListaSuspensa extends React.PureComponent {

  constructor(props) {
    super(props);
    this.dropType = uuid();

    if (_.isEmpty(this.props.initialState)) {
      let id = uuid();
      let option = { id, text: ''};
      this.state = { optionsList: [ option ]};
      this.props.onUpdateStateToParent(this.state);
    } else {
      this.state = { ...this.props.initialState };
    }
  }

  //Metodo Wrapper para qualquer alteracao via setState
  //Repassa o a optionsList do state final ao parent.
  onSetState = (newState) => {
    this.setState({...newState}, () => {
      this.props.onUpdateStateToParent({...this.state, noUpdate : true})
    });

  }

  onAddOption = () => {
    let option = { id: uuid(), text: ''};
    this.onSetState({ optionsList: [...this.state.optionsList, option ]});
  }

  /**
   * Metodo repassado via state ao componente TipoResposta para remover
   * um item na lista de options.
   */
  onRemoveOption = id => {
    let newOptions = this.state.optionsList.filter(option => option.id !== id);
    this.onSetState({ optionsList: newOptions});
  }

  onUpdateOption = (id, newOpt) => {
      let newOptions = [...this.state.optionsList];
      let optIndex = null;
      newOptions.filter((option, index) => {
        if (option.id === id) {
          optIndex = index;
        }
        return option.id === id
      });

      if (optIndex !== null) {
        newOptions[optIndex] = {...newOptions[optIndex], ...newOpt, id };
      }
      
      this.onSetState({ optionsList: newOptions});
  }

  handleChangeOption = (id, value) => {
    let updated = { id, ...value};
    this.onUpdateOption(id, updated);
  }

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    if ( result.type === this.dropType &&
      ( !this.state.lastDragResult || this.state.lastDragResult !== result))
     {
        const options = ReorderDnD(
          this.state.optionsList,
          result.source.index,
          result.destination.index
        );

        this.onSetState({ optionsList: options, lastDragResult: result });
     }
  }

  render() {
    return (
      <div>
        <Row gutter={DefaultGutter}>
          <Col xs={24} sm={24} md={24} lg={12} xl={12} style={{paddingBottom: '8px'}}>
              <Title>Será apresentada uma lista com as opções e o usuário poderá seleciona <strong>apenas uma</strong>.</Title>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <div style={{width: '100%'}}>
                <Droppable droppableId={this.dropType} type={this.dropType}>
                  { (provided, snapshot) => (
                    <OptionContainer
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      isDraggingOver={snapshot.isDraggingOver} 
                    >
                      <DragEndContext.Consumer>
                        { value => this.onDragEnd(value)}
                      </DragEndContext.Consumer>

                      <InnerList optionsList={this.state.optionsList}
                        handleChangeOption={this.handleChangeOption }
                        onRemoveOption={this.onRemoveOption}
                        showValidacao={this.props.showValidacao}
                        idPergunta={this.props.idPergunta}
                        idsList={this.props.idsList}  
                      />
                      {provided.placeholder}
                    </OptionContainer>
                  )}
                </Droppable>
            </div>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <AddOptionTemplate 
              style={{...listStyle, width: 150, paddingLeft: '24px'}} 
              onClick={this.onAddOption} 
              id={this.state.optionsList.length + 1}
            />
          </Col>
        </Row>
      </div>
    )
  }
}

export default ListaSuspensa;