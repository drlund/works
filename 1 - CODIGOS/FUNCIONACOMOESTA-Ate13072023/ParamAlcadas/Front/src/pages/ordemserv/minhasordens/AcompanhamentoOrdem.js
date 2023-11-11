import React, { Component } from 'react'
import { EyeOutlined } from '@ant-design/icons';
import { Descriptions, Row, Col, Card, Statistic, Button, Divider, Modal } from 'antd';
import SearchTable from 'components/searchtable/SearchTable';
import { MATRIZ_COR_ESTADOS } from 'pages/ordemserv/Types';
import AlfaSort from "utils/AlfaSort";
import DateBrSort from "utils/DateBrSort";
import uuid from 'uuid/v4';
import _ from 'lodash';

const statusAssinatura = {
  "assinou": "Assinaram",
  "naoAssinou": "Pendentes",
  "naoPassivelAssinatura": "Não Passível Assinatura"
}

class AcompanhamentoOrdem extends Component {

  state = {
    modalKey: uuid(),
    modalVisible: false,
    dadosParticSelecionados: []
  }

  renderDadosBasicos = () => {
    let { dadosOrdem } = this.props.dadosAcompanhamento;
    let { tipo_validade, data_validade, id_estado, nomeEstado } = dadosOrdem;
    let validade = tipo_validade === "Determinada" ? data_validade : tipo_validade;
    let corEstado = MATRIZ_COR_ESTADOS[id_estado];
    nomeEstado = nomeEstado.toUpperCase();

    return (
      <Descriptions title="Dados da Ordem" bordered size="small" style={{marginBottom: 20}}>
        <Descriptions.Item label="Número"><span style={{fontWeight: "bold"}}>{dadosOrdem.numero}</span></Descriptions.Item>
        <Descriptions.Item label="Validade" span={2}>{validade}</Descriptions.Item>
        <Descriptions.Item label="Título" span={3}>{dadosOrdem.titulo}</Descriptions.Item>
        <Descriptions.Item label="Estado" span={3}><span style={{color: corEstado, fontWeight: 'bold'}}>{nomeEstado}</span></Descriptions.Item>
      </Descriptions>
    )
  }

  renderDesignantes = () => {
    let { designantes } = this.props.dadosAcompanhamento;
    return this.renderCardsData("designantes", designantes);
  }

  renderDesignados = () => {
    let { designados } = this.props.dadosAcompanhamento;
    return this.renderCardsData("designados", designados);
  }

  renderCardsData = (tipoParticipante, dadosEstatistica) => {
    let total = dadosEstatistica.length;
    let assinaram = dadosEstatistica.filter(elem => elem.statusAssinatura === "assinou").length;
    let naoAssinaram = dadosEstatistica.filter(elem => elem.statusAssinatura === "naoAssinou").length;
    let naoPassivelAssinatura = dadosEstatistica.filter(elem => elem.statusAssinatura === "naoPassivelAssinatura").length;
    let backgroundColor = naoAssinaram ? '#e63d49' : '#85ce4b';
    
    if (total === 0) {
      backgroundColor = '#ECECEC';
    }

    return (
      <div style={{marginBottom: 20}}>
        <Descriptions title={_.capitalize(tipoParticipante)} bordered size="small" column={4} layout="vertical" />
        <div style={{ background: backgroundColor, padding: '20px' }}>
          <Row>
            <Col span={6}>
              <Card style={{textAlign: 'center'}}>
                <Statistic title="Total" value={total} suffix={
                  <div style={{ position: "absolute", marginTop: -20}}>
                    {
                      total > 0 &&
                      <React.Fragment>
                        <Divider type="vertical" />
                        <Button icon={<EyeOutlined />} type="primary" size="small" title="Visualizar" onClick={() => this.onVisualizarItem(tipoParticipante, "total")} />
                      </React.Fragment>
                    }
                  </div>
                }/>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={{textAlign: 'center'}}>
                <Statistic title="Assinaram" value={assinaram} suffix={
                  <div style={{ position: "absolute", marginTop: -20}}>
                    {
                      assinaram > 0 &&
                      <React.Fragment>
                        <Divider type="vertical" />
                        <Button icon={<EyeOutlined />} type="primary" size="small" title="Visualizar" onClick={() => this.onVisualizarItem(tipoParticipante, "assinou")} />
                      </React.Fragment>
                    }
                  </div>
                }/>
              </Card>
            </Col>
            <Col span={6}>
              <Card style={{textAlign: 'center'}}>
                <Statistic title="Pendentes" value={naoAssinaram} suffix={
                  <div style={{ position: "absolute", marginTop: -20}}>
                    {
                      naoAssinaram > 0 &&
                      <React.Fragment>
                        <Divider type="vertical" />
                        <Button icon={<EyeOutlined />} type="primary" size="small" title="Visualizar" onClick={() => this.onVisualizarItem(tipoParticipante, "naoAssinou")} />
                      </React.Fragment>
                    }
                  </div>
                }/>
              </Card>
              
            </Col>
            <Col span={6}>
              <Card style={{textAlign: 'center'}}>
                <Statistic title="Não Passível Assinatura" value={naoPassivelAssinatura} suffix={
                  <div style={{ position: "absolute", marginTop: -20}}>
                    {
                      naoPassivelAssinatura > 0 &&
                      <React.Fragment>
                        <Divider type="vertical" />
                        <Button icon={<EyeOutlined />} type="primary" size="small" title="Visualizar" onClick={() => this.onVisualizarItem(tipoParticipante, "naoPassivelAssinatura")} />
                      </React.Fragment>
                    }
                  </div>
                }/>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    );
  }

  onVisualizarItem = (tipoParticipante, filtro) => {
    let dadosParticSelecionados = [...this.props.dadosAcompanhamento[tipoParticipante]];
    let tituloModal = _.capitalize(tipoParticipante) + " - Visão (Total)";

    if (filtro !== "total") {
      tituloModal = _.capitalize(tipoParticipante) + " - Visão (" + statusAssinatura[filtro] + ")";
      dadosParticSelecionados = dadosParticSelecionados.filter(elem => elem.statusAssinatura === filtro);
    }

    this.setState({ modalKey: uuid(), modalVisible: true, dadosParticSelecionados, tituloModal })
  }

  renderModalParticipantes = () => {
    return (
      <Modal 
        title={this.state.tituloModal}
        key={this.state.modalKey}
        visible={this.state.modalVisible}
        width="60%"
        centered
        bodyStyle={{paddingTop: 10, minHeight: 500}}
        destroyOnClose
        maskClosable={false}
        footer={<Button type="danger" onClick={() => this.setState({modalVisible: false})}>Fechar</Button>}
        onCancel={ () => this.setState({modalVisible: false}) }
      >
        {this.renderTableParticipantes()}
      </Modal>
    )
  }

  renderTableParticipantes = () => {
    const columns = [
      {
        title: 'Prefixo',
        dataIndex: "prefixo",
        sorter: (a, b) =>AlfaSort(a.prefixo, b.prefixo)
      },
      {
        title: 'Dependência',
        dataIndex: "dependencia",
        sorter: (a, b) =>AlfaSort(a.dependencia, b.dependencia)
      },
      {
        title: 'Matrícula',
        dataIndex: "matricula",
        sorter: (a, b) =>AlfaSort(a.matricula, b.matricula)
      },
      {
        title: 'Nome',
        dataIndex: "nome",
        sorter: (a, b) =>AlfaSort(a.nome, b.nome)
      },
      {
        title: 'Data Assinatura',
        dataIndex: "dataAssinatura",
        sorter: (a, b) => DateBrSort(a.dataAssinatura, b.dataAssinatura)
      }
    ];

    const dadosTabela = this.state.dadosParticSelecionados.map((elem) =>{
      return {
        key: elem.id,
        ...elem
      }
    })

    return  (
      <div>
        <SearchTable
          columns = {columns}
          dataSource = {dadosTabela}
          size="small"
          ignoreAutoKey
        />
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderDadosBasicos()}
        <Divider />
        {this.renderDesignantes()}
        {this.renderDesignados()}
        {this.renderModalParticipantes()}
      </div>
    )
  }
}

export default AcompanhamentoOrdem;
