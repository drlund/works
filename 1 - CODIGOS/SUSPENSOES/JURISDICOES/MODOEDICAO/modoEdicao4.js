/**
 * Entendo que você está usando um arquivo de configuração para suas rotas. Para encaixar o trecho `render={(props) => 
 * <FormParamSuspensao {...props} />}` em seu arquivo de configuração de rotas, você pode criar um componente de 
 * renderização personalizado que encapsula a lógica de passagem das props para o `FormParamSuspensao`. Em seguida, 
 * você pode usar esse componente de renderização personalizado em sua configuração de rota.
 * 
 * Aqui está como você pode fazer isso:
 * 
 * 1. Crie um componente de renderização personalizado que receberá as props e renderizará o `FormParamSuspensao`:
 */ 

import React from 'react';
import FormParamSuspensao from 'pages/movimentacoes/components/suspensao/FormParamSuspensao';

const RenderFormParamSuspensao = (props) => {
  return <FormParamSuspensao {...props} />;
};

export default RenderFormParamSuspensao;

/** 
 * 2. Em seu arquivo de configuração de rotas, importe o componente de renderização personalizado e use-o na configuração 
 * da rota:
 */

import React from 'react';
import RenderFormParamSuspensao from './path/to/RenderFormParamSuspensao'; // Atualize o caminho correto

// ...

{
  title: 'Editar Suspensão',
  path: `${basePath}editar-suspensao/`,
  permissions: ['PARAM_SUSPENSOES_USUARIO'],
  verifyAllPermissions: false,
  component: React.lazy(() =>
    import('pages/movimentacoes/components/suspensao/RenderFormParamSuspensao'), // Use o componente de renderização personalizado
  ),
  breadcrumbRoutes: [
    ...baseBCRoutes,
    { breadcrumbName: 'Edição de Suspensão' },
  ],
},

/**
 * Dessa forma, você está criando um componente intermediário `RenderFormParamSuspensao` que recebe as props e as repassa 
 * para o `FormParamSuspensao`. Isso permitirá que você utilize a lógica de renderização personalizada em suas rotas, 
 * mantendo a funcionalidade original do `FormParamSuspensao`. Certifique-se de ajustar os caminhos e as importações de 
 * acordo com a estrutura do seu projeto.
 */