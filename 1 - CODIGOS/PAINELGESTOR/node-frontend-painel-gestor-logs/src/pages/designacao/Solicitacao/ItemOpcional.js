import React, { useState } from 'react';
import {
  Form, Row, Col, Input, Upload, Card,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { DefaultGutter } from 'utils/Commons';
import { beforeUpload, normFile, removeFile } from './metodosItens';

function ItemOpcional() {
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
              <Form.Item name="opcionalText" label="Caso queira enviar informações adicionais, por favor use este campo" labelAlign="left">
                <Input.TextArea style={{ width: '100%' }} maxLength={10000} rows={4} />
              </Form.Item>
              <Form.Item
                label="Envio de documentos (OPCIONAL)"
                valuePropName="fileList"
                name="opcionalFiles"
                getValueFromEvent={thisNormFile}
              >
                <Upload.Dragger
                  name="opcional"
                  beforeUpload={thisBeforeUpload}
                  onRemove={thisRemoveFile}
                  getValueFromEvent={thisNormFile}
                  accept=".pdf,image/*"
                  multiple
                  style={{ width: '100%' }}
                >
                  <p className="ant-upload-drag-icon"><InboxOutlined /></p>
                  <p className="ant-upload-text">Clique aqui ou arraste até aqui os arquivos a enviar</p>
                  <p className="ant-upload-hint">Envie os arquivos (opcionais) que julgar importante para o processo de Movimentação Transitória.</p>
                </Upload.Dragger>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default React.memo(ItemOpcional);
