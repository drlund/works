Para incluir o estado `setPageSize`, você pode adicioná-lo no componente React onde você lida com a tabela, juntamente com o botão "Carregar Mais". No exemplo anterior, mostrei como adicionar o estado `page`, e você pode seguir um padrão semelhante para o estado `pageSize`.

Aqui está como você pode incluir o estado `pageSize` no seu componente `LogAcessosTable`:

```javascript
import React, { useState, useEffect } from 'react';
import { toggleSideBar } from 'services/actions/commons';
import SearchTable from 'components/searchtable/SearchTable';
import './TableHead.scss';
import { Card, Row, Col, Space } from 'antd';
import { connect, useSelector } from 'react-redux';
import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';

import moment from 'moment';
import { getLogAcessos } from './apiCalls/Logs';

/**
 * @typedef {Object} Props
 * @property {string} id
 */

/**
 * @param {Object} props
 * @param {object} props.match
 * @param {Props} props.match.params
 */

function LogAcessosTable({ match }) {
  const authState = useSelector((state) => state.app.authState);
  const permissao = getPermissoesUsuario('Painel do Gestor', authState);
  const id = parseInt(match.params.id, 10);
  const [acessos, setAcessos] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // Novo estado para pageSize
  const formatarData = (/** @type {moment.MomentInput} */ data) =>
    moment(data).format('DD/MM/YYYY - HH:mm:ss');

  useEffect(() => {
    getLogAcessos(id, page, pageSize) // Atualize a chamada para incluir pageSize
      .then((data) => {
        setAcessos(data);
      })
      .catch(() => 'Erro ao obter acessos!')
      .finally(() => {});
  }, [id, page, pageSize]); // Adicione pageSize como uma dependência

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
    },
    {
      title: 'Matrícula',
      dataIndex: 'matricula',
      align: 'center',
      render: (/** @type {string} */ matricula) =>
        String(matricula).padStart(4, '0'),
    },
    {
      title: 'Nome',
      dataIndex: 'nome',
    },
    {
      title: 'Comissão',
      dataIndex: 'codigoComissao',
      align: 'center',
    },
    {
      title: 'Nome Comissão',
      dataIndex: 'nomeComissao',
    },
    {
      title: 'Prefixo',
      dataIndex: 'prefixo',
      align: 'center',
    },
    {
      title: 'Nome Prefixo',
      dataIndex: 'nomePrefixo',
    },
    {
      title: 'UOR',
      dataIndex: 'uor',
    },
    {
      title: 'Prefixo Consultado',
      dataIndex: 'prefixoConsultado',
      align: 'center',
    },
    {
      title: 'Subordinada Consultada',
      dataIndex: 'subordinadaConsultada',
      align: 'center',
    },
    {
      title: 'Data',
      dataIndex: 'createdAt',
      align: 'center',
      render: (/** @type {Date} */ data) => formatarData(data),
    },
  ];

  return (
    <div>
      {/* Renderize a tabela e os dados existentes aqui */}
      <SearchTable
        className="styledTableHead"
        columns={columns}
        dataSource={acessos.map((logAcessos) => ({
          ...logAcessos,
        }))}
        rowKey="id"
        size="small"
        pagination={false}
        bordered
      />

      {/* Botão "Carregar Mais" */}
      <button onClick={loadMoreData} disabled={loading}>
        {loading ? 'Carregando...' : 'Carregar Mais'}
      </button>
    </div>
  );
}

export default connect(null, { toggleSideBar })(LogAcessosTable);
```

Lembre-se de adicionar o estado `pageSize` como uma dependência no `useEffect` e atualizar a chamada `getLogAcessos` para incluir o valor de `pageSize`. Agora, você pode controlar o número de itens exibidos na tabela e carregar mais itens conforme necessário.