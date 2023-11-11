// @ts-nocheck
import React, { useState, useEffect } from 'react';
import history from 'history.js';
import { Droppable } from 'react-beautiful-dnd';
import {
  Card,
  Space,
  Avatar,
  Modal,
  Button,
  Tooltip,
  Form,
  Input,
  message,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';

import InputFunci from '@/components/inputsBB/InputFunci';
import DragCard from './DragCard';
import {
  getPlataformas,
  patchPlataforma,
} from '../../apiCalls/plataformasCall';
import InputFunciNucleo from './InputFunciNucleo';

const Column = ({ column, index }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalPlataforma, setIsModalPlataforma] = useState(true);
  const [formValues, setFormValues] = useState({});
  const [, setDadosFormPlataforma] = useState();
  const [dadosNucleos, setDadosNucleos] = useState([]);

  const [form] = Form.useForm();

  const mostrarModal = (isPlataforma) => {
    setIsModalVisible(true);
    setIsModalPlataforma(isPlataforma);
    if (isPlataforma) {
      setFormValues({
        id: column.id,
        nome: column.nome,
        matriculaResponsavel: column.matriculaResponsavel.value,
        nomeResponsavel: column.matriculaResponsavel.label?.slice(2).toString(),
      });
      console.log('Matricula: ', column.matriculaResponsavel);
      console.log('Nome: ', column.nomeResponsavel);
    } else {
      setFormValues({
        nucleos: column.nucleos.map((nucleo) => ({
          id: nucleo.id,
          nome: nucleo.nome,
          uor: nucleo.uor,
          responsavel: nucleo.nomeResponsavel,
          ativo: nucleo.ativo,
        })),
      });
    }
    console.log('Dados dos nucleos: ', column.nucleos);
  };

  const editarPlataforma = ( values) => {
    const dadosForm = values;

    const dadosPlataforma = {
      ...dadosForm,
      matriculaResponsavel: dadosForm.matriculaResponsavel.value,
      nomeResponsavel: dadosForm.matriculaResponsavel.label?.slice(2).toString(),
    };
    console.log('Matricula ao editar: ', column.matriculaResponsavel);
    console.log('Nome ao editar: ', column.nomeResponsavel);

    if (values) {
      patchPlataforma(dadosPlataforma)
      .then((dadosFormPlataforma) => {
          console.log('Dados da Plataforma: ', dadosPlataforma)
          setDadosFormPlataforma(dadosFormPlataforma);
          console.log('Esse dados: ', dadosFormPlataforma);
          history.goBack();
        })
        .catch(() => message.error('Falha ao editar plataforma!'));
    }
  };

  const onFinish = (values) => {
    const { nome, responsavel } = values;
    const { nomeResponsavel, matriculaResponsavel } = responsavel;

    console.log('Nome responsável: ', nomeResponsavel);
    console.log('Matricula: ', matriculaResponsavel);

    if (isModalPlataforma) {
      const { id } = values;
      const dados = {
        id,
        nome,
        nomeResponsavel,
        matriculaResponsavel,
      };
      editarPlataforma(dados);
      history.goBack();
    } else {
      const { nucleos } = values.nucleos;
    }

    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const plataformas = await getPlataformas();
        if (plataformas && plataformas.length > 0) {
          const initialData = plataformas[0];
          setFormValues(initialData);
        }
      } catch (error) {
        message.error('Erro ao obter dados da plataforma', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div style={{ margin: '8px' }}>
        <Droppable droppableId={column.nome} key={column.nome}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Card
                title={
                  <Space direction="vertical">
                    <div>
                      <Tooltip title="Editar plataforma">
                        <EditOutlined
                          style={{ marginRight: 8 }}
                          onClick={() => mostrarModal(true)}
                        />
                      </Tooltip>
                      <p>{column.nome}</p>
                    </div>
                    <Avatar />
                    <p>{column.nomeResponsavel}</p>
                    <p>Id: {column.id}</p>
                  </Space>
                }
                bordered
                style={{
                  width: 500,
                  borderRadius: '15px',
                  borderWidth: '5px',
                  borderColor: 'gray',
                }}
              >
                <Tooltip title="Editar núcleos">
                  <EditOutlined
                    style={{ marginRight: 8 }}
                    onClick={() => mostrarModal(false)}
                  />
                </Tooltip>
                {column.nucleos.map((item, index) => (
                  <DragCard key={item.nome} item={item} index={index} />
                ))}
              </Card>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
      <Modal
        title={isModalPlataforma ? 'Editar Plataforma' : 'Editar Núcleos'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>,
          <Button key="submit" type="primary" onClick={form.submit}>
            Salvar
          </Button>,
        ]}
      >
        {isModalPlataforma ? (
          <Form form={form} initialValues={formValues} onFinish={onFinish}>
            <Form.Item
              name="id"
              label="Id"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
            >
              <Input placeholder="Id" />
            </Form.Item>
            <Form.Item
              name="nome"
              label="Plataforma"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
            >
              <Input placeholder="Nome da plataforma" />
            </Form.Item>
            <Form.Item
              name={['responsavel', 'matriculaResponsavel']}
              label="Matricula"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
            >
              <InputFunciNucleo />
            </Form.Item>
            <Form.Item
              name={['responsavel', 'nomeResponsavel']}
              label="Nome Responsável"
              labelCol={{ span: 7 }}
              wrapperCol={{ span: 17 }}
            >
              <InputFunciNucleo nomeResponsavel={column.nomeResponsavel}/>
            </Form.Item>
          </Form>
        ) : (
          <Form form={form} initialValues={formValues}>
            {formValues.nucleos.map((nucleo, index) => (
              <>
                <Form.Item
                  key={nucleo.id}
                  name={`nucleo_${nucleo.id}`}
                  label={`Núcleo ${index + 1}`}
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                >
                  <Input
                    placeholder={`Núcleo ${index + 1}`}
                    defaultValue={nucleo.nome}
                  />
                </Form.Item>
                <Form.Item
                  name={`uor_${nucleo.id}`}
                  label="UOR"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                >
                  <Input defaultValue={nucleo.uor} />
                </Form.Item>
                <Form.Item
                  name="responsavel"
                  valuePropName="responsavel"
                  label="Responsável"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                  value={nucleo.responsavel}
                >
                  <InputFunciNucleo />
                </Form.Item>
                <Form.Item
                  name={`ativo_${nucleo.id}`}
                  label="Ativo"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                >
                  <Input defaultValue={nucleo.ativo} />
                </Form.Item>
                {index < formValues.nucleos.length - 1 && <hr />}
              </>
            ))}
          </Form>
        )}
      </Modal>
    </>
  );
};

export default Column;
