import React, { Component } from 'react';
import { getBulkSelectGedip, setBulkSelectGedip } from 'services/ducks/CtrlDisciplinar/Gedip.ducks';
import { Row, Col, Button, message, Divider, Card, Result, Typography, Table, Input } from 'antd';
import PageLoading from '../../../components/pageloading/PageLoading';
import { DefaultGutter } from 'utils/Commons';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/pt-br';
import AlfaSort from 'utils/AlfaSort';

const { Text } = Typography;

const opcoes = [
  {
    acao: 'email',
    titulo: 'Reenviar e-mail de cobrança'
  },
  {
    acao: 'reset',
    titulo: 'Resetar status de envio de documentos'
  },
  {
    acao: 'cancelar',
    titulo: 'Cancelar Demanda Gedip'
  }
]

export class SelectGedips extends Component {
  state = {
    sending: false,
    gedips: [],
    gedipsFiltrados: [],
    opcao: -1,
    completo: false,
    fase: 1,
    chavesSelect: [],
    linhasSelect: [],
    results: [],
  }

  /**
   * ordem:
   * abrir a modal, informando que se pode enviar email para vários, resetar vários e cancelar vários
   * ao selecionar uma das opções, carregar os que podem receber a referida alteração.
   * inicializar o componente, recebendo todos os gedips passíveis de alteração
   */

  processAcao = ({ acao }) => {
    this.setState({ loading: true }, () => {
      getBulkSelectGedip(acao)
        .then((gedips) => this.setState({ gedips, gedipsFiltrados: gedips, fase: 2, opcao: acao }))
        .catch((error) => message.error(error))
        .then(() => this.setState({ loading: false }))

    })

  }

  restart = () => {
    this.setState({
      loading: true,
      sending: false,
      gedips: [],
      gedipsFiltrados: [],
      opcao: -1,
      completo: false,
      fase: 1,
      chavesSelect: [],
      linhasSelect: [],
      results: [],
    }, () => {
      this.setState({ loading: false })
    })
  }

  renderTelaInicial = () => {
    if (this.state.opcao >= 0) return null;

    return (
      opcoes.map(opt => {
        return (
          <React.Fragment key={opt.acao}>
            <Row gutter={DefaultGutter}>
              <Col span={7}></Col>
              <Col span={10}>
                <Button block type="primary" onClick={() => this.processAcao({ acao: opt })}>{opt.titulo}</Button>
              </Col>
              <Col span={7}></Col>
            </Row>
            <Divider />
          </React.Fragment>
        )
      })
    )
  }

  renderTabela = () => {
    if (_.isNil(this.state.gedips)) return null;

    const colunas = [
      {
        dataIndex: 'nm_gedip',
        title: 'GEDIP',
        width: '10%',
        sorter: (a, b) => parseInt(a.nm_gedip) - parseInt(b.nm_gedip),
        render: (text, record) => {
          return (record.nm_gedip)
        },
      },
      {
        dataIndex: 'dt_julgamento_gedip',
        title: 'Data da Decisão',
        width: '20%',
        sorter: (a, b) => parseInt(moment(a.dt_julgamento_gedip).format("YYYYMMDD")) - parseInt(moment(b.dt_julgamento_gedip).format("YYYYMMDD")),
        render: (text, record) => {
          return (moment(record.dt_julgamento_gedip).format("DD/MM/YYYY"))
        },
      },
      {
        dataIndex: 'nm_medida',
        title: 'Decisão',
        width: '20%',
        sorter: (a, b) => AlfaSort(a.medida.nm_medida, b.medida.nm_medida),
        render: (text, record) => {
          return (record.medida.nm_medida)
        },
      },
      {
        dataIndex: 'funcionario_gedip',
        title: 'Funcionário',
        width: '45%',
        sorter: (a, b) => parseInt(a.funcionario_gedip.replace(/[^0-9\\.]+/g, '')) - parseInt(b.funcionario_gedip.replace(/[^0-9\\.]+/g, '')),
        render: (text, record) => {
          return <Text code>{`${record.funcionario_gedip} - ${record.func_gedip.nome.trim()}`.slice(0, 42)}</Text>
        },
      }
    ];

    const rowSelection = {
      type: 'checkbox',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ chavesSelect: selectedRowKeys, linhasSelect: selectedRows });
      },
      selectedRowKeys: this.state.chavesSelect
    };

    return (
      <Table
        rowSelection={rowSelection}
        columns={colunas}
        dataSource={this.state.gedipsFiltrados}
      />
    )
  }

  search = (text) => {
    if (_.isEmpty(this.state.gedips) || _.isNil(this.state.gedips)) return;

    if (_.isEmpty(text.target.value) || _.isNil(text.target.value)) {
      this.setState({ gedipsFiltrados: this.state.gedips }, () => true);
    }

    const gedips = this.state.gedips.filter(gedip => {
      return [
        gedip.nm_gedip,
        moment(gedip.dt_julgamento_gedip).format("DD/MM/YYYY"),
        gedip.medida.nm_medida,
        [gedip.funcionario_gedip.trim(), gedip.func_gedip.nome.trim()].join(' - ')
      ].some(ged => ged.toLowerCase().indexOf(text.target.value) !== -1);
    });

    this.setState({ gedipsFiltrados: gedips }, () => true);
  }


  CaixaPesquisa = () => {
    return (
      <Input defaultValue="" onChange={this.search} />
    )
  }

  renderConfirm = () => {
    if (!this.state.completo) return null;

    let gedips;
    if (this.state.results.gedips.length > 1) {
      const ultimo = this.state.results.gedips.pop();
      gedips = this.state.results.gedips.toString().replace(/,/g, ', ').concat(` e ${ultimo}`);
    } else {
      gedips = this.state.results.gedips.toString();
    }

    return (
      <Result
        status="success"
        title={
          <>
            <Text>Alterações nos GEDIPs:</Text><br />
            <Text>{gedips}</Text><br />
            <Text>efetuadas com sucesso!</Text>
          </>
        }
        extra={[
          <Button type="primary" onClick={this.restart} key="novo">
            Nova Alteração
          </Button>
        ]}
      />
    )
  }

  setNovoEstado = () => {
    this.setState({ loading: true }, () => true);

    const gedips = this.state.linhasSelect.map(e => e.id_gedip);

    setBulkSelectGedip({ gedips, acao: this.state.opcao.acao })
      .then((results) => this.setState({ fase: 3, results, completo: true }))
      .catch((error) => message.error(error))
      .then(() => this.setState({ loading: false }))
  }

  render() {
    if (this.state.sending || this.state.loading) {
      return <PageLoading />;
    }

    return (
      <Card
        title={this.state.fase !== 1 && <Text strong>{this.state.opcao.titulo}</Text>}
        extra={this.state.fase === 2 && this.CaixaPesquisa()}
      >
        {
          this.state.fase === 1 &&
          this.renderTelaInicial()
        }
        {
          this.state.fase === 2 &&
          this.renderTabela()
        }
        {
          this.state.fase === 3 &&
          this.renderConfirm()
        }
        {
          this.state.fase === 2 &&
          <Row>
            <Col span={21}>
              <Button danger onClick={this.restart}>Reiniciar</Button>
            </Col>
            {
              !_.isEmpty(this.state.chavesSelect) &&
              <Col span={3}>
                <Button type="primary" onClick={this.setNovoEstado}>Executar Ação</Button>
              </Col>
            }
          </Row>
        }
      </Card>
    );
  }
}

export default SelectGedips;
