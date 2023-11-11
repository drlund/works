Para implementar um botão "Carregar Mais" com Infinite Scroll (Rolgagem Infinita) nas tabelas apresentadas, você pode seguir os passos a seguir:

1. **Frontend**:

   Primeiro, você precisará adicionar um botão "Carregar Mais" abaixo da tabela para permitir aos usuários carregar mais dados conforme necessário. Aqui está um exemplo de como fazer isso no componente `LogAcessosTable`:

   ```javascript
   const [page, setPage] = useState(1);
   const [pageSize, setPageSize] = useState(10);
   const [acessos, setAcessos] = useState([]);
   const [carregando, setCarregando] = useState(false);

   const carregaMaisDados = () => {
     setCarregando(true);
     const nextPage = page + 1;
     // Chame a função para carregar mais dados com a próxima página
     getLogAcessos(id, nextPage, pageSize)
       .then((data) => {
         if (data.length > 0) {
           setAcessos([...acessos, ...data]);
           setPage(nextPage);
         }
       })
       .catch(() => 'Erro ao obter acessos!')
       .finally(() => {
         setCarregando(false);
       });
   };

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
       <button onClick={carregaMaisDados} disabled={carregando}>
         {carregando ? 'Carregando...' : 'Carregar Mais'}
       </button>
     </div>
   );
   ```

   No exemplo acima, você adicionou um botão "Carregar Mais" que, quando clicado, chama a função `loadMoreData`. Esta função atualiza a página atual e faz uma nova solicitação ao servidor para obter mais dados. Os dados são então adicionados à matriz existente `acessos`. O botão "Carregar Mais" é desativado enquanto os dados estão sendo carregados para evitar múltiplas solicitações simultâneas.

2. **Backend (AdonisJS)**:

   No seu backend, você já configurou as funções `getLogAcessos` e `getLogAtualizacoes` para receber os valores de "page" e "pageSize" da solicitação. Certifique-se de que esses parâmetros estejam sendo corretamente tratados nas funções do seu repositório, como mostrado anteriormente.

   A cada solicitação, o servidor deve retornar a próxima página de dados com base nos parâmetros de "page" e "pageSize". Certifique-se de atualizar essas funções para retornar os dados corretos com base na página solicitada.

Com essas alterações, você terá um botão "Carregar Mais" que permite aos usuários carregar mais dados à medida que rolam para baixo na tabela. Certifique-se de aplicar as mesmas alterações ao componente `LogAtualizacoesTable` se desejar implementar a mesma funcionalidade para essa tabela.