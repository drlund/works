// Em `ParamSuspensaoTable.js`:

// 1. Importe o hook `useHistory` do React Router:

import { useHistory } from 'react-router-dom';


// 2. Dentro da sua função `renderActionButtons`, use o hook `useHistory` para obter acesso ao objeto `history`:

const history = useHistory();


/**
 * 3. Modifique o manipulador `onClick` do componente `EditOutlined` para navegar até o formulário de edição com os 
 * dados correspondentes da suspensão:
 */

<EditOutlined
  className="link-color link-cursor"
  onClick={() =>
    history.push({
      pathname: '/movimentacoes/editar-suspensao/',
      state: { id: record.id },
    })
  }
/>


/**
 * Agora, você está passando o `id` da suspensão selecionada para o formulário de edição usando o estado de localização 
 * do React Router.
 * 
 * Em `FormParamSuspensao.js`:
 * 
 * 1. Importe o hook `useLocation` do React Router:
 */

import { useLocation } from 'react-router-dom';


// 2. Dentro do seu componente `FormParamSuspensao`, use o hook `useLocation` para acessar o estado de localização:

const location = useLocation();


// 3. Atualize o seu `useEffect` para preencher os campos do formulário com os dados do estado de localização quando ele mudar:

useEffect(() => {
  if (location.state) {
    // Use location.state para preencher os campos do formulário
    const { id, validade, tipoSuspensao } = location.state;
    // Atualize os campos do formulário com os dados obtidos
    form.setFieldsValue({
      validade: moment(validade),
      tipoSuspensao,
      // ...outros campos
    });
  }
}, [location.state]);


/**
 * Com essas alterações, quando você clicar em "Editar" em uma linha da tabela, os dados de `id`, `validade` e 
 * `tipoSuspensao` serão passados para o formulário de edição, e os campos do formulário serão preenchidos com 
 * esses dados, permitindo que você edite e atualize os detalhes da suspensão. Certifique-se de que os nomes 
 * dos campos no formulário correspondam às chaves usadas no método `form.setFieldsValue`.
 */