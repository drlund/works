Para mostrar "em atualização!" na mensagem do Tooltip em vez de "não finalizado" quando a data em "finalAtualização" é igual a NULL e "inicioAtualizacao" é menor que 1 hora, você pode ajustar a mensagem diretamente no `Tooltip` da seguinte forma:

```jsx
<Tooltip
  title={`Inicio da Atualização: ${
    inicioAtualizacao
      ? moment(inicioAtualizacao).format('DD/MM/YYYY - HH:mm:ss')
      : 'não finalizado!'
  } - Final da Atualização: ${
    finalAtualizacao === null
      ? inicioAtualizacao &&
        moment(inicioAtualizacao).isBefore(moment().subtract(1, 'hour'))
        ? 'em atualização!'
        : 'não finalizado!'
      : moment(finalAtualizacao).format('DD/MM/YYYY - HH:mm:ss')
  }`}
>
  <BulbFilled style={{ fontSize: '35px', color: corDaLampada }} />
</Tooltip>
```

Neste código, a mensagem do Tooltip é condicionalmente definida como "em atualização!" quando `finalAtualizacao` é igual a NULL e `inicioAtualizacao` é menor que 1 hora, caso contrário, a mensagem permanecerá como "não finalizado!". Certifique-se de ajustar o valor de `marginTop` no rótulo conforme necessário para garantir o espaçamento adequado.