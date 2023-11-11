/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/sort-comp */
/* eslint-disable no-shadow */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/state-in-constructor */
import React from 'react';
import {
  Form, message, Modal, Select, Button
} from 'antd';
import { UndoOutlined } from '@ant-design/icons';
import PageLoading from 'components/pageloading/PageLoading';
import _ from 'lodash';
import moment from 'moment';
import {
  getTpSolic,
  getPerguntas,
  getRecorrencia,
  getPrefAut,
  gravaSolic,
  Acoes,
  hashPerguntas,
  getIdPergunta,
  strMoedaToNumber,
  tipoArquivos,
  dispatchArquivos,
  changeRecorrenciaSelecionada,
  setVisibleFormRecorrencia,
} from 'services/ducks/Patrocinios.ducks';
import { connect } from 'react-redux';
import history from 'history.js';
import FormPerguntas from './FormPerguntas';
import { FormRadio } from './FormInputs';

const { Option } = Select;
class NovaSolicitacao extends React.Component {
  state = {
    idTipoSolicitacao: null,
    dadosRecorrencia: null,
    prefAutSelecionado: null,
    nomePrefAutSelecionado: null,
    idRecorrenciaSelecionado: null,
    fetchingRecorrencia: false,
    submitForm: false,
    tiposSolicitacao: [],
    perguntas: [],
    prefAut: [],
    recorrencia: [],
    pergRecorrencia: null,
    pergNomeEvento: null,
    pergDataInicioEvento: null,
    pergDataFimEvento: null,
    pergValorPatrocinio: null,
    pergValorAcaoPromocional: null,
    pergBriefing: null,
  };

  formRef = React.createRef();

  formRefName = 'control-ref';

  formRecorrencia = React.createRef();

  layout = { labelCol: { span: 24 } };

  perguntasFormRecorrencia = [
    {
      id: 'nomeEvento',
      descricaoPergunta: 'Nome do Evento',
      obrigatorio: { data: [1] },
      tipo: { cdTipoPergunta: 'text' },
    },
    {
      id: 'dtEvento',
      descricaoPergunta: 'Data do Evento',
      obrigatorio: { data: [1] },
      tipo: { cdTipoPergunta: 'date' },
    },
    {
      id: 'valorEvento',
      descricaoPergunta: 'Valor do Evento',
      obrigatorio: { data: [1] },
      tipo: { cdTipoPergunta: 'moeda' },
    },
    {
      id: 'avaliacaoResultado',
      descricaoPergunta: 'Avaliação do Resultado',
      obrigatorio: { data: [1] },
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
            const prefAutSelecionado = prefAut.length === 1 ? prefAut[0].prefixo : null;
            const nomePrefAutSelecionado = prefAut.length === 1
              ? `${prefAut[0].prefixo} - ${prefAut[0].nome}`
              : null;
            this.setState(
              {
                pageLoading: false,
                prefAutSelecionado,
                nomePrefAutSelecionado,
              },
              () => this.setRecorrencia()
            );
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
        const { dadosRecorrencia, idRecorrenciaSelecionado } = this.state;

        if (dadosRecorrencia) {
          this.formRecorrencia.current.setFieldsValue(dadosRecorrencia);
        } else if (this.formRecorrencia.current) {
          this.formRecorrencia.current.resetFields();

          // Se recorrência for "Evento não cadastrado" (idRecorrenciaSelecionado = 0)
          // ou "Evento anterior cadastrado" (idRecorrenciaSelecionado > 0)
          if (idRecorrenciaSelecionado >= 0) {
            this.formRecorrencia.current.setFieldsValue({
              selectIdRecorrencia: idRecorrenciaSelecionado,
            });
          }
        }
      }
    }
  }

  updateTpSolicitacao = (idTipoSolicitacao) => {
    this.setState({ pageLoading: true }, () => getPerguntas({
      idTipoSolicitacao,
      sequencial: 1,
      responseHandler: {
        successCallback: ({ perguntas, faseTipoSolic, solicitacao }) => {
          const { idTipoSolicitacao, idForm, versao } = faseTipoSolic;

          this.setState(
            {
              pageLoading: false,
              idTipoSolicitacao,
              solicitacao,
              perguntas,
              solicitacoes: { idForm, versao },
            },
            () => {
              if (perguntas) {
                const pergNomeEvento = getIdPergunta(
                  perguntas,
                  hashPerguntas.NomeEvento
                );
                const pergDataInicioEvento = getIdPergunta(
                  perguntas,
                  hashPerguntas.DataInicioEvento
                );
                const pergDataFimEvento = getIdPergunta(
                  perguntas,
                  hashPerguntas.DataFimEvento
                );
                const pergRecorrencia = getIdPergunta(
                  perguntas,
                  hashPerguntas.Recorrencia
                );
                const pergValorPatrocinio = getIdPergunta(
                  perguntas,
                  hashPerguntas.ValorPatrocinio
                );
                const pergValorAcaoPromocional = getIdPergunta(
                  perguntas,
                  hashPerguntas.ValorAcaoPromocional
                );

                const pergBriefing = getIdPergunta(
                  perguntas,
                  hashPerguntas.Briefing
                );

                if (pergBriefing) {
                  // const { idTipoArquivo } = pergBriefing.opcoes[0];
                  this.props.dispatchArquivos({ arquivos: [] });
                }

                this.setState({
                  pergNomeEvento,
                  pergDataInicioEvento,
                  pergDataFimEvento,
                  pergRecorrencia,
                  pergValorPatrocinio,
                  pergValorAcaoPromocional,
                  pergBriefing,
                });
              }
            }
          );
        },
        errorCallback: () => message.error('Falha ao obter os dados do formulário.'),
      },
    }));
  };

  onChangePrefAutorizado = (value, option) => {
    this.setState(
      {
        prefAutSelecionado: value,
        nomePrefAutSelecionado: option.children,
        dadosRecorrencia: null,
        idRecorrenciaSelecionado: null,
        fetchingRecorrencia: true,
      },
      () => this.setRecorrencia()
    );
  };

  setRecorrencia = () => {
    const { prefAutSelecionado } = this.state;

    this.setFieldRecorrenciaNao();

    if (prefAutSelecionado) {
      getRecorrencia({
        responseHandler: {
          successCallback: (recorrencia) => this.setState(
            { recorrencia, fetchingRecorrencia: false },
            () => {
              if (recorrencia.length === 0) {
                this.setState({ idRecorrenciaSelecionado: 0 });
              }
            }
          ),
          errorCallback: () => message.error('Erro ao buscar recorrência.'),
        },
        prefixo: prefAutSelecionado,
      });
    }
  };

  formataFunciContato = (values) => {
    const { perguntas } = this.state;

    const pergFunciContato = getIdPergunta(
      perguntas,
      hashPerguntas.FunciContato
    );

    if (
      pergFunciContato
      && pergFunciContato.id
      && pergFunciContato.id in values
      && values[pergFunciContato.id]
    ) {
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
    console.log(values);
    console.log(this.state);
    this.setState({ submitForm: true }, () => {
      const {
        dadosRecorrencia,
        prefAutSelecionado,
        solicitacoes,
        nomePrefAutSelecionado,
        idRecorrenciaSelecionado,
        pergValorPatrocinio,
        pergValorAcaoPromocional,
        pergNomeEvento,
        pergDataInicioEvento,
        pergDataFimEvento,
      } = this.state;

      if (pergNomeEvento && pergDataInicioEvento && pergDataFimEvento) {
        // Gera um objeto sem as respostas obrigatórias
        let respostas = _.omit(values, [
          pergNomeEvento.id,
          pergDataInicioEvento.id,
          pergDataFimEvento.id,
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
        const { pergBriefing } = this.state;

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
        // Retira o prefixo (Ex.: "8495 - SUPER VAREJO CE" ficará "SUPER VAREJO CE")
        const nomeSolicitante = nomePrefAutSelecionado.substring(7);
        let recorrencia = null;

        if (dadosRecorrencia) {
          recorrencia = !idRecorrenciaSelecionado
            ? {
              // Envia idSolicitacao como null, caso não exista evento recorrente cadastrado
              idSolicitacao: null,
              prefixo: prefAutSelecionado,
              nomeDependencia: nomeSolicitante,
              nomeEvento: dadosRecorrencia.nomeEvento,
              valorEvento: dadosRecorrencia.valorEvento,
              dtEvento: dadosRecorrencia.dtEvento,
              avaliacaoResultado: dadosRecorrencia.avaliacaoResultado,
              ativo: 1,
            }
            : { idSolicitacao: idRecorrenciaSelecionado, ativo: 1 };
        }

        const ret = { respostas, solicitacoes, recorrencia };
        console.log(ret);

        // Busca o valor do patrocínio informado no formulário
        const valorPatrocinio = pergValorPatrocinio && values[pergValorPatrocinio.id]
          ? strMoedaToNumber(values[pergValorPatrocinio.id])
          : 0;

        // Busca o valor da ação promocional informado no formulário
        const valorAcaoPromocional = pergValorAcaoPromocional && values[pergValorAcaoPromocional.id]
          ? strMoedaToNumber(values[pergValorAcaoPromocional.id])
          : 0;

        ret.solicitacoes = {
          ...ret.solicitacoes,
          prefixoSolicitante: prefAutSelecionado,
          nomeSolicitante,
          nomeEvento: values[pergNomeEvento.id],
          dataInicioEvento: values[pergDataInicioEvento.id],
          dataFimEvento: values[pergDataFimEvento.id],
          valorEvento: valorPatrocinio + valorAcaoPromocional,
          idAcao: Acoes.IncluirSolic,
        };

        gravaSolic({
          solicitacao: ret,
          responseHandler: {
            successCallback: () => {
              message.success('Solicitação salva com sucesso!');
              history.push('/patrocinios/cadastrar-consultar-sac');
            },
            errorCallback: (error) => {
              message.error(error);
              this.setState({ submitForm: false });
            },
          },
        });
      }
    });
  };

  onFinishFormRecorrencia = (values) => {
    this.setState({ dadosRecorrencia: values }, () => {
      // Se evento não cadastrado
      if (this.state.idRecorrenciaSelecionado === 0) {
        this.props.changeRecorrenciaSelecionada(
          `${values.nomeEvento}  (${moment(values.dtEvento).format(
            'DD/MM/YYYY'
          )})`
        );
      } else {
        const recorrenciaSelecionada = this.state.recorrencia.find(
          (evento) => evento.idSolicitacao === this.state.idRecorrenciaSelecionado
        );

        if (recorrenciaSelecionada) {
          this.props.changeRecorrenciaSelecionada(
            `${recorrenciaSelecionada.nomeEvento} (${recorrenciaSelecionada.dataEvento})`
          );
        }
      }

      this.hideModal();
    });
  };

  onValuesChange = (changedValues) => {
    const { pergRecorrencia } = this.state;

    // Verifica se houve alteração no campo de recorrência
    if (pergRecorrencia && pergRecorrencia.id in changedValues) {
      // Se foi selecionado a opção 'Sim'
      if (changedValues[pergRecorrencia.id] === 1) {
        this.props.setVisibleFormRecorrencia(true);
      } else {
        this.setState({
          dadosRecorrencia: null,
          idRecorrenciaSelecionado: null,
        });
        this.props.changeRecorrenciaSelecionada('');
      }
    }
  };

  hideModal = () => {
    this.props.setVisibleFormRecorrencia(false);

    // Se form recorrência não foi preenchido, setar a pergunta como não recorrente
    if (!this.state.dadosRecorrencia) {
      this.setFieldRecorrenciaNao();
    }
  };

  setFieldRecorrenciaNao() {
    const { pergRecorrencia } = this.state;

    if (pergRecorrencia) {
      const opcaoNao = _.find(pergRecorrencia.opcoes, { descricao: 'Não' });
      this.formRef.current.setFieldsValue({
        [pergRecorrencia.id]: opcaoNao.id,
      });
    }

    this.props.changeRecorrenciaSelecionada('');
    this.setState({ dadosRecorrencia: null, idRecorrenciaSelecionado: null });
  }

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
          onFinish={this.onFinishFormRecorrencia}
        >
          <Form.Item
            name="selectIdRecorrencia"
            label={
              <span style={{ fontWeight: 'bold' }}>Evento recorrente</span>
            }
            rules={[{ required: true, message: 'Preenchimento obrigatório!' }]}
          >
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Selecione o evento recorrente"
              optionFilterProp="children"
              onChange={(value) => this.setState({ idRecorrenciaSelecionado: value })}
              filterOption={(input, option) => option.toLowerCase()
                .indexOf(input.toLowerCase()) >= 0}
              loading={this.state.fetchingRecorrencia}
            >
              {this.state.recorrencia.map((evento) => {
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
                label={
                  <span style={{ fontWeight: 'bold' }}>Super solicitante</span>
                }
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

  renderPerguntas() {
    const {
      perguntas, tiposSolicitacao, idTipoSolicitacao, submitForm
    } = this.state;

    return (
      <FormPerguntas
        perguntas={perguntas}
        tipoSolicitacao={tiposSolicitacao.find(
          (tpSol) => tpSol.id === idTipoSolicitacao
        )}
        buttons={[
          { type: 'buttonOk', label: 'Salvar', disabled: submitForm },
          {
            type: 'buttonCancel',
            label: 'Cancelar',
            onClick: () => history.push('/patrocinios/cadastrar-consultar-sac'),
          },
        ]}
        />
    );
  }

  render() {
    if (this.state.pageLoading) {
      return <PageLoading />;
    }

    const {
      idTipoSolicitacao,
      prefAutSelecionado,
      tiposSolicitacao,
      perguntas,
      prefAut,
    } = this.state;

    return (
      <>
        <Button
          icon={<UndoOutlined />}
          style={{ float: 'right' }}
          onClick={() => history.push('/patrocinios/cadastrar-consultar-sac')}
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
          <Form.Item
            label={
              <span style={{ fontWeight: 'bold' }}>Tipo de Solicitação</span>
            }
          >
            <FormRadio
              itens={tiposSolicitacao}
              defaultValue={idTipoSolicitacao}
              value={idTipoSolicitacao}
              onChange={(e) => this.updateTpSolicitacao(e.target.value)}
            />
          </Form.Item>

          {idTipoSolicitacao && prefAut && (
            <Form.Item
              label={
                <span style={{ fontWeight: 'bold' }}>Super Solicitante</span>
              }
            >
              <Select
                defaultValue={prefAutSelecionado}
                style={{ width: '25%' }}
                onChange={(value, option) => this.onChangePrefAutorizado(value, option)}
              >
                {prefAut.map((prefAutorizado) => (
                  <Option
                    key={prefAutorizado.prefixo}
                    value={prefAutorizado.prefixo}
                    >
                    {`${prefAutorizado.prefixo} - ${prefAutorizado.nome}`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {idTipoSolicitacao
            && prefAutSelecionado
            && perguntas
            && this.renderPerguntas()}
        </Form>

        {this.renderModal()}
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
})(NovaSolicitacao);
