import React, { useState } from 'react';
import {
  Row, Col, Input, Form, Upload, Card, List,
  Typography
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { DefaultGutter } from 'utils/Commons';
import { beforeUpload, normFile, removeFile } from './metodosItens';

const { Text } = Typography;

function ItemNormal({ elem, analise }) {
  const nomeFiles = `${elem.nome}Files`;
  const nomeText = `${elem.nome}Text`;

  const [files, setFiles] = useState([]);

  const thisBeforeUpload = (file, fileList) => {
    setFiles(beforeUpload(files, fileList, file));
    return false;
  };

  const thisRemoveFile = (file) => setFiles(removeFile(files, file));

  const thisNormFile = (e) => normFile(files, e);

  return (
    <Row gutter={DefaultGutter}>
      <Col span={16} offset={4}>
        <Row>
          <Col>
            <Card bodyStyle={{ width: '100%' }}>
              {
                elem.nome === 'trilhaEtica'
                && (
                  <List
                    header={<Text strong>Cursos da Trilha Ética Faltantes:</Text>}
                    dataSource={analise.origem.treinamentos.cursosTrilhaEticaNaoRealizados}
                    renderItem={(item) => (
                      <List.Item>
                        <Text mark>{item.cd_curso}</Text>
                        {' - '}
                        <Text>{item.nm_curso}</Text>
                      </List.Item>
                    )}
                  />
                )
              }
              <Form.Item
                name={nomeText}
                label="Digite a justificativa"
                labelAlign="left"
                rules={[{ required: true, message: 'Campo Obrigatório' }]}
              >
                <Input.TextArea style={{ width: '100%' }} maxLength={10000} rows={4} />
              </Form.Item>
              <Form.Item
                label="Envio de documentos (OPCIONAL)"
                valuePropName="fileList"
                name={nomeFiles}
                getValueFromEvent={thisNormFile}
              >
                <Upload.Dragger
                  key={nomeFiles}
                  name="documentos"
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

export default React.memo(ItemNormal);
