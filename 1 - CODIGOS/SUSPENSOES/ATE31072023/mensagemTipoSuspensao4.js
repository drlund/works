/**
 * Pelo que você explicou, a API está retornando corretamente os dados esperados. Portanto, o problema provavelmente está 
 * relacionado à forma como os dados estão sendo combinados no `dataTable`.
 * 
 * Ao analisar os dados retornados, podemos ver que existem várias mensagens com o mesmo "id". Isso explica por que você 
 * deseja mostrar oito mensagens do tipo 3, uma do tipo 4 e duas do tipo 8.
 * 
 * Para resolver o problema, precisamos verificar a origem dos dados em `suspensoes` e garantir que os dados sejam combinados 
 * corretamente com as mensagens da API `getTipoSuspensao`.
 * 
 * Para fazer isso, vamos modificar a forma como o `dataSource` é criado no `SearchTable`. Em vez de usar a propriedade 
 * `tipoSuspensao` diretamente, vamos combinar os dados usando o `map` e procurar a mensagem correspondente com base no 
 * "id" em `tipoSuspensaoDados`.
 * 
 * Com essas alterações, o `dataSource` será criado corretamente, combinando os dados do `suspensoes` com as mensagens da API 
 * `getTipoSuspensao` com base no "id" correspondente.
 * 
 * Essa abordagem deve resolver o problema e exibir as mensagens corretas no `dataTable`. Verifique se as mensagens agora 
 * estão sendo mostradas corretamente de acordo com os "id"s correspondentes.
 * 
 * Aqui está como fazer isso:
 */

// ... (código existente)

const columns = [
  // ... (código existente)
  {
    title: 'Tipo Suspensão',
    dataIndex: 'tipoSuspensao',
    // Modificar a função de renderização para mostrar as mensagens em vez do id.
    render: (data) => {
      const tipoSuspensaoItem = tipoSuspensaoDados.find((item) => item.id === data);
      return tipoSuspensaoItem ? tipoSuspensaoItem.mensagem : '';
    },
  },
  // ... (outras colunas)
];

// ... (código existente)

const dataSource = suspensoes.map((suspensao) => {
  // Procurar a mensagem correspondente com base no "id" em tipoSuspensaoDados
  const tipoSuspensaoItem = tipoSuspensaoDados.find((item) => item.id === suspensao.tipoSuspensao);
  return {
    ...suspensao,
    tipoSuspensao: tipoSuspensaoItem ? tipoSuspensaoItem.mensagem : '',
  };
});

// ... (código existente)
