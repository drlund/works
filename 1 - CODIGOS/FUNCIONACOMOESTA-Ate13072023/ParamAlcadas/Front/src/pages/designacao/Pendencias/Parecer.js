import React, { useCallback, useEffect, useState } from 'react';

import {
  Form,
  Row,
  Col,
  Button,
  Card,
  message,
  Select,
  Result,
  Switch,
} from 'antd';
import _ from 'lodash';

import Dragger from 'antd/lib/upload/Dragger';
import { InboxOutlined } from '@ant-design/icons';

import {
  getOpcoesHistorico,
  setParecer,
  getTemplateByHistorico,
} from 'services/ducks/Designacao.ducks';

import useEffectOnce from 'utils/useEffectOnce';
import EditorTexto from './EditorTexto';

const { Option } = Select;
const CONFIDENCIAL = 1;

function Parecer(props) {
  const [formParecer] = Form.useForm();

  const [confirm, setConfirm] = useState();

  const [files, setFiles] = useState();

  const [tipo, setTipo] = useState();

  const [idHistorico, setIdHistorico] = useState();
  const [historico, setHistorico] = useState();

  const [templateVisible, setTemplateVisible] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [textoSelecionado, setTextoSelecionado] = useState('');

  const onFinish = (values) => {
    const { id } = props;
    setIdHistorico(values.id_historico);

    values.id = id;
    values.files = files;
    values.texto = values.editor.value || ' ';
    if (tipo) {
      (values.tipo = CONFIDENCIAL);
    }

    setParecer(values)
      .then((parecer) => setConfirm(parecer))
      .catch((error) => message.error(error));
  };

  const [options, setOptions] = useState({});

  useEffectOnce(() => {
    setSelect();
  });

  const setSelect = () => {
    const { acesso, consulta, id } = props;
    getOpcoesHistorico(acesso, id, consulta)
      .then((thisOptions) => setOptions(thisOptions))
      .catch((error) => message.error(error));
  };

  const getTemplates = useCallback(() => {
    let sair = false;
    getTemplateByHistorico(historico)
      .then((template) => setTemplates([...template]))
      .catch((error) => message.error(error))
      .then(() => {
        sair = true;
        return sair;
      });

    return sair;
  }, [historico]);

  useEffect(() => {
    if (!_.isNil(historico)) {
      getTemplates();
      setTemplateVisible(true);
    }
  }, [getTemplates, historico]);

  useEffect(() => {
    if (!_.isEmpty(textoSelecionado)) {
      formParecer.setFieldsValue({ texto: textoSelecionado });
    }
  }, [textoSelecionado]);

  const adjTemplate = (value) => {
    const [selecionado] = templates.filter((temp) => temp.id === value);
    setTextoSelecionado(selecionado.texto);
  };

  const optionsTemplate = () => {
    if (_.isEmpty(templates)) {
      return null;
    }
    return templates.map((opt) => (
      <Option key={opt.id} value={opt.id}>
        {opt.curto}
      </Option>
    ));
  };

  const updateSelf = () => {
    const { updateSelf: setUpdateSelf } = props;
    setUpdateSelf(idHistorico);
  };

  const normFile = (e) => {
    // ? 'Upload event: e'

    if (Array.isArray(e)) {
      return e;
    }

    return e && e.fileList;
  };

  const beforeUpload = (thisFiles, fileList) => {
    setFiles(fileList);
    return false;
  };

  const removeFile = (file) => {
    const index = files.indexOf(file);
    const newFileList = files.slice();
    newFileList.splice(index, 1);
    setFiles(newFileList);
  };

  const optionsHistorico = () => {
    if (_.isEmpty(options)) {
      return null;
    }
    return options.map((opt) => (
      <Option key={opt.id} value={opt.id}>
        {opt.verbo}
      </Option>
    ));
  };

  const resetTemplate = () => {
    setTemplateVisible(false);
    setTemplates([]);
    setTextoSelecionado('');
    setHistorico(undefined);
    return 1;
  };

  const adjHistorico = (value) => {
    if (historico !== value) {
      resetTemplate();
      formParecer.setFieldsValue({ templates: null });
    }
    setHistorico(value);
  };

  const onConfidencialChange = (checked) => {
    setTipo(checked);
  };

  return (
    <Card
      headStyle={{
        textAlign: 'center',
        fontWeight: 'bold',
        background: '#74B4C4',
        fontSize: '1.3rem',
      }}
      bodyStyle={{ alignContent: 'center', padding: 10 }}
      title="Parecer, Observação ou Comentário"
    >
      <Row>
        <Col span={14} offset={5}>
          {confirm ? (
            <Result
              status="success"
              title="Dados Gravados com Sucesso!"
              extra={[
                <Button type="primary" key="renew" onClick={updateSelf}>
                  Concluído
                </Button>,
              ]}
            />
          ) : (
            <Form
              name="parecer"
              layout="vertical"
              labelAlign="left"
              onFinish={onFinish}
              form={formParecer}
              initialValues={{
                editor: '<p></p>'
              }}
              onValuesChange={(changedValues) => {
                if ('templates' in changedValues) {
                  if (changedValues.templates) {
                    const [template] = templates.filter(
                      (item) => item.id === changedValues.templates
                    );
                    formParecer.setFieldsValue({ editor: template.texto });
                  }
                }
              }}
            >
              <Row>
                <Col>
                  <Form.Item
                    label="Tipo do Texto"
                    name="id_historico"
                    rules={[
                      {
                        required: true,
                        message: 'Por favor, selecione uma das opções',
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      onChange={adjHistorico}
                      placeholder="Escolha uma opção"
                      optionFilterProp="label"
                      filterOption={(input, option) => option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0}
                    >
                      {optionsHistorico()}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              {
                templateVisible
                && [10, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28].includes(historico)
                && (
                  <Row>
                    <Col>
                      <Form.Item label="Templates" name="templates">
                        <Select
                          showSearch
                          onChange={adjTemplate}
                          placeholder="Escolha um template (OPCIONAL)"
                          optionFilterProp="children"
                          filterOption={(input, option) => option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0}
                        >
                          {optionsTemplate()}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                )
              }
              <Row>
                <Col span={24}>
                  <Form.Item
                    key={formParecer.getFieldValue('templates')}
                    label="Texto"
                    name="editor"
                    rules={[
                      {
                        required: true,
                        message: 'Campo obrigatório. Favor preenchê-lo!',
                      },
                    ]}
                  >
                    <EditorTexto readOnly={!formParecer.getFieldValue('id_historico')} />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item
                    label="Envio de documentos"
                    valuePropName="fileList"
                    name="documentoParecer"
                    getValueFromEvent={normFile}
                  >
                    <Dragger
                      name="documento"
                      beforeUpload={beforeUpload}
                      onRemove={removeFile}
                      valuePropName="fileList"
                      getValueFromEvent={normFile}
                      accept=".pdf,image/*"
                      multiple
                    >
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Clique aqui ou arraste até aqui os arquivos a enviar
                      </p>
                      <p className="ant-upload-hint">
                        Envie (OPCIONAL) arquivo(s) para fundamentar o parecer,
                        observação ou comentário acima
                      </p>
                    </Dragger>
                  </Form.Item>
                </Col>
              </Row>
              {props.acesso === 'full'
                && [10, 11, 12, 13, 14, 15].includes(historico)
                && (
                  <Row>
                    <Col>
                      <Form.Item
                        labelCol={{ span: 5 }}
                        wrapperCol={{ span: 16 }}
                        valuePropName="checked"
                        label="Confidencial"
                        name="tipo"
                      >
                        <Switch onChange={onConfidencialChange} />
                      </Form.Item>
                    </Col>
                  </Row>
                )}
              <Row>
                <Col>
                  <Button type="primary" htmlType="submit">
                    {
                      [16, 17, 18, 19, 20, 21, 22, 23, 24, 25].includes(historico)
                      && 'Encaminhar Processo'
                    }
                    {
                      [26, 27, 28].includes(historico)
                      && 'Concluir/Cancelar'
                    }
                    {
                      ![16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28].includes(historico)
                      && 'Emitir Parecer'
                    }
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Col>
      </Row>
    </Card>
  );
}
export default React.memo(Parecer);
