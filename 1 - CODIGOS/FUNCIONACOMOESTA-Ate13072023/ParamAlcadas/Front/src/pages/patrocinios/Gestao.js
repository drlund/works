// @ts-nocheck
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable consistent-return */
/* eslint-disable react/state-in-constructor */
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Row,
  Col,
  Popconfirm,
  Divider,
  message,
  Tooltip,
  Tag,
  Select,
  Modal,
  Popover,
  Timeline,
  Card,
  Avatar,
  DatePicker,
} from 'antd';
import {
  PlayCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  RedoOutlined,
  FileDoneOutlined,
  ExclamationCircleOutlined,
  FileSearchOutlined,
  FilePdfOutlined,
  UndoOutlined,
  InfoCircleTwoTone,
  UserAddOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileExcelOutlined,
  ProjectOutlined,
  DollarOutlined,
  FundViewOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import 'moment/locale/pt-br';

import { toggleSideBar } from 'services/actions/commons';
import SearchTable from 'components/searchtable/SearchTable';
import AlfaSort from 'utils/AlfaSort';
import FloatSort from 'utils/FloatSort';
import DateBrSort from 'utils/DateBrSort';
import { commonDateRanges } from 'utils/DateUtils';
import { getProfileURL } from 'utils/Commons';
import history from 'history.js';

import {
  getSolic,
  alteraSolic,
  Acoes,
  statusSolicitacao,
  fetchEquipeComunicacao,
  gravaRespAnalise,
  fetchHistorico,
  downloadDados,
} from 'services/ducks/Patrocinios.ducks';
import { fetchIsNivelGerencial } from 'services/ducks/Arh.ducks';

import InputFuncisMultiplos from 'components/inputsBB/InputFuncisMultiplos';

import './TableHead.scss';
import VerVotosPopOver from './VerVotosPopOver';

const { Option } = Select;
const { Meta } = Card;
const { RangePicker } = DatePicker;

class Gestao extends React.Component {
  state = {
    pageLoading: false,
    dataLoading: false,
    periodo: 2,
    dtPeriodo: commonDateRanges['Semestre Atual'],
    idStatus: statusSolicitacao.emAndamento, // Define o status "Em Andamento"
    // como valor inicial para o filtro de Status
    listaStatus: [],
    membroComite: 0,
    solicitacoes: [],
    // solicDownload: [],
    solicitacaoSelecionada: {},
    respAnaliseSelecionado: [],
    respAnaliseAtribuido: [],
    isEquipeComunic: false,
    equipeComunicacao: [],
    equipComunicDisponivel: [],
    PDFAutDimacVisible: false,
    PDFAutDimacPreview: null,
    PDFBriefingVisible: false,
    PDFBriefingPreview: null,
    isNivelGerencial: null,
    atribuirRespAnaliseVisible: false,
    historico: [],
    isGestaoDePatrocinios: false,
  };

  columns = [
    {
      dataIndex: 'idSolicitacao',
      title: 'Id',
      width: '1%',
      align: 'center',
      sorter: (a, b) => AlfaSort(a.idSolicitacao, b.idSolicitacao),
    },
    {
      dataIndex: 'dtInclusao',
      title: 'Dt. Inclusão',
      width: '2%',
      align: 'center',
      sorter: (a, b) => DateBrSort(a.dtInclusao, b.dtInclusao),
      render: (text, record) => (
        <span>
          {`${text} `}
          {record.devolucao ? (
            <>
              <br />
              <Popover
                placement="rightTop"
                title="Motivo da Devolução"
                content={
                  <p
                    style={{
                      maxWidth: 500,
                      maxHeight: 400,
                      overflowY: 'auto',
                      padding: '0 10px',
                    }}
                  >
                    {record.obsDevolucao}
                  </p>
                }
              >
                <Tag color="red">
                  <UndoOutlined style={{ marginRight: 5 }} />
                  {record.devolucao}
                  <InfoCircleTwoTone />
                </Tag>
              </Popover>
            </>
          ) : (
            ''
          )}
        </span>
      ),
    },
    {
      dataIndex: 'prefixoSolicitante',
      title: 'Super',
      width: '7%',
      sorter: (a, b) => AlfaSort(a.prefixoSolicitante, b.prefixoSolicitante),
      render: (text, record) =>
        `${record.prefixoSolicitante} - ${record.nomeSolicitante}`,
    },
    {
      dataIndex: 'dataInicioEvento',
      title: 'Dt. Evento',
      width: '2%',
      align: 'center',
      sorter: (a, b) => DateBrSort(a.dataInicioEvento, b.dataInicioEvento),
      render: (text, record) => (
        <span>
          {`${text} `}
          {record.solicitadoForaPrazo ? (
            <>
              <br />
              <Tag color={record.temAutDimac ? 'blue' : 'warning'}>
                <ExclamationCircleOutlined /> {'Fora do prazo '}
                {record.temAutDimac ? '(Autorizado)' : ''}
              </Tag>
            </>
          ) : (
            ''
          )}
        </span>
      ),
    },
    {
      dataIndex: 'nomeEvento',
      title: 'Evento',
      width: '10%',
      sorter: (a, b) => AlfaSort(a.nomeEvento, b.nomeEvento),
    },
    {
      dataIndex: 'valorEvento',
      title: 'Valor',
      width: '2%',
      align: 'center',
      sorter: (a, b) => FloatSort(a.valorEvento, b.valorEvento),
    },
    {
      dataIndex: 'nrMKT',
      title: 'Nº MKT',
      width: '2%',
      align: 'center',
      sorter: (a, b) => AlfaSort(a.nrMKT, b.nrMKT),
    },
    {
      dataIndex: 'qtdVotos',
      title: 'Votos',
      width: '2%',
      align: 'center',
      sorter: (a, b) => AlfaSort(a.qtdVotos, b.qtdVotos),
      render: (text, record) => (
        <VerVotosPopOver
          votos={record.voto}
          votacaoEmAndamento={record.votacaoEmAndamento}
        />
      ),
    },
    {
      dataIndex: 'fase',
      title: 'Fase/Status',
      width: '2%',
      align: 'center',
      render: (text, record) => (
        <Tag color={record.colorStatus}>
          {record.statusEmAndamento ? text : record.status}
        </Tag>
      ),
    },
    {
      title: 'Ações',
      width: '5%',
      align: 'center',
      render: (text, record) => {
        if (this.state.isGestaoDePatrocinios) {
          return (
            <div>
              {!record.gestao.length ? (
                <>
                  <Tooltip title="Iniciar Gestão">
                    <Button
                      type="link"
                      icon={<PlayCircleOutlined />}
                      className="link-color link-cursor"
                      onClick={() =>
                        history.push(
                          `/patrocinios/iniciar-gestao-patrocinios/${record.idSolicitacao}`,
                        )
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Editar Projeto">
                    <Button
                      disabled
                      type="link"
                      icon={<ProjectOutlined />}
                      className="link-color link-cursor"
                      onClick={() =>
                        history.push(
                          `/patrocinios/editar-projeto-patrocinios/${record.idSolicitacao}`,
                        )
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Gerenciar Orçamento">
                    <Button
                      icon={<FormOutlined />}
                      disabled
                      type="link"
                      className="link-color link-cursor"
                      onClick={() =>
                        history.push({
                          pathname: `/patrocinios/tabela-gerenciar-orcamento/${record.idSolicitacao}`,
                          state: {
                            idProjeto: record.idSolicitacao,
                            nomeEvento: record.nomeEvento,
                          },
                        })
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Gerenciar Provisão">
                    <Button
                      icon={<FundViewOutlined />}
                      disabled
                      type="link"
                      className="link-color link-cursor"
                      onClick={() =>
                        history.push(
                          `/patrocinios/tabela-gerenciar-provisao/${record.idSolicitacao}`,
                        )
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Gerenciar Pagamentos">
                    <Button
                      icon={<DollarOutlined />}
                      disabled
                      type="link"
                      className="link-color link-cursor"
                      onClick={() =>
                        history.push(
                          `/patrocinios/tabela-gerenciar-pagamentos/${record.idSolicitacao}`,
                        )
                      }
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip title="Editar Projeto">
                    <Button
                      icon={<ProjectOutlined />}
                      type="link"
                      className="link-color link-cursor"
                      onClick={() =>
                        history.push({
                          pathname: `/patrocinios/editar-projeto-patrocinios/${record.idSolicitacao}`,
                          state: record,
                        })
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Gerenciar Orçamento">
                    <Button
                      icon={<FormOutlined />}
                      type="link"
                      className="link-color link-cursor"
                      onClick={() =>
                        history.push({
                          pathname: `/patrocinios/tabela-gerenciar-orcamento/${record.idSolicitacao}`,
                          state: {
                            idProjeto: record.idSolicitacao,
                            nomeEvento: record.nomeEvento,
                          },
                        })
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Gerenciar Provisão">
                    <Button
                      icon={<FundViewOutlined />}
                      type="link"
                      className="link-color link-cursor"
                      onClick={() =>
                        history.push(
                          `/patrocinios/tabela-gerenciar-provisao/${record.idSolicitacao}`,
                        )
                      }
                    />
                  </Tooltip>
                  <Tooltip title="Gerenciar Pagamentos">
                    <Button
                      icon={<DollarOutlined />}
                      type="link"
                      className="link-color link-cursor"
                      onClick={() =>
                        history.push(
                          `/patrocinios/tabela-gerenciar-pagamentos/${record.idSolicitacao}`,
                        )
                      }
                    />
                  </Tooltip>
                </>
              )}
            </div>
          );
        }
        return (
          <>
            {this.state.isEquipeComunic && (
              <Tooltip title="Histórico da Solicitação">
                <ClockCircleOutlined
                  className="link-color link-cursor"
                  onClick={() => {
                    fetchHistorico({ idSolicitacao: record.idSolicitacao })
                      .then((response) => {
                        this.setState({
                          historico: response,
                          solicitacaoSelecionada: record,
                        });
                      })
                      .catch(() => {
                        message.error('Erro na busca do histórico.');
                      });
                  }}
                />
                <Divider type="vertical" />
              </Tooltip>
            )}

            <Tooltip title="Visualizar">
              <Link to={`visualizasolicitacao/${record.idSolicitacao}`}>
                <EyeOutlined className="link-color link-cursor" />
              </Link>
            </Tooltip>

            {this.renderButtonEdit(record)}

            {this.renderButtonEnviarParaVotacao(record)}

            {this.renderButtonCancelarSolicitacao(record)}

            {this.renderButtonAnalise(record)}

            {this.renderButtonPDFAutDimac(record)}

            {this.renderButtonPDFBriefing(record)}

            {this.renderButtonAddRespAnalise(record)}

            {this.renderButtonVerAnalise(record)}
          </>
        );
      },
    },
  ];

  componentDidMount() {
    this.isGestaoDePatrocinios();
  }

  onEnviarParaVotacao = (idSolicitacao) => {
    const solicitacao = {
      solicitacoes: {
        idSolicitacao,
        idAcao: Acoes.EnviarParaVotacao,
      },
    };

    this.submitSolic(solicitacao);
  };

  onCancelarSolicitacao = (idSolicitacao) => {
    const solicitacao = {
      solicitacoes: {
        idSolicitacao,
        idAcao: Acoes.CancelarSolic,
      },
    };

    this.submitSolic(solicitacao);
  };

  getIsNivelGerencial() {
    fetchIsNivelGerencial().then((permissao) => {
      this.setState({ isNivelGerencial: permissao });
    });
  }

  getEquipeComunicacao() {
    fetchEquipeComunicacao().then((response) => {
      this.setState({
        equipeComunicacao: response,
        equipComunicDisponivel: response,
      });
    });
  }

  exibirColunasGestao = () => {
    const { isGestaoDePatrocinios } = this.state;
    const naoExibir = [
      { dataIndex: 'dtInclusao' },
      { dataIndex: 'qtdVotos' },
      { dataIndex: 'fase' },
    ];

    const columnsGestao = this.columns.filter(
      (coluna1) =>
        !naoExibir.some((coluna2) => coluna1.dataIndex === coluna2.dataIndex),
    );

    return isGestaoDePatrocinios ? columnsGestao : this.columns;
  };

  onChangePeriodo = (value) => {
    this.setState(
      {
        periodo: value,
        idStatus:
          // eslint-disable-next-line react/destructuring-assignment
          value === 3 ? statusSolicitacao.concluido : this.state.idStatus,
      },
      () => this.fetchSolicitacoes(),
    );
  };

  fetchSolicitacoes = () => {
    this.setState({ pageLoading: true }, () => {
      const { idStatus, periodo, dtPeriodo } = this.state;

      const dtPeriodoExiste = dtPeriodo || commonDateRanges['Semestre Atual'];

      const filtro = {};
      filtro.idStatus = idStatus || null;
      filtro.periodo = periodo;
      filtro.inicioData = dtPeriodoExiste[0];
      filtro.fimData = dtPeriodoExiste[1];

      getSolic({
        filtro,
        responseHandler: {
          successCallback: ({
            listaStatus,
            membroComite,
            solicitacoes,
            isEquipeComunic,
          }) => {
            this.setState({
              listaStatus,
              membroComite,
              solicitacoes,
              isEquipeComunic,
              pageLoading: false,
            });
          },
          errorCallback: () => message.error('Falha ao obter as solicitações.'),
        },
      });
    });
  };

  submitSolic = (solicitacao) => {
    this.setState({ pageLoading: true }, () =>
      alteraSolic({
        solicitacao,
        responseHandler: {
          successCallback: () => {
            message.success('Operação efetuada com sucesso!');
            this.fetchSolicitacoes();
          },
          errorCallback: (error) => {
            message.error(error);
            this.setState({ pageLoading: false });
          },
        },
      }),
    );
  };

  onChangeDtPeriodo = (value) => {
    this.setState({ dtPeriodo: value }, () => this.fetchSolicitacoes());
  };

  onChangeStatus = (value) => {
    this.setState({ idStatus: value }, () => this.fetchSolicitacoes());
  };

  dadosHistorico = (historico) => (
    <>
      <p style={{ fontSize: 12, marginBottom: 0 }}>
        <ClockCircleOutlined
          className="link-color"
          style={{ marginRight: 3 }}
        />
        {historico.dtCriacao}
      </p>
      <p style={{ fontSize: 12, marginBottom: 0 }}>
        {`${historico.matricula} - ${historico.nomeFunci}`}
      </p>
      <p style={{ fontSize: 12, marginBottom: 0 }}>
        {`${historico.codFuncaoFunci} - ${historico.nomeFuncaoFunci}`}
      </p>
      <p style={{ fontSize: 12, marginBottom: 0 }}>
        {`${historico.prefixo} - ${historico.nomePrefixo}`}
      </p>
    </>
  );

  isGestaoDePatrocinios() {
    if (this.props.match.path === '/patrocinios/gestao-do-orcamento') {
      this.setState({ isGestaoDePatrocinios: true });
    }
    this.props.toggleSideBar(true);
    this.getIsNivelGerencial();
    this.getEquipeComunicacao();
    this.fetchSolicitacoes();
  }

  renderButtonEdit = (record) => {
    if (record.liberaEdicao) {
      return (
        <>
          <Divider type="vertical" />

          <Tooltip title="Editar">
            <EditOutlined
              className="link-color link-cursor"
              onClick={() =>
                history.push(`alterasolicitacao/${record.idSolicitacao}`)
              }
            />
          </Tooltip>
        </>
      );
    }
  };

  renderButtonEnviarParaVotacao = (record) => {
    if (record.liberaVoto) {
      return (
        <>
          <Divider type="vertical" />

          <Tooltip title="Enviar para Votação">
            <Popconfirm
              title="Deseja enviar esta solicitação para votação do comitê?"
              placement="left"
              onConfirm={() => this.onEnviarParaVotacao(record.idSolicitacao)}
            >
              <FileDoneOutlined style={{ color: 'purple' }} />
            </Popconfirm>
          </Tooltip>
        </>
      );
    }
  };

  renderButtonCancelarSolicitacao = (record) => {
    if (record.liberaCancelamento) {
      return (
        <>
          <Divider type="vertical" />

          <Tooltip title="Cancelar Solicitação">
            <Popconfirm
              title="Deseja CANCELAR esta solicitação?"
              placement="left"
              onConfirm={() => this.onCancelarSolicitacao(record.idSolicitacao)}
            >
              <DeleteOutlined style={{ color: 'firebrick' }} />
            </Popconfirm>
          </Tooltip>
        </>
      );
    }
  };

  renderButtonAnalise = (record) => {
    if (
      record.statusEmAndamento &&
      !record.emFaseInclusao &&
      this.state.isEquipeComunic
    ) {
      return (
        <>
          <Divider type="vertical" />
          <Tooltip
            title={
              record.isRespAnalise
                ? 'Analisar Solicitação'
                : () => {
                    let textResp = 'Resp. Analise:';

                    for (let i = 0; i < record.respAnalise.length; i++) {
                      const texto = ` ${record.respAnalise[i].nome} (${record.respAnalise[i].matricula})`;
                      textResp += i === 0 ? texto : `, ${texto}`;
                    }
                    return textResp;
                  }
            }
          >
            <FileSearchOutlined
              className={record.isRespAnalise ? 'link-cursor' : ''}
              style={{ color: record.isRespAnalise ? 'green' : 'black' }}
              onClick={
                record.isRespAnalise
                  ? () => history.push(`analise/${record.idSolicitacao}`)
                  : null
              }
            />
          </Tooltip>
        </>
      );
    }
  };

  renderButtonPDFAutDimac = (record) => {
    if (record.temAutDimac) {
      return (
        <>
          <Divider type="vertical" />
          <Tooltip title="Autorização DIMAC">
            <FilePdfOutlined
              className="link-cursor"
              style={{ color: 'green' }}
              onClick={() =>
                this.setState({
                  PDFAutDimacPreview: record.temAutDimac,
                  PDFAutDimacVisible: true,
                })
              }
            />
          </Tooltip>
        </>
      );
    }
  };

  renderButtonPDFBriefing = (record) => {
    if (record.temBriefing) {
      return (
        <>
          <Divider type="vertical" />
          <Tooltip title="Briefing">
            <FilePdfOutlined
              className="link-cursor"
              style={{ color: 'tomato' }}
              onClick={() =>
                this.setState({
                  PDFBriefingPreview: record.temBriefing,
                  PDFBriefingVisible: true,
                })
              }
            />
          </Tooltip>
        </>
      );
    }
  };

  renderButtonAddRespAnalise = (record) => {
    const { isNivelGerencial, isEquipeComunic, equipComunicDisponivel } =
      this.state;
    if (
      record.statusEmAndamento &&
      !record.emFaseInclusao &&
      isNivelGerencial &&
      isEquipeComunic
    ) {
      return (
        <>
          <Divider type="vertical" />
          <Tooltip title="Atribuir Resp. Análise">
            <UserAddOutlined
              className="link-cursor"
              style={{ color: 'green' }}
              onClick={() => {
                this.setState({
                  solicitacaoSelecionada: record,
                  equipComunicDisponivel: equipComunicDisponivel.filter(
                    (value) =>
                      // Filtra os responsáveis que não estão atribuídos
                      !record.respAnalise.some(
                        (val) => value.matricula === val.matricula,
                      ),
                  ),
                  respAnaliseAtribuido: record.respAnalise,
                  atribuirRespAnaliseVisible: true,
                });
              }}
            />
          </Tooltip>
        </>
      );
    }
  };

  renderButtonVerAnalise = (record) => {
    if (!record.emFaseInclusao && this.state.isEquipeComunic) {
      return (
        <>
          <Divider type="vertical" />
          <Tooltip title="Visualizar Análise">
            <SearchOutlined
              className="link-color link-cursor"
              onClick={() =>
                history.push(`visualiza-analise/${record.idSolicitacao}`)
              }
            />
          </Tooltip>
        </>
      );
    }
  };

  renderButtonVotacao() {
    const { pageLoading, membroComite } = this.state;

    if (membroComite) {
      return (
        <Button
          icon={<FileDoneOutlined />}
          type="primary"
          disabled={pageLoading}
          style={{
            backgroundColor: 'MediumPurple',
            borderColor: 'transparent',
            marginRight: '15px',
          }}
          onClick={() => history.push('/patrocinios/votacao')}
        >
          Votar Solicitações
        </Button>
      );
    }
  }

  renderFiltros() {
    const { pageLoading, periodo, idStatus, listaStatus, dtPeriodo } =
      this.state;

    if (listaStatus) {
      return (
        <>
          <Row>
            <Col span={7} style={{ top: -22 }}>
              <label htmlFor="filtroPeriodo">Período</label>
              <Select
                id="filtroPeriodo"
                defaultValue={periodo}
                disabled={pageLoading}
                style={{ width: '100%' }}
                onChange={this.onChangePeriodo}
              >
                <Option key={1} value={1}>
                  Data de Inclusão
                </Option>
                <Option key={2} value={2}>
                  Data do Evento
                </Option>
                <Option key={3} value={3}>
                  Data de Conclusão da Solicitação
                </Option>
              </Select>
            </Col>

            <Col span={5} offset={3} style={{ top: -22 }}>
              <label htmlFor="filtroStatus">Status</label>
              <Select
                id="filtroStatus"
                value={pageLoading ? 'Carregando...' : idStatus}
                disabled={pageLoading}
                style={{ width: '100%' }}
                onChange={this.onChangeStatus}
              >
                {listaStatus.map((status) => (
                  <Option key={status.id} value={status.id}>
                    {status.descricao}
                  </Option>
                ))}
                <Option key={0} value={0}>
                  Todos
                </Option>
              </Select>
            </Col>
          </Row>
          <Row style={{ marginTop: -10, marginBottom: 15 }}>
            <RangePicker
              value={dtPeriodo}
              ranges={commonDateRanges}
              allowEmpty={false}
              showToday={false}
              format="DD/MM/YYYY"
              disabled={pageLoading}
              onChange={this.onChangeDtPeriodo}
            />
          </Row>
        </>
      );
    }
  }

  renderModalHead = () => {
    const columnsSolic = this.columns.reduce((result, value) => {
      if (!['Ações', 'Votos'].includes(value.title)) {
        const col = { ...value, disableSearch: true }; // Desabilita a opção de filtro
        delete col.sorter; // Retira a função de ordenamento
        result.push(col);
      }

      return result;
    }, []);

    return (
      <SearchTable
        className="styledTableHead noPagination"
        columns={columnsSolic}
        dataSource={[this.state.solicitacaoSelecionada]}
        size="small"
        bordered
      />
    );
  };

  renderAtribuirRespAnalise() {
    const {
      solicitacaoSelecionada,
      respAnaliseSelecionado,
      respAnaliseAtribuido,
      equipComunicDisponivel,
      pageLoading,
    } = this.state;

    return Object.keys(solicitacaoSelecionada).length ? (
      <>
        {this.renderModalHead()}

        <div style={{ marginTop: 25, marginBottom: 25 }}>
          <span style={{ fontWeight: 'bold', color: 'rgba(0, 0, 0, 0.65)' }}>
            Escolha o funcionário a ser atribuído para análise:
          </span>

          <div style={{ marginTop: 5, marginBottom: 10 }}>
            <InputFuncisMultiplos
              value={respAnaliseSelecionado}
              dataFuncis={equipComunicDisponivel}
              onChange={(value) => {
                if (value.length) {
                  const arrayResp = value.map((val) => ({
                    matricula: val.key,
                    nome: val.label[2],
                  }));

                  this.setState({
                    ...respAnaliseSelecionado,
                    respAnaliseSelecionado: arrayResp,
                  });
                }
              }}
            />
          </div>

          <Button
            icon={<PlusOutlined />}
            type="primary"
            loading={pageLoading}
            disabled={!respAnaliseSelecionado.length}
            onClick={() => {
              this.setState({ pageLoading: true }, () => {
                const respAtribuido = respAnaliseAtribuido.concat(
                  respAnaliseSelecionado,
                );
                const arrayMatriculas = respAtribuido.length
                  ? respAtribuido.map((resp) => resp.matricula)
                  : [];

                gravaRespAnalise({
                  idSolicitacao: solicitacaoSelecionada.idSolicitacao,
                  respAtribuido: respAnaliseSelecionado,
                })
                  .then(() => {
                    this.setState(
                      {
                        respAnaliseAtribuido: respAtribuido,
                        respAnaliseSelecionado: [],
                        equipComunicDisponivel: equipComunicDisponivel.filter(
                          (funci) => !arrayMatriculas.includes(funci.matricula),
                        ),
                      },
                      this.fetchSolicitacoes,
                    );
                  })
                  .catch(() => {
                    message.error('Erro ao atribuir responsável para análise.');
                  })
                  .then(() => this.setState({ pageLoading: false }));
              });
            }}
          >
            Atribuir
          </Button>
        </div>

        <div>
          <div
            style={{
              marginBottom: 10,
              borderBottom: 'solid',
              borderWidth: 1,
              borderBottomColor: '#ccc',
            }}
          >
            <h3 style={{ fontWeight: 'bold', color: '#777' }}>
              Funcionários atribuídos
            </h3>
          </div>

          <SearchTable
            className="styledTableHead"
            columns={[
              {
                dataIndex: 'matricula',
                title: 'Matrícula',
                width: '10%',
                sorter: (a, b) => AlfaSort(a.matricula, b.matricula),
              },
              {
                dataIndex: 'nome',
                title: 'Nome',
                sorter: (a, b) => AlfaSort(a.nome, b.nome),
              },
            ]}
            pagination={{ position: ['none'] }}
            dataSource={respAnaliseAtribuido}
            size="small"
            bordered
          />
        </div>
      </>
    ) : (
      <div />
    );
  }

  renderHistorico = () => {
    const { historico } = this.state;

    return (
      <>
        <div style={{ marginBottom: 30 }}>{this.renderModalHead()}</div>
        <Timeline mode="alternate">
          {historico.map((hist, index) => (
            <Timeline.Item
              key={index}
              dot={<CheckCircleOutlined style={{ fontSize: '20px' }} />}
            >
              <Card
                hoverable
                style={{
                  marginTop: 16,
                  cursor: 'default',
                  border: '2px solid #f0f0f0',
                  borderRadius: 12,
                }}
              >
                <Meta
                  avatar={<Avatar src={getProfileURL(hist.matricula)} />}
                  title={hist.descricaoAcao}
                  description={this.dadosHistorico(hist)}
                  style={{ textAlign: 'left' }}
                />
              </Card>
            </Timeline.Item>
          ))}
        </Timeline>
      </>
    );
  };

  render() {
    const {
      pageLoading,
      dataLoading,
      solicitacoes,
      // solicDownload,
      PDFAutDimacVisible,
      PDFAutDimacPreview,
      PDFBriefingVisible,
      PDFBriefingPreview,
      atribuirRespAnaliseVisible,
      historico,
      equipeComunicacao,
      periodo,
      dtPeriodo,
      idStatus,
      isGestaoDePatrocinios,
    } = this.state;

    return (
      <>
        <Row style={{ marginTop: 15 }}>
          <Col span={12}>{this.renderFiltros()}</Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            {this.renderButtonVotacao()}

            {!isGestaoDePatrocinios && (
              <Button
                icon={<PlusOutlined />}
                type="primary"
                disabled={pageLoading}
                onClick={() => history.push('/patrocinios/novasolicitacao')}
              >
                Nova Solicitação
              </Button>
            )}

            <Button
              icon={<RedoOutlined />}
              loading={pageLoading}
              style={{ marginLeft: '15px' }}
              onClick={this.fetchSolicitacoes}
            >
              Atualizar a lista
            </Button>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Tooltip title="Exportar dados para planilha">
              <Button
                type="primary"
                icon={<FileExcelOutlined />}
                onClick={() =>
                  this.setState(
                    { dataLoading: true },
                    downloadDados({
                      filtro: {
                        periodo,
                        inicioData: dtPeriodo[0],
                        fimData: dtPeriodo[1],
                        idStatus,
                      },
                      // dados: solicDownload,
                      fileName: 'solicitacoes.xlsx',
                      responseHandler: {
                        successCallback: () =>
                          this.setState({ dataLoading: false }),
                        errorCallback: (msg) => message.error(msg),
                      },
                    }),
                  )
                }
                style={{
                  marginBottom: '15px',
                  backgroundColor: 'slategray',
                  opacity: 0.7,
                  border: 'none',
                }}
                loading={dataLoading}
                disabled={pageLoading}
              >
                Exportar
              </Button>
            </Tooltip>
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <SearchTable
              className="styledTableHead"
              columns={this.exibirColunasGestao()}
              dataSource={solicitacoes}
              size="small"
              loading={pageLoading}
              pagination={{ showSizeChanger: true }}
              bordered
            />
          </Col>
        </Row>

        <Modal
          visible={!!historico.length}
          title="Histórico da Solicitação"
          footer={null}
          onCancel={() =>
            this.setState({
              historico: [],
              solicitacaoSelecionada: {},
            })
          }
          width="55%"
          style={{ top: 10 }}
        >
          {this.renderHistorico()}
        </Modal>

        <Modal
          visible={PDFAutDimacVisible}
          title="Autorização da DIMAC"
          footer={null}
          onCancel={() => this.setState({ PDFAutDimacVisible: false })}
          width="50%"
          style={{ top: 10 }}
        >
          <embed src={PDFAutDimacPreview} width="100%" height={800} />
        </Modal>

        <Modal
          visible={PDFBriefingVisible}
          title="Briefing"
          footer={null}
          onCancel={() => this.setState({ PDFBriefingVisible: false })}
          width="50%"
          style={{ top: 10 }}
        >
          <embed src={PDFBriefingPreview} width="100%" height={800} />
        </Modal>

        <Modal
          visible={atribuirRespAnaliseVisible}
          title="Atribuição de Responsável para Análise"
          footer={null}
          onCancel={() => this.setState({ atribuirRespAnaliseVisible: false })}
          maskClosable={false}
          afterClose={() =>
            this.setState({
              respAnaliseAtribuido: [],
              respAnaliseSelecionado: [],
              equipComunicDisponivel: equipeComunicacao,
              solicitacaoSelecionada: {},
            })
          }
          width="80%"
          style={{ top: 10 }}
        >
          {this.renderAtribuirRespAnalise()}
        </Modal>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  authState: state.app.authState,
});

export default connect(mapStateToProps, { toggleSideBar })(Gestao);
