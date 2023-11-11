// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
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
import InputFunciNucleo from './InputFunciNucleo';
import DragCard from './DragCard';
import { getPlataformas } from '../../apiCalls/plataformasCall';

const Column = ({ column, index }) => {
  const inputRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalPlataforma, setIsModalPlataforma] = useState(true);
  const [formValues, setFormValues] = useState({});
  const [form] = Form.useForm();
  const layout = {
    labelCol: {
      span: 7,
    },
    wrapperCol: {
      span: 17,
    },
  };

  const mostraModalPlataforma = () => {
    setIsModalVisible(true);
    setIsModalPlataforma(true);
    setFormValues({
      id: column.id,
      nome: column.nome,
      nomeResponsavel: column.nomeResponsavel,
    });
  };

  const mostraModalNucleos = () => {
    setIsModalVisible(true);
    setIsModalPlataforma(false);
    setFormValues({
      nucleos: column.nucleos.map((nucleo) => ({
        id: nucleo.id,
        nome: nucleo.nome,
        uor: nucleo.uor,
        nomeResponsavel: nucleo.nomeResponsavel,
        ativo: nucleo.ativo,
      })),
    });
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
                          onClick={mostraModalPlataforma}
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
                    onClick={mostraModalNucleos}
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
          <Button key="submit" type="primary" onClick={handleCancel}>
            Salvar
          </Button>,
        ]}
      >
        {isModalPlataforma ? (
          <Form initialValues={formValues}>
            <Form.Item
              name="id"
              label="Id"
            >
              <Input placeholder="Id" />
            </Form.Item>
            <Form.Item
              name="nome"
              label="Plataforma"
            >
              <Input placeholder="Nome da plataforma" />
            </Form.Item>
            <Form.Item
              name="nomeResponsavel"
              label="Nome Responsável"
            >
              <InputFunci />
            </Form.Item>
          </Form>
        ) : (
          <Form initialValues={formValues}
          form={form}
          {...layout}>
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
                  name={`nomeResponsavel_${nucleo.nomeResponsavel}`}
                  label="Responsável"
                  labelCol={{ span: 7 }}
                  wrapperCol={{ span: 17 }}
                >
                  <Input value={nucleo.responsavel} ref={inputRef} />
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
