import { Space, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { fetchCanais } from '../apiCalls/apiPodcasts';
import DeletarCanal from './DeletarCanal';
import EditarCanal from './EditarCanal';
import EditarCapaCanal from './EditarCapaCanal';

export default function ListaCanais() {
  const [canais, setCanais] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCanais()
      .then(setCanais)
      .catch(setError);
  }, []);


  const handleDelete = (record) => {
    setCanais((pre) => pre.filter((canal) => canal.id !== record.id));
  };

  const handleEdit = (record) => {
    setCanais((pre) =>
      pre.map((canal) =>
        canal.id === record.id ? { ...canal, ...record } : canal
      )
    );
  };

  const columns = [
    {
      title: 'Canal',
      dataIndex: 'nome',
      width: '32%'
    },
    {
      title: 'Descrição',
      dataIndex: 'descricao',
      width: '40%',
    },
    {
      title: 'Episódios',
      dataIndex: 'totalEpisodios',
      width: '8%',
    },
    {
      title: 'Seguidores',
      dataIndex: 'totalSeguidores',
      width: '8%',
    },
    {
      title: 'Responsável',
      dataIndex: 'matriculaResponsavel',
      width: '12%',
      render: (matriculaResponsavel) => (
        <a
          href={`https://humanograma.intranet.bb.com.br/${matriculaResponsavel.toUpperCase()}`}
          target="_blank"
          rel="noreferrer"
        >
          {matriculaResponsavel.toUpperCase()}
        </a>
      ),
    },
    {
      title: 'Ações',
      width: '10%',
      render: (record) => (
        <Space size="middle">
          <EditarCapaCanal record={record} handleEdit={handleEdit} />
          <EditarCanal record={record} handleEdit={handleEdit} />
          <DeletarCanal record={record} handleDelete={handleDelete} />
        </Space>
      ),
    },
  ];

  if (error) {
    return (
      <>
        <Typography>Você não tem permissão para acessar os canais ativos ou incluir novos canais.</Typography>
        <Typography>{`Solicite ao administrador acesso no aplicativo: "Podcasts" > "GERENCIAR"`}</Typography>
      </>
    );
  }

  return <Table columns={columns} dataSource={canais} rowKey={(record) => record.id} pagination={{ hideOnSinglePage: true }} />;
}