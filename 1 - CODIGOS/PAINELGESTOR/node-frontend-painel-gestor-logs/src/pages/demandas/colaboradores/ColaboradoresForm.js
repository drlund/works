import React, { Component } from 'react'
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Table,
  Divider,
  Skeleton,
  Tooltip,
  Popconfirm,
  Spin,
  Button,
  Row,
  Col,
  Avatar,
  message,
} from 'antd';
import MaskedInput from 'react-text-mask';
import AlfaSort from 'utils/AlfaSort';
import { updateFormData, fetchColaborador } from 'services/actions/demandas';
import { connect } from 'react-redux';
import { LogIn } from 'components/authentication/Authentication';
import StyledCard from 'components/styledcard/StyledCard';
import {DefaultGutter} from 'utils/Commons';
import _ from 'lodash';


class ColaboradoresForm extends Component {  

  static propName = 'colaboradores';

  constructor(props) {

    super(props);
    this.state = { 
      matriculaIncluindo : "",
      loading: false        
    };

    if (_.isEmpty(this.props.colaboradores)){
      
      let initialState = [];
      this.props.updateFormData(ColaboradoresForm.propName, initialState);
    }
    
  }

  componentDidMount = () => {

    if(_.isEmpty(this.props.colaboradores)){
      this.setState({loading: true}, () => {
        // Caso não esteja logado, fica aguardando o login e depois adiciona o colaborador
        if(!this.props.authState.isLoggedIn){
          LogIn();
          var checaLogado = setInterval(() => {
            if(this.props.authState.isLoggedIn){
              clearInterval(checaLogado);
              this.onAddColaborador(this.props.authState.sessionData.chave);
            }
          }, 500);      
        }else{
          this.onAddColaborador(this.props.authState.sessionData.chave);
        }
      });
    }

  }

  /**
   * Metodo auxiliar que verifica se um determinado colaborador ja esta
   * incluido na lista da demanda atual.
   */
  isColaboradorInList = (matriculaColaborador) => {
    return _.find(this.props.colaboradores, (colaborador) => { 
      return colaborador.key === matriculaColaborador 
    });
  }

  onAddColaborador = (matriculaColaborador) => {    
    /*  Verifica se o colaborador já existe na lista */
    if (!this.isColaboradorInList(matriculaColaborador)){

      this.setState({loading: true}, () => {
        this.props.fetchColaborador(
          matriculaColaborador,           
          { successCallback: this.onFetchSuccess,
            errorCallback: this.onFetchError
          },
        );
      });
    } else {
      message.error('Este funcionário já foi adicionado');
    }
  }

  onFetchSuccess = () => {
    this.setState({ loading: false, matriculaIncluindo: ""});
  }

  onFetchError = () => {
    message.error('Matrícula não encontrada');      
    this.setState({loading: false, matriculaIncluindo: ""})
  }

  onRemoveColaborador = (matriculaColaborador) => {
    
    let listaFiltrada = 
      _.filter(this.props.colaboradores, (element) => {  
          return element.key !== matriculaColaborador 
        }
      );

    this.props.updateFormData(ColaboradoresForm.propName, listaFiltrada);
  };

  render() {

    const columns = [
      {
        title: 'Funcionario',
        key: 'matricula',
        width: '50%',
        sorter: (a, b) => AlfaSort(a.nome, b.nome),
        render: (record,text) => { 
          
          return (<span>   <Avatar src={record.img} /> <Divider type="vertical" /><a target="_blank" rel="noopener noreferrer" href={"https://humanograma.intranet.bb.com.br/" + record.matricula}>{record.matricula} - {record.nome}</a> </span>)   
        },
      }, {
        width: '15%',
        title: 'Cargo',
        dataIndex: 'cargo',
        sorter: (a, b) => AlfaSort(a.cargo, b.cargo),
        key: 'cargo',
      },    
      {
        width: '15%',
        title: 'Prefixo',
        sorter: (a, b) => AlfaSort(a.prefixo, b.prefixo),
        render: (record,text) => {
          return (<span>{record.prefixo} - {record.nome_prefixo}</span>)   
        }
      }, {
        key: 'key',
        title: 'Ações',
        width: '10%',
        align: 'center',
        render: (text,record) => {
          
          if(!(record.key === this.props.authState.sessionData.chave)  ){

            return (
              <span>     
                <Tooltip title="Remover colaborador" placement="bottom">
                  <Popconfirm title="Deseja excluir o colaborador?" onConfirm={() =>this.onRemoveColaborador(record.key)}>
                      <DeleteOutlined className="link-color" />
                  </Popconfirm>
                </Tooltip>
              </span>
            );
          }
        },
      }
    ];
  
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;;
   
    return (
      <Spin indicator={antIcon} spinning={this.state.loading}>
        <StyledCard title="Incluir colaboradores na demanda">
          <Form layout="horizontal">
            <Row gutter={DefaultGutter}>
              <Col span={3}>
                <MaskedInput
                    className="ant-input"
                    value={this.state.matriculaIncluindo}
                    mask={['F',/\d/, /\d/, /\d/,/\d/, /\d/, /\d/, /\d/]}
                    placeholder="F0000000"
                    onChange={event => this.setState({ matriculaIncluindo: event.target.value })}
                  />          
              </Col>
              <Col span={1}>        
                <Button 
                  onClick={() => this.onAddColaborador(this.state.matriculaIncluindo) }
                  type="primary" 
                  shape="circle" 
                  icon={<PlusOutlined />}></Button>
              </Col>                
            </Row>
          </Form>

          <Divider />

          {!_.isEmpty(this.props.colaboradores) && 
          <Row>
            <Col span={24}>
              <Skeleton loading={this.state.searching} active title={false} avatar paragraph={{ rows: 6 }}>
                <Table 
                  columns={columns} 
                  dataSource={this.props.colaboradores}
                  size="small"
                  pagination={{showSizeChanger: true}}
                  showHeader={this.props.colaboradores.length ? true : false}
                />
              </Skeleton>
            </Col>
          </Row>
          }

        </StyledCard>

      </Spin>
    );
  }

}


const mapStateToProps = state => {

  return  { authState : { ...state.app.authState },
            colaboradores: state.demandas.demanda_atual.colaboradores ? state.demandas.demanda_atual.colaboradores : [],
            errorsList: state.demandas.demanda_erros.colaboradores
          }
}

export default connect(mapStateToProps,{updateFormData, fetchColaborador})(ColaboradoresForm);