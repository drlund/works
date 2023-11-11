Para atualizar os dados retornados da função "lockAtualizacao" dentro do `useEffect` em vez de chamar "getLockAtualizacao" diretamente, você pode fazer o seguinte:

1. Crie uma função assíncrona chamada `fetchLockData` para buscar os dados e atualizar o estado:

```javascript
const fetchLockData = async () => {
  try {
    const data = await getLockAtualizacao(match.params?.id);
    setInicioAtualizacao(data.inicioAtualizacao);
    setFinalAtualizacao(data.finalAtualizacao);
  } catch (error) {
    message.error('Erro ao obter locks!');
  } finally {
    setLoading(false);
  }
};
```

2. No `useEffect`, chame a função `fetchLockData`:

```javascript
useEffect(() => {
  fetchLockData();
}, []);
```

Isso irá executar a função `fetchLockData` assim que o componente for montado, atualizando os estados `inicioAtualizacao` e `finalAtualizacao` com os dados obtidos da função `getLockAtualizacao`. Dessa forma, você separa a lógica de obtenção dos dados da lógica de atualização dos estados, o que torna o código mais organizado e legível.