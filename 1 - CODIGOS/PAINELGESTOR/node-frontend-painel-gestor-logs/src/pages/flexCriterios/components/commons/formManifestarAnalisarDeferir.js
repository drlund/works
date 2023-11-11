import React, { useState } from 'react';
import {
  Avatar,
  Button,
  Checkbox,
  Comment,
  Divider,
  Form,
  Input,
  Radio,
  Select,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import { getProfileURL } from 'utils/Commons';
import constantes from 'pages/flexCriterios/helpers/constantes';
import { CardResponsivo } from '../../styles';
import { useSelector } from 'react-redux';
import { InfoCircleOutlined } from '@ant-design/icons';

export default function FormularioManifestacao({
  enviarForm,
  titulo,
  exibirAcoes,
  exibirItensForm,
  analises,
  deferidos,
  manifestacoesAnteriores,
  mensagemErro,
  tiposManifestacoes,
}) {
  const authState = useSelector(({ app }) => app.authState);
  const [form] = Form.useForm();
  const [justificativaLabel, setJustivicativaLAbel] = useState('1');
  const [registraManifestacao, setRegistraManifestacao] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const manifestacoesAutorizadas = [
    constantes.acaoManifestacao,
    constantes.acaoAnalise,
    constantes.acaoDeferir,
    constantes.acaoFinalizar,
  ];

  //Filtro para excluir proprio prefixo e prefixo que incluiu
  const objetoFiltro = {};
  const arrayPrefixosEnvolvidosUnicos = manifestacoesAnteriores?.filter(
    (manifesta) => {
      //Limpar das opções do select o proprio prefixo
      //Incluir lógica aqui para habilitar somente complemento de subordinados no futuro
      if (manifesta?.prefixo == authState?.sessionData?.prefixo_efetivo) {
        return false;
      }

      if (/2/.test(manifesta.acaoId) && manifesta.situacaoId == 1) {
        return null;
      }

      return objetoFiltro.hasOwnProperty(manifesta.prefixo)
        ? false
        : (objetoFiltro[manifesta.prefixo] = true);
    },
  );

  //Caso não tenha prefixo envolvido para solicitar complemento no select ele não mostra a opção complementação
  const opcoesSelect =
    arrayPrefixosEnvolvidosUnicos?.length > 0
      ? tiposManifestacoes || []
      : tiposManifestacoes?.filter(
          (el) => el.id !== constantes.acaoComplemento,
        );

  const placeholderOrigemDestino = () => {
    if (
      titulo === 'Análise' ||
      titulo === 'Deferimento' ||
      titulo === 'Finalizar'
    ) {
      return;
    }
    if (
      authState.sessionData.prefixo == manifestacoesAnteriores[0].prefixo &&
      manifestacoesAnteriores.length == 4
    ) {
      return 'Prefixo Origem: Justificar clara e objetivamente a respeito do impacto que será gerado no funcionamento da dependência de origem com a efetivação da movimentação.\n Prefixo Destino: Justificar os motivos para o não aproveitamento dos candidatos classificados na oportunidade, informações sobre o desempenho profissional do funcionário indicado e demais informações que justifiquem o preenchimento da vaga fora das diretrizes de nomeações vigentes.';
    }
    if (authState.sessionData.prefixo == manifestacoesAnteriores[0].prefixo) {
      return 'Prefixo Destino: Justificar os motivos para o não aproveitamento dos candidatos classificados na oportunidade, informações sobre o desempenho profissional do funcionário indicado e demais informações que justifiquem o preenchimento da vaga fora das diretrizes de nomeações vigentes.';
    }

    if (authState.sessionData.prefixo == manifestacoesAnteriores[2].prefixo) {
      return 'Prefixo Origem: Justificar clara e objetivamente a respeito do impacto que será gerado no funcionamento da dependência de origem com a efetivação da movimentação.';
    }
    return null;
  };

  const showIcon = () => {
    const testString = placeholderOrigemDestino();
    if (testString == null) {
      return false;
    } else {
      return true;
    }
  };

  function reorderSelectedValues(
    selectedValues,
    arrayPrefixosEnvolvidosUnicos,
  ) {
    // Salvao valordo index por prefixo [prefixo]=index || No formato pra usar o sort...
    const prefixoIndexMap = {};
    arrayPrefixosEnvolvidosUnicos.forEach((item, index) => {
      prefixoIndexMap[item.prefixo] = index;
    });
    // Faz o sorte dos valores
    selectedValues.sort((a, b) => prefixoIndexMap[a] - prefixoIndexMap[b]);
    return selectedValues;
  }

  const onEnviarForm = () => {
    const fields = form.getFieldsValue();

    if (fields?.idAcao == 9) {
      const reorderedSelectedValues = reorderSelectedValues(
        fields?.manifestacoesComplementares,
        arrayPrefixosEnvolvidosUnicos,
      );
      const orderedFormData = {
        ...fields,
        manifestacoesComplementares: reorderedSelectedValues,
      };
      enviarForm(orderedFormData);
    } else {
      enviarForm(fields);
    }
  };
  //test

  return (
    <Form
      form={form}
      onFinish={() => {
        setIsButtonDisabled(true);

        onEnviarForm();
      }}
      style={{ marginBottom: '40px' }}
    >
      <CardResponsivo
        title={titulo}
        actions={
          exibirAcoes && [
            <Form.Item>
              <Space>
                <Button htmlType="reset">Cancelar</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={isButtonDisabled}
                >
                  {!['Finalizar', ' Registrar Manifestação'].includes(titulo)
                    ? `Incluir ${titulo}`
                    : titulo}
                </Button>
              </Space>
            </Form.Item>,
          ]
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {/*  //1) Serve pra printar as analises anteriores */}
          {analises && (
            <>
              {analises.map((analise) => (
                <>
                  <p> {analise?.nomePrefixo}</p>
                  <Comment
                    key={analise.id}
                    author={`${analise?.matricula} - ${analise?.nome}`}
                    avatar={<Avatar src={getProfileURL(analise?.matricula)} />}
                    content={analise?.texto}
                    datetime={analise?.updatedAt}
                  />

                  <Divider />
                </>
              ))}
            </>
          )}

          {/*  //2) Serve pra gerar os selects */}
          {exibirItensForm ? (
            <Space
              direction="vertical"
              style={{ width: '100%', marginTop: '20px' }}
            >
              <Form.Item
                name="idAcao"
                rules={[
                  {
                    required: true,
                    message: 'Escolha uma das opções.',
                  },
                ]}
              >
                <Select
                  placeholder="Selecione o tipo de manifestação para inclusão"
                  style={{
                    width: 400,
                  }}
                  allowClear
                  onChange={(valor) => setRegistraManifestacao(valor)}
                  options={opcoesSelect.map((opcao) => ({
                    label: opcao.descricao,
                    value: opcao.id,
                  }))}
                />
              </Form.Item>

              {/*     REGISTRAR MANIFESTAÇÂO */}
              {manifestacoesAutorizadas.includes(registraManifestacao) && (
                <>
                  <Form.Item
                    name="parecer"
                    rules={[
                      {
                        required: true,
                        message: 'Escolha uma das opções acima.',
                      },
                    ]}
                  >
                    <Radio.Group
                      onChange={(evento) =>
                        setJustivicativaLAbel(evento.target.value)
                      }
                    >
                      <Radio value={constantes.favoravel}>Favorável</Radio>
                      <Radio value={constantes.desfavoravel}>
                        Desfavorável
                      </Radio>
                    </Radio.Group>
                  </Form.Item>

                  <Space>
                    <Typography.Text>
                      Justificativa{' '}
                      {justificativaLabel === '0'
                        ? '(obrigatória)'
                        : '(opcional)'}
                    </Typography.Text>

                    <Tooltip title={placeholderOrigemDestino()}>
                      {showIcon() == true ? <InfoCircleOutlined /> : null}
                    </Tooltip>
                  </Space>

                  <Form.Item
                    name="texto"
                    rules={
                      justificativaLabel === '0'
                        ? [
                            {
                              required: true,
                              message:
                                'Escreva uma justificativa para seu voto desfavorável.',
                            },
                          ]
                        : null
                    }
                  >
                    <Input.TextArea
                      placeholder={placeholderOrigemDestino()}
                      autoSize={{ minRows: 5 }}
                    />
                  </Form.Item>
                </>
              )}

              {/*       //10 )  Select para formulario de solicitação de complemento */}
              {registraManifestacao === constantes.acaoComplemento && (
                <>
                  {/*                 //10 A )) Se for finalizar ou deferimento volta pra analise.*/}
                  {titulo == 'Finalizar' || titulo == 'Deferimento' ? (
                    <Typography.Text>
                      Descreva uma justificativa para atendimento da equipe de
                      analistas.
                    </Typography.Text>
                  ) : (
                    <>
                      {/*              //10 B )) Gera o array de prefixos pra solicitar complementação.*/}
                      <Form.Item
                        name="manifestacoesComplementares"
                        rules={[
                          {
                            required: true,
                            message: 'Escolha ao menos uma das opções acima.',
                          },
                        ]}
                      >
                        <Checkbox.Group>
                          <Space direction="vertical">
                            {arrayPrefixosEnvolvidosUnicos?.map((manifesta) => {
                              /* if (
                                  /2/.test(manifesta.acaoId) &&
                                  manifesta.situacaoId == 1
                                ) {
                                  return null;
                                } */

                              return (
                                <Checkbox
                                  key={manifesta.prefixo}
                                  value={manifesta.prefixo}
                                >
                                  {manifesta.nomePrefixo}
                                </Checkbox>
                              );
                            })}
                          </Space>
                        </Checkbox.Group>
                      </Form.Item>
                      <Typography.Text>
                        Descreva qual informaçãos complementar você espera
                        receber de cada prefixo selecionado.
                      </Typography.Text>
                    </>
                  )}

                  {/*                 //10 C )) O campo pro usuario escrever.*/}
                  <Form.Item
                    name="texto"
                    rules={[
                      {
                        required: justificativaLabel === '0',
                        message:
                          'Escreva uma justificativa para seu voto desfavorável.',
                      },
                      {
                        required:
                          registraManifestacao === constantes.acaoComplemento,
                        message:
                          'Descreva quais informações você deseja ver na manifestação complementar que está solicitando.',
                      },
                    ]}
                  >
                    <Input.TextArea autoSize={{ minRows: 6 }} />
                  </Form.Item>
                </>
              )}

              {/*10 - FIM  DO FORMULARIO DA ACAO COMPLEMENTO*/}
            </Space>
          ) : (
            mensagemErro
          )}
        </Space>
      </CardResponsivo>
    </Form>
  );
}
