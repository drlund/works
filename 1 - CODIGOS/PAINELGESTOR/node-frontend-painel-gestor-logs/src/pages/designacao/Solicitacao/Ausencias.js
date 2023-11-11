import React, { PureComponent } from 'react';
import {
  Form, Row, Col, Select, Button, message, Spin, Card, Typography
} from 'antd';
import uuid from 'uuid/v4';
import _ from 'lodash';
import { connect } from 'react-redux';
import moment from 'moment';

import 'moment/locale/pt-br';

import {
  fetchMatchedCodAusencia,
  getOptsBasicas,
  getDiaUtil,
  setDtsDesig,
  getQtdeDias
} from 'services/ducks/Designacao.ducks';

import Ausencia from 'pages/designacao/Solicitacao/Ausencia';
import PeriodoMovimentacao from 'pages/designacao/Solicitacao/PeriodoMovimentacao';
import Constants from 'pages/designacao/Commons/Constants';

const { Option } = Select;
const { Text } = Typography;

const QUANDO = {
  PROXIMO_DIA: 1,
  DIA_ANTERIOR: 0
};

const { TIPOS } = Constants();

class Ausencias extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      ausencias: [],
      soma: '',
      diasAusencia: 0,
      diasUteisAusencia: 0,
      data: null,
      value: '',
      ausencia: '',
      codAusencia: '',
      key: 0,
      arrAusencias: [],
      iniDesig: '',
      fimDesig: '',
      dataFimDesig: '',
      dt_ini: '',
      dt_fim: '',
      dias_totais: '',
      dias_uteis: ''
    };

    this.onAusenciaSearch = _.debounce(this.onAusenciaSearch, 750);
  }

  componentDidMount() {
    this.getInitialData();
  }

  componentDidUpdate(prevProps) {
    const { prefixo } = this.props;
    if (prevProps.prefixo !== prefixo) {
      this.getInitialData();
    }
  }

  getInitialData = () => {
    const { motivo, tipo } = this.props;
    if (tipo === TIPOS.ADICAO) {
      this.setState({ iniDesig: moment().startOf('day'), fimDesig: moment().startOf('day') });
    } else if (!_.isEmpty(motivo.cods_ausencia)) {
      this.setState({ loading: true }, () => {
        fetchMatchedCodAusencia('', motivo.cods_ausencia)
          .then((data) => {
            this.setState({ data, loading: false });
          })
          .catch((error) => {
            message.error(error);
            this.setState({ loading: false });
          });
      });
    }
  };

  /**
   * ? métodos onChange
   */

  // Evento de click no botão de adicionar Ausência
  clickAddAusencia = () => {
    this.setState({ loading: true }, () => this.novaAusencia());
  };

  acertaArray = async (indice, ausencias) => {
    const { prefixo } = this.props;
    // caso alterou data_inicio, nothing to do => return arr

    // se alterou a dataFim
    if (indice + 1 <= ausencias.length) {
      for (let i = indice; i < ausencias.length; i += 1) {
        const atual = i;
        const anterior = i - 1;

        const setar = (indx, thisDataInicio, thisDataFim) => {
          const thisId = uuid();

          ausencias[indx].dados.id = thisId;

          ausencias[indx].componente = (
            <Ausencia
              key={thisId}
              id={thisId}
              codAusencia={ausencias[indx].dados.codAusencia}
              dataFim={moment(thisDataFim).startOf('day')}
              dataInicio={moment(thisDataInicio).startOf('day')}
              prefixo={prefixo}
              changeDatas={this.changeDatas}
              deletePeriodo={this.deletePeriodo}
            />
          );
        };

        if (atual !== 0 && atual >= indice) {
          const dataFimAnterior = moment(ausencias[anterior].dados.dataFim).startOf('day');
          let dataInicio = moment(ausencias[atual].dados.dataInicio).startOf('day');
          let dataFimAtual = moment(ausencias[atual].dados.dataFim).startOf('day');

          if (dataFimAnterior.isAfter(dataFimAtual, 'day')) {
            dataInicio = dataFimAnterior.add(1, 'days');

            if (dataFimAtual.isBefore(dataInicio, 'day')) {
              dataFimAtual = dataInicio;
            }
            setar(atual, dataInicio.startOf('day'), dataFimAtual.startOf('day'));
          } else {
            const dataDepoisAnterior = dataFimAnterior.startOf('day').add(1, 'day');

            if (!moment(dataDepoisAnterior).isSame(dataInicio, 'day')) {
              dataInicio = moment(dataDepoisAnterior).startOf('day');

              if (dataFimAtual.isBefore(dataInicio, 'day')) {
                dataFimAtual = moment(dataInicio).startOf('day');
              }
              setar(atual, dataInicio.startOf('day'), dataFimAtual.startOf('day'));
            }
          }
        }
      }

      this.calcIniFim(ausencias);
    } else {
      this.calcIniFim(ausencias);
    }
  };

  deletePeriodo = (ausencia) => {
    const { ausencias } = this.state;
    let indx;
    const ausenciasFiltradas = ausencias.filter((el, i) => {
      if (el.dados.id === ausencia.id) (indx = i);
      return el.dados.id !== ausencia.id;
    });

    this.acertaArray(indx, ausenciasFiltradas);
  };

  changeDatas = (ausencia) => {
    const { ausencias } = this.state;

    const dados = {
      dataInicio: ausencia.dataInicio,
      dataFim: ausencia.dataFim,
      periodo: ausencia.periodo,
      qtdeDiasUteis: ausencia.qtdeDiasUteis
    };

    let indice;

    const newArr = ausencias.map((el, indx) => {
      if (el.dados.id === ausencia.id) {
        indice = indx;

        el.dados = {
          ...el.dados,
          ...dados
        };
      }
      return el;
    });

    this.acertaArray(indice, newArr);
  };

  calcQtdeDias = (inicio, fim) => {
    const { prefixo } = this.props;
    getQtdeDias({ inicio, fim, prefixo })
      .then((dias) => {
        this.setState({ dias_totais: dias.qtdeDias, dias_uteis: dias.qtdeDiasUteis });
      })
      .catch(() => message.error('Não foi possível calcular a quantidade de dias entre as datas informadas!'));
  };

  calcIniFim = async (ausencias) => {
    let iniDesig = null;
    let fimDesig = null;
    let dataFimDesig = null;

    const { motivo, prefixo, setDtsDesig: setDatasDesig } = this.props;

    if (!_.isEmpty(ausencias)) {
      const datasAusencia = ausencias.map((elem) => [elem.dados.dataInicio, elem.dados.dataFim]);

      const dataIni = _.head(_.head(datasAusencia));
      const dataFim = _.last(_.last(datasAusencia));

      iniDesig = moment(dataIni).startOf('day').add(motivo.ini_ausencia - 1, 'days');

      if (moment(iniDesig).isBefore(moment())) iniDesig = moment();

      fimDesig = moment(dataFim).startOf('day');

      dataFimDesig = moment(fimDesig).startOf('day').add(1, 'days');

      dataFimDesig = await getDiaUtil({ data: dataFimDesig, prefixo, quando: QUANDO.PROXIMO_DIA });

      iniDesig = moment(iniDesig);

      fimDesig = moment(fimDesig);
    }

    this.calcQtdeDias(iniDesig, fimDesig);

    this.setState({
      ausencias, iniDesig, fimDesig, dataFim: dataFimDesig
    }, () => {
      setDatasDesig(this.state)
        .then(() => {
          message.success('Cálculo de início e fim da Designação realizados com sucesso!');
        })
        .catch(() => message.error('Falha no cálculo do início e fim da Designação'));
    });
  };

  changePerDesig = (estado) => {
    const { onChange } = this.props;
    this.setState({
      dt_ini: estado.inicio,
      dt_fim: estado.fim,
      dias_totais: estado.dias_totais,
      dias_uteis: estado.dias_uteis
    }, () => onChange(this.state));
  };

  /**
   * factory para Ausencia
   */

  novaAusencia = () => {
    const id = uuid();
    const {
      ausencias,
      codAusencia,
      dataFim,
      key,
    } = this.state;
    const { prefixo } = this.props;
    const dados = {
      codAusencia,
      dataFim,
      dataInicio: dataFim,
      id,
      periodo: 1,
      prefixo,
      qtdeDiasUteis: 1,
    };

    const ausencia = {
      dados: {
        ...dados
      },
      componente: <Ausencia
        key={dados.id}
        id={dados.id}
        dataFim={dados.dataFim}
        prefixo={dados.prefixo}
        codAusencia={dados.codAusencia}
        changeDatas={this.changeDatas}
        deletePeriodo={this.deletePeriodo}
      />
    };

    this.setState({
      ausencia,
      ausencias: [...ausencias, ausencia],
      key: key + 1,
      codAusencia: '',
    });
  };

  /**
   * ? métodos que carregam os Options
   */

  onAusenciaSearch = (value) => {
    const { motivo } = this.props;
    if (_.isEmpty(motivo.cods_ausencia)) {
      if (value.length > 2) {
        this.setState({ loading: true }, () => {
          fetchMatchedCodAusencia(value, motivo.cods_ausencia)
            .then((data) => {
              this.setState({ data, loading: false });
            })
            .catch((error) => {
              message.error(error);
              this.setState({ loading: false });
            });
        });
      } else {
        this.setState({ data: null });
      }
    }
  };

  onAusenciaChange = (value) => {
    const { motivo } = this.props;
    this.setState({ codAusencia: value || '' }, () => {
      if (_.isEmpty(motivo.cods_ausencia)) {
        this.setState({ data: null });
      }
    });
  };

  optionsAusencias = () => {
    const { data } = this.state;
    if (data) {
      return data.map((aus) => (
        <Option key={aus.codigo}>{`${aus.codigo} - ${aus.nome.trim()}`}</Option>));
    }
    return null;
  };

  /**
   * ? métodos que renderizam os componentes
   */

  renderSelectAusencias = () => {
    const { motivo, placeholder, style } = this.props;
    const { loading, key } = this.state;

    const optEsp = _.isEmpty(motivo.cods_ausencia) ? {} : { optionFilterProp: 'children' };
    const notFound = _.isEmpty(motivo.cods_ausencia) ? {} : { notFoundContent: loading ? <Spin size="small" /> : null };

    return (
      <Form.Item label="Códigos de Ausência">
        <Select
          key={key}
          showSearch
          labelInValue
          placeholder={placeholder}
          style={style}
          defaultActiveFirstOption={false}
          showArrow={false}
          filterOption
          allowClear
          {...optEsp}
          onSearch={this.onAusenciaSearch}
          onChange={this.onAusenciaChange}
          {...notFound}
          loading={loading}
        >
          {this.optionsAusencias()}
        </Select>
      </Form.Item>
    );
  };

  renderButtonAddAusencias = () => {
    const { codAusencia } = this.state;
    const disabled = codAusencia === '';

    return (
      <Button
        type="primary"
        onClick={this.clickAddAusencia}
        disabled={disabled}
        style={{ marginTop: '21px' }}
      >
        Adicionar Ausência
      </Button>
    );
  };

  renderListaAusencias = () => {
    const { ausencias } = this.state;
    return ausencias.map((el) => el.componente);
  };

  renderTotalDiasAusencias = () => {
    const { dias_totais: diasTotais, dias_uteis: diasUteis } = this.state;

    return (
      <div style={{ marginTop: '22px' }}>
        <Row>
          <Col span={12}>
            <Text>Dias Corridos: </Text>
            <Text strong style={{ fontSize: '1.3rem' }}>{diasTotais}</Text>
          </Col>
          <Col span={10} offset={2}>
            <Text>Dias Úteis: </Text>
            <Text strong style={{ fontSize: '1.3rem' }}>{diasUteis}</Text>
          </Col>
        </Row>
      </div>
    );
  };

  renderPeriodoDesignacao = () => {
    const {
      dias_uteis: diasUteis,
      iniDesig,
      fimDesig,
    } = this.state;
    const { motivo, prefixo, tipo } = this.props;

    if (iniDesig && fimDesig) {
      if (moment(iniDesig).isAfter(fimDesig, 'day')) return null;

      if (
        [1, 2, 4, 10, 11, 12, 13].includes(motivo.id)
        && diasUteis < motivo.min_afast_vac) {
        return null;
      }

      return (
        <>
          <Row style={{ marginTop: '22px', fontSize: '1.1' }}>
            <Col span={5}>
              <Text strong>Período passível de Movimentação:</Text>
            </Col>
            <Col span={5}>
              <Text strong>Inicio: </Text>
              <Text>{moment(iniDesig).format('DD/MM/YYYY')}</Text>
            </Col>
            <Col span={5}>
              <Text strong>Fim: </Text>
              <Text>{moment(fimDesig).format('DD/MM/YYYY')}</Text>
            </Col>
          </Row>
          <Row style={{ marginTop: '30' }}>
            <Col>
              <PeriodoMovimentacao
                key={fimDesig}
                changePeriodo={this.changePerDesig}
                inicio={iniDesig}
                fim={fimDesig}
                prefixo={prefixo}
                tipo={tipo}
              />
            </Col>
          </Row>
        </>
      );
    }

    return null;
  };

  renderPeriodoAdicao = () => {
    const {
      iniDesig,
      fimDesig,
    } = this.state;
    const { tipo, prefixo } = this.props;

    if (iniDesig && fimDesig) {
      if (moment(iniDesig).isAfter(fimDesig, 'day')) return null;

      return (
        <Row>
          <Col>
            <Card>
              <Row>
                <Col>
                  <PeriodoMovimentacao
                    key={fimDesig}
                    changePeriodo={this.changePerDesig}
                    inicio={iniDesig}
                    fim={fimDesig}
                    prefixo={prefixo}
                    tipo={tipo}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      );
    }

    return null;
  };

  render() {
    const { ausencias } = this.state;
    const { tipo } = this.props;
    return (
      <>
        {
          tipo === TIPOS.DESIGNACAO && (
            <Card title="Lista de Ausências (adicione todos os eventos de ausência do Funcionário)">
              <Row style={{ display: 'flex', alignItems: 'center' }}>
                <Col span={12}>
                  {this.renderSelectAusencias()}
                </Col>
                <Col span={2} offset={2}>
                  {this.renderButtonAddAusencias()}
                </Col>
                <Col span={6} offset={2}>
                  {!_.isEmpty(ausencias) && this.renderTotalDiasAusencias()}
                </Col>
              </Row>
              <Row>
                <Col style={{ marginBottom: '50px' }}>
                  {!_.isEmpty(ausencias) && this.renderListaAusencias()}
                </Col>
              </Row>
              {this.renderPeriodoDesignacao()}
            </Card>
          )
        }
        {
          tipo === TIPOS.ADICAO && (
            <Row>
              <Col>
                {this.renderPeriodoAdicao()}
              </Col>
            </Row>
          )
        }
      </>
    );
  }
}

export default connect(null, {
  fetchMatchedCodAusencia,
  getOptsBasicas,
  getDiaUtil,
  setDtsDesig
})(Ausencias);
