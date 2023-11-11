import React, {Component} from 'react';
import TabelaDemandas from 'pages/demandas/TabelaDemandas';
import styled from 'styled-components';
import { CopyOutlined, EditOutlined, EyeOutlined, FolderOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Switch,
  Divider,
  Tooltip,
  Popconfirm,
  Row,
  Col,
  Input,
  message,
  Tabs,
  InputNumber,
} from 'antd';
import PageLoading from 'components/pageloading/PageLoading';
import { fetchDemandasAdm, arquivarDemanda,reativarDemanda, duplicarDemanda } from 'services/actions/demandas';
import { verifyPermission } from 'utils/Commons';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import AlfaSort from 'utils/AlfaSort';
import DateBrSort from 'utils/DateBrSort';

const constantes = {
  tabs: {
    ativas: "ativas",
    arquivadas: "arquivadas"
  },
  codPublicadas: 2,
  codArquivadas: 3
}


const Mb = styled.div` 
margin-bottom: 20px;    
`;

const StyledPopConfirm = styled.div`
  margin-left: -22px;
  text-align: center;
`

const Search = Input.Search;
const { TabPane } = Tabs;

class AdmDemandas extends Component {
  static nomeFerramenta = "Demandas";

  constructor(props){
    super(props);
    //Initial State config
    this.state = { 
      demandasDisplay: [],
      loading: true,
      activeTab: constantes.tabs.ativas,
      mostrarTodas: false,
      qtdReplicas: 1,
      filtros: {
        expiradas: { mostrarExpiradas: false, funcao: this.filtrarExpiradas  },
        texto: { termo: "", funcao: this.filtrarTexto },
      }
    };
  }
  
  componentDidMount = () => {
    this.fetchDemandas();
  }

  columns = [
    {
    dataIndex: 'titulo',
    title: 'Título',
    width: '50%',
    sorter: (a, b) => AlfaSort(a.titulo, b.titulo)
  }, {
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
    width: '10%',
    title: 'Status',
    dataIndex: 'status',
    sorter: (a, b) => AlfaSort(a.status, b.status)
  }, {
    title: 'Ações',
    width: '10%',
    align: 'center',
    render: (text, record) => {
      
      return (
        <span>
          <Tooltip title="Editar">
            <Link to={"/demandas/editar-demanda/" + record.id}>
              <EditOutlined className="link-color" />
            </Link>
          </Tooltip>
          <Divider type="vertical" />
          <Tooltip placement="bottom" title="Duplicar demanda">
              <Popconfirm icon={null} title={this.renderMsgDuplicar()} onConfirm={() => this.duplicarDemanda(record.id)}>
                  <CopyOutlined className="link-color" />
              </Popconfirm>
          </Tooltip>

          <Divider type="vertical" />
    
          <Tooltip title="Acompanhar">
          <Link to={"/demandas/acompanhar-demanda/" + record.id}>            
              <EyeOutlined className="link-color" />
            </Link>
          </Tooltip>
    
          { //Caso a demanda esteja encerrada, não exibe o botão para inativar
            record.status !== constantes.codArquivadas ? 
            (
              <span>  
                <Divider type="vertical" />
                  <Tooltip placement="bottom" title="Arquivar demanda">
                    <Popconfirm title="Deseja arquivar a demanda?" onConfirm={() => this.arquivarDemanda(record.id)}>
                        <FolderOutlined className="link-color" />
                    </Popconfirm>
                </Tooltip>
              </span>  
    
            ) : 
            (
            <span>  
              <Divider type="vertical" />
                <Tooltip placement="bottom" title="Reativar demanda">
                <Popconfirm title="Deseja reativar a demanda?" onConfirm={() => this.reativarDemanda(record.id)}>
                    <UploadOutlined className="link-color" />
                </Popconfirm>
              </Tooltip>
            </span>  )}
    
        </span>
      );
    },
  }];
  

  fetchDemandas = () => {
    
    this.setState({loading:true}, () =>{
      this.props.fetchDemandasAdm({
        typeFetch: this.state.activeTab, 
        mostrarTodas: this.state.mostrarTodas,
        responseHandler : {
          successCallback: this.onFetchedData,
          errorCallback: this.onFetchError
        }
      });
    })
  }


//************ Response Handler ************

  onFetchedData = () => {
    if(this.state.activeTab === constantes.tabs.ativas){
      this.filtrarDemandasAtivas();
    }else{
      const baseFormmated = this.props.baseDemandas.map(elem => {
        return {
          ...elem, 
          key: elem.id,
          dataCriacao: moment(elem.dataCriacao).format("DD/MM/YYYY HH:mm"),
          dataExpiracao: moment(elem.dataExpiracao).format("DD/MM/YYYY HH:mm")
        }
      });

      this.setState({loading: false, demandasDisplay: baseFormmated});
    }
    
  }

  onFetchError = (error) => {
    message.error(error);
    //message.error('Erro de rede. Favor verifique a conexão. Caso o erro persista, favor contatar o  administrador do sistema!');
    this.setState({loading: false});

  }

  onArquivada = () => {
    message.success("Demanda arquivada com sucesso.");
  }

  onArquivadaErro = () => {
    message.error('Erro ao arquivar demanda. Tente novamente. Caso o erro persisnta, contate o administrador do sistema.');
  }

  //************ Filtros ************

  filtrarExpiradas = (arrayDemandas) => {
    
    let filtrado = arrayDemandas;
    if(!this.state.filtros.expiradas.mostrarExpiradas){
      filtrado = _.filter(arrayDemandas, (demanda) => {
        return moment(demanda.dataExpiracao, "DD/MM/YYYY hh:mm").isAfter(moment());
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

    const baseFormmated = this.props.baseDemandas.map(elem => {
      return {
        ...elem, 
        key: elem.id,
        dataCriacao: moment(elem.dataCriacao).format("DD/MM/YYYY HH:mm"),
        dataExpiracao: moment(elem.dataExpiracao).format("DD/MM/YYYY HH:mm")
      }
    });

    let filtradas = baseFormmated;    
    _.forOwn(this.state.filtros, (dados,nomeFiltro) => {
      filtradas = dados.funcao(filtradas);
    });
    
    this.setState({loading: false, demandasDisplay: filtradas});    
  }

  onSearchDemandas = (termo) => {
    this.props.filtrarDemandasAtivas({type: this.props.type, query: termo});
  }

  arquivarDemanda = (idDemanda) => {
      
      this.props.arquivarDemanda({
        idDemanda, 
        responseHandler : {
          successCallback: this.fetchDemandas,
          errorCallback: this.onArquivadaErro
        }
      });

  }

  duplicarDemanda = (idDemanda) => {
    
    this.props.duplicarDemanda({
      idDemanda,
      qtd: this.state.qtdReplicas, 
      responseHandler : {
        successCallback: () => {
          message.success('Demanda duplicada com sucesso.')
          this.fetchDemandas();
        },
          
        errorCallback: () => message.error('Erro ao duplicar a demanda.')
      }
    });

}

  reativarDemanda = (idDemanda) => {

    
    this.props.reativarDemanda({
      idDemanda, 
      responseHandler : {
        successCallback: this.fetchDemandas,
        errorCallback: this.onArquivadaErro
      }
    });
    
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
                  <Col  xs={24} sm={24} md={24} lg={24} xl={24}>            
                    <Mb>
                      <span style={{marginRight: 15}}>Mostrar Expiradas:</span>
                      <Switch 
                        checkedChildren="Sim" 
                        unCheckedChildren="Não" 
                        defaultChecked={false}
                        checked={this.state.filtros.expiradas.mostrarExpiradas}
                        onClick = {this.onChangeFiltroExpirada}
                      />
                    </Mb>
                  </Col>
              </Row>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
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

  renderMsgDuplicar = () => {
    return (
      <StyledPopConfirm>
        <p>Qtd. de réplicas</p>
        <InputNumber onChange={ (qtd) =>  this.setState({qtdReplicas: qtd}) } size="small" min={1} max={100} defaultValue={1}/>
      </StyledPopConfirm>
    )
  }


  onMostrarTodasChange = (checked) => {
    this.setState({mostrarTodas: checked}, () => {
      this.fetchDemandas();
    })
  }

  renderExtraContent = () => {
    const isAdmin = verifyPermission({
      ferramenta: AdmDemandas.nomeFerramenta, 
      permissoesRequeridas: ['ADMIN'], 
      authState: this.props.authState      
    });

    if (isAdmin) {
      return (
        <div>
          <span style={{marginRight: 15}}>Mostrar Todas:</span>
          <Switch 
            checkedChildren="Não" 
            unCheckedChildren="Sim" 
            defaultChecked
            checked={this.state.mostrarTodas}
            onClick = {this.onMostrarTodasChange}
          />
        </div>
      )
    }
  }

  render(){  
    
    if(this.state.loading){
      return( <PageLoading /> );  
    }else{
      
      return ( 
        <span>
          <Tabs 
            activeKey={this.state.activeTab} 
            onChange={this.onChangeTab} 
            type="card"
            tabBarExtraContent={this.renderExtraContent()}
          >
            <TabPane tab="Ativas" key={constantes.tabs.ativas}>
              {this.renderFilters()}
            </TabPane>

            <TabPane tab="Arquivadas" key={constantes.tabs.arquivadas}>
            </TabPane>

          </Tabs>
          
          <TabelaDemandas listaDemandas={this.state.demandasDisplay}  columns={this.columns} /> 
        </span>
      );
    }
  }

}

const mapStateToProperties = state => {
  return { 
    baseDemandas: state.demandas.baseDemandas,
    authState: state.app.authState
  };
}

export default connect(mapStateToProperties,{
  fetchDemandasAdm,
  arquivarDemanda, 
  reativarDemanda,
  duplicarDemanda
})(AdmDemandas);

