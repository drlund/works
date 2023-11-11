/**
 * Se você deseja atualizar apenas o componente `SearchTable` após a exclusão de um elemento, sem recarregar a página inteira, você pode fazer isso de 
 * forma mais reativa, atualizando o estado do componente quando a exclusão for concluída com sucesso. Aqui está como você pode fazer isso:
 * 
 * 1. Primeiro, adicione um estado adicional para controlar os dados da tabela após a exclusão:
 */


const [dataTable, setDataTable] = useState([]);

// 2. Em seguida, atualize o estado `dataTable` com os novos dados após a exclusão bem-sucedida. Isso deve ser feito dentro da função `removerSuspensao`:


const removerSuspensao = (/** @type {number} */ id) => {
  deleteSuspensao({ id, observacao })
    .then(() => {
      setShowModal(false);
      setObservacao('');

      // Atualize o estado da tabela com os dados atualizados, excluindo o elemento excluído
      setDataTable(prevDataTable => prevDataTable.filter(item => item.id !== id));
    })
    .catch(() => message.error('Falha ao excluir suspensão!'));
};

// 3. Finalmente, atualize o componente `SearchTable` para usar o estado `dataTable` em vez de `suspensoes`:


<SearchTable
  className="styledTableHead"
  columns={columns}
  dataSource={dataTable.map((suspensao) => ({
    ...suspensao,
  }))}
  rowKey="id"
  size="small"
  pagination={{ showSizeChanger: true }}
  bordered
/>

// Com essas alterações, o componente `SearchTable` será atualizado automaticamente com os dados atualizados após a exclusão de um elemento, sem a necessidade de recarregar a página inteira. Isso proporcionará uma experiência mais suave para o usuário. Certifique-se de que a função `removerSuspensao` esteja sendo chamada corretamente no momento da exclusão.