Se a função `carregaMaisDados` está trazendo os dados do backend corretamente, mas os dados anteriores estão sendo substituídos pelos atuais, isso sugere que a substituição dos dados anteriores pelo estado atual não está ocorrendo corretamente no seu componente React. Para acumular os dados, você deve atualizar o estado `atualizacoes` de forma que os novos dados sejam adicionados aos dados existentes, em vez de substituí-los.

Aqui está um exemplo de como você pode atualizar a função `carregaMaisDados` para acumular os dados:

```javascript
const carregarMaisDados = () => {
  setCarregando(true);
  const nextPage = page + 1;
  getLogAtualizacoes(id, nextPage, pageSize)
    .then((data) => {
      if (data.length > 0) {
        setAtualizacoes([...atualizacoes, ...data]); // Concatena os novos dados aos existentes
        setPage(nextPage);
      }
    })
    .catch(() => 'Erro ao obter atualizacoes!')
    .finally(() => {
      setCarregando(false);
    });
};
```

Certifique-se de que a linha `setAtualizacoes([...atualizacoes, ...data]);` está atualizando o estado `atualizacoes` de forma correta, concatenando os novos dados aos dados existentes. Dessa forma, os novos dados devem ser adicionados à tabela em vez de substituir os dados anteriores.

Se ainda estiver enfrentando problemas após essas alterações, certifique-se de que não há outros códigos no componente que podem estar causando a substituição dos dados ou verifique se há alguma outra lógica que está afetando o estado `atualizacoes`.