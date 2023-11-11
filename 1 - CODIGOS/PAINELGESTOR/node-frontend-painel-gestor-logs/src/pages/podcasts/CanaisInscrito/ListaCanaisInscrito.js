import { Table, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCanaisAtivosBySeguidor } from '../apiCalls/apiPodcasts';
import { imgFallback } from '../fallbackImage';


export default function ListaCanaisInscrito() {
  const [canaisAtivosBySeguidor, setcanaisAtivosBySeguidor] = useState(/** @type {Podcasts.Canal[]} */([]));
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchCanaisAtivosBySeguidor()
      .then(setcanaisAtivosBySeguidor)
      .catch(setError);
  }, []);

  const columns = [
    {
      title: 'Capa',
      dataIndex: 'imagem',
      width: '32%',
      render: (/** @type {Podcasts.Canal['imagem']} */ imagem, /** @type {Podcasts.Canal} */ record) => (
        <img
          width={150}
          height={150}
          alt={`Logo para ${record.nome}`}
          src={`${process.env.REACT_APP_ENDPOINT_API_URL}/uploads/multimidia/podcast/${imagem}`}
          onError={(event) => {
            event.target.src = `${imgFallback}`;
          }}
        />
      ),
    },
    {
      title: 'Canal',
      dataIndex: 'nome',
      width: '32%',
      render: (/** @type {Podcasts.Canal['nome']} */ canal) => (
        <Link to={{
          pathname: '/podcasts',
          state: { canal },
        }}>{`${canal}`}</Link>
      ),
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
      render: (/** @type {Podcasts.Canal['matriculaResponsavel']} */ matriculaResponsavel) => (
        <a
          href={`https://humanograma.intranet.bb.com.br/${matriculaResponsavel.toUpperCase()}`}
          target="_blank"
          rel="noreferrer"
        >
          {matriculaResponsavel.toUpperCase()}
        </a>
      ),
    },
  ];

  if (error) {
    return (
      <>
        <Typography> Você não tem permissão para acessar os canais ativos ou incluir novos canais. </Typography>
        <Typography>{`Solicite ao administrador acesso no aplicativo: "Podcasts" > "GERENCIAR"`}</Typography>
      </>
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={canaisAtivosBySeguidor}
      rowKey={(record) => record.id}
      pagination={{ hideOnSinglePage: true }}
    />
  );
}
