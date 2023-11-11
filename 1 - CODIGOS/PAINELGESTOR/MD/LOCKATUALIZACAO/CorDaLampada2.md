
Para atualizar a cor da lâmpada toda vez que o componente "Card" for renderizado, você pode fazer a chamada da função `corDaLampada` diretamente no componente de renderização e armazenar o resultado em um estado para que a renderização seja acionada sempre que a cor da lâmpada for atualizada. Aqui está como você pode fazer isso:

```javascript
import React, { useEffect, useState } from 'react';
// ... outras importações ...

export default function Home({ match }) {
  // Resto do seu código ...

  const [corLampada, setCorLampada] = useState('green'); // Estado para armazenar a cor da lâmpada

  // Resto do seu código ...

  // Dentro do seu componente de renderização
  return (
    <div>
      {/* ... Resto do seu código ... */}
      <Tooltip
        title={`Inicio da Atualização: ${
          inicioAtualizacao
            ? moment(inicioAtualizacao).format('DD/MM/YYYY - HH:mm:ss')
            : 'não finalizado!'
        } - Final da Atualização: ${
          finalAtualizacao !== null
            ? moment(finalAtualizacao).format('DD/MM/YYYY - HH:mm:ss')
            : finalAtualizacao === null &&
              inicioAtualizacao &&
              moment().diff(moment(inicioAtualizacao), 'hours') < 1
            ? 'em atualização!'
            : 'não finalizado!'
        }`}
      >
        <BulbFilled
          style={{
            fontSize: '18px',
            color: corLampada, // Usar a cor do estado
            marginLeft: '40px',
          }}
        />
      </Tooltip>
      {/* ... Resto do seu código ... */}
    </div>
  );
}
```

Depois disso, dentro do componente de renderização, você pode usar o estado `corLampada` para definir a cor da lâmpada. Agora, sempre que quiser atualizar a cor da lâmpada, você pode chamar `setCorLampada` com a nova cor desejada. Certifique-se de chamar `setCorLampada` no lugar apropriado do seu código para que a cor seja atualizada de acordo com suas regras de negócio.
