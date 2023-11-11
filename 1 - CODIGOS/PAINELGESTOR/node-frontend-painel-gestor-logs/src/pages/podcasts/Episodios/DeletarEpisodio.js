import React from 'react';
import {
  Button, Modal, message, Tooltip
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { deleteEpisodio } from '../apiCalls/apiPodcasts';

/**
 * @typedef {Podcasts.Episodio} EpisodioSelecionado
 */

/**
 * @param {{
 * record: EpisodioSelecionado;
 * }} props
 */
export default function DeletarEpisodio({ record, handleDelete }) {

  const onDeleteEpisodio = () => {
    Modal.confirm({
      title: `Confirma a exclusão do episódio "${record.titulo}"?`,
      okText: 'Sim',
      okType: 'danger',
      onOk: () => {
        deleteEpisodio(record)
          .then(() => {
            message.success('Episódio excluído com sucesso!');
            handleDelete(record);
          })
          .catch((error) => {
            message.error(error.response.data);
          });
      },
    });
  };

  return (
    <Button type="secondary" danger="true" size="small" onClick={() => onDeleteEpisodio(record)}>
      <Tooltip title="Deletar episódio">
        <DeleteOutlined />
        </Tooltip>
    </Button>
  );
}
