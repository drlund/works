/**
 * Usando a biblioteca `moment`, você pode formatar a data no formato "DD/MM/AAAA" de forma similar. Primeiro, 
 * certifique-se de que o pacote `moment` esteja instalado no seu projeto:
 */

// Em seguida, importe o módulo `moment` no seu arquivo:

import moment from 'moment';

// Dentro do componente `ParamSuspensaoTable`, você pode criar uma função que formate a data utilizando o `moment`:

// ...

// Função para formatar a data no formato "DD/MM/AAAA"
const formatarData = (data) => {
  return moment(data).format('DD/MM/YYYY');
};

// ...

function ParamSuspensaoTable({ ...props }) {
  // ...

  const columns = [
    // ...
    {
      title: 'Validade',
      dataIndex: 'validade',
      render: (data) => formatarData(data), // Formata a data usando a função
    },
    // ...
  ];

  // ...

  return (
    // ...
  );
}

export default connect(null, { toggleSideBar })(ParamSuspensaoTable);
