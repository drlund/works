import React from 'react';
import Icon, { PlusOutlined } from '@ant-design/icons';
import { Row, Col, Button } from 'antd';
import Pergunta from './Pergunta';
import { ReorderDnD } from 'utils/Commons';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import uuid from 'uuid/v4';
import _ from 'lodash';
import clonedeep from 'lodash.clonedeep';
import { connect } from 'react-redux';
import { updateFormData, clearQuestionErrorStatus } from 'services/actions/demandas';
import styled from 'styled-components';
import { DragHandleHorizontal } from 'components/draghandles/DragHandles';
import AlertList from 'components/alertlist/AlertList';
import DragEndContext from './DragEndContext';

/** Componente com a lista de todas as Perguntas */
const QuestionsContainer = styled.div`
  background-color: ${props => props.isDraggingOver ? 'lightgray' : '!important'};
  padding: 5px;
`;

/** Componente que encapsula uma pergunta individual  */
const QuestionTemplate = styled.div``;

const HandleContainer = styled.label``;

const NovaPerguntaText = styled.label`
  padding-left: 10px;
  font-weight: bold;
  cursor: pointer;
`;

const handleStyle = {
  marginLeft: 10, 
  marginRight: 10, 
  backgroundColor: '#B1CBE0',
  borderTopLeftRadius: '4px',
  borderTopRightRadius: '4px',
  boxShadow: '0px 5px 5px 0px rgba(0,0,0,.16),0px 10px 20px -10px rgba(0,0,0,.12)'
}

const handleStyleError = { ...handleStyle, backgroundColor: '#F42937' };
const handleColor = '#4A8CC9';
const handleColorError = '#E8C5CB';

class InnerList extends React.Component {
  render() {
    const { questionsList, errorsList } = this.props;

    return questionsList.map((question, index) => {
      let questionNumber = index + 1;
      let validationErrors = 
            (!_.isEmpty(errorsList) && errorsList[question.id]) ? errorsList[question.id] : [];

      return (
        <Draggable draggableId={question.id} key={question.id} index={index}>
          { (provided) => (
              <QuestionTemplate 
                {...provided.draggableProps}
                ref={provided.innerRef}
              >
                <Row style={_.isEmpty(validationErrors) ? handleStyle : handleStyleError}>
                  <Col span={24} justify="center" align="middle" >
                    <HandleContainer {...provided.dragHandleProps} >
                      <Icon 
                        component={() => 
                          <DragHandleHorizontal
                            fill={_.isEmpty(validationErrors) ? handleColor : handleColorError}
                            style={{verticalAlign: 'middle'}}                          
                          />
                        }                   
                      />
                    </HandleContainer>
                  </Col>
                </Row>

                <Row>
                  <Col span={24}>
                    <Pergunta 
                      initialState={question}
                      number={questionNumber}
                      idPergunta={question.id}
                      idsList={this.props.idsList}
                      onAddClick={this.props.onAddClick}
                      onRemoveClick={this.props.onRemoveClick}
                      onDuplicateClick={this.props.onDuplicateClick}
                      onUpdateStateToParent={this.props.onUpdateStateToParent}
                      lastUpdatedQuestionId={this.props.lastUpdatedQuestionId} 
                      lastEvent={this.props.lastEvent}
                      errorsList={validationErrors}
                    />
                  </Col>
                </Row>
              </QuestionTemplate>
          )}
        </Draggable>
      )
    });
  }
}

/**
 * Classe base que representa uma lista de perguntas.
 * Recebe/Repassa um array com os dados dos objetos gerados pelo componente Pergunta.
 */
class ListaPerguntas extends React.PureComponent {
  static propName = 'perguntas';

  constructor(props) {
    super(props);

    this.state = { 
      dragEndResult: {}
    };

    if (_.isEmpty(this.props.formData)) {
      this.props.updateFormData(ListaPerguntas.propName, []);
    }

    this.dropType = uuid();
  }

  /**
   * Wrapper do metodo setState para atualizar a nova lista de perguntas no store.
   */
  onSetState = (newState, newQuestionsList) => {
    this.setState({...newState}, () => this.props.updateFormData(ListaPerguntas.propName, newQuestionsList));
  }

  /**
   * Adiciona uma nova pergunta a lista.
   */
  onAddPergunta = (prevId = null) => {
    let question = { 
      id: uuid(), 
      obrigatoria: true, 
      tipoResposta: 'respostaCurta',
      dadosResposta: [],
      showDescricao: false,
      showValidacao: false,
      ordenarAleatoriamente: false
    };

    if (prevId) {
      //insere imediatamente apos a pergunta com o id = prevId.
      let newList = [...this.props.formData];
      let prevIndex = null;
      newList.filter((item, index) => {
        if (item.id === prevId) {
          prevIndex = index + 1;
        }
        return item.id === prevId
      });

      newList.splice(prevIndex, 0, question);
      this.onSetState({ lastUpdatedQuestionId: '*', lastEvent: 'addQuestion' }, newList);
    } else {
      this.onSetState({ lastUpdatedQuestionId: '*', lastEvent: 'addQuestion' }, [...this.props.formData, question ]);
    }
  }

  /**
   * Remove a pergunta com id especificado da lista.
   */
  onRemovePergunta = id => {
    let newList = this.props.formData.filter(item => item.id !== id);
    this.onSetState({ lastUpdatedQuestionId: '*', lastEvent: 'removeQuestion'}, newList);

    //se a lista estiver vazia, limpa as mensagens de erro.
    if (_.isEmpty(newList)) {
      this.props.clearQuestionErrorStatus();
    }
  }

  /**
   * Atualiza os dados de uma pergunta especifica.
   */
  onUpdatePergunta = (newState) => {
    let id = newState.id;
    let newList = [...this.props.formData];
    let targetIndex = null;
    newList.filter((item, index) => {
      if (item.id === id) {
        targetIndex = index;
      }
      return item.id === id
    });

    if (targetIndex !== null) {
      newList[targetIndex] = {...newState, id };
      this.onSetState({ lastUpdatedQuestionId: id, lastEvent: 'questionUpdate'}, newList);
    }
  }

  onDuplicatePergunta = id => {
    let newList = [...this.props.formData];
    let targetIndex = null;
    let baseItem = null;

    newList.filter((item, index) => {
      if (item.id === id) {
        targetIndex = index + 1;
        baseItem = clonedeep(item);
      }
      return item.id === id
    });

    if (baseItem) {
      baseItem.id = uuid();
      if (!_.isEmpty(baseItem.dadosResposta) &&
          baseItem.dadosResposta.optionsList) {
          //Todo: implementar uma funcao de clone das perguntas dentro
          //da propria pergunta para desacoplar o conhecimento dos detalhes
          //da classe ListaPerguntas. Solucao temporaria para resolver o problema.  
          let newDados = baseItem.dadosResposta.optionsList.map(item => {
            let newItem = clonedeep(item);
            newItem.id = uuid();
            return newItem;  
          });
          baseItem.dadosResposta.optionsList = newDados;
      }

      newList.splice(targetIndex, 0, baseItem);
      this.onSetState({ lastUpdatedQuestionId: '*', lastEvent: 'duplicateQuestion' }, newList);
    }
  }

  onDragEnd = result => {
    if (!result.destination) {
      return;
    }

    if (result.type !== "app") {
      //evento vindo de algum droppable filho
      this.setState({dragEndResult: result, lastUpdatedQuestionId: '*', lastEvent: 'childrenDrop'});
      return;
    }

    const questionsList = ReorderDnD(
      this.props.formData,
      result.source.index,
      result.destination.index
    );

    this.onSetState({dragEndResult: result, lastUpdatedQuestionId: '*', lastEvent: 'reorderQuestions'}, questionsList)
  }

  getIdsList = () => {
    return this.props.formData.map(question => question.id);
  }

  render() {
    if ( !this.props.formData.length) {
      return (
        <div>
          <Row>
            <Col span={24}>
              <Button 
                icon={<PlusOutlined />} 
                type="primary" 
                shape="circle" 
                style={{fontSize: '18px', marginLeft: '10px'}}
                onClick={() => this.onAddPergunta()}
              />
              <NovaPerguntaText onClick={() => this.onAddPergunta()}>Adicionar uma Nova Pergunta</NovaPerguntaText>
            </Col>
          </Row>

          <Row>
            <Col span={24} style={{paddingTop: '20px'}}>
              <AlertList title="Erros Encontrados" messagesList={this.props.errorsList.erros || []}/>
            </Col>
          </Row>
        </div>
      );
    }

    return (
      <div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId='listaPerguntas' type="app">
            { (provided, snapshot) => (
              <QuestionsContainer
                ref={provided.innerRef}
                {...provided.droppableProps} 
                isDraggingOver={snapshot.isDraggingOver} 
              >
                <DragEndContext.Provider value={this.state.dragEndResult}>
                  <InnerList 
                    questionsList={this.props.formData}
                    idsList={this.props.formData.map(question => question.id)}
                    isDragging={snapshot.isDraggingOver}
                    onAddClick={this.onAddPergunta}
                    onRemoveClick={this.onRemovePergunta}
                    onDuplicateClick={this.onDuplicatePergunta}
                    onUpdateStateToParent={this.onUpdatePergunta}
                    lastUpdatedQuestionId={this.state.lastUpdatedQuestionId || '*'} 
                    lastEvent={this.state.lastEvent || 'noEvent'}
                    errorsList={this.props.errorsList || {}}
                  />    
                </DragEndContext.Provider>
                {provided.placeholder}
              </QuestionsContainer>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    )
  }
}

const mapStateToProperties = state => {
  return { formData: state.demandas.demanda_atual.perguntas ? state.demandas.demanda_atual.perguntas : [],
           errorsList: state.demandas.demanda_erros.perguntas
         }
}

export default connect(mapStateToProperties, { 
  updateFormData,
  clearQuestionErrorStatus
})(ListaPerguntas);