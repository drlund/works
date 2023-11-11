import React, {Component} from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import { Input, Button, Row, Col, Tabs,message, Checkbox, Popconfirm } from 'antd';

import AlertList from 'components/alertlist/AlertList';
import InfoLabel from 'components/infolabel/InfoLabel';
import {DefaultGutter,padLeft} from 'utils/Commons';
import md5 from 'md5'
import SearchTable from 'components/searchtable/SearchTable'
import PageLoading from 'components/pageloading/PageLoading';
import {testeMatricula, testePrefixo} from 'utils/Regex';
import AlfaSort from 'utils/AlfaSort';

const { TabPane } = Tabs;

const TIPOS_IDENTIFICADORES = {
  PREFIXO: "prefixo", MATRICULA: "matricula"
}

class FormPlanilha extends Component{

  static propName = 'publicoAlvo';
  static separators = [ ';', ',', '\n' ];
  static TAB_INCLUI = "incluir_dados";
  static TAB_VISUALIZAR = "visualizar_dados";

  constructor(props){
    super(props);

    this.state = {
      substituirDados: true,
      stringPublico: "",
      dadosInvalidos: [],
      listaHashs: [],
      activeTab: FormPlanilha.TAB_INCLUI,
      selectedRowKeys: []
    }

    if(!this.props.data){
      this.props.updateFormData(FormPlanilha.propName, {lista: {headers: [], dados:[] }})
    }else{
      this.state.substituirDados = false;

      if (props.data.dados.length) {
        this.state.tipoIdentificador = this.getTipoIdentificador(this.props.data.dados[0]['0']);
      } else {
        this.state.tipoIdentificador = "";
      }
    }
  };

/**
 *   Verifica o tipo do identificador, se matrícula ou se prefixo. Para tanto verifica o formato da primeira coluna do primeiro elemento
 * 
 */
  getTipoIdentificador = (identificador) => {

    if( testePrefixo.test(identificador) ){
      return TIPOS_IDENTIFICADORES.PREFIXO
    }
    if( testeMatricula.test(identificador) ){
      return TIPOS_IDENTIFICADORES.MATRICULA
    }

    return "";
  }

  //Limpa os dados inválidos e depois trata os dados incluídos
  incluirDados = () => {
    this.setState({dadosInvalidos: []}, 
      () => {
        this.tratarDadosPlanilha()
      });
  }

  tratarDadosPlanilha = () => {

    const stringPublico = this.state.stringPublico;

    //Caso deseje-se substituir os dados e já existam dados incluídos anteriormente,
    //deve-se limpar o tipo de identificador e reexecutar a função tratarDadosPlanilha com o novo estado
    if(this.state.substituirDados && this.state.tipoIdentificador !== ""){
      this.setState({tipoIdentificador: ""}, () => this.tratarDadosPlanilha());
      return; 
    }
    //Caso não seja para substituir os dados, deve-se extrair a lista de hashs do props
    let listaHashsTemp = this.state.substituirDados ? 
      [] : this.props.data.dados.map((linha) => linha.hash);    
    /*  Criação de uma versão local da propriedade dadosInvalidos para não ficar atualizando via setState em cada iteração e renderizar à toa*/ 
    let dadosInvalidosTemp = this.state.dadosInvalidos;
    this.props.loadingFunc(true);
    let resultado = { headers: [], dados: [] };

    if(!stringPublico || stringPublico.trim().length === 0){
      message.error('Insira os dados da planilha no campo adequado');
      this.props.loadingFunc(false);
      return;
    }

    const linhas = stringPublico.split("\n");
    let tipoIdentificador = "";

    for (let i = 0; i < linhas.length ; i++){
      if(i===0){        
        //Caso seja para substituir os dados anteiores os headers estão na primeira linha dos dados, caso contrário, utiliza-se o do props
        resultado.headers = this.state.substituirDados ? 
          linhas[0].split("\t") : this.props.data.headers    
        if(this.state.substituirDados){
          continue;
        }
      }
      
      if (linhas[i] === "") {
        //geralmente a ultima linha eh vazia quando cola-se do excel
        continue;
      }

      let novaLinhaObj = {};
      let novaLinhaArray = linhas[i].split("\t");      
      
      if(tipoIdentificador === ""){
        tipoIdentificador = this.state.tipoIdentificador ? this.state.tipoIdentificador : this.getTipoIdentificador(novaLinhaArray[0]);
      }

      if( this.validaIdentificador(tipoIdentificador, novaLinhaArray[0]) === false  ){
        dadosInvalidosTemp.push("Identificador no formato inválido: " + novaLinhaArray.join(";"));
        continue;
      }
      //Para cada um dos campos, cria o novo objeto no qual a chave é o identificador posicional
      for(let j = 0; j < novaLinhaArray.length; j++ ){
        if(j === 0){
          if (tipoIdentificador === TIPOS_IDENTIFICADORES.PREFIXO) {
            novaLinhaArray[j] = padLeft(novaLinhaArray[j], 4, '0');
          } else {
            novaLinhaArray[j] = String(novaLinhaArray[j]).toUpperCase()
          }
        }
        novaLinhaObj[j] = novaLinhaArray[j];
      }        

      //Caso o hash já exista na lista ou tenha uma quantidade de campos diferente do Header, não deve ser incluída.
      novaLinhaObj.hash = md5(novaLinhaArray.join(";"));
      if(listaHashsTemp.includes(novaLinhaObj.hash)){
        dadosInvalidosTemp.push("Dado duplicado: " + novaLinhaArray.join(";"));
        continue;
      }

      if(novaLinhaArray.length !== resultado.headers.length){
        dadosInvalidosTemp.push("Quantidade de campos inválidos: " + novaLinhaArray.join(";"));
        continue;
      }
      
      resultado.dados.push(novaLinhaObj);                  
    }
    

    if(this.state.substituirDados){
      this.props.updateFormData(FormPlanilha.propName, {lista: resultado});
    }else{
      this.props.updateFormData(FormPlanilha.propName, {lista: {headers: resultado.headers, dados: [...this.props.data.dados, ...resultado.dados] }});
    }

    if(dadosInvalidosTemp.length > 0){
      this.setState({dadosInvalidos: dadosInvalidosTemp, stringPublico: ""})
    }

    if(resultado.dados.length > 0 ){
      this.setState({activeTab: FormPlanilha.TAB_VISUALIZAR, substituirDados: false, tipoIdentificador, stringPublico: ""});
    }
    this.props.loadingFunc(false);  
  }

/**
 * 
 *   Dependendo do tipo de identificador, valida o seu formato
 * 
 */
  validaIdentificador = (tipoIdentificador, identificador) => {
    if(  (tipoIdentificador === TIPOS_IDENTIFICADORES.PREFIXO && testePrefixo.test(identificador)) ||
         (tipoIdentificador === TIPOS_IDENTIFICADORES.MATRICULA && testeMatricula.test(identificador))
    ){
      return true
    }

    return false;
  }

  removeLinhaPlanilha = (hash) => {
    let newLista = this.props.data;
    newLista.dados = newLista.dados.filter((linha) => linha.hash !== hash);
    this.props.updateFormData(FormPlanilha.propName, newLista);    
  }

  removeLinhasSelecionadas = () => {
    let newLista = this.props.data;
    newLista.dados = newLista.dados.filter((linha) => !this.state.selectedRowKeys.includes(linha.hash));
    this.setState({selectedRowKeys : [], activeTab: newLista.dados.length === 0 ? FormPlanilha.TAB_INCLUI : FormPlanilha.TAB_VISUALIZAR });
    this.props.updateFormData(FormPlanilha.propName, {lista: newLista});   
    
  }

  removerTodosRegistro = () => {
    let newLista = this.props.data;
    newLista.dados = [];
    this.setState({selectedRowKeys : [], activeTab: FormPlanilha.TAB_VISUALIZAR });
    this.props.updateFormData(FormPlanilha.propName, {lista: newLista});
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };
  /**
   * 
   *   Caso a propriedade data não estiver vazia, ou seja, caso tenham sido incluídos dados, exibir a aba contendo a tabela com os mesmos.
   * 
   */
  renderTableIncluidos = () => {
  
    if(this.jaExistemDados()){

      let dadosTabela = this.props.data;
      dadosTabela.dados = dadosTabela.dados.map((elem) => { return { ...elem, key: elem.hash}  });
      
      let columns = dadosTabela.headers.map((title,dataIndex) => {
        return {   
          title,
          dataIndex: dataIndex.toString(),
          sorter: (a, b) => AlfaSort(a[dataIndex], b[dataIndex])
        }
      });

      const { selectedRowKeys } = this.state;
      const rowSelection = {
        selectedRowKeys,
        onChange: this.onSelectChange,
      };

      return (
        <TabPane tab="Dados incluídos" key={FormPlanilha.TAB_VISUALIZAR}>
          <SearchTable               
            columns={columns} 
            dataSource={dadosTabela.dados}
            rowSelection={rowSelection}
            ignoreAutoKey
            scroll={{ x: true }}
            size="small"
            pagination={{showSizeChanger: true}}
          />
          <Popconfirm 
            title="Deseja excluir este registro?" 
            placement="top" 
            onConfirm={() => this.removeLinhasSelecionadas()}
            disabled={!this.state.selectedRowKeys.length > 0}
          >
            <Button disabled={!this.state.selectedRowKeys.length > 0} 
              style={{ marginTop: 20 }} 
              icon={<DeleteOutlined />}
              type="danger"
            >
              Excluir linhas selecionadas
            </Button>  
          </Popconfirm>

          <Popconfirm 
            title="Deseja limpar todos os registros da tabela?" 
            placement="top" 
            onConfirm={() => this.removerTodosRegistro() } 
            disabled={this.props.data.dados.length === 0}
          >
            <Button disabled={this.props.data.dados.length === 0}
              style={{ marginTop: 20, marginLeft: 25 }} 
              icon={<DeleteOutlined />}
              type="danger"
            >
              Limpar Todos os Registros
            </Button>  
          </Popconfirm>               

        </TabPane>
      );
    }
  }

  jaExistemDados = () => {
    return this.props.data.dados.length > 0 || this.props.data.headers.length > 0 ;

  }

  render = () => {    
    if(!this.props.data){
      return <PageLoading  />; 
    }   

    return (<div>      
      <Row gutter={DefaultGutter} type="flex">        
        <Col span={24}>
          <Tabs activeKey={this.state.activeTab} onTabClick={(key) => this.setState({activeTab: key})} tabPosition="left">
            <TabPane tab="Incluir Dados do Excel" key={FormPlanilha.TAB_INCLUI}>
                <p >Neste tipo de público-alvo, a primeira linha é o cabeçalho dos dados.</p>
                <Checkbox 
                  disabled={!this.jaExistemDados()}
                  onChange={(e) => this.setState({substituirDados: e.target.checked}) } 
                  checked={this.state.substituirDados}>
                    Substituir dados incluídos anteriormente?
                </Checkbox>
              
              { !this.state.substituirDados &&
                <InfoLabel showIcon={true} type="warning">Os dados não podem possuir cabeçalho e devem possuir a mesma quantidade de campos que aqueles já incluídos.</InfoLabel>
              }
              <Input.TextArea 
                style={{ marginTop: 20 }}
                width={700}
                value={this.state.stringPublico}
                onChange={ (event) => this.setState({stringPublico: event.target.value })} 
                rows={20} 
              />          
              <Button disabled={this.state.stringPublico === ""} 
                  style={{ marginTop: 20 }} type="primary"
                  onClick={this.incluirDados}>
                Incluir dados do Excel
              </Button>      
            </TabPane>

            
            {this.renderTableIncluidos()}
            
        </Tabs>
        </Col> 
      </Row>
      
      <Row gutter={DefaultGutter} style={{marginTop: '15px'}}>
        <Col span={24}>          
          <AlertList closable={true} title="O seguintes registros foram ignorados por estarem com formato inválido" type='warning' messagesList={this.state.dadosInvalidos}/>
        </Col>
      </Row>
      
    </div>)};
  
}

export default FormPlanilha;