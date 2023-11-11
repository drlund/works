import React, {Component} from 'react';
import { BankOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Tabs,
  Col,
  Row,
  Input,
  Table,
  message,
  Tooltip,
  Popconfirm,
  Avatar,
  Button,
  DatePicker,
  Select,
} from 'antd';
import {fetchDependencia, fetchFunci, removeDestinatario,
        updateFormData, salvarMensagem, novoElogio } from 'services/ducks/Elogios.ducks';
import { DefaultGutter, getProfileURL } from 'utils/Commons';
import {testeMatricula, testePrefixo} from 'utils/Regex';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import AlertList from 'components/alertlist/AlertList';
import PageLoading from 'components/pageloading/PageLoading';
import RichEditor from 'components/richeditor/RichEditor';
import StyledCard from 'components/styledcard/StyledCard';
import styled from 'styled-components';
import moment from 'moment';
import 'moment/locale/pt-br';
import "./ElogioForm.css"

import _ from 'lodash';

const { Search } = Input;
const { Option } = Select;

const TabPane = Tabs.TabPane;

const TabLabel = styled.label`
  color: !important;
  cursor: pointer;
  color: ${props => props.hasError && "red"}
`;


class ElogioForm extends Component{
  
 constructor(props){
    super(props);

    //Initial State config
    this.state = { 
      searchText: "",
      saving: false,
      activeTabKey: "1"
    }

    if (!props.dadosElogio.formData.dataElogio) {
      props.updateFormData({dataElogio: moment().toISOString()})
    }

  }
  
  /** Funções auxiliares */

  isDuplicadoFunci = () => {
    
   //Verifica se é uma duplicata de 
    let encontrado = _.find(this.props.dadosElogio.listaFuncis, (funci) => { 
      return funci.matricula.toLowerCase() === this.state.searchText.toLowerCase()
    });

    return !_.isUndefined(encontrado);
  }

  isDuplicadoPrefixo = () => {
    
    let encontrado = _.find(this.props.dadosElogio.listaDependencias, (prefixo) => { 
      return prefixo.prefixo === this.state.searchText 
    });

    return !_.isUndefined(encontrado);
  }

  getColumns = () => {

    const columns = [
      {
        title: 'Identificador',
        dataIndex: 'id',
        render: (text,record) => {
            return (
              <span>
                
                {testeMatricula.test(record.id) ? //Caso matrícula mostra a foto da pessoa, caso prefixo mostra o ícone
                  <Avatar style={{verticalAlign: "middle"}} src={getProfileURL(record.id)} />:
                  <Avatar style={{verticalAlign: "middle"}} icon={<BankOutlined />} />
                }
                <span style={{verticalAlign: "middle", marginLeft: 5}} >{record.identificador}</span>
              </span>
            );

        }
      },
      {
        title: 'Tipo',
        dataIndex: 'tipo',
      },
    
      {
        title: 'Ações',
        width: '10%',
        align: 'center',
        render: (text,record) => {
        
            return (
              <span>     
                <Tooltip title="Remover destinatario" placement="bottom">
                  <Popconfirm title="Deseja excluir o destinatário?" onConfirm={() =>this.onRemoveDestinatario(record.id)}>
                      <DeleteOutlined className="link-color" />
                  </Popconfirm>
                </Tooltip>
              </span>
            );
          
        },
      }
    ];

    return columns;
  }

  renderDestinTable = () => {
  
    let tratadoFuncis = [], tratadoPrefixos = [];
    
    if (!_.isUndefined(this.props.dadosElogio.listaFuncis)) {
      tratadoFuncis = this.props.dadosElogio.listaFuncis.map((funci) => {
        return {
          id: funci.matricula,
          tipo: "Funcionário",
          identificador: funci.matricula + " - " + funci.nome
        }
      })
    }

    if(!_.isUndefined(this.props.dadosElogio.listaDependencias)) {
      tratadoPrefixos = this.props.dadosElogio.listaDependencias.map((dependencia) => {
        return {
          id: dependencia.prefixo,
          tipo: "Dependência",
          identificador: dependencia.prefixo + " - " + dependencia.nome
        }
      })      
    }

    let dataSource = _.concat(tratadoFuncis, tratadoPrefixos);

    return (
      <Table 
        pagination={{ pageSize: 5 }}
        loading = {this.state.searching ? {spinning: this.state.searching, indicator: <PageLoading/>} : false}
        style={{marginTop: 15}}
        dataSource={dataSource}
        columns={this.getColumns()} 
        size="small"
        rowKey={() => uuid()} 
      />
    )

  }

/**  Funções de ação */

  onRemoveDestinatario = (identificador) => {

    this.setState({loading: true}, 
      () => {
        this.props.removeDestinatario({
          identificador,
          responseHandler: {
            successCallback: () => message.success("Funci removido com sucesso"),
            errorCallback: (msg) => msg ? message.error(msg) : message.error("Ocorreu um erro na exclusão do detinatário")
          }
        });
      }
    );
    
  }

  onFonteChange = (value) => {
    this.state.fonteElogio !== "Outros" ?
      this.props.updateFormData({fonteElogio: value, outros: ""}) :
      this.props.updateFormData({fonteElogio: value});
    
  }

  onDataChange = (data) => {
    if (data) {
      this.props.updateFormData({dataElogio: data.toISOString()})
    } else {
      this.props.updateFormData({dataElogio: ''})
    }
  }

  onTextoElogioChange = (e) => {
    this.props.updateFormData({textoElogio: e.target.getContent()})
  }

/**  Funções fetch */

  fetchDadosDestinatario = () => {

    if(this.state.searchText.length === 0){
      message.error("O Campo de pesquisa deve ser preenchido");
      this.setState({searchText: ""});
      return;
    }
    
    if (this.isDuplicadoFunci() || this.isDuplicadoPrefixo()){
      message.error("Entrada '"+this.state.searchText+"' duplicada");
      this.setState({searchText: ""});
      return;
    }

    this.setState({searching: true}, 
      () => {

        let responseHandler = {
          successCallback: () => this.setState({searching: false, searchText: ""}),
          errorCallback: this.onErroPesquisa
        }

        if(testeMatricula.test(this.state.searchText)){
          this.props.fetchFunci(
            {matricula: this.state.searchText.toUpperCase(),
            responseHandler}
          );
        } else if(testePrefixo.test(this.state.searchText)){
          this.props.fetchDependencia(
            {prefixo: this.state.searchText,
            responseHandler}
          );
        } else{
          message.error("Digite uma matrícula ou um prefixo");

          this.setState({searching: false, searchText: ""});
        }
      })
  }


/** Funções de eventos */


  onErroPesquisa = () => {
    message.error("Termo da pesquisa não encotrado! Tente novamente");
    this.setState({searching: false, searchText: ""})
  }

  textChange = (e) => {
    
    let texto =  e.target.value.toUpperCase()
    if(texto.length > 8 ){
      texto = texto.substring(0,8);
    }
    this.setState({searchText: texto})
  }
  
  onSalvarMensagem = async () => {
    //validando os campos obrigatorios
    let errorsList = [];

    if (_.isEmpty(this.props.dadosElogio.listaDependencias) && _.isEmpty(this.props.dadosElogio.listaFuncis) ) {
      errorsList.push('Necessário adicionar pelo menos um destinatário do elogio.');
    }

    if (!this.props.dadosElogio.formData.dataElogio || this.props.dadosElogio.formData.dataElogio === '') {
      errorsList.push('Necessária a data do elogio.');
    }

    if (!this.props.dadosElogio.formData.fonteElogio || this.props.dadosElogio.formData.fonteElogio === '') {
      errorsList.push('Necessária a fonte do elogio.');
    } else {
      if (this.props.dadosElogio.formData.fonteElogio === "Outros" && this.props.dadosElogio.formData.outros === "") {
        errorsList.push('Ao selecionar a fonte "outros" no elegio, é necessário o endereço da fonte.');
      }
    }

    if (!this.props.dadosElogio.formData.textoElogio || this.props.dadosElogio.formData.textoElogio === '') {
      errorsList.push('Necessário o texto do elogio.');
    }

    if (errorsList.length) {
      this.setState({errorsList, activeTabKey: "1"});
      message.error("Preencha todos os campos!");
    } else {
      this.setState({errorsList: []}, () => {
        this.setState({saving: true}, () =>{
          this.props.salvarMensagem({
            successCallback: this.onSaveSuccess,
            errorCallback: this.onSaveError
          })
        })    
      })
    }

  }

  onSaveSuccess = () => {
    this.setState({saving: false}, () => {
      if (this.props.dadosElogio.id) {
        message.success("Elogio salvo com sucesso");
      } else {
        message.success("Elogio registrado com sucesso");
      }
    });
  }

  onSaveError = (what) => {
    this.setState({saving: false}, () => {
      if (what) {
        message.error(what);
      } else {
        message.error("Erro ao salvar o elogio!");
      }
    });
  }

/**  Render methods */
  renderActions = () => {
    return (
      <div>
        <Button 
          type="primary" 
          style={{marginRight: '10px'}}
          onClick={this.onSalvarMensagem}
          loading={this.state.saving}
        >
          Salvar
        </Button>

        {
          !this.props.dadosElogio["id"] &&
          <Popconfirm title="Deseja limpar todos os dados do formulário?" placement="bottomLeft" onConfirm={this.onCancel}>
            <Button disabled={this.state.saving}>Limpar</Button>
          </Popconfirm>
        }
      </div>
    )
  }

  onCancel = () => {
    this.setState({
      searchText: "",
      saving: false,
      activeTabKey: "1"
    }, () => {
      this.props.novoElogio();
    })
  }

  onChangeTab = (key) => {
    this.setState({activeTabKey: key})
  }

  render = () => {  
    return (
      <div>
        <Tabs type="card" 
          tabBarExtraContent={this.renderActions()} 
          activeKey={this.state.activeTabKey}
          onTabClick={this.onChangeTab}
        >
          <TabPane tab={<TabLabel>Elogiados</TabLabel>} 
            key={1}
          >
            <Row gutter={DefaultGutter} >
              <Col span={24} style={{minHeight: 300}}>
                <StyledCard className="elogio-card">
                  <Form > 
                    <Form.Item label="Matrícula/Prefixo" >
                      <Search placeholder="Insira a matrícula ou prefixo destinatario" value={this.state.searchText}
                              onChange={ this.textChange } onSearch={this.fetchDadosDestinatario} enterButton={<PlusOutlined />} />
                    </Form.Item>
                    {this.renderDestinTable()}

                    <Row style={{paddingTop: '10px'}}>
                      <Col span={24}>
                        <AlertList title="Erros Encontrados" messagesList={this.state.errorsList || []}/>
                      </Col>
                    </Row>
                  </Form>
                </StyledCard>                  
              </Col>
            </Row>

          </TabPane>

          <TabPane tab={<TabLabel>Dados do Elogio</TabLabel>} 
            key={2}
          >
            <Row gutter={DefaultGutter} >
              <Col span={24}>
                <StyledCard className="elogio-card">
                  <Form > 
                    <Row gutter={DefaultGutter}>
                      <Col span={4}>
                        <Form.Item label="Data do elogio" >
                          <DatePicker 
                            defaultValue={moment(this.props.dadosElogio.formData.dataElogio)}
                            format="DD/MM/YYYY"                        
                            showToday={false}   
                            onChange={this.onDataChange}                                    
                          />
                        </Form.Item>
                      </Col>
                      <Col span={20}>
                        <Form.Item label="Fonte do elogio">      
                          <Select 
                            onChange={this.onFonteChange} 
                            placeholder="Escolha opção desejada"
                            value={this.props.dadosElogio.formData.fonteElogio}
                          >
                            <Option value="Twitter">Twitter</Option>
                            <Option value="Facebook">Facebook</Option>
                            <Option value="Email">Email</Option>
                            <Option value="Ouvidoria">Ouvidoria</Option>
                            <Option value="Outros">Outros</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                    </Row>

                    {
                      this.props.dadosElogio.formData.fonteElogio === "Outros" &&
                      <Row>
                        <Col span={24}>
                          <Form.Item label="Insira a fonte"> 
                            <Input 
                              defaultValue={this.props.dadosElogio.formData.outros || ""}  
                              onChange={ (e) =>  {  this.props.updateFormData({outros: e.target.value})}  }
                            />
                          </Form.Item> 
                        </Col>
                      </Row>
                    }

                    <Row>
                      <Col span={24}>          
                        <Form.Item  label="Texto/Imagem(print) do elogio - arraste ou cole as imagens para dentro do editor" >
                          <RichEditor 
                            height={500} 
                            onBlur={this.onTextoElogioChange}
                            initialValue={this.props.dadosElogio.formData.textoElogio}
                            customRootDir="elogios"
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </StyledCard>
              </Col>
            </Row>

          </TabPane>
        </Tabs>

      </div>
    );
    
  }

}

const mapStateToProps = state => {
  return { dadosElogio: state.elogios.dadosElogio }
}

export default connect(mapStateToProps, {
  updateFormData, 
  fetchDependencia, 
  fetchFunci, 
  removeDestinatario, 
  salvarMensagem,
  novoElogio
})(ElogioForm);