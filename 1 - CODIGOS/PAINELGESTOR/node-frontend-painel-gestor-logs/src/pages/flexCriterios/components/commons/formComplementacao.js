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

export default function FormularioComplementacao({
  enviarForm,
  titulo,
  exibirAcoes,
  exibirItensForm,
  manifestacoesAnteriores,
  mensagemErro,
  tiposManifestacoes,
  complemento,
}) {
  const [form] = Form.useForm();
  const [justificativaLabel, setJustivicativaLAbel] = useState();
  const [registraManifestacao, setRegistraManifestacao] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const manifestacoesAutorizadas = [
    constantes.acaoManifestacao,
    constantes.acaoAnalise,
    constantes.acaoDeferir,
    constantes.acaoFinalizar,
  ];

  return (
    <Form
      form={form}
      onFinish={() => {
        setIsButtonDisabled(true);
        enviarForm(form.getFieldsValue(), complemento.id)
      }}
    >
      <CardResponsivo
        style={{ background: '#fffdd0' }}
        title={titulo}
        actions={
          exibirAcoes && [
            <Form.Item>
              <Space>
                <Button htmlType="reset">Cancelar</Button>
                <Button type="primary" htmlType="submit" disabled={isButtonDisabled}>
                  {`Incluir ${titulo}`}
                </Button>
              </Space>
            </Form.Item>,
          ]
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Comment
            author={<a>{complemento.matSolicitanteComplemento}</a>}
            avatar={
              <Avatar
                src={getProfileURL(complemento.matSolicitanteComplemento)}
              />
            }
            content={
              <p>
                <strong>Complemento esperado</strong>:{' '}
                {complemento?.complementoEsperado}
              </p>
            }
            datetime={
              <Tooltip /*  title={complemento.createdAt} */>
                <span>{complemento.createdAt}</span>
              </Tooltip>
            }
          />

          {exibirItensForm ? (
            <Space direction="vertical" style={{ width: '100%' }}>
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
                  placeholder="Selecione o tipo de manifestação"
                  style={{
                    width: 400,
                  }}
                  allowClear
                  onChange={(valor) => setRegistraManifestacao(valor)}
                  options={tiposManifestacoes?.map((opcao) => ({
                    label: 'Responder Complementação',
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

                  <Form.Item
                    name="texto"
                    rules={
                      justificativaLabel === constantes.desfavoravel
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
                    <Input.TextArea autoSize={{ minRows: 6 }} />
                  </Form.Item>
                </>
              )}
              {registraManifestacao === constantes.acaoComplemento && (
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
                        {manifestacoesAnteriores.map((manifesta) => {
                          /*      console.log('MANIFESTA', manifesta); */
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
                    Descreva qual informação complementar você espera receber de
                    cada prefixo selecionado.
                  </Typography.Text>
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
    </Form>
  );
}
