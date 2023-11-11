Para mostrar "em atualização!" em vez de "não finalizado" quando a data em "finalAtualização" é igual a NULL e "inicioAtualizacao" é menor que 1 hora, você pode ajustar a lógica em sua função `getStatusLabel` da seguinte forma:

```jsx
const getStatusLabel = () => {
  if (finalAtualizacao === null) {
    const inicioAtualizacaoDate = moment(inicioAtualizacao);
    const now = moment();
    const diferencaDehoras = now.diff(inicioAtualizacaoDate, 'hours');

    if (diferencaDehoras < 1) {
      return 'em atualização!';
    } else {
      return 'não finalizado!';
    }
  }
  return 'Ok';
};
```

Neste código, se `finalAtualizacao` for igual a NULL e `inicioAtualizacao` for menor que 1 hora, a função `getStatusLabel` retornará "em atualização!". Caso contrário, retornará "não finalizado!". Certifique-se de que o valor retornado pela função seja exibido no Tooltip em vez de "não finalizado". Isso deve atender aos requisitos que você mencionou.