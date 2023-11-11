import React from 'react';
import {
  Button, Modal, message
} from 'antd';
import { regexVideo } from '../helpers/regex';
import { deleteVideo } from '../apiCalls/apiCarrossel';

export default function DeletarVideo({ record, handleDelete }) {
  const onDeleteVideo = () => {
    Modal.confirm({
      title: `Confirma a exclusão do vídeo ${regexVideo.exec(record.urlVideo)?.[1] || record.urlVideo}?`,
      okText: 'Sim',
      okType: 'danger',
      onOk: () => {
        deleteVideo(record)
          .then(() => {
            message.success('Vídeo excluído com sucesso!');
            handleDelete(record);
          })
          .catch((error) => {
            message.error(error.response.data);
          });
      },
    });
  };
  return (
    <Button type="secondary" danger="true" size="small" onClick={() => onDeleteVideo(record)}>
      Excluir
    </Button>
  );
}
