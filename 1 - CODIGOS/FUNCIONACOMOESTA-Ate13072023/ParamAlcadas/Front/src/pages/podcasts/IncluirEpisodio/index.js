import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Select, Space, Tag, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchCanais, fetchTags, postEpisodio } from '../apiCalls/apiPodcasts';

export default function IncluirEpisodio() {
  const [canais, setCanais] = useState([]);
  const [tags, setTags] = useState([]);
  const [listaTags, setListaTags] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCanais()
      .then(setCanais)
      .catch((error) => {
        message.error(error.response.data);
      });
  }, []);

  useEffect(() => {
    fetchTags()
      .then(setListaTags)
      .catch((error) => {
        message.error(error.response.data);
      });
  }, []);

  const canaisOptions = canais.map((canal) => ({
    value: canal.id,
    label: canal.nome,
  }));

  const tagOptions = listaTags.map((tag) => ({
    value: tag.id,
    label: tag.nome,
    color: tag.cor,
  }));

  const onReset = () => {
    form.resetFields();
    setTags([]);
  };

  function tratamentoDeTags(string) {
    return string.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const onFinish = () => {

    const { tags: tagArr, ...restante } = form.getFieldsValue();
    const tagReduce = tagArr.reduce((acc, cur) => {
      if (typeof cur === 'number') {
        acc.existentes.push(cur);
        return acc;
      }

      const tagExistente = tagOptions.find(tag => tratamentoDeTags(tag.label) === tratamentoDeTags(cur))?.value;

      if (typeof cur === 'string' && tagExistente) {
        acc.existentes.push(tagExistente);
      } else {
        acc.novas.push(cur);
      }
      return acc;
    }, { existentes: [], novas: [] });


    const infosEpisodio = { tags: { novas: tagReduce.novas, existentes: [...new Set(tagReduce.existentes)] }, ...restante };

    postEpisodio(infosEpisodio)
      .then(() => {
        message.success('Episódio incluído com sucesso!');
        onReset();
      })
      .catch((error) => {
        message.error(error);
      });

  };

  return (
    <Form
      name="incluirEpisodio"
      labelCol={{
        span: 4,
      }}
      wrapperCol={{
        span: 8,
      }}
      form={form}
      onSubmitCapture={onFinish}
    >
      <Form.Item
        label="Nome do Episódio"
        name="nomeEpisodio"
        rules={[
          {
            required: true,
            message: 'Inclua o nome do episódio',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Canal"
        name="idCanal"
        rules={[
          {
            required: true,
            message: 'Selecione um canal',
          },
        ]}
      >
        <Select
          defaultValue="Selecione um canal"
          options={canaisOptions}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
        />
      </Form.Item>
      <Form.Item
        label="Tags"
        name="tags"
        initialValue={tags}
        rules={[
          {
            required: true,
            message: 'Inclua ao menos uma tag',
          },
        ]}>
        <Select
          mode="tags"
          style={{
            width: '100%',
          }}
          placeholder="Selecione as Tags desejadas ou adicione novas"
          options={tagOptions}
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label.toLowerCase() ?? '').includes(input.toLowerCase())}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
        />
      </Form.Item>
      <Form.Item
        label="Episódio"
        name="videoEpisodio"
        tooltip="Formatos aceitos: mp4, webm"
        rules={[
          {
            required: true,
            message: 'Faça upload do arquivo',
          },
        ]}
      >
        <Upload type="file" name="capa" accept="video/mp4, video/webm" maxCount={1} data-testid="uploadEpisodioPodcasts">
          <Button icon={<UploadOutlined />}>Clique aqui para fazer o upload do arquivo</Button>
        </Upload>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 4,
          span: 16,
        }}
      >
        <Space>
          <Button type="secondary" htmlType="reset" onClick={onReset}>
            Limpar
          </Button>
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
        </Space>
      </Form.Item>

    </Form>
  );
}
