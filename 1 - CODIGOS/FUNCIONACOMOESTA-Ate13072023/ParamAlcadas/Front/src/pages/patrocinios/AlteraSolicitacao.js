/* eslint-disable react/state-in-constructor */
/* eslint-disable react/sort-comp */
/* eslint-disable no-shadow */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable consistent-return */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import React from 'react';
import {
  Form, message, Modal, Select, Button
} from 'antd';
import { UndoOutlined } from '@ant-design/icons';
import PageLoading from 'components/pageloading/PageLoading';
import AccessDenied from 'pages/errors/AccessDenied';
import Error from 'pages/errors/Error';
import {
  getPerguntas,
  getTpSolic,
  getPrefAut,
  getRecorrencia,
  alteraSolic,
  Acoes,
  hashPerguntas,
  getIdPergunta,
  strMoedaToNumber,
  dispatchArquivos,
  tipoArquivos,
  changeRecorrenciaSelecionada,
  setVisibleFormRecorrencia,
} from 'services/ducks/Patrocinios.ducks';
import moment from 'moment';
import _ from 'lodash';
import { connect } from 'react-redux';
import history from 'history.js';
import FormPerguntas from './FormPerguntas';

const { Option } = Select;

class AlteraSolicitacao extends React.Component {
  state = {
    pageLoading: false,
    idRecorrenciaSelecionado: null,
    tiposSolicitacao: [],
    perguntas: [],
    prefAut: [],
    faseTipoSolic: {},
    solicitacao: {},
    recorrenciaList: [],
    notAllowed: false,
    msgError: '',
    pergRecorrencia: null,
    pergNomeEvento: null,
    pergDataInicioEvento: null,
    pergDataFimEvento: null,
    pergValorPatrocinio: null,
    pergValorAcaoPromocional: null,
    pergFunciContato: null,
  };

  idSolicitacao = this.props.match.params.id;

  formRef = React.createRef();

  formRefName = 'control-ref';

  formRecorrencia = React.createRef();

  layout = { labelCol: { span: 24 } };

  perguntasFormRecorrencia = [
    {
      id: 'nomeEvento',
      descricaoPergunta: 'Nome do Evento',
      obrigatorio: 1,
      tipo: { cdTipoPergunta: 'text' },
    },
    {
      id: 'dtEvento',
      descricaoPergunta: 'Data do Evento',
      obrigatorio: 1,
      tipo: { cdTipoPergunta: 'date' },
    },
    {
      id: 'valorEvento',
      descricaoPergunta: 'Valor do Evento',
      obrigatorio: 1,
      tipo: { cdTipoPergunta: 'moeda' },
    },
    {
      id: 'avaliacaoResultado',
      descricaoPergunta: 'Avaliação do Resultado',
      obrigatorio: 1,
      tipo: { cdTipoPergunta: 'textarea' },
    },
  ];

  componentDidMount() {
    this.setState({ pageLoading: true }, () => {
      // busca os tipos de solicitação
      getTpSolic({
        responseHandler: {
          successCallback: (tiposSolicitacao) => this.setState({ tiposSolicitacao }),
          errorCallback: () => message.error('Falha ao obter os tipos de solicitação.'),
        },
      });

      // busca os prefixos na qual o usuario tem acesso
      getPrefAut({
        responseHandler: {
          successCallback: (prefAut) => this.setState({ prefAut }, () => {
            getPerguntas({
              idSolicitacao: this.idSolicitacao,
              sequencial: 1,
              responseHandler: {
                successCallback: ({
                  solicitacao,
                  perguntas,
                  faseTipoSolic,
                }) => {
                  this.setState(
                    {
                      pageLoading: false,
                      solicitacao,
                      perguntas,
                      faseTipoSolic,
                      prefAutSelecionado: solicitacao.prefixoSolicitante,
                      nomePrefAutSelecionado: `${solicitacao.prefixoSolicitante} - ${solicitacao.nomeSolicitante}`,
                    },
                    () => {
                      this.props.dispatchArquivos(solicitacao);
                      this.setStatePrefAut();
                      this.setRecorrencia();
                      this.setStateHashPerguntas(perguntas);
                    }
                  );
                },
                errorCallback: (error) => this.setState({ pageLoading: false }, () => {
                  // Se acesso não permitido à informação limitada
                  if (error.status === 403) {
                    this.setState({ notAllowed: true });
                  } else {
                    this.setState({ msgError: error.data }, () => message.error(error.data));
                  }
                }),
              },
            });
          }),
          errorCallback: () => message.error('Erro ao buscar prefixos autorizados.'),
        },
      });
    });
  }

  componentDidUpdate(prevProps) {
    const { visibleFormRecorrencia } = this.props;

    if (prevProps.visibleFormRecorrencia !== visibleFormRecorrencia) {
      if (visibleFormRecorrencia) {
        this.setFieldsRecorrencia();
      }
    }
  }

  setStateRecorrencia() {
    const { recorrencia } = this.state.solicitacao;

    if (recorrencia && recorrencia.ativo) {
      const {
        idAuxiliarRecorrencia,
        idSolicitacaoAnterior,
        nomeEvento,
        dtEvento,
        valorEvento,
        avaliacaoResultado,
      } = recorrencia;
      this.props.changeRecorrenciaSelecionada(`${nomeEvento} (${dtEvento})`);

      if (idAuxiliarRecorrencia) {
        this.setState({
          idRecorrenciaSelecionado: 0,
          recorrencia: {
            selectIdRecorrencia: 0,
            nomeEvento,
            valorEvento,
            dtEvento: this.dateFormat(dtEvento),
            avaliacaoResultado,
          },
        });
      } else if (idSolicitacaoAnterior) {
        this.setState({
          recorrencia: { selectIdRecorrencia: idSolicitacaoAnterior },
          idRecorrenciaSelecionado: idSolicitacaoAnterior,
        });
      }
    }
  }

  setRecorrencia() {
    const { prefAutSelecionado } = this.state;

    getRecorrencia({
      prefixo: prefAutSelecionado,
      responseHandler: {
        successCallback: (recorrenciaList) => this.setState(
          { recorrenciaList },
          () => this.setStateRecorrencia()
        ),
        errorCallback: () => message.error('Erro ao buscar recorrência.'),
      },
    });
  }

  setStateHashPerguntas(perguntas) {
    if (perguntas) {
      const pergRecorrencia = getIdPergunta(
        perguntas,
        hashPerguntas.Recorrencia
      );
      const pergNomeEvento = getIdPergunta(perguntas, hashPerguntas.NomeEvento);
      const pergDataInicioEvento = getIdPergunta(
        perguntas,
        hashPerguntas.DataInicioEvento
      );
      const pergDataFimEvento = getIdPergunta(
        perguntas,
        hashPerguntas.DataFimEvento
      );
      const pergValorPatrocinio = getIdPergunta(
        perguntas,
        hashPerguntas.ValorPatrocinio
      );
      const pergValorAcaoPromocional = getIdPergunta(
        perguntas,
        hashPerguntas.ValorAcaoPromocional
      );

      const pergFunciContato = getIdPergunta(
        perguntas,
        hashPerguntas.FunciContato
      );

      this.setState(
        {
          pergRecorrencia,
          pergNomeEvento,
          pergDataInicioEvento,
          pergDataFimEvento,
          pergValorPatrocinio,
          pergValorAcaoPromocional,
          pergFunciContato,
        },
        () => this.setFieldsValue()
      );
    }
  }

  setStatePrefAut() {
    const { prefAut } = this.state;

    const arrayPrefAut = _.reduce(
      prefAut,
      (result, value) => {
        result.push({ id: value.prefixo, descricao: value.nome });
        return result;
      },
      []
    );

    this.setState({ prefAutList: arrayPrefAut });
  }

  setFieldsValue() {
    const {
      perguntas,
      pergRecorrencia,
      solicitacao,
      pergNomeEvento,
      pergDataInicioEvento,
      pergDataFimEvento,
      pergFunciContato,
    } = this.state;

    const {
      idTipoSolicitacao,
      nomeEvento,
      dataInicioEvento,
      dataFimEvento,
      prefixoSolicitante,
    } = solicitacao;

    let respostas = _.reduce(
      perguntas,
      (result, value) => {
        if (value.resposta) {
          if (
            pergRecorrencia
            && pergRecorrencia.id
            && value.id === pergRecorrencia.id
          ) {
            result[value.id] = Number(value.resposta.descricaoResposta);
          } else {
            result[value.id] = value.resposta.descricaoResposta;
          }
        }

        return result;
      },
      {}
    );

    const funciContato = [];

    if (respostas[pergFunciContato.id]) {
      respostas[pergFunciContato.id].split(', ').forEach((value) => {
        if (value) {
          const matricula = value.substring(0, 8);
          const nome = value.substring(9, value.length);

          funciContato.push({
            key: matricula,
            label: [matricula, ' ', nome],
            value: matricula,
          });
        }
      });
    }

    respostas = {
      ...respostas,
      idTipoSolicitacao,
      [pergNomeEvento.id]: nomeEvento,
      [pergDataInicioEvento.id]: this.dateFormat(dataInicioEvento),
      [pergDataFimEvento.id]: this.dateFormat(dataFimEvento),
      [pergFunciContato.id]: funciContato,
      prefixoSolicitante,
    };

    if (this.formRef.current) {
      this.formRef.current.setFieldsValue(respostas);
    }
  }

  dateFormat = (date) => {
    const arrayDate = date.split('/');
    const day = arrayDate[0];
    const month = arrayDate[1];
    const year = arrayDate[2];

    return moment(`${year}-${month}-${day}T03:00:00.0000Z`);
  };

  getNomePrefSelecionado = (prefixo) => {
    const prefSelecionado = _.find(this.state.prefAut, { prefixo });
    return prefSelecionado.nome;
  };

  updateTpSolicitacao = (idTipoSolicitacao) => {
    this.setState({ pageLoading: true }, () => getPerguntas({
      idTipoSolicitacao,
      sequencial: 1,
      idSolicitacao: this.idSolicitacao,
      responseHandler: {
        successCallback: ({ perguntas, faseTipoSolic }) => {
          const { idTipoSolicitacao, idForm, versao } = faseTipoSolic;

          this.setState(
            {
              pageLoading: false,
              faseTipoSolic,
              perguntas,
              solicitacao: {
                ...this.state.solicitacao,
                idForm,
                versao,
                idTipoSolicitacao,
              },
            },
            () => {
              this.setStateHashPerguntas(perguntas);
            }
          );
        },
        errorCallback: () => message.error('Falha ao obter os dados do formulário.'),
      },
    }));
  };

  formataFunciContato = (values) => {
    const { perguntas } = this.state;

    const pergFunciContato = getIdPergunta(
      perguntas,
      hashPerguntas.FunciContato
    );

    if (pergFunciContato && pergFunciContato.id in values) {
      let funcisMultiplos = '';

      for (const funci of values[pergFunciContato.id]) {
        const funciLabel = funci.label.join('');
        funcisMultiplos = funcisMultiplos
          ? `${funcisMultiplos}, ${funciLabel}`
          : funciLabel;
      }

      return { id: pergFunciContato.id, value: funcisMultiplos };
    }

    return null;
  };

  onFinish = (values) => {
    this.setState({ submitForm: true }, () => {
      const {
        solicitacao,
        recorrencia,
        prefAutSelecionado,
        nomePrefAutSelecionado,
        faseTipoSolic,
        pergValorPatrocinio,
        pergValorAcaoPromocional,
        pergNomeEvento,
        pergDataInicioEvento,
        pergDataFimEvento,
      } = this.state;

      // Gera um objeto sem as respostas obrigatórias
      let respostas = _.omit(values, [
        pergNomeEvento.id,
        pergDataInicioEvento.id,
        pergDataFimEvento.id,
        'prefixoSolicitante',
        'idTipoSolicitacao',
      ]);

      const { arquivos, respostaCampoOpcoes } = this.props;

      // Caso exista resposta para o campo "Funci de Contato",
      // formata-o de array para string separado por vírgula
      const pergFunciContato = this.formataFunciContato(values);

      // Caso exista o campo "Funci de Contato" no form
      if (pergFunciContato) {
        respostas[pergFunciContato.id] = pergFunciContato.value;
      }

      // Verifica se tem upload de arquivo de autorização da DIMAC
      if (arquivos[tipoArquivos.AutDimac]) {
        respostas[`file${tipoArquivos.AutDimac}`] = [];
        // Cria um campo 'fileN' recebendo o arquivo. "N" é o tipo de arquivo.
        arquivos[tipoArquivos.AutDimac].forEach((file) => respostas[`file${tipoArquivos.AutDimac}`].push(file.originFileObj));
      }

      // Obtém os dados da pergunta de Briefing
      const pergBriefing = getIdPergunta(
        this.state.perguntas,
        hashPerguntas.Briefing
      );

      // Se houver pergunta de Briefing
      if (pergBriefing) {
        // Verifica se tem upload de arquivo do Briefing
        if (arquivos[tipoArquivos.Briefing]) {
          if (arquivos[tipoArquivos.Briefing].length) {
            respostas[pergBriefing.id] = 1;
          } else {
            respostas[pergBriefing.id] = '';
          }

          respostas[`file${tipoArquivos.Briefing}`] = [];
          // Cria um campo 'fileN' recebendo o arquivo. "N" é o tipo de arquivo.
          arquivos[tipoArquivos.Briefing].forEach((file) => respostas[`file${tipoArquivos.Briefing}`].push(file.originFileObj));
        } else {
          respostas[pergBriefing.id] = '';
        }
      }

      // Verifica se tem resposta de subperguntas
      if (respostaCampoOpcoes) {
        for (const key in respostaCampoOpcoes) {
          respostas[key] = JSON.stringify(respostaCampoOpcoes[key]);
        }
      }

      // Se o objeto for vazio retorna null
      respostas = _.isEmpty(respostas) ? null : respostas;

      const { idForm, versao } = faseTipoSolic;
      // Retira o prefixo (Ex.: "8495 - SUPER VAREJO CE" ficará "SUPER VAREJO CE")
      const nomeSolicitante = nomePrefAutSelecionado.substring(7);

      let dadosRecorrencia = solicitacao.recorrencia
        ? {
          id: solicitacao.recorrencia.id,
          idSolicitacao: solicitacao.id,
          idSolicitacaoAnterior:
              solicitacao.recorrencia.idSolicitacaoAnterior,
          idAuxiliarRecorrencia:
              solicitacao.recorrencia.idAuxiliarRecorrencia,
          ativo: 0,
        }
        : null;

      if (recorrencia) {
        dadosRecorrencia = recorrencia.selectIdRecorrencia
          ? {
            id: solicitacao.recorrencia ? solicitacao.recorrencia.id : null,
            idSolicitacao: solicitacao.id,
            idSolicitacaoAnterior: recorrencia
              ? recorrencia.selectIdRecorrencia
              : null,
            idAuxiliarRecorrencia: null,
            ativo: 1,
          }
          : {
            id: solicitacao.recorrencia ? solicitacao.recorrencia.id : null,
            idSolicitacao: solicitacao.id,
            idSolicitacaoAnterior: null,
            idAuxiliarRecorrencia: solicitacao.recorrencia
              ? solicitacao.recorrencia.idAuxiliar
              : null,
            ativo: 1,
            prefixo: prefAutSelecionado,
            nomeDependencia: nomeSolicitante,
            nomeEvento: recorrencia.nomeEvento,
            valorEvento: recorrencia.valorEvento,
            dtEvento: recorrencia.dtEvento,
            avaliacaoResultado: recorrencia.avaliacaoResultado,
          };
      }

      const ret = { respostas, recorrencia: dadosRecorrencia };

      // Busca o valor do patrocínio informado no formulário
      const valorPatrocinio = pergValorPatrocinio && values[pergValorPatrocinio.id]
      ? strMoedaToNumber(values[pergValorPatrocinio.id])
      : 0;

      // Busca o valor da ação promocional informado no formulário
      const valorAcaoPromocional = pergValorAcaoPromocional && values[pergValorAcaoPromocional.id]
      ? strMoedaToNumber(values[pergValorAcaoPromocional.id])
      : 0;

      ret.solicitacoes = {
        idSolicitacao: solicitacao.id,
        idForm,
        versao,
        prefixoSolicitante: prefAutSelecionado,
        nomeSolicitante,
        nomeEvento: values[pergNomeEvento.id],
        dataInicioEvento: values[pergDataInicioEvento.id],
        dataFimEvento: values[pergDataFimEvento.id],
        valorEvento: valorPatrocinio + valorAcaoPromocional,
        idAcao: Acoes.AlterarSolic,
      };

      alteraSolic({
        solicitacao: ret,
        responseHandler: {
          successCallback: () => {
            message.success('Solicitação salva com sucesso!');
            this.clickVoltar();
          },
          errorCallback: (error) => {
            message.error(error);
            this.setState({ submitForm: false });
          },
        },
      });
    });
  };

  onValuesChange = (changedValues) => {
    if ('idTipoSolicitacao' in changedValues) {
      this.updateTpSolicitacao(changedValues.idTipoSolicitacao);
    }

    if ('prefixoSolicitante' in changedValues) {
      this.onChangePrefSolicitante(changedValues.prefixoSolicitante);
    }

    const { pergRecorrencia } = this.state;

    // Verifica se houve alteração no campo de recorrência
    if (pergRecorrencia.id in changedValues) {
      // Se foi selecionado a opção 'Sim'
      if (changedValues[pergRecorrencia.id] === 1) {
        this.props.setVisibleFormRecorrencia(true);
      } else {
        this.setFieldRecorrenciaNao();
      }
    }
  };

  onChangePrefSolicitante = (prefAutSelecionado) => {
    this.setState(
      {
        prefAutSelecionado,
        nomePrefAutSelecionado: this.getNomePrefSelecionado(prefAutSelecionado),
        recorrencia: null,
        idRecorrenciaSelecionado: null,
      },
      () => {
        this.setFieldRecorrenciaNao();
        getRecorrencia({
          prefixo: this.state.prefAutSelecionado,
          responseHandler: {
            successCallback: (recorrenciaList) => this.setState(
              { recorrenciaList, fetchingRecorrencia: false },
              () => {
                if (recorrenciaList.length === 0) {
                  this.setState({ idRecorrenciaSelecionado: 0 });
                }
              }
            ),
            errorCallback: () => message.error('Erro ao buscar recorrência.'),
          },
        });
      }
    );
  };

  setFieldRecorrenciaNao() {
    const { pergRecorrencia } = this.state;
    const opcaoNao = _.find(pergRecorrencia.opcoes, { descricao: 'Não' });
    this.formRef.current.setFieldsValue({ [pergRecorrencia.id]: opcaoNao.id });
    this.props.changeRecorrenciaSelecionada('');
    this.setState({ recorrencia: null, idRecorrenciaSelecionado: null });
  }

  setFieldsRecorrencia() {
    const { recorrencia, idRecorrenciaSelecionado } = this.state;

    if (this.formRecorrencia.current) {
      this.formRecorrencia.current.resetFields();

      if (recorrencia) {
        this.formRecorrencia.current.setFieldsValue(recorrencia);
      } else if (idRecorrenciaSelecionado === 0) {
        this.formRecorrencia.current.setFieldsValue({
          selectIdRecorrencia: idRecorrenciaSelecionado,
        });
      }
    }
  }

  onFinishFormRecorrencia = (values) => {
    this.setState({ recorrencia: values }, () => {
      const { selectIdRecorrencia } = this.state.recorrencia;
      if (selectIdRecorrencia === 0) {
        this.props.changeRecorrenciaSelecionada(
          `${values.nomeEvento}  (${moment(values.dtEvento).format(
            'DD/MM/YYYY'
          )})`
        );
      } else if (selectIdRecorrencia > 0) {
        const solicitacaoRecorrente = this.state.recorrenciaList.find(
          (evento) => evento.idSolicitacao === selectIdRecorrencia
        );

        if (solicitacaoRecorrente) {
          this.props.changeRecorrenciaSelecionada(
            `${solicitacaoRecorrente.nomeEvento} (${solicitacaoRecorrente.dataEvento})`
          );
        }
      } else {
        this.props.changeRecorrenciaSelecionada('');
      }

      this.hideModal();
    });
  };

  onValuesChangeFormRecorrencia = (changedValues) => {
    if ('selectIdRecorrencia' in changedValues) {
      this.setState({
        idRecorrenciaSelecionado: changedValues.selectIdRecorrencia,
      });
    }
  };

  hideModal = () => {
    this.props.setVisibleFormRecorrencia(false);

    // Se form recorrência não foi preenchido, setar a pergunta como não recorrente
    if (!this.state.recorrencia) {
      this.setFieldRecorrenciaNao();
    }
  };

  renderModal() {
    return (
      <Modal
        title={<span style={{ fontWeight: 'bold' }}>Recorrência</span>}
        visible={this.props.visibleFormRecorrencia}
        onOk={this.hideModal}
        onCancel={this.hideModal}
        footer={null}
        width="650px"
        >
        <Form
          {...this.layout}
          ref={this.formRecorrencia}
          initialValues={this.state.recorrencia}
          onFinish={this.onFinishFormRecorrencia}
          onValuesChange={this.onValuesChangeFormRecorrencia}
          >
          <Form.Item
            name="selectIdRecorrencia"
            label={
              <span style={{ fontWeight: 'bold' }}>Evento recorrente</span>
              }
            rules={[
              { required: true, message: 'Preenchimento obrigatório!' },
            ]}
            >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Selecione o evento recorrente"
              optionFilterProp="children"
              filterOption={(input, option) => option.children.toLowerCase()
                .indexOf(input.toLowerCase())
                  >= 0}
              loading={this.state.fetchingRecorrencia}
              >
              {this.state.recorrenciaList.map((evento) => {
                const { idSolicitacao, nomeEvento, dataEvento } = evento;
                return (
                  <Option
                    key={idSolicitacao}
                    value={idSolicitacao}
                    >
                    {`${nomeEvento} (${dataEvento})`}
                  </Option>
                );
              })}

              <Option key={0} value={0}>
                Evento não cadastrado
              </Option>
            </Select>
          </Form.Item>

          {this.state.idRecorrenciaSelecionado === 0 && (
          <>
            <Form.Item
              label={(
                <span style={{ fontWeight: 'bold' }}>
                  Super solicitante
                </span>
                  )}
                >
              <span
                style={{
                  padding: 8,
                  border: '1px solid #d9d9d9',
                  borderRadius: 3,
                }}
                  >
                {this.state.nomePrefAutSelecionado}
              </span>
            </Form.Item>
            <FormPerguntas
              perguntas={this.perguntasFormRecorrencia}
              buttons={[
                { type: 'buttonOk', label: 'Salvar' },
                {
                  type: 'buttonCancel',
                  label: 'Voltar',
                  onClick: () => this.hideModal(),
                },
              ]}
                />
          </>
          )}

          {this.state.idRecorrenciaSelecionado > 0 && (
          <FormPerguntas
            perguntas={[]}
            buttons={[
              { type: 'buttonOk', label: 'Salvar' },
              {
                type: 'buttonCancel',
                label: 'Voltar',
                onClick: () => this.hideModal(),
              },
            ]}
              />
          )}
        </Form>
      </Modal>
    );
  }

  clickVoltar = () => history.push('/patrocinios/cadastrar-consultar-sac');

  renderPerguntas() {
    const {
      submitForm,
      prefAutList,
      tiposSolicitacao,
      perguntas,
      faseTipoSolic,
    } = this.state;

    if (perguntas && tiposSolicitacao && prefAutList) {
      const perguntasSolicitacao = [
        {
          id: 'idTipoSolicitacao',
          descricaoPergunta: 'Tipo de Solicitação',
          obrigatorio: { data: [1] },
          tipo: { cdTipoPergunta: 'radio' },
          opcoes: tiposSolicitacao,
        },
        {
          id: 'prefixoSolicitante',
          descricaoPergunta: 'Super Solicitante',
          obrigatorio: { data: [1] },
          tipo: { cdTipoPergunta: 'select' },
          opcoes: prefAutList,
        },
      ];

      return (
        <>
          <FormPerguntas perguntas={perguntasSolicitacao} />

          <FormPerguntas
            perguntas={perguntas}
            tipoSolicitacao={tiposSolicitacao.find(
              (tpSol) => tpSol.id === faseTipoSolic.idTipoSolicitacao
            )}
            buttons={[
              { type: 'buttonOk', label: 'Salvar', disabled: submitForm },
              {
                type: 'buttonCancel',
                label: 'Cancelar',
                onClick: this.clickVoltar,
              },
            ]}
          />
        </>
      );
    }
  }

  render() {
    const {
      pageLoading, notAllowed, msgError, solicitacao
    } = this.state;

    if (pageLoading) {
      return <PageLoading />;
    }

    if (notAllowed) {
      return (
        <>
          <Button icon={<UndoOutlined />} onClick={this.clickVoltar}>
            Voltar
          </Button>
          <AccessDenied nomeFerramenta="Patrocínios" showMessage={false} />
        </>
      );
    }

    if (msgError) {
      return (
        <>
          <Button icon={<UndoOutlined />} onClick={this.clickVoltar}>
            Voltar
          </Button>
          <Error nomeFerramenta="Patrocínios" mensagemErro={msgError} />
        </>
      );
    }

    if (solicitacao) {
      // Se solicitação não estiver disponível para edição
      if (!solicitacao.liberaEdicao) {
        return (
          <>
            <Button icon={<UndoOutlined />} onClick={this.clickVoltar}>
              Voltar
            </Button>
            <Error
              nomeFerramenta="Patrocínios"
              mensagemErro="Esta solicitação não pode ser alterada."
            />
          </>
        );
      }
    }

    return (
      <>
        <Button
          icon={<UndoOutlined />}
          style={{ float: 'right' }}
          onClick={this.clickVoltar}
        >
          Voltar
        </Button>

        <Form
          {...this.layout}
          ref={this.formRef}
          name={this.formRefName}
          onFinish={this.onFinish}
          onValuesChange={this.onValuesChange}
        >
          {this.renderPerguntas()}
          {this.renderModal()}
        </Form>
      </>
    );
  }
}

const mapStatetoProps = (state) => {
  const {
    arquivos,
    recorrenciaSelecionada,
    visibleFormRecorrencia,
    camposResposta,
  } = state.patrocinios;

  return {
    arquivos,
    recorrenciaSelecionada,
    visibleFormRecorrencia,
    respostaCampoOpcoes: camposResposta,
  };
};

export default connect(mapStatetoProps, {
  dispatchArquivos,
  changeRecorrenciaSelecionada,
  setVisibleFormRecorrencia,
})(AlteraSolicitacao);
