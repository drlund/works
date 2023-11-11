/**
 * O erro "Uncaught ReferenceError: tipo is not defined" ocorre porque a variável `tipo` não está definida no escopo em que você está tentando acessá-la. Parece que você está tentando acessar a variável `tipo` fora do escopo da função `handleEdit`.

Aqui está uma sugestão para resolver o erro:

1. **Mova a Definição de `tipoToColumnMap` para o Escopo da Função `handleEdit`:**

   Você precisa acessar o valor de `tipo` diretamente dentro da função `handleEdit`. Portanto, mova a definição do objeto 
   `tipoToColumnMap` para dentro da função `handleEdit`.
   */

   // ...

   const handleEdit = (id, tipo) => {
     const tipoToColumnMap = {
       'Vice Presidencia': 'vicePresi',
       'Unid. Estratégica': 'diretoria',
       'Unid. Tática': 'supers',
       Comercial: 'gerev',
       Prefixo: 'prefixo',
       Matrícula: 'matriculas',
     };
     const column = tipoToColumnMap[tipo];
     
     history.push({
       pathname: `/movimentacoes/editar-suspensao/${id}`,
       state: { id: id, tipo: column, tipoSuspensao: record.tipoSuspensao, validade: record.validade },
     });
   };

   // ...

/**
 * Com esta alteração, a variável `tipo` estará definida no escopo correto da função `handleEdit`, e o erro não deverá 
 * mais ocorrer. Certifique-se de ajustar o restante do código de acordo com essa mudança.
 */