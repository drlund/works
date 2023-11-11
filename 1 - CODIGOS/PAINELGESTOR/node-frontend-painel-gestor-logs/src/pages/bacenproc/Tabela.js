import React from 'react';
import StyledCard from 'components/styledcard/StyledCard';
import { FileExcelOutlined } from '@ant-design/icons';
import { message, Modal, Button, Tooltip } from 'antd';
import AlfaSort from 'utils/AlfaSort';
import SearchTable from 'components/searchtable/SearchTable';
import { getTabelas, downloadDados, getDadosModal } from 'services/ducks/BacenProc.ducks';
import _ from 'lodash';
import { connect } from 'react-redux';


class Tabela extends React.Component {
  state = {
    pageLoading: true,
    loadingDados: false,
    visibleModal: false,
    loadingDadosModal: false,
    mesRef: '',
    prefixo: ''
  };

  componentDidUpdate(prevProps) {
    if (this.props.ano !== prevProps.ano || this.props.periodo !== prevProps.periodo || this.props.visao !== prevProps.visao) {
      this.setState({pageLoading: true}, 
        () => {
          this.props.getTabelas({
            ano: this.props.ano,
            periodo: this.props.periodo,
            visao: this.props.visao,
            responseHandler: {
              successCallback: () => this.setState({ pageLoading: false }),
              errorCallback: (what) => message.error(what || "Falha ao obter os dados das tabelas.")
            }
          })
        }
      );
    }
  }

  renderTotalGeral = () => {
    if (this.props.tabelas.length) {
      return _.reduce(_.map(this.props.tabelas, 'total'), function(sum, value) {
        return sum = sum + value;
      });
    }

    return 0;
  };

  renderColumns = (tipoTabela) => {
    let arrayColumns = [];
    let arrayIndex = [];
    let dados = (tipoTabela === 'dadosModal') ? this.props.dadosModal : this.props.tabelas;

    if (dados.length) {
      arrayIndex = Object.keys(dados[0]);
      arrayIndex.forEach(item => {
        let itemTitle = (item === 'dependencia') ? 'Dependência' : _.capitalize(item);
        itemTitle = <span style={{fontWeight: 'bold'}}>{itemTitle}</span>;

        let row = {
          title: itemTitle,
          dataIndex: item,
          sorter: (a, b) => AlfaSort(a[item], b[item], false),
          render: (text) => {
            if (tipoTabela === 'dadosModal') {
              if (item === 'ocorrencia') {
                return (<a 
                          href={`https://plataforma.atendimento.bb.com.br:49286/estatico/bbr/app/spas/manifestacao/consultar/consultarManifestacao.app.html?p_ticket_cnl=005500141O0ThJCzWhM4BSBN00000000#/consultar-manifestacao/${text}/0`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >{text}</a>
                );
              } else {
                return text;
              }
            }

            if (_.some(['prefixo', 'dependencia', 'motivo'], (key) => {return key === item})) {
              return text;
            } else if (item === 'total') {
              return <span onClick={(event) => this.showModal(event)} column={item} style={{cursor: 'pointer'}}>{text}</span>;
            } else {
              return <span onClick={(event) => this.showModal(event)} column={item} style={{color: '#1E90FF', cursor: 'pointer'}}>{text}</span>;
            }
          }
        };

        arrayColumns.push(row);
      });
    }

    return arrayColumns;
  };

  downloadDados = () => {
    this.setState({ loadingDados: true }, () => {
      this.props.downloadDados({
        periodo: this.props.periodo,
        ano: this.props.ano,
        visao: this.props.visao,
        mesRef: this.state.mesRef,
        prefixo: this.state.prefixo,
        fileName: `Dados-${this.props.lblVisao}.xlsx`,
        responseHandler: {
          successCallback: () => this.setState({ loadingDados: false }),
          errorCallback: (what) => message.error(what || "Falha ao exportar os dados.")
        }
      });  
    });
  }

  showModal = (event) => {
    let prefixo = event.target.parentElement.parentElement.children[0].textContent, // prefixo da linha do valor clicado 
        mesRef = event.target.attributes.column.textContent; // Coluna da tabela do valor clicado;

    this.setState({ visibleModal: true, loadingDadosModal: true, mesRef, prefixo }, () => {
      this.props.getDadosModal({
        periodo: this.props.periodo,
        ano: this.props.ano,
        visao: this.props.visao,
        mesRef,
        prefixo,
        responseHandler: {
          successCallback: () => this.setState({ loadingDadosModal: false }),
          errorCallback: (what) => message.error(what || "Falha ao obter dados da Modal.")
        }
      });
    });
  };

  hideModal = () => {
    this.setState({ visibleModal: false, prefixo: '', mesRef: '' });
  };

  render() {
    return (
      <StyledCard 
        title={
          <span style={{fontWeight: 'bold'}}>
            {`${this.props.lblVisao} - ${this.props.lblPeriodo} ${this.props.ano}`}
          </span>
        }
        extra={
          <span style={{fontWeight: 'bold'}}>
            {'Total Geral: ' + this.renderTotalGeral().toLocaleString('pt-BR')}
          </span>
        }
      >
        <Tooltip title="Exportar dados">
          <Button
            type="primary" 
            icon={<FileExcelOutlined />} 
            onClick={this.downloadDados}
            style={{marginBottom: "15px", backgroundColor: "#207245", border: "none"}} 
            loading={this.state.loadingDados}
            disabled={this.state.pageLoading}
          >Excel</Button>
        </Tooltip>
        <SearchTable
          columns={this.renderColumns()} 
          dataSource={this.props.tabelas}
          size="small"
          loading={this.state.pageLoading}
        />
        <Modal
          title={<span style={{fontWeight: 'bold'}}>{`Detalhamento (${this.props.lblVisao} - ${_.capitalize(this.state.mesRef)} ${this.props.ano}) - ${this.state.prefixo}`}</span>}
          visible={this.state.visibleModal}
          onCancel={this.hideModal}
          footer={null}
          width='1400px'
        >
          <Tooltip title="Exportar dados">
            <Button
              type="primary" 
              icon={<FileExcelOutlined />} 
              onClick={this.downloadDados}
              style={{marginBottom: "15px", backgroundColor: "#207245", border: "none"}} 
              loading={this.state.loadingDados}
              disabled={this.state.loadingDadosModal}
            >Excel</Button>
          </Tooltip>

          <SearchTable
            columns={this.renderColumns('dadosModal')} 
            dataSource={this.props.dadosModal}
            size="small"
            loading={this.state.loadingDadosModal}
          />
        </Modal>
      </StyledCard>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tabelas: state.bacenProc.tabelas,
    dadosModal: state.bacenProc.dadosModal
  }
}

export default connect(mapStateToProps, { getTabelas, downloadDados, getDadosModal })(Tabela);