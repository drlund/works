import { HeartFilled, HeartOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Button, Space, Table, Tag, Tooltip } from 'antd';
import { BBSpinning } from 'components/BBSpinning/BBSpinning';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import AlfaSort from 'utils/AlfaSort';
import DeletarEpisodio from '../Episodios/DeletarEpisodio';
import VisualizarEpisodio from '../Episodios/VisualizarEpisodio';
import { fetchEpisodios, fetchTags, toggleCurtir } from '../apiCalls/apiPodcasts';
import useCopyToClipboard from '../hooks/useCopyToClipboard';
import { usePermissaoGerenciar } from '../hooks/usePermissaoGerenciar';

/**
 * @typedef {Podcasts.Episodio} EpisodioRecord
 */

/**
 * @param {{
 *  canalSelecionado: Podcasts.Canal;
 * }} props
 */
export default function TabelaEpisodios({ canaisSeguidos, check, canalSelecionado }) {
  const [episodios, setEpisodios] = useState([]);
  const [likes, setLikes] = useState({});
  const [filters, setFilters] = useState([]);
  const [listaTags, setListaTags] = useState([]);
  const [error, setError] = useState(false);
  const [value, copy] = useCopyToClipboard();
  const [loading, setLoading] = useState(false);

  const hasGerenciarPermission = usePermissaoGerenciar();

  useEffect(() => {
    setLoading(true);
    fetchEpisodios()
      .then(setEpisodios)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchTags().then((tags) => {
      const uniqueTags = [...new Set(tags.map(tag => tag.nome))];
      setListaTags(uniqueTags);
      setFilters(uniqueTags.map(tag => ({ text: tag, value: tag })));
    }).catch(setError);
  }, []);


  const likeIcon = (id) => {
    const isLiked = episodios.find((episodio) => episodio.id === id).matriculaLiked === 1;
    return likes[id] || isLiked ? (
      <HeartFilled
        onMouseEnter={() => setLikes((prevState) => ({ ...prevState, [id]: true }))}
        onMouseLeave={() => setLikes((prevState) => ({ ...prevState, [id]: false }))}
      />
    ) : (
      <HeartOutlined
        onMouseEnter={() => setLikes((prevState) => ({ ...prevState, [id]: true }))}
        onMouseLeave={() => setLikes((prevState) => ({ ...prevState, [id]: false }))}
      />
    );
  };

  function handleLikeClick(/** @type {EpisodioRecord} */record) {
    toggleCurtir(record.id)
      .then(() => {
        handleCurtida(record);
      })
      .catch(setError);
  }

  const handleCurtida = (/** @type {EpisodioRecord} */record) => {
    setEpisodios((pre) =>
      pre.map((episodio) =>
        episodio.id === record.id
          ? {
            ...record, matriculaLiked: record.matriculaLiked === 1 ? 0 : 1,
            likesCount: record.matriculaLiked === 1 ? record.likesCount - 1 : record.likesCount + 1
          }
          : episodio
      ));
  };

  const handleDelete = (/** @type {EpisodioRecord} */record) => {
    setEpisodios((pre) => pre.filter((episodio) => episodio.id !== record.id));
  };

  /**
   * @typedef {{
  *  title: string;
  *  dataIndex?: string;
  *  key?: string;
  *  width: number | string;
  *  render: (row: EpisodioRecord) => React.ReactNode;
  *  sorter: (a: unknown, b: unknown) => number;
  * }[]} Columns
  */

  const /** @type {Columns} */ columns = [
    {
      title: 'Data de Inclusão',
      dataIndex: 'createdAt',
      width: '16%',
      render: (createdAt) => moment(createdAt).format('DD/MM/YYYY'),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: 'Episódio',
      width: '34%',
      render: (record) => <VisualizarEpisodio record={record} />,
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
    },
    {
      title: 'Canal',
      dataIndex: 'canal',
      key: 'idCanal',
      width: '18%',
      render: (canal) => (canal.nome),
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      width: '20%',
      filters,
      onFilter: (value, record) => record.tags.map(tag => tag.nome).includes(value),
      filterSearch: true,
      render: (tags) => <>
        {tags.map(tag => (
          <Tag color={tag.cor} key={tag.id} style={{ margin: '2px' }}>{tag.nome}</Tag>
        ))}</>,
    },
    {
      title: 'Likes',
      dataIndex: 'likesCount',
      width: '12%',
      render: (_, episodio) => (
        <Button onClick={() => handleLikeClick(episodio)} type="link">
          {likeIcon(episodio.id)} {episodio.likesCount}
        </Button>
      ),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    // @ts-ignore
    {
      title: 'Ações',
      width: '12%',
      render: (/** @type {EpisodioRecord} */record) => (
        <Space size="middle">
          <Tooltip title="Compartilhar Episódio">
            <Button
              type="secondary"
              size="small"
              onClick={() => copy(`${process.env.REACT_APP_ENDPOINT_API_URL}/uploads/multimidia/podcast/${record.urlEpisodio}`)}
            >
              <ShareAltOutlined />
            </Button>
          </Tooltip>
          {hasGerenciarPermission ?
            (<DeletarEpisodio record={record} handleDelete={handleDelete} />)
            :
            (null)}
        </Space>
      ),
    },
  ];

  if (canalSelecionado) {
    const filteredEpisodios = episodios.filter((record) => record.idCanal === canalSelecionado.id);
    return <Table columns={columns} dataSource={filteredEpisodios} rowKey={(record) => record.id} />;
  }

  return <BBSpinning spinning={loading}>
    <Table columns={columns} dataSource={episodios} rowKey={(record) => record.id} />
  </BBSpinning>;

}
