import React, { useState, useEffect } from 'react';
import {
  message,
  Space, Table, Typography
} from 'antd';
import moment from 'moment';
import { fetchVideos } from '../apiCalls/apiCarrossel';
import EditarVideo from './EditarVideo';
import DeletarVideo from './DeletarVideo';
import { regexNomeVideo } from '../helpers/regex';

export default function ListaVideos() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchVideos()
      .then(setVideos)
      .catch(setError);
  }, []);

  const handleDelete = (record) => {
    setVideos((pre) => pre.filter((video) => video.id !== record.id));
  };

  const handleEdit = (record) => {
    setVideos((pre) => pre.map((video) => video.id === record.id ? record : video))
  }


  const columns = [
    {
      title: 'Data da Reprodução',
      dataIndex: 'dataInicioReproducao',
      key: 'dataInicioReproducao',
      render: (dataInicioReproducao) => moment(dataInicioReproducao).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.dataInicioReproducao).unix() - moment(b.dataInicioReproducao).unix(),
    },
    {
      title: 'Vídeo',
      dataIndex: 'urlVideo',
      key: 'urlVideo',
      render: (urlVideo) => <a href={`https://super.intranet.bb.com.br/superadm/assets/files/pages/${urlVideo}`} target="_blank" rel="noreferrer">{regexNomeVideo(urlVideo)}</a>,
    },
    {
      title: 'Responsável pela inclusão',
      dataIndex: 'nomeFunci',
      key: 'nomeFunci',
    },
    {
      title: 'Data da inclusão',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt) => moment(createdAt).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: 'Ações',
      key: 'acoes',
      render: (record) => (
        <Space size="middle">
          <EditarVideo record={record} handleEdit={handleEdit} />
          <DeletarVideo record={record} handleDelete={handleDelete} />
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <>
      <Typography>Você não tem permissão para acessar esta funcionalidade.</Typography>
      <Typography>{`Solicite ao administrador acesso no aplicativo: "Carrossel de Notícias" > "CONSULTAR"`}</Typography>
      </>
    )
  }

  return <Table columns={columns} dataSource={videos} rowKey={(record) => record.id} />
}
