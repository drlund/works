import React, {Component} from 'react';
import TabelaDemandas from 'pages/demandas/TabelaDemandas';
import { EyeOutlined, FormOutlined } from '@ant-design/icons';
import { Tooltip, Row, Col, Input, message, Tabs } from 'antd';
import PageLoading from 'components/pageloading/PageLoading';
import { fetchDemandasResponder, arquivarDemanda,reativarDemanda } from 'services/actions/demandas';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import AlfaSort from 'utils/AlfaSort';
import DateBrSort from 'utils/DateBrSort';

const constantes = {
  tabs: {
    pendentes: "pendentes",
    respondidas: "respondidas"
  }
}

const Search = Input.Search;
const { TabPane } = Tabs;

class MinhasDemandas extends Component{
  

  columns = [
    {
    dataIndex: 'titulo',
    title: 'Título',
    width: '50%',
    sorter: (a, b) => AlfaSort(a.titulo, b.titulo)
  },{
    width: '15%',
    title: 'Dt. Criação',
    dataIndex: 'dataCriacao',
    sorter: (a, b) => DateBrSort(a.dataCriacao, b.dataCriacao)
  },{
    width: '15%',
    title: 'Dt. Expiração',
    dataIndex: 'dataExpiracao',
    sorter: (a, b) => DateBrSort(a.dataExpiracao, b.dataExpiracao)
  },{
    title: 'Ações',
    width: '10%',
    align: 'center',
    render: (text, record) => {
      if(this.state.activeTab === constantes.tabs.respondidas){
        return (
          <span>
            <Tooltip title="Visualizar Resposta">
              <Link to={"/demandas/visualizar-demanda/" + record.id}>
                <EyeOutlined className="link-color" />
              </Link>
            </Tooltip>
          </span>
        );
      }else{
        return (
          <span>
            <Tooltip title="Responder">
              <Link to={"/demandas/responder-demanda/" + record.id}>
                <FormOutlined className="link-color" />
              </Link>
            </Tooltip>
          </span>
        );
      }
    },
    
  }];
  


  constructor(props){
    super(props);
    //Initial State config
    this.state = { 
      demandasDisplay: [],
      loading: true,
      activeTab: constantes.tabs.pendentes,
      filtros: {
        texto: { termo: "", funcao: this.filtrarTexto },
      }
    };

    
  }
  
  componentDidMount = () => {
    this.fetchDemandas();
  }

  fetchDemandas = () => {
        
    this.setState({loading:true}, () =>{
        this.props.fetchDemandasResponder({
        typeFetch: this.state.activeTab, 
        responseHandler : {
          successCallback: this.onFetchedData,
          errorCallback: this.onFetchError
        }
      });
    })
  }


//************ Response Handler ************

  onFetchedData = () => {
    if (this.state.activeTab === constantes.tabs.ativas) {
      this.filtrarDemandasAtivas();
    } else {
      this.setState({
        loading: false, 
        demandasDisplay: this.props.baseDemandas.map(elem => { 
          return { 
            ...elem, 
            key: elem.id,
            dataCriacao: moment(elem.dataCriacao).format("DD/MM/YYYY HH:mm"),
            dataExpiracao: moment(elem.dataExpiracao).format("DD/MM/YYYY HH:mm")
          }
        })
      });
    }
    
  }

  onFetchError = (error) => {

    message.error('Erro de rede. Favor verifique a conexão. Caso o erro persista, favor contatar o  administrador do sistema!');
    this.setState({loading: false});

  }

  onArquivada = () => {
    message.success("Demanda arquivada com sucesso.");
  }

  onArquivadaErro = () => {
    message.error('Erro ao arquivar demanda. Tente novamente. Caso o erro persista, contate o administrador do sistema.');
  }

  //************ Filtros ************

  filtrarExpiradas = (arrayDemandas) => {
    
    let filtrado = arrayDemandas;
    if(!this.state.filtros.expiradas.mostrarExpiradas){
      filtrado = _.filter(arrayDemandas, (demanda) => {
        return moment(demanda.dataExpiracao).isAfter(moment());
      });
    }

    return filtrado;

  }

  filtrarTexto = (arrayDemandas) => {

    let termo = this.state.filtros.texto.termo.trim().toLocaleLowerCase();
    let filtradas = [];
  
    filtradas = arrayDemandas.filter(item => {
      return termo.trim() === '*' || termo.trim() === '' ||
      (item.titulo.toLocaleLowerCase().indexOf(termo) !== -1)
    });
    

    return filtradas;

  }


//************ Funções de Ação ************


  filtrarDemandasAtivas = () => {

    if(!this.state.loading){
 
      this.setState({loading: true});
    }

    let filtradas = this.props.baseDemandas;    
    _.forOwn(this.state.filtros, (dados,nomeFiltro) => {
      filtradas = dados.funcao(filtradas);
    });
    

    this.setState({loading: false, demandasDisplay: filtradas});
    
  }

  onSearchDemandas = (termo) => {
    this.props.filtrarDemandasAtivas({type: this.props.type, query: termo});
  }
 
  // *********** Funções ONCHANGE ************

  onChangeFiltroExpirada = (mostrarExpiradas) => {
    
    let filtros  = {...this.state.filtros};
    filtros.expiradas.mostrarExpiradas = mostrarExpiradas;
    this.setState({...this.state, filtros}, () => this.filtrarDemandasAtivas());

  }

  onChangeTab = (aba) => {
    
    this.setState({loading:true, activeTab: aba}, () => { this.fetchDemandas()});
    
  }

  onSearch = (termo) =>{
    let filtros  = {...this.state.filtros};
    filtros.texto.termo = termo;
    this.setState({...this.state, filtros}, () => this.filtrarDemandasAtivas());
  }

  // *********** Funções RENDER ************

  renderFilters = () => {
      return(
        <Row>
          <Col span={24}>
              <Row>
                <Col xs={24} sm={24} md={12} lg={24} xl={24}>
                  <Search
                    placeholder="Pesquise um formulário por título"
                    onSearch={ (value) => { this.onSearch(value) }  }
                    className="search-bar"            
                    />
                </Col>
              </Row>
          </Col>
        </Row>
    )
  }


  render(){  

    if(this.state.loading){
      return( <PageLoading /> );  
    }else{

      return ( 
        <span>
          <Tabs activeKey={this.state.activeTab} onChange={this.onChangeTab} type="card">
            <TabPane tab="Pendentes" key={constantes.tabs.pendentes}>
              {this.renderFilters()}
            </TabPane>

            <TabPane tab="Respondidas" key={constantes.tabs.respondidas}>
              {this.renderFilters()}
            </TabPane>

          </Tabs>
          
          <TabelaDemandas listaDemandas={this.state.demandasDisplay} columns={this.columns} /> 
        </span>
      );
    }
  }

}

const mapStateToProperties = state => {
  return { baseDemandas: state.demandas.baseDemandas};
}

export default connect(mapStateToProperties,{fetchDemandasResponder,arquivarDemanda, reativarDemanda})(MinhasDemandas);
