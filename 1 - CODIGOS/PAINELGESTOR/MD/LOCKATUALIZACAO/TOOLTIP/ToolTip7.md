Para exibir "em atualização!" na mensagem do `Tooltip` quando a data em "finalAtualização" for igual a NULL e "inicioAtualizacao" for menor que 1 hora, você pode ajustar a lógica diretamente na mensagem do `Tooltip`. Aqui está como você pode fazer isso:

```jsx
<Tooltip
  title={`Inicio da Atualização: ${
    inicioAtualizacao
      ? moment(inicioAtualizacao).format('DD/MM/YYYY - HH:mm:ss')
      : 'não finalizado!'
  } - Final da Atualização: ${
    finalAtualizacao === null
      ? moment(finalAtualizacao).format('DD/MM/YYYY - HH:mm:ss') : (finalAtualizacao ? moment(finalAtualizacao).format('DD/MM/YYYY - HH:mm:ss') : 'não finalizado!')
  }${finalAtualizacao === null && inicioAtualizacao && moment().diff(moment(inicioAtualizacao), 'hours') < 1 ? 'em atualização!' : ''}`}
>
  <BulbFilled style={{ fontSize: '35px', color: corDaLampada }} />
</Tooltip>
```

Neste código, a mensagem do `Tooltip` é construída dinamicamente com base nas condições de "inicioAtualizacao" e "finalAtualizacao". Se "finalAtualizacao" for igual a NULL e "inicioAtualizacao" for menor que 1 hora, "em atualização!" será adicionado à mensagem do `Tooltip`. Caso contrário, a mensagem será "não finalizado!" ou a data formatada, dependendo das condições. Isso deve atender aos requisitos mencionados.