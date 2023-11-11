Para configurar corretamente a paginação em suas chamadas de API, você precisa fazer as seguintes modificações em suas funções `getLogAcessos` e `getLogAtualizacoes` no arquivo "apiCalls/Logs.js":

1. Adicione os parâmetros de página (`page`) e tamanho da página (`pageSize`) às chamadas da API. Esses parâmetros serão passados para o servidor para solicitar dados de página em página.

2. Modifique as chamadas da API para incluir esses parâmetros de página na URL da solicitação.

Aqui está como você pode fazer isso:

```javascript
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

export const getLogAcessos = (/** @type {number} */ id, /** @type {number} */ page, /** @type {number} */ pageSize) => {
  const queryParams = `?id=${id}&page=${page}&pageSize=${pageSize}`;
  return fetch(FETCH_METHODS.GET, `/painel/logAcesso/${queryParams}`);
};

export const getLogAtualizacoes = (/** @type {number} */ id, /** @type {number} */ page, /** @type {number} */ pageSize) => {
  const queryParams = `?id=${id}&page=${page}&pageSize=${pageSize}`;
  return fetch(FETCH_METHODS.GET, `/painel/logAtualizacoes/${queryParams}`);
};
```

Nas chamadas acima, adicionei os parâmetros `page` e `pageSize` às funções `getLogAcessos` e `getLogAtualizacoes`. Em seguida, criei uma string `queryParams` contendo esses parâmetros formatados como uma string de consulta (por exemplo, `?id=1&page=2&pageSize=10`) e anexei-a à URL da solicitação.

Agora, quando você chama essas funções, pode especificar a página e o tamanho da página para obter os dados de página em página. Por exemplo:

```javascript
getLogAcessos(id, 2, 10) // Obtém a segunda página com 10 itens por página
getLogAtualizacoes(id, 3, 20) // Obtém a terceira página com 20 itens por página
```

Certifique-se de que seu servidor backend esteja configurado para receber esses parâmetros de consulta, paginar os resultados adequadamente e retornar os dados corretos com base na página e no tamanho da página especificados.