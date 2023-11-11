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
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';

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
  const manifestacoesAutorizadas = [
    constantes.acaoManifestacao,
    constantes.acaoAnalise,
    constantes.acaoDeferir,
    constantes.acaoFinalizar,
  ];

  const objetoFiltro = {};
  const arraySemDuplicados = manifestacoesAnteriores?.filter((manifesta) => {
    return objetoFiltro.hasOwnProperty(manifesta.prefixo)
      ? false
      : (objetoFiltro[manifesta.prefixo] = true);
  });

  const placeholderOrigemDestino = () => {
    if (titulo === 'Análise' || titulo === 'Deferimento' || titulo === 'Finalizar') {
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
  };

  return (
    <Form form={form} onFinish={() => enviarForm(form.getFieldsValue())}>
      <CardResponsivo
        title={titulo}
        actions={
          exibirAcoes && [
            <Form.Item>
              <Space>
                <Button htmlType="reset">Cancelar</Button>
                <Button type="primary" htmlType="submit">
                  {`Incluir ${titulo}`}
                </Button>
              </Space>
            </Form.Item>,
          ]
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {analises && (
            <>
              {analises?.length
                ? analises.map((analise) => (
                    <>
                      <Comment
                        key={analise.id}
                        author={`${analise?.matricula} - ${analise?.nome}`}
                        avatar={
                          <Avatar src={getProfileURL(analise?.matricula)} />
                        }
                        content={analise?.texto}
                        datetime={analise?.dataAtualizacao}
                      />
                      <Divider />
                    </>
                  ))
                : 'Não há análises anteriores registradas para este pedido.'}
            </>
          )}

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
                  options={tiposManifestacoes.map((opcao) => ({
                    label: opcao.descricao,
                    value: opcao.id,
                  }))}
                />
              </Form.Item>

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
                      <InfoCircleOutlined />
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
                      style={{ maxWidth: '900px', fontSize: '25px' }}
                      placeholder={placeholderOrigemDestino()}
                      autoSize={{ minRows: 10 }}
                    />
                  </Form.Item>
                </>
              )}

              {registraManifestacao === constantes.acaoComplemento && (
                <>
                  {titulo == 'Finalizar' || titulo == 'Deferimento' ? (
                    <Typography.Text>
                      Descreva uma justificativa para atendimento da equipe de
                      analistas.
                    </Typography.Text>
                  ) : (
                    <>
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
                            {arraySemDuplicados?.map((manifesta) => {
                              if (
                                /2/.test(manifesta.acaoId) &&
                                manifesta.situacaoId == 1
                              ) {
                                return null;
                              }

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
                        Descreva qual informação complementar você espera
                        receber de cada prefixo selecionado.
                      </Typography.Text>
                    </>
                  )}

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
            </Space>
          ) : (
            mensagemErro
          )}
        </Space>
      </CardResponsivo>

      {deferidos && (
        <CardResponsivo style={{ marginTop: '20px' }} title={'Deferimentos'}>
          <Space
            direction="vertical"
            style={{ width: '100%', marginTop: '10px' }}
          >
            <>
              {deferidos?.length
                ? deferidos.map((deferimento) => (
                    <>
                      <Comment
                        key={deferimento.id}
                        author={`${deferimento?.matricula} - ${deferimento?.nome}`}
                        avatar={
                          <Avatar src={getProfileURL(deferimento?.matricula)} />
                        }
                        content={deferimento?.texto}
                        datetime={deferimento?.dataAtualizacao}
                      />
                      <Divider />
                    </>
                  ))
                : 'Não há deferimentos anteriores registrados para este pedido.'}
            </>
          </Space>
        </CardResponsivo>
      )}
    </Form>
  );
}
