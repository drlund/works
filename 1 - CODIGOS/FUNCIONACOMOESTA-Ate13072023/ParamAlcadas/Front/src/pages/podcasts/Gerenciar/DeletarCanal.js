import React from 'react';
import {
  Button, Modal, message, Tooltip
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteCanal } from '../apiCalls/apiPodcasts';

export default function DeletarCanal({ record, handleDelete }) {

  const onDeleteCanal = () => {
    Modal.confirm({
      title: `Confirma a exclusão do canal ${record.nome}?`,
      okText: 'Sim',
      okType: 'danger',
      onOk: () => {
        deleteCanal(record)
          .then(() => {
            message.success('Canal excluído com sucesso!');
            handleDelete(record);
          })
          .catch((error) => {
            message.error(error.response.data);
          });
      },
    });
  };

  return (
    <Button type="secondary" danger="true" size="small" onClick={() => onDeleteCanal(record)}>
      <Tooltip title="Deletar canal">
        <DeleteOutlined />
        </Tooltip>
    </Button>
  );
}
