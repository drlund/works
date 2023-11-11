import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tag,
  Modal,
  Tooltip,
} from 'antd';
import moment from 'moment';
import 'moment/locale/pt-br';
import {
  getDadosResumoHEGG,
  enviarDadosSolicitacao,
  getDadosFuncionario,
  getFuncisPrefixo,
  obterListaDiasUteis,
} from 'services/ducks/HoraExtra.ducks';
import _ from 'lodash';
import ResumoGeral from 'pages/hrxtra/NovaSolicitacao/ResumoGeral';
import Confirmacao from './Confirmacao';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import PageLoading from 'components/pageloading/PageLoading';

const { Option } = Select;
const { RangePicker } = DatePicker;

const OPCOESTIPOCOMPENSACAO = [
  {
    key: 'negativa',
    label: 'Horas Negativas',
  },
  {
    key: 'folga',
    label: 'Folga',
  },
];

function SolicitacaoUN(props) {
  const [form] = Form.useForm();

  const mountedRef = useRef(false);
  const isMounted = useCallback(() => mountedRef.current, []);

  const [funci, setFunci] = useState(null); // entrada via input
  const [funcis, setFuncis] = useState([]); // após retorno do getFuncisPrefixo
  const [funcionario, setFuncionario] = useState(null); // retorno do sistema
  const [prefixo, setPrefixo] = useState(null);
  const [nomePrefixo, setNomePrefixo] = useState(null);
  const [prefixos, setPrefixos] = useState([]);
  const [qtdeHoras, setQtdeHoras] = useState(0);
  const [botaoBloq, setBotaoBloq] = useState(false);
  const [textoJustf, setTextoJustf] = useState(0);
  const [textoJustfNA, setTextoJustfNA] = useState(0);
  const [dadosHE, setDadosHE] = useState({});
  const [novo, setNovo] = useState(null);
  const [novoVisible, setNovoVisible] = useState(false);
  const [, setTotalHoras] = useState(0);
  const [loadingResGeral, setLoadingResGeral] = useState(false);
  const [loadingEnviandoDados, setLoadingEnviandoDados] = useState(false);
  const [datasSelecionadas, setDatasSelecionadas] = useState([]);

  useEffect(() => {
    mountedRef.current = true;

    setPrefixo((prev) => props.dados.prefixo.prefixo);
    setPrefixos((prev) => [...props.dados.subordinadas]);
    setNomePrefixo((prev) => props.dados.prefixo.nome);

    setLoadingResGeral((prev) => true);
    getDadosResumoHEGG(null, props.dados.prefixo.prefixo)
      .then((dados) => isMounted() && setDadosHE(dados))
      .catch((error) => message.error(error))
      .then(() => isMounted() && setLoadingResGeral((prev) => false));

    return () => (mountedRef.current = false);
  }, [
    isMounted,
    props.dados.prefixo.nome,
    props.dados.prefixo.prefixo,
    props.dados.subordinadas,
  ]);

  const obterDadosHoraExtraFunci = useCallback(
    (func = null, prefixoFunci = null) => {
      isMounted() && setLoadingResGeral((prev) => true);
      getDadosResumoHEGG(func, prefixoFunci || prefixo)
        .then((dados) => isMounted() && setDadosHE(dados))
        .catch((error) => message.error(error))
        .then(() => isMounted && setLoadingResGeral((prev) => false));
    },
    [prefixo, isMounted],
  );

  useEffect(() => {
    if (funci) {
      setQtdeHoras((prev) => 0);
      setFunci((prev) => null);
      setFuncionario((prev) => null);
      setTextoJustf((prev) => 0);
      getDadosFuncionario(funci)
        .then((dados) => {
          isMounted() && setFuncionario((prev) => dados);
        })
        .then(() => obterDadosHoraExtraFunci(funci))
        .catch((error) => message.error(error));
    }
  }, [
    funci,
    obterDadosHoraExtraFunci,
    isMounted,
    setQtdeHoras,
    setFunci,
    setFuncionario,
    setTextoJustf,
  ]);

  useEffect(() => {
    if (prefixo !== props.dados.prefixo.super && !_.isNil(prefixo)) {
      setFuncis((prev) => []);
      setQtdeHoras((prev) => 0);
      setFunci((prev) => null);
      setFuncionario((prev) => null);
      setTextoJustf((prev) => 0);
      getFuncisPrefixo(prefixo)
        .then((dados) => isMounted() && setFuncis(dados))
        .then(() => obterDadosHoraExtraFunci(null, prefixo))
        .catch((error) => message.error(error));
    }
  }, [prefixo, props.dados.prefixo.super, isMounted, obterDadosHoraExtraFunci]);

  useEffect(() => {
    if (!qtdeHoras) {
      if (isMounted()) {
        setTextoJustf((prev) => '');
      }
    }
  }, [qtdeHoras, isMounted]);

  const onSubmit = async () => {
    try {
      await form.validateFields([
        'qtdeHoras',
        'justifNaoAdesaoBH',
        'totalHorasACompensar',
        'justifSolicitHE',
      ]);
    } catch (err) {
      return;
    }

    const formulario = form.getFieldsValue();

    if (!_.isEmpty(formulario)) {
      const bloquearBotaoEnviar = () => {
        setBotaoBloq((prev) => true);
      };

      const desbloquearBotaoEnviar = () => {
        setBotaoBloq((prev) => false);
      };

      bloquearBotaoEnviar();

      if (isMounted()) {
        setLoadingEnviandoDados((prev) => true);
      }

      const compensacaoHoras = JSON.parse(
        JSON.stringify(formulario.compensacaoHoras),
      );

      for (const item of compensacaoHoras) {
        if (item.tipoCompensacao === 'folga') {
          if (
            moment(item.dataCompensacao[0]).startOf('day') ===
            moment(item.dataCompensacao[1]).startOf('day')
          ) {
            item.dataCompensacao = moment(item.dataCompensacao[0]).format(
              'DD/MM/YYYY',
            );
            continue;
          }
          item.dataCompensacao = await obterListaDiasUteis(
            moment(item.dataCompensacao[0]).format('YYYY-MM-DD'),
            moment(item.dataCompensacao[1]).format('YYYY-MM-DD'),
            prefixo,
          );
        }

        if (item.tipoCompensacao === 'negativa')
          item.dataCompensacao = [item.dataCompensacao];
      }

      formulario.compensacaoHoras = JSON.parse(
        JSON.stringify(compensacaoHoras),
      );
      formulario.foto_resumo_geral = dadosHE;

      enviarDadosSolicitacao(formulario)
        .then((novo) => {
          if (isMounted()) {
            setNovo((prev) => novo);
            setNovoVisible((prev) => true);
          }
        })
        .catch((error) => {
          message.error(error);
        })
        .then(() => {
          if (isMounted()) {
            setLoadingEnviandoDados((prev) => false);
            desbloquearBotaoEnviar();
          }
        });
    }
  };

  const onPrefixoChange = (pref) => {
    setNomePrefixo((prev) =>
      _.head(prefixos.filter((pr) => pr.prefixo === pref).map((pr) => pr.nome)),
    );
    setPrefixo((prev) => pref);
  };

  const onFunciChange = (func) => {
    setFunci((prev) => func);
  };

  const addHoraACompensar = async (horasComp) => {
    const resetDatas = () => {
      setDatasSelecionadas((prev) => []);
    };

    resetDatas();

    const horasCompensacao = [];

    for (const elem of horasComp) {
      if (_.isNil(elem) || _.isNil(elem.dataCompensacao)) continue;

      const horas = (select, range = []) => {
        const opcoes = {
          negativa: elem.qtdeHoras || 0,
          folga: funcionario.ddComissao.jornada * range.length,
        };
        return opcoes[select];
      };

      const rangeDias = async (arrayDatas) => {
        const qtdeDias = await obterListaDiasUteis(
          arrayDatas[0].format('YYYY-MM-DD'),
          arrayDatas[1].format('YYYY-MM-DD'),
          prefixo,
        );
        return qtdeDias;
      };

      const setarDatasSelecionadas = (elemento) => {
        setDatasSelecionadas((prev) => [...prev, ...elemento]);
        return;
      };

      const isDataUnica =
        !_.isArray(elem.dataCompensacao) &&
        moment.isMoment(elem.dataCompensacao);

      if (!isDataUnica) {
        const diasSelecionados = await rangeDias(elem.dataCompensacao);
        setarDatasSelecionadas(diasSelecionados);
        horasCompensacao.push(horas(elem.tipoCompensacao, diasSelecionados));
      }

      if (isDataUnica) {
        setarDatasSelecionadas([elem.dataCompensacao]);
        horasCompensacao.push(horas(elem.tipoCompensacao));
      }
    }

    const horasCompensar = horasCompensacao.reduce(
      (prev, acc) => prev + acc,
      0,
    );

    form.setFieldsValue({
      totalHorasACompensar: horasCompensar,
    });

    setTotalHoras((prev) => horasCompensar);

    form.validateFields();
  };

  const datasDesabilitadas = (current) => {
    const fimDeSemana = [0, 6].includes(moment(current).day());

    const datasJaSelecionadas = datasSelecionadas
      .map((elemento) => moment(elemento).format('YYYY-MM-DD'))
      .includes(moment(current).format('YYYY-MM-DD'));

    return (
      current < moment().startOf('day') || fimDeSemana || datasJaSelecionadas
    );
  };

  return loadingEnviandoDados ? (
    <PageLoading />
  ) : (
    <Card>
      <Row gutter={16}>
        <Col span={12}>
          <Form
            name="novaSolicitacao"
            form={form}
            initialValues={{
              prefixo:
                props.dados.prefixo.prefixo !== props.dados.prefixo.super &&
                props.dados.prefixo.prefixo,
            }}
            labelAlign="left"
            layout="vertical"
            onValuesChange={(changedValues, allValues) => {
              if (changedValues.funci) {
                form.resetFields([
                  'qtdeHoras',
                  'justifNaoAdesaoBH',
                  'compensacaoHoras',
                  'justifSolicitHE',
                  'totalHorasACompensar',
                ]);
                setTotalHoras((prev) => 0);
              }

              if (!_.isNil(changedValues.compensacaoHoras)) {
                addHoraACompensar(allValues.compensacaoHoras);
              }
              allValues.justifSolicitHE &&
                setTextoJustf(allValues.justifSolicitHE.length);
              allValues.justifNaoAdesaoBH &&
                setTextoJustfNA(
                  allValues.justifNaoAdesaoBH
                    ? allValues.justifNaoAdesaoBH.length
                    : 0,
                );
              allValues.qtdeHoras &&
                qtdeHoras !== allValues.qtdeHoras &&
                setQtdeHoras(allValues.qtdeHoras);
            }}
            onFinish={onSubmit}
          >
            <Card
              title="Dados da Solicitação"
              headStyle={{
                textAlign: 'center',
                backgroundColor: '#002D4B',
                color: 'white',
              }}
            >
              <Row>
                <Col>
                  <Form.Item label="Dependência" name="prefixo">
                    <Select
                      showSearch
                      placeholder="Selecione um Prefixo"
                      optionFilterProp="children"
                      onChange={onPrefixoChange}
                      disabled={loadingResGeral}
                      filterOption={(input, option) => {
                        const label = ''.concat(...option.children);
                        return (
                          label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {prefixos &&
                        prefixos.map((pref) => {
                          const options = {};
                          pref.prefixo === prefixo && (options.selected = true);

                          return (
                            <Option
                              key={pref.prefixo}
                              value={pref.prefixo}
                              {...options}
                            >
                              {pref.prefixo} {pref.nome}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Item label="Funcionário Indicado" name="funci">
                    <Select
                      showSearch
                      placeholder="Selecione um Funcionário"
                      optionFilterProp="children"
                      onChange={onFunciChange}
                      disabled={loadingResGeral}
                      filterOption={(input, option) => {
                        const label = ''.concat(...option.children);
                        return (
                          label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {funcis &&
                        funcis.map((funci) => {
                          return (
                            <Option
                              key={funci.matricula}
                              value={funci.matricula}
                            >
                              {funci.matricula} {funci.nome}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {!_.isNil(funcionario) && (
                <>
                  <Row>
                    <Col span={15}>
                      <Form.Item
                        label="Cód. Comissão"
                        name="cod_comissao"
                        initialValue={funcionario.ddComissao.nome_funcao}
                      >
                        <Tag>{funcionario.ddComissao.nome_funcao}</Tag>
                        <Input hidden />
                      </Form.Item>
                    </Col>
                    <Col span={3}>
                      <Form.Item
                        label="Comissão"
                        name="comissao"
                        initialValue={funcionario.ddComissao.cod_funcao}
                      >
                        <Tag>{funcionario.ddComissao.cod_funcao}</Tag>
                        <Input hidden />
                      </Form.Item>
                    </Col>
                    <Col span={6}>
                      <Form.Item
                        label="Horas Solicitadas"
                        name="qtdeHoras"
                        initialValue={0}
                        rules={[
                          {
                            required: true,
                            message:
                              'Necessário informar a quantidade solicitada de Horas Extras!',
                          },
                          {
                            type: 'integer',
                            min: 1,
                            message:
                              'Necessário informar a quantidade de horas!',
                          },
                        ]}
                      >
                        <InputNumber style={{ width: '100%' }} min={0} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Divider>
                    Informação sobre Adesão ao Banco de Horas do Funcionário
                  </Divider>
                  <Row>
                    <Col>
                      <Form.Item label="Funcionário aderiu ao Banco de Horas">
                        <Tag
                          style={{ fontSize: '1.1rem' }}
                          color={
                            funcionario.dadosAdesao.adesao === 1
                              ? 'blue'
                              : 'red'
                          }
                        >
                          {funcionario.dadosAdesao.aderiu}
                        </Tag>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
              {!_.isNil(funcionario) &&
                funcionario.dadosAdesao.adesao === 0 && (
                  <Row>
                    <Col>
                      <Form.Item
                        label="Justificativa para a Não Adesão ao Banco de Horas"
                        name="justifNaoAdesaoBH"
                        rules={[
                          {
                            required: true,
                            message:
                              'Necessário justificar a Não Adesão ao Banco de Horas!',
                          },
                          {
                            min: 50,
                            max: 1000,
                            message:
                              'Justificativa com quantidade mínima de 50 caracteres!',
                          },
                        ]}
                      >
                        <Input.TextArea
                          rows={6}
                          placeholder="Justifique a NÃO adesão, min. 50 caracteres"
                        />
                      </Form.Item>
                      <Row>
                        <Col span={18}></Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                          {textoJustfNA}/1000
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                )}
              {!_.isNil(funcionario) && (
                <>
                  <Row>
                    <Col span={12}>
                      <Form.Item label="Horas Totais acumuladas">
                        <Tag color="warning" style={{ fontSize: '1.1rem' }}>
                          {funcionario.dadosAdesao.saldoTotal} h
                        </Tag>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Horas vencendo no mês atual">
                        <Tag
                          color="error"
                          style={{ padding: '3px', fontSize: '2rem' }}
                        >
                          {funcionario.dadosAdesao.mesAtual} h
                        </Tag>
                      </Form.Item>
                    </Col>
                  </Row>
                  {(funcionario.dadosAdesao.saldoTotal > 0 ||
                    funcionario.dadosAdesao.mesAtual > 0 ||
                    qtdeHoras > 0) && (
                    <>
                      <Divider>
                        Planejamento da Compensação do Banco de Horas (Mês
                        Atual)
                      </Divider>
                      <Row>
                        <Col>
                          <Form.List name="compensacaoHoras">
                            {(fields, { add, remove }) => (
                              <React.Fragment key={moment().valueOf + 1}>
                                {fields.map((field, index) => (
                                  <Row gutter={10}>
                                    <Col span={9}>
                                      <Form.Item
                                        {...field}
                                        label="Tipo de Compensação"
                                        name={[field.name, 'tipoCompensacao']}
                                        fieldKey={[
                                          field.fieldKey,
                                          'tipoCompensacao',
                                        ]}
                                        rules={[
                                          {
                                            required: true,
                                            message:
                                              'Selecione um tipo de compensação',
                                          },
                                        ]}
                                      >
                                        <Select>
                                          {OPCOESTIPOCOMPENSACAO.filter(
                                            (opcao) =>
                                              qtdeHoras +
                                                funcionario.dadosAdesao
                                                  .saldoTotal >=
                                              funcionario.ddComissao.jornada
                                                ? [
                                                    'negativa',
                                                    'folga',
                                                  ].includes(opcao.key)
                                                : ['negativa'].includes(
                                                    opcao.key,
                                                  ),
                                          ).map((opcao) => (
                                            <Option
                                              key={opcao.key}
                                              value={opcao.key}
                                            >
                                              {opcao.label}
                                            </Option>
                                          ))}
                                        </Select>
                                      </Form.Item>
                                    </Col>
                                    <Col span={9}>
                                      <Form.Item shouldUpdate>
                                        {({ getFieldValue }) => {
                                          const valorCompensacaoHoras =
                                            getFieldValue('compensacaoHoras');
                                          if (
                                            !_.isNil(
                                              valorCompensacaoHoras[index],
                                            ) &&
                                            valorCompensacaoHoras[index]
                                              .tipoCompensacao === 'negativa'
                                          )
                                            return (
                                              <Form.Item
                                                {...field}
                                                label="Data de Compensação"
                                                name={[
                                                  field.name,
                                                  'dataCompensacao',
                                                ]}
                                                fieldKey={[
                                                  field.fieldKey,
                                                  'dataCompensacao',
                                                ]}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      'Informar período de compensação',
                                                  },
                                                ]}
                                              >
                                                <DatePicker
                                                  key={index}
                                                  disabledDate={
                                                    datasDesabilitadas
                                                  }
                                                  style={{ width: '100%' }}
                                                  placeholder="Data Prevista para compensação do Banco de Horas"
                                                  format={'DD/MM/YYYY'}
                                                />
                                              </Form.Item>
                                            );
                                          if (
                                            !_.isNil(
                                              valorCompensacaoHoras[index],
                                            ) &&
                                            valorCompensacaoHoras[index]
                                              .tipoCompensacao === 'folga'
                                          )
                                            return (
                                              <Form.Item
                                                {...field}
                                                label="Data de Compensação"
                                                name={[
                                                  field.name,
                                                  'dataCompensacao',
                                                ]}
                                                fieldKey={[
                                                  field.fieldKey,
                                                  'dataCompensacao',
                                                ]}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      'Informar período de compensação',
                                                  },
                                                ]}
                                              >
                                                <RangePicker
                                                  key={index}
                                                  disabledDate={
                                                    datasDesabilitadas
                                                  }
                                                  style={{ width: '100%' }}
                                                  placeholder="Data Prevista para compensação do Banco de Horas"
                                                  format={'DD/MM/YYYY'}
                                                />
                                              </Form.Item>
                                            );

                                          return null;
                                        }}
                                      </Form.Item>
                                    </Col>
                                    <Col span={4}>
                                      <Form.Item shouldUpdate>
                                        {({ getFieldValue }) => {
                                          const valorCompensacaoHoras =
                                            getFieldValue('compensacaoHoras');

                                          if (
                                            !_.isNil(
                                              valorCompensacaoHoras[index],
                                            ) &&
                                            valorCompensacaoHoras[index]
                                              .tipoCompensacao === 'negativa'
                                          )
                                            return (
                                              <Form.Item
                                                {...field}
                                                label="Horas"
                                                name={[field.name, 'qtdeHoras']}
                                                fieldKey={[
                                                  field.fieldKey,
                                                  'qtdeHoras',
                                                ]}
                                                rules={[
                                                  {
                                                    required: true,
                                                    message:
                                                      'Informar quantidade de horas',
                                                  },
                                                  ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                      const somaHrCmp =
                                                        getFieldValue(
                                                          'totalHorasACompensar',
                                                        );

                                                      if (!value)
                                                        return Promise.reject();

                                                      if (
                                                        value &&
                                                        funcionario.ddComissao
                                                          .jornada <
                                                          parseInt(value)
                                                      )
                                                        return Promise.reject(
                                                          new Error(
                                                            'Quantidade de horas maior ou igual a um dia útil. Favor selecionar FOLGA ou diluir em mais dias.',
                                                          ),
                                                        );

                                                      if (
                                                        value &&
                                                        somaHrCmp >
                                                          funcionario
                                                            .dadosAdesao
                                                            .saldoTotal +
                                                            qtdeHoras
                                                      )
                                                        return Promise.reject(
                                                          new Error(
                                                            'Quantidade de horas maior que o total a compensar. Favor refaça os cálculos ou remova algum período.',
                                                          ),
                                                        );

                                                      if (
                                                        value &&
                                                        somaHrCmp <
                                                          funcionario
                                                            .dadosAdesao
                                                            .mesAtual
                                                      )
                                                        return Promise.reject(
                                                          new Error(
                                                            'Quantidade de horas menor que o total a compensar. Favor refaça os cálculos ou adicione um novo período.',
                                                          ),
                                                        );

                                                      return Promise.resolve();
                                                    },
                                                  }),
                                                ]}
                                              >
                                                <InputNumber min={1} />
                                              </Form.Item>
                                            );

                                          return null;
                                        }}
                                      </Form.Item>
                                    </Col>
                                    <Col span={1}>
                                      <Tooltip title="Remover Período">
                                        <MinusCircleOutlined
                                          onClick={() => remove(field.name)}
                                        />
                                      </Tooltip>
                                    </Col>
                                  </Row>
                                ))}
                                <Form.Item>
                                  <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                  >
                                    Adicionar Período de Compensação
                                  </Button>
                                </Form.Item>
                              </React.Fragment>
                            )}
                          </Form.List>
                        </Col>
                      </Row>
                      <Form.Item
                        label="Horas Marcadas a compensar"
                        name="totalHorasACompensar"
                        initialValue={0}
                        rules={[
                          {
                            required: true,
                            message:
                              'Necessário informar as horas a compensar!',
                          },
                          ({ getFieldValue }) => ({
                            validator(rl, value) {
                              if (funcionario.dadosAdesao.mesAtual > value)
                                return Promise.reject(
                                  new Error(
                                    'Quantidade de horas menor que o total de horas a compensar NESTE MÊS. Favor refaça os cálculos ou adicione um novo período.',
                                  ),
                                );

                              return Promise.resolve();
                            },
                          }),
                        ]}
                      >
                        <Input disabled={true}></Input>
                      </Form.Item>
                    </>
                  )}
                </>
              )}
              {((!_.isNil(funcionario) &&
                (funcionario.dadosAdesao.saldoTotal > 0 ||
                  funcionario.dadosAdesao.mesAtual > 0)) ||
                qtdeHoras > 0) && (
                <>
                  <Divider />
                  <Row>
                    <Col>
                      <Form.Item
                        label="Justificativa para a solicitação de Hora Extra"
                        name="justifSolicitHE"
                        rules={[
                          {
                            required: true,
                            message:
                              'Necessário justificar a solicitação de Horas Extras!',
                          },
                          {
                            min: 50,
                            max: 1000,
                            message:
                              'Justificativa com quantidade mínima de 50 caracteres!',
                          },
                        ]}
                      >
                        <Input.TextArea
                          rows={6}
                          placeholder="Justifique seu pedido, min. 50 caracteres"
                        ></Input.TextArea>
                      </Form.Item>
                      <Row>
                        <Col span={18}></Col>
                        <Col span={6} style={{ textAlign: 'right' }}>
                          {textoJustf}/1000
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={10}></Col>
                    <Col span={4}>
                      <Form.Item>
                        <Button
                          block
                          disabled={botaoBloq}
                          onClick={onSubmit}
                          type="primary"
                        >
                          Solicitar
                        </Button>
                      </Form.Item>
                    </Col>
                    <Col span={10}></Col>
                  </Row>
                </>
              )}
            </Card>
          </Form>
        </Col>
        <Col span={12}>
          <ResumoGeral
            dadosHE={dadosHE || null}
            prefixo={prefixo}
            nomePrefixo={nomePrefixo}
            loading={loadingResGeral}
          />
        </Col>
      </Row>
      {novoVisible && (
        <Modal
          title="Solicitação e Planejamento de Horas Extras"
          visible={novoVisible}
          maskClosable={false}
          destroyOnClose
          footer={null}
        >
          <Confirmacao key={novo.id} novo={novo} />
        </Modal>
      )}
    </Card>
  );
}

export default React.memo(SolicitacaoUN);
