O problema está ocorrendo porque o Moment.js está tentando formatar uma data nula (null), o que resulta em "Invalid date". Para resolver isso, você pode ajustar a lógica da seguinte maneira:

```jsx
<Tooltip
  title={`Inicio da Atualização: ${
    inicioAtualizacao
      ? moment(inicioAtualizacao).format('DD/MM/YYYY - HH:mm:ss')
      : 'não finalizado!'
  } - Final da Atualização: ${
    finalAtualizacao !== null
      ? moment(finalAtualizacao).format('DD/MM/YYYY - HH:mm:ss')
      : finalAtualizacao === null && inicioAtualizacao &&
        moment().diff(moment(inicioAtualizacao), 'hours') < 1
      ? 'em atualização!'
      : 'não finalizado!'
  }`}
>
  <BulbFilled style={{ fontSize: '35px', color: corDaLampada }} />
</Tooltip>
```

Neste código, a mensagem do `Tooltip` é construída de modo a verificar primeiro se a data de "finalAtualizacao" não é nula. Se não for nula, a data é formatada normalmente. Caso seja nula e a data de "inicioAtualizacao" exista e seja menor que 1 hora, a mensagem será "em atualização!". Caso contrário, a mensagem será "não finalizado!". Isso deve resolver o problema da exibição de "Invalid date".