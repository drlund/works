import React, { Component } from 'react';
import AlfaSort from 'utils/AlfaSort';
import StyledCard from 'components/styledcard/StyledCard';
import SearchTable from 'components/searchtable/SearchTable';
import QuestionHelp from 'components/questionhelp';
import {testeMatricula} from 'utils/Regex';
import { DeleteOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import '@ant-design/compatible/assets/index.css';
import {
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
import { fetchColaborador, removeColaborador } from 'services/ducks/OrdemServ.ducks';
import { LogIn } from 'components/authentication/Authentication';
import { connect } from 'react-redux';
import _ from 'lodash';
import InputFunci from 'components/inputsBB/InputFunci';

class Colaboradores extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      matriculaIncluindo : "",
      loading: false        
    };
  }

  columns = [
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
        return (<span>{record.prefixo} - {record.nomeDependencia}</span>)   
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

  componentDidMount = () => {

    if (_.isEmpty(this.props.colaboradores)) {
      this.setState({loading: true}, () => {
        // Caso não esteja logado, fica aguardando o login e depois adiciona o colaborador
        if (!this.props.authState.isLoggedIn) {
          LogIn();
          var checaLogado = setInterval(() => {
            if(this.props.authState.isLoggedIn){
              clearInterval(checaLogado);
              this.onAddColaborador(this.props.authState.sessionData.chave);
            }
          }, 500);      
        } else {
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
    })
  }

  onAddColaborador = (matriculaColaborador) => {

    if (_.isEmpty(matriculaColaborador)) {
      message.error('Matrícula do colaborador não informada!')
      return
    }

    if (!testeMatricula.test(matriculaColaborador)) {
      message.error('Matrícula do colaborador inválida!')
      return
    }

    /*  Verifica se o colaborador já existe na lista */
    if (!this.isColaboradorInList(matriculaColaborador)){

      this.setState({loading: true}, () => {
        this.props.fetchColaborador(
          matriculaColaborador,           
          { successCallback: this.onFetchSuccess,
            errorCallback: this.onFetchError
          }
        );
      });
    } else {
      message.error('Este funcionário já foi adicionado');
    }
  }

  onFetchSuccess = () => {
    this.setState({ loading: false, matriculaIncluindo: ""});
  }

  onFetchError = (what) => {
    message.error(what);      
    this.setState({loading: false, matriculaIncluindo: ""})
  }

  onRemoveColaborador = (matricula) => {
    this.setState({loading: true}, () => {
      this.props.removeColaborador(
        matricula,           
        { successCallback: () => {
          message.success('Colaborador removido da lista!');
          this.setState({ loading: false });
        },
          errorCallback: (what) => { 
            message.error(what);
            this.setState({ loading: false });
          }
        },
      );
    });
  }

  render() {  
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    const helpTitle = (
      <cite>
        O colaborador poderá editar a ordem enquanto em <strong>Rascunho</strong> e acompanhar as assinaturas e status da ordem em qualquer estado.
        <br />
        Caso necessite, adicione também os designantes para que eles possam revisar a ordem junto com você antes de <strong>Finalizar o Rascunho.</strong>
      </cite>
    )

    return (
      <Spin indicator={antIcon} spinning={this.state.loading}>
        <StyledCard title={<span>Incluir colaboradores na O.S<QuestionHelp title={helpTitle} style={{marginLeft: 20}} contentWidth={550} /></span>}>
          <Row>
            <Col span={12}>
              <InputFunci allowClear={true} onChange={value => this.setState({ matriculaIncluindo: value }) } style={{width: "100%"}} />
            </Col>
            <Col span={1}>        
              <Button 
                style={{ marginLeft: 15 }}
                onClick={() => this.onAddColaborador(this.state.matriculaIncluindo) }
                type="primary" 
                shape="circle" 
                icon={<PlusOutlined />}></Button>
            </Col>                
          </Row>

          <Divider />        

          {!_.isEmpty(this.props.colaboradores) && 
            <Row>
              <Col span={24}>
                <Skeleton loading={this.state.searching} active title={false} avatar paragraph={{ rows: 6 }}>
                  <SearchTable 
                    columns={this.columns} 
                    dataSource={this.props.colaboradores}
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
  return {
    authState : { ...state.app.authState },
    colaboradores: state.ordemserv.ordemEdicao.colaboradores
  }
}

export default connect(mapStateToProps, {
  fetchColaborador,
  removeColaborador
})(Colaboradores);
