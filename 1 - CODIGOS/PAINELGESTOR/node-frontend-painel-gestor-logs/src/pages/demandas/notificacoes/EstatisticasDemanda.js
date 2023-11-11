import React, { Component } from 'react';
import {
  EditOutlined,
  FileExcelOutlined,
  ReloadOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import {
  Statistic,
  Card,
  Button,
  Spin,
  Col,
  Row,
  message,
  Tooltip,
  Popconfirm,
} from 'antd';
import './EstatisticasDemanda.css';
import moment from 'moment';
import 'moment/locale/pt-br';
import { fetchDownloadRespostas } from 'services/actions/demandas';
import { connect } from 'react-redux';
import history from '@/history.js';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const gridStyle = {
  textAlign: 'center',
};

class EstatisticaDemanda extends Component {
  state = {
    loading: true,
    saving: false,
    found: true,
    perguntas: [],
    downloadCSV: false,

    dadosResposta: {
      respostas: {},
    },
  };

  downloadRespostasCSV = (apenasFinalizadas = true) => {
    this.setState(
      {
        downloadCSV: true,
      },
      () => {
        this.props.fetchDownloadRespostas({
          idDemanda: this.props.idDemanda,
          fileName: `respostas-${this.props.idDemanda}.xlsx`,
          apenasFinalizadas,
          responseHandler: {
            successCallback: () => this.setState({ downloadCSV: false }),
            errorCallback: (what) => {
              message.error(what);
              this.setState({ downloadCSV: false });
            },
          },
        });
      },
    );
  };

  renderDownloadButton = () => {
    const isModuloLista = this.props.tipoPublico === 'lista';

    if (isModuloLista) {
      if (
        this.props.finalizadas === 0 &&
        this.props.totalOcorrenciasFinalizadas === 0
      ) {
        return (
          <Button type="primary" icon={<FileExcelOutlined />} disabled={true}>
            Download Respostas
          </Button>
        );
      } else {
        return (
          <Popconfirm
            title="Escolha o tipo do Download:"
            placement="bottom"
            okText="Todas"
            cancelText="Finalizadas"
            onConfirm={() => this.downloadRespostasCSV(false)}
            onCancel={() => this.downloadRespostasCSV(true)}
          >
            <Button
              type="primary"
              loading={this.state.downloadCSV}
              icon={<FileExcelOutlined />}
            >
              Download Respostas
            </Button>
          </Popconfirm>
        );
      }
    } else {
      return (
        <Button
          type="primary"
          onClick={() => this.downloadRespostasCSV()}
          loading={this.state.downloadCSV}
          icon={<FileExcelOutlined />}
          disabled={this.props.finalizadas === 0}
        >
          Download Respostas
        </Button>
      );
    }
  };

  render() {
    let url = `${process.env.PUBLIC_URL}/demandas/responder-demanda/${this.props.idDemanda}`;
    moment.locale('pt-br');
    let moment_now = moment();
    let moment_countdown = moment(this.props.countDown);
    let tempo_restante;
    const isModuloLista = this.props.tipoPublico === 'lista';
    const isRespostaInfinita = !this.props.respostaUnica;
    // console.log
    if (moment_countdown < moment_now) {
      tempo_restante = 'Demanda Expirada';
    } else {
      tempo_restante = moment
        .duration(moment_now.diff(moment_countdown))
        .humanize();
    }

    return (
      <Card
        headStyle={{ backgroundColor: '#fafafa' }}
        title={
          <Row>
            <Col span={12} style={{ overflowX: 'hidden' }}>
              {`Estatísticas da Demanda - ${this.props.tituloDemanda} `}
            </Col>
            <Col span={12} style={{ textAlign: 'right' }}>
              <Tooltip title="Editar demanda">
                <Button
                  type="danger"
                  icon={<EditOutlined />}
                  onClick={() =>
                    history.push(
                      `/demandas/editar-demanda/${this.props.idDemanda}`,
                    )
                  }
                  style={{ marginRight: '10px' }}
                />
              </Tooltip>

              {this.renderDownloadButton()}
            </Col>
          </Row>
        }
        actions={[
          <span>
            <span>Link para demanda:</span>
            <Button type="link">{url}</Button>
            <CopyToClipboard
              text={url}
              onCopy={() =>
                message.success('Link copiado para área de transferência!')
              }
            >
              <Button
                icon={<CopyOutlined />}
                type="text"
                title="Clique para copiar"
              />
            </CopyToClipboard>
          </span>,
          <Button icon={<ReloadOutlined />} onClick={this.props.reload}>
            Atualizar
          </Button>,
        ]}
      >
        <Card.Grid style={{ ...gridStyle, width: '50%' }}>
          <Spin spinning={this.props.loading}>
            <Statistic title="Expira em " value={tempo_restante} />
          </Spin>
        </Card.Grid>
        <Card.Grid style={{ ...gridStyle, width: '50%' }}>
          <Spin spinning={this.props.loading}>
            {isModuloLista && (
              <Statistic
                loading={this.props.loading}
                title={
                  <span>
                    <strong>Total:</strong> Público / Ocorrências
                  </span>
                }
                groupSeparator="."
                value={`${this.props.publicoTotal} / ${this.props.totalOcorrencias}`}
              />
            )}

            {!isModuloLista && (
              <Statistic
                loading={this.props.loading}
                title="Público Total"
                groupSeparator="."
                value={this.props.publicoTotal}
              />
            )}
          </Spin>
        </Card.Grid>
        <Card.Grid
          style={{ ...gridStyle, width: isRespostaInfinita ? '100%' : '50%' }}
        >
          <Spin spinning={this.props.loading}>
            {isModuloLista && (
              <Statistic
                title={
                  <span>
                    <strong>Finalizadas:</strong> Público / Ocorrências
                  </span>
                }
                groupSeparator="."
                value={`${this.props.finalizadas} / ${this.props.totalOcorrenciasFinalizadas}`}
              />
            )}

            {!isModuloLista && (
              <Statistic
                title={
                  isRespostaInfinita ? 'Total de Respostas' : 'Finalizadas'
                }
                groupSeparator="."
                value={this.props.finalizadas}
              />
            )}
          </Spin>
        </Card.Grid>
        {!isRespostaInfinita && (
          <Card.Grid style={{ ...gridStyle, width: '50%' }}>
            <Spin spinning={this.props.loading}>
              {isModuloLista && (
                <Statistic
                  title={
                    <span>
                      <strong>Pendentes:</strong> Público / Ocorrências
                    </span>
                  }
                  groupSeparator="."
                  value={`${this.props.pendentes} / ${this.props.totalOcorrenciasPendentes}`}
                />
              )}

              {!isModuloLista && !isRespostaInfinita && (
                <Statistic
                  title="Pendentes"
                  groupSeparator="."
                  value={this.props.pendentes}
                />
              )}
            </Spin>
          </Card.Grid>
        )}
      </Card>
    );
  }
}

export default connect(null, { fetchDownloadRespostas })(EstatisticaDemanda);
