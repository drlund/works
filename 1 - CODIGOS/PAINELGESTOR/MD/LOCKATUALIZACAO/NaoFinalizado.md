Para incluir a mensagem "Não finalizado!" quando a data for nula (inválida), você pode usar uma declaração condicional para verificar se as datas são nulas antes de formatá-las. Aqui está como você pode fazer isso:

```jsx
import moment from 'moment';

// ...

<Tooltip title={`Inicio da Atualização: ${inicioAtualizacao ? moment(inicioAtualizacao).format('DD/MM/YYYY - HH:mm:ss') : 'Não finalizado!'} - Final da Atualização: ${finalAtualizacao ? moment(finalAtualizacao).format('DD/MM/YYYY - HH:mm:ss') : 'Não finalizado!'}`}>
  <BulbFilled style={{ fontSize: '35px', color: corDaLampada }} />
</Tooltip>

// ...
```

Neste código, o operador condicional (ternário) é usado para verificar se `inicioAtualizacao` e `finalAtualizacao` são nulos. Se forem nulos, a mensagem "Não finalizado!" é exibida; caso contrário, as datas são formatadas no formato "DD/MM/YYYY - HH:mm:ss".