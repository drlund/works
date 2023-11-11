import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Row, Col, Radio, Card, InputNumber, Tag, Form, Upload, Input, Tooltip, Typography
} from 'antd';
import { InboxOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import { DefaultGutter } from 'utils/Commons';
import useEffectOnce from 'utils/useEffectOnce';

import Constants from 'pages/designacao/Commons/Constants';
import { beforeUpload, normFile, removeFile } from './metodosItens';

const { Text } = Typography;

const { TIPOS } = Constants();

function ItemLimitrofes({
  analise,
  elem,
}) {
  const diasUteis = useSelector(({ designacao }) => designacao.dias_uteis);
  const diasTotais = useSelector(({ designacao }) => designacao.dias_totais);
  const distancia = useSelector(({ designacao }) => (
    designacao.dadosAnalise.rotaRodoviaria.distancia));
  const tipo = useSelector(({ designacao }) => parseInt(designacao.tipo, 10));

  const [files, setFiles] = useState([]);

  const thisBeforeUpload = (file, fileList) => {
    setFiles(beforeUpload(files, fileList, file));
    return false;
  };

  const thisRemoveFile = (file) => setFiles(removeFile(files, file));

  const thisNormFile = (e) => normFile(files, e);

  /**
   * ? 1: Designação Interina GG e 3GUN
   * ? 2: Designação Interina Super Regional
   * ? 3: Adição - Qualquer
   */
  const [tipoLimitrofe, setTipoLimitrofe] = useState();

  const carregar = () => {
    let tL = null;

    if (tipo === TIPOS.DESIGNACAO && analise.nivelGer && ['1GUN', '3GUN'].includes(analise.nivelGer.ref_org)) {
      tL = 1;
    }
    if (tipo === TIPOS.DESIGNACAO && analise.nivelGer && (analise.nivelGer.ref_org === '2GUT' && analise.nivelGer.flag_administrador === 1)) {
      tL = 2;
    }
    if (tipo === TIPOS.ADICAO) {
      tL = 3;
    }
    if (tL) setTipoLimitrofe(tL);
  };

  useEffectOnce(() => {
    carregar();
  });

  const [tipoDesloc, setTipoDesloc] = useState('');

  const changeTipoDesloc = (event) => {
    setTipoDesloc(event.target.value);
  };

  const questoes = () => {
    if (!tipoLimitrofe) {
      return null;
    }

    if (tipoLimitrofe === 1) {
      return (
        <>
          <Form.Item
            name="limitrofesMotivo"
            label="Qual(is) o(s) motivo(s) de não indicação de funcionário(s) da própria agência?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Detalhar funcionários público alvo. Ex.: F0000000 - Férias. Min. 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            name="limitrofesOrient"
            label="O(s) funcionário(s) da própria agência recebe(m) orientação(ões) para se capacitar(em)?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Min. 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            name="limitrofesLimit"
            label="Informar as agências LIMÍTROFES"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Min. 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            name="limitrofesDistL"
            label="Qual distância entre a(s) agência(s) LIMÍTROFE(S) e a agência DESTINO?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Min. 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            name="limitrofesDific"
            label="Há dificuldade quanto ao transporte de funcionários da(s) agência(s) LIMÍTROFE(S)?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Ex..: Estrada de chão batido, inexistência de transporte por via terrestre, custos com transporte, horário do transporte não compatível com a jornada de trabalho e etc. Min. 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            name="limitrofesAusenc"
            label="Há ausências de funcionários de agências LIMÍTROFES para o período de designação interina?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Min. 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            initialValue={`${distancia} km`}
            name="limitrofesDistNL"
            label="Qual a distância entre a agência NÃO LIMÍTROFE e a agência DESTINO?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder={`${distancia} km`}
            />
          </Form.Item>
        </>
      );
    }

    if (tipoLimitrofe === 2) {
      return (
        <>
          <Form.Item
            name="limitrofesMotivo"
            label="Qual o motivo da não indicação de funcionário localizado em município limítrofe?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Min. 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            name="limitrofesAusenc"
            label="Há ausências de funcionários de agências LIMÍTROFES para o período de designação interina?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Favor Detalhar por funcionário as ausências. Ex..: F0000000 - Férias. Min 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            initialValue={`${distancia} km`}
            name="limitrofesDistNL"
            label="Qual a distância entre a agência NÃO LIMÍTROFE e a agência DESTINO?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder={`${distancia} km`}
            />
          </Form.Item>
        </>
      );
    }

    if (tipoLimitrofe === 3) {
      return (
        <>
          <Form.Item
            name="limitrofesLimit"
            label="Informar as agências LIMÍTROFES"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}>
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Min. 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            name="limitrofesDistL"
            label="Qual distância entre a(s) agência(s) LIMÍTROFE(S) e a agência DESTINO?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}>
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Min. 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            name="limitrofesDific"
            label="Há dificuldade quanto ao transporte de funcionários da(s) agência(s) LIMÍTROFE(S)?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}
          >
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Ex..: Estrada de chão batido, inexistência de transporte por via terrestre, custos com transporte, horário do transporte não compatível com a jornada de trabalho e etc. Min. 10 caracteres"
            />
          </Form.Item>
          <Form.Item
            name="limitrofesAusenc"
            label="Há ausências de funcionários de agências LIMÍTROFES para o período de designação interina?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}>
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder="Favor Detalhar as ausências por funcionário. Ex..: F0000000 - Férias"
            />
          </Form.Item>
          <Form.Item
            initialValue={`${distancia} km`}
            name="limitrofesDistNL"
            label="Qual a distância entre a agência NÃO LIMÍTROFE e a agência DESTINO?"
            labelAlign="left"
            rules={[{ required: true, message: 'Campo Obrigatório' }]}>
            <Input.TextArea
              style={{ width: '100%' }}
              minLength={10}
              maxLength={10000}
              rows={4}
              placeholder={`${distancia} km`}
            />
          </Form.Item>
        </>
      );
    }

    return null;
  };

  const [desloc, setDesloc] = useState(0);
  const [hosped, setHosped] = useState(0);
  const [alim, setAlim] = useState(0);

  const changeDesloc = (value) => {
    setDesloc(value);
  };

  const changeHosped = (value) => {
    setHosped(value);
  };

  const changeAlim = (value) => {
    setAlim(value);
  };

  const nome = `${elem.nome}Files`;

  return (
    <Row gutter={DefaultGutter}>
      <Col span={16} offset={4}>
        <Row>
          <Col>
            <Card bodyStyle={{ width: '100%' }}>
              <Form.Item name="tipoDesloc" label="Tipo Deslocamento" rules={[{ required: true, message: 'Campo Obrigatório' }]}>
                <Radio.Group onChange={changeTipoDesloc} value={tipoDesloc}>
                  <Radio value={1}>Hospedagem</Radio>
                  <Radio value={2}>Deslocamento Diário</Radio>
                </Radio.Group>
              </Form.Item>
              <Row>
                <Col>
                  {
                    tipoDesloc === 1
                      ? (
                        <Card>
                          <Row>
                            <Col span={10} style={{ align: 'left' }}>Quantidade Diárias</Col>
                            <Col span={14}>
                              <Tag style={{ width: '100%' }}>
                                {diasTotais}
                                {' '}
                                {diasTotais > 1 ? 'dias' : 'dia'}
                              </Tag>
                            </Col>
                          </Row>
                          <Form.Item
                            name="limitrofesDesloc"
                            label={(
                              <>
                                <Text>Valor Deslocamento (Ida + Volta) </Text>
                                <Tooltip title="IN377-1 itens 4.11.2.2 e 4.12">
                                  <QuestionCircleOutlined />
                                </Tooltip>
                              </>
                            )}
                            rules={[{ required: true, message: 'Campo Obrigatório' },
                              () => ({
                                validator(rule, value) {
                                  if (value) {
                                    const valueFloat = parseFloat((`${value}`).replace(/,/g, '.'));
                                    if (valueFloat > 9.99) {
                                      return Promise.resolve();
                                    }
                                  }
                                  return Promise.reject('Valor mínimo de R$ 10,00');
                                }
                              })]}>
                            <InputNumber style={{ width: '100%' }} precision={2} decimalSeparator="," onChange={changeDesloc} />
                          </Form.Item>
                          <Form.Item
                            name="limitrofesHosped"
                            label={(
                              <>
                                <Text>Valor Diário Hospedagem </Text>
                                <Tooltip title="IN377-1 itens 4.11.5.3 e 4.12.3"><QuestionCircleOutlined /></Tooltip>
                              </>
                            )}
                            rules={[{ required: true, message: 'Campo Obrigatório' },
                              () => ({
                                validator(rule, value) {
                                  if (value) {
                                    const valueFloat = parseFloat((`${value}`).replace(/,/g, '.'));
                                    if ((valueFloat > 82.0 || valueFloat < 321.0)) {
                                      return Promise.resolve();
                                    }
                                  }
                                  return Promise.reject('Valor mínimo de R$ 82,00 e máximo de R$ 321,00');
                                }
                              })]}>
                            <InputNumber style={{ width: '100%' }} precision={2} decimalSeparator="," onChange={changeHosped} />
                          </Form.Item>
                          <Form.Item
                            name="limitrofesAlim"
                            label={(
                              <>
                                <Text>Valor Diário Alimentação </Text>
                                <Tooltip title={(
                                  <Text style={{ color: 'white' }}>
                                    IN377-1 item 4.12.2
                                    <br />
                                    Integral R$ 27,00
                                    <br />
                                    Reduzida R$ 22,00
                                  </Text>
                                )}>
                                  <QuestionCircleOutlined />
                                </Tooltip>
                              </>
                            )}
                            rules={[{ required: true, message: 'Campo Obrigatório' },
                              () => ({
                                validator(rule, value) {
                                  if (value) {
                                    const valueFloat = parseFloat((`${value}`).replace(/,/g, '.'));
                                    if ((valueFloat >= 22.0 || valueFloat <= 321.0)) {
                                      return Promise.resolve();
                                    }
                                  }
                                  return Promise.reject('Valor mínimo de R$ 22,00 e máximo de R$ 27,00');
                                }
                              })]}>
                            <InputNumber style={{ width: '100%' }} precision={2} decimalSeparator="," onChange={changeAlim} />
                          </Form.Item>
                          <Row>
                            <Col span={6}>Valor Total</Col>
                            <Col span={18}>
                              <Row>
                                <Col span={8}>
                                  <Text keyboard>
                                    {diasTotais}
                                    {' '}
                                    dias X
                                    {' '}
                                  </Text>
                                </Col>
                              </Row>
                              <Row>
                                <Col span={8}><Text>Deslocamento</Text></Col>
                                <Col span={8}>
                                  <Text keyboard>{desloc ? desloc.toLocaleString('PT-br', { style: 'currency', currency: 'BRL' }) : '0,00'}</Text>
                                  {' '}
                                  =
                                  {' '}
                                </Col>
                                <Col span={8}><Text keyboard>{desloc ? desloc.toLocaleString('PT-br', { style: 'currency', currency: 'BRL' }) : '0,00'}</Text></Col>
                              </Row>
                              <Row>
                                <Col span={8}><Text>Hospedagem</Text></Col>
                                <Col span={8}>
                                  <Text keyboard>{hosped ? hosped.toLocaleString('PT-br', { style: 'currency', currency: 'BRL' }) : '0,00'}</Text>
                                  {' '}
                                  =
                                  {' '}
                                </Col>
                                <Col span={8}><Text keyboard>{hosped ? (hosped * diasTotais).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' }) : '0,00'}</Text></Col>
                              </Row>
                              <Row>
                                <Col span={8}><Text>Alimentação</Text></Col>
                                <Col span={8}>
                                  <Text keyboard>{alim ? alim.toLocaleString('PT-br', { style: 'currency', currency: 'BRL' }) : '0,00'}</Text>
                                  {' '}
                                  =
                                  {' '}
                                </Col>
                                <Col span={8}><Text keyboard>{alim ? (alim * diasTotais).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' }) : '0,00'}</Text></Col>
                              </Row>
                              <Row>
                                <Col span={16}>
                                  <Text> (Valores estimados. Podem variar conforme análise) </Text>
                                </Col>
                                <Col span={8}>
                                  =
                                  {' '}
                                  <Text keyboard>{((desloc || 0) + ((hosped || 0) * diasTotais) + ((alim || 0) * diasTotais)).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })}</Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Card>
                      )
                      : tipoDesloc === 2
                      && (
                        <Card>
                          <Row>
                            <Col span={10} style={{ align: 'left' }}>Quantidade Diárias (dias úteis)</Col>
                            <Col span={14}>
                              <Tag style={{ width: '100%' }}>
                                {diasUteis}
                                {' '}
                                {diasUteis > 1 ? 'dias' : 'dia'}
                              </Tag>
                            </Col>
                          </Row>
                          <Form.Item
                            name="limitrofesDesloc"
                            label={(
                              <>
                                <Text>Valor Diário Deslocamento </Text>
                                <Tooltip title="IN377-1 itens 4.10, 4.12.4 e 4.12.6 a 10"><QuestionCircleOutlined /></Tooltip>
                              </>
                            )}
                            rules={[{ required: true, message: 'Campo Obrigatório' },
                              () => ({
                                validator(rule, value) {
                                  if (value) {
                                    const valueFloat = parseFloat((`${value}`).replace(/,/g, '.'));
                                    if (valueFloat) {
                                      return Promise.resolve();
                                    }
                                  }
                                  return Promise.reject('Valor obrigatório');
                                }
                              })]}>
                            <InputNumber style={{ width: '100%' }} precision={2} decimalSeparator="," onChange={changeDesloc} />
                          </Form.Item>
                          <Row>
                            <Col span={6}>Valor Total</Col>
                            <Col span={18}>
                              <Row>
                                <Col span={8}>
                                  <Text keyboard>
                                    {diasUteis}
                                    {' '}
                                    dias X
                                    {' '}
                                  </Text>
                                </Col>
                              </Row>
                              <Row>
                                <Col span={8}><Text>Deslocamento</Text></Col>
                                <Col span={8}>
                                  <Text keyboard>{desloc ? desloc.toLocaleString('PT-br', { style: 'currency', currency: 'BRL' }) : '0,00'}</Text>
                                  {' '}
                                  =
                                  {' '}
                                </Col>
                                <Col span={8}><Text keyboard>{desloc ? (desloc * diasUteis).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' }) : '0,00'}</Text></Col>
                              </Row>
                              <Row>
                                <Col span={16}>
                                  <Text> (Valores estimados. Podem variar conforme análise) </Text>
                                </Col>
                                <Col span={8}>
                                  =
                                  {' '}
                                  <Text keyboard>{(((desloc || 0) * diasUteis)).toLocaleString('PT-br', { style: 'currency', currency: 'BRL' })}</Text>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </Card>
                      )
                  }
                </Col>
              </Row>
              <Row>
                <Col>Por Favor, responda as perguntas abaixo</Col>
              </Row>
              {
                questoes()
              }
              <Form.Item name="limitrofesText" label="Demais motivos relevantes para a designação interina NÃO limítrofe (Opcional)" labelAlign="left">
                <Input.TextArea style={{ width: '100%' }} minLength={10} maxLength={10000} rows={10} placeholder="Min. 10 caracteres" />
              </Form.Item>
              <Form.Item
                label="Envio de documentos (OPCIONAL)"
                valuePropName="fileList"
                name={nome}
                getValueFromEvent={thisNormFile}
              >
                <Upload.Dragger
                  name="limitrofes"
                  beforeUpload={thisBeforeUpload}
                  onRemove={thisRemoveFile}
                  getValueFromEvent={thisNormFile}
                  accept=".pdf,image/*"
                  multiple
                  style={{ width: '100%' }}
                >
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">Clique aqui ou arraste até aqui os arquivos a enviar</p>
                  <p className="ant-upload-hint">Envie os arquivos que comprovem a necessidade de flexibilização desta regra</p>
                </Upload.Dragger>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default React.memo(ItemLimitrofes);
