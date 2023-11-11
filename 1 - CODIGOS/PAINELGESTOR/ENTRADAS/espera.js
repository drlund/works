/**
 * Você pode adicionar um ícone de espera enquanto o seu datatable está carregando dados. Uma abordagem comum é usar um componente de carregamento, como o 
 * `Spin` do Ant Design, para indicar que os dados estão sendo carregados. Aqui está como você pode fazer isso:
 * 
 * 1. Primeiro, você precisará importar o componente `Spin` do Ant Design no seu arquivo. Certifique-se de que o Ant Design está devidamente instalado no seu projeto.
 */

import { Spin } from 'antd';

// 2. Em seguida, você pode criar um estado para controlar se os dados estão sendo carregados ou não. Por exemplo:

const [isLoading, setIsLoading] = useState(true); // Inicialize com true para exibir o ícone de espera inicialmente

/**
 * 3. Dentro do seu `useEffect` onde você busca os dados, você pode definir `isLoading` como `true` antes de fazer a solicitação e, em seguida, definir `isLoading` 
 * como `false` quando a solicitação for concluída. Isso garantirá que o ícone de espera seja exibido enquanto os dados estão sendo carregados:
 */

useEffect(() => {
  setIsLoading(true); // Defina isLoading como true antes de fazer a solicitação
  getLogAcessos(id)
    .then((data) => {
      setAcessos(data);
    })
    .catch(() => 'Erro ao obter acessos!')
    .finally(() => {
      setIsLoading(false); // Defina isLoading como false quando a solicitação for concluída
    });
}, [id]);

// 4. Agora, você pode envolver o seu `SearchTable` com o componente `Spin` e mostrar o ícone de espera quando `isLoading` for `true`:

<Spin spinning={isLoading}>
  <SearchTable
    className="styledTableHead"
    columns={columns}
    dataSource={acessos.map((logAcessos) => ({
      ...logAcessos,
    }))}
    rowKey="id"
    size="small"
    pagination={{ showSizeChanger: true }}
    bordered
  />
</Spin>

/**
 * Dessa forma, o ícone de espera será exibido enquanto os dados estiverem sendo carregados, e desaparecerá quando os dados forem carregados com sucesso. Isso 
 * proporcionará uma melhor experiência ao usuário. Certifique-se de ajustar o estilo e a aparência do ícone de espera conforme necessário para se adequar ao 
 * seu projeto.
 */