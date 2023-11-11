import React, { useState, useEffect } from 'react';
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Space,
  Tag,
  Tooltip,
  Upload,
} from 'antd';
import { InfoCircleOutlined, UploadOutlined } from '@ant-design/icons';
import { getTipoFlex } from 'pages/flexCriterios/apiCalls/flexTipoDadosAPICall';
import '../../flexCriterios.module.css';
import { getSessionState } from 'components/authentication/Authentication';

export default function InclusaoPedido({ fileList, addFile }) {
  const [tipoFlex, setTipoFlex] = useState([]);
  useEffect(() => {
    getTipoFlex()
      .then((listaTipos) => {
        setTipoFlex(listaTipos);
      })
      .catch((resposta) => {
        message.error(resposta);
      });
  }, []);

  /*   const [fileList, setFileList] = useState([]); */

  const handleChange = (info) => {
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-2);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    addFile(newFileList);
    /*  setFileList(newFileList); */
  };

  const sessionState = getSessionState();

  const props = {
    headers: {
      'X-CSRFToken': sessionState.token,
      'X-CSRF-Token': sessionState.token,
      token: sessionState.token,
    },

    action: `${process.env.REACT_APP_ENDPOINT_API_URL}/flexcriterios/uploads?token=${sessionState.token}`,
    onChange: handleChange,
    multiple: true,
  };

  const tagRender = ({ value, label, closable, onClose }) => {
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const tipoSelecionado = tipoFlex.find((flex) => flex.id === value);

    return (
      <Tag
        color={tipoSelecionado.cor}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        {label}
      </Tag>
    );
  };

  return (
    <Space className="containerForm" direction="vertical" size="middle">
      <h2 className="ant-descriptions-title"> Tipo de Flexibilização</h2>
      <div className="containerItem">
        <Form.Item
          name="tipoFlexibilizacao"
          rules={[
            {
              required: true,
              message: 'Escolha uma das opções disponíveis.',
            },
          ]}
          style={{ maxWidth: '900px' }}
        >
          <Select
            mode="multiple"
            allowClear
            tagRender={tagRender}
            className="descricaoMetade"
            fieldNames={{ label: 'nome', value: 'id' }}
            options={tipoFlex}
          />
        </Form.Item>
      </div>

      <Space>
        <h2 className="ant-descriptions-title">Justificativa</h2>
        <Tooltip
          title={
            'Justificar os motivos para o não aproveitamento dos candidatos classificados na oportunidade, informações sobre o desempenho profissional do funcionário indicado e demais informações que justifiquem o preenchimento da vaga fora das diretrizes de nomeações vigentes.'
          }
        >
          <InfoCircleOutlined />
        </Tooltip>
      </Space>

      <Form.Item
        name="justificativa"
        rules={[
          {
            required: true,
            message:
              'Descreva o motivo que justifica o pedido de flexibilização para nomeação.',
          },

          {
            max: 1000,
            message: 'A justificativa deve ter até 1000 caracteres.',
          },
        ]}
      >
        <Input.TextArea
          placeholder="
        Justificar os motivos para o não aproveitamento dos candidatos classificados na oportunidade, informações sobre o desempenho profissional do funcionário indicado e demais informações que justifiquem o preenchimento da vaga fora das diretrizes de nomeações vigentes
        "
          style={{ maxWidth: '900px', fontSize: 20, padding: '10px' }}
          autoSize={{ minRows: 10 }}
        />
      </Form.Item>

      <Form.Item>
        <Upload {...props} fileList={fileList}>
          <Button icon={<UploadOutlined />}>Adicionar anexos</Button>
        </Upload>
      </Form.Item>
    </Space>
  );
}
