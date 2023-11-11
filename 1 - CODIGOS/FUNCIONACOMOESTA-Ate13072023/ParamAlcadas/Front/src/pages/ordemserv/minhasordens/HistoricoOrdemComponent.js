import React, { Component } from 'react'
import { Descriptions, Button } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';
import StyledCard from 'components/styledcard/StyledCard';
import DateBrSort from "utils/DateBrSort";
import { MATRIZ_COR_ESTADOS } from 'pages/ordemserv/Types';
import { FileSearchOutlined } from "@ant-design/icons";
import ModalVisualizarOrdem from './ModalVisualizarOrdem';
import uuid from 'uuid/v4';

class HistoricoOrdemComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      idOrdemViz: null,
      idHistoricoViz: null,
      dataHistoricoViz: null,
      modalVizKey: uuid(),
      modalVizVisible: false
    }
  }

  renderTable = () => {
    let columns = [
      {
        title: 'Data/Hora Evento',
        dataIndex: 'dataEvento',
        width: '10%',
        sorter: (a, b) => DateBrSort(a.dataEvento, b.dataEvento)
      },
      {
        title: 'Matrícula',
        dataIndex: 'matricula',
        width: '10%',
      },
      {
        title: 'Participante',
        dataIndex: 'nomeParticipante',
        width: '25%',
      },
      {
        title: 'Participação',
        dataIndex: 'tipoParticipacao',
        width: '10%',
      },
      {
        title: 'Evento',
        dataIndex: 'descEvento',
        width: '20%',
      },
      {
        title: 'Resp. Modificação',
        dataIndex: 'responsavelAlteracao',
        width: '13%'
      },
      {
        title: "Ações",
        width: 80,
        align: 'center',
        render: (text,record) => {
          return (
            <Button 
              icon={<FileSearchOutlined />} 
              title="Visualizar ordem estoque" 
              onClick={() => this.openOrdemEstoque({ idHistorico: record.id, idOrdem: record.idOrdem, dataHistorico: record.dataEvento })} 
            />
          )
        }
      }
    ]

    const dadosTabela = this.props.dadosHistorico.map((elem) =>{
      return {
        ...elem,
        key: elem.id
      }
    })

    return  (
      <div>
        <Descriptions title="Histórico" bordered size="small" />  
        <SearchTable
          columns = {columns}
          dataSource = {dadosTabela}
          size="small"
          ignoreAutoKey
        />
      </div>
    )
  }

  renderHeader = () => {
    if (this.props.dadosHistorico.length) {
      let {titulo, numero, idEstado, estado, tipoValidade, dataValidade} = this.props.dadosHistorico[0];
      let validade = tipoValidade === "Determinada" ? dataValidade : tipoValidade;
      let corEstado = MATRIZ_COR_ESTADOS[idEstado];
      estado = estado.toUpperCase();

      return (
        <Descriptions title="Dados da Ordem" bordered size="small">
          <Descriptions.Item label="Número da O.S."><span style={{fontWeight: "bold"}}>{numero}</span></Descriptions.Item>
          <Descriptions.Item label="Validade" span={2}>{validade}</Descriptions.Item>
          <Descriptions.Item label="Título" span={3}>{titulo}</Descriptions.Item>
          <Descriptions.Item label="Estado" span={3}><span style={{color: corEstado, fontWeight: 'bold'}}>{estado}</span></Descriptions.Item>
        </Descriptions>
      )
    }
  }

  openOrdemEstoque = ({idHistorico, idOrdem, dataHistorico }) => {
    this.setState({ modalVizVisible: true, modalVizKey: uuid(), idOrdemViz: idOrdem, idHistoricoViz: idHistorico, dataHistoricoViz: dataHistorico});
  }

  render() {
    return (
      <div>
        <StyledCard style={{marginBottom: 10}}>
          {this.renderHeader()}
        </StyledCard>

        <StyledCard style={{minHeight: 495}}>
          {this.renderTable()}
        </StyledCard>

        { this.props.dadosHistorico !== null && 
          <ModalVisualizarOrdem
            idOrdem={this.state.idOrdemViz}
            idHistorico={this.state.idHistoricoViz}
            dataHistoricoOrdem={this.state.dataHistoricoViz}
            visible={this.state.modalVizVisible} 
            modalKey={this.state.modalVizKey} 
            closeModal={ () => this.setState({modalVizVisible: false, idOrdemViz: null})}
          />
        }

      </div>
    )
  }
}

export default HistoricoOrdemComponent;