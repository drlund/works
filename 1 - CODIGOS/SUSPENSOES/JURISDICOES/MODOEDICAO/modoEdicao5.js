/**
 * Se o componente `FormParamSuspensao` não está sendo renderizado corretamente no modo de edição (modoEdicao), pode 
 * haver algumas razões pelas quais isso está acontecendo. Vamos verificar algumas possíveis soluções para resolver 
 * esse problema:
 * 
 * 1. **Verifique se o `modoEdicao` está sendo definido corretamente:** Certifique-se de que a variável `modoEdicao` 
 * está sendo definida como `true` quando você está navegando para a página de edição. Verifique os trechos de código 
 * onde você define o valor de `modoEdicao` e certifique-se de que ele seja definido corretamente.
 * 
 * 2. **Passe o valor de `modoEdicao` para o componente `RenderFormParamSuspensao`:** Se o valor de `modoEdicao` não 
 * estiver sendo passado corretamente para o componente `RenderFormParamSuspensao`, o modo de edição não será ativado. 
 * Certifique-se de que você está passando o valor de `modoEdicao` para o componente na configuração da rota.
 * 
 * 3. **Verifique a lógica de renderização condicional:** No componente `FormParamSuspensao`, verifique se você está 
 * usando a variável `modoEdicao` corretamente em sua lógica de renderização condicional. Certifique-se de que os 
 * componentes correspondentes ao modo de edição estejam sendo renderizados corretamente.
 * 
 * 4. **Depuração:** Adicione alguns logs de depuração para acompanhar o valor de `modoEdicao` e outros estados 
 * relevantes enquanto você navega para a página de edição. Isso ajudará a identificar se o valor está sendo definido 
 * corretamente e se a lógica de renderização está funcionando como esperado.
 * 
 * Aqui está um exemplo de como você pode ajustar a configuração da rota para passar o valor de `modoEdicao` para 
 * o componente `RenderFormParamSuspensao`:
 */

{
  title: 'Editar Suspensão',
  path: `${basePath}editar-suspensao/`,
  permissions: ['PARAM_SUSPENSOES_USUARIO'],
  verifyAllPermissions: false,
  render: (props) => <RenderFormParamSuspensao modoEdicao={true} {...props} />, // Passa o valor de modoEdicao
  breadcrumbRoutes: [
    ...baseBCRoutes,
    { breadcrumbName: 'Edição de Suspensão' },
  ],
},

// Lembre-se de substituir `{basePath}` e outras variáveis pelos valores corretos do seu projeto.

/**
 * Se após verificar esses pontos ainda houver problemas com o carregamento da renderização no modo de edição, pode ser 
 * necessário revisar o código em detalhes para identificar a causa raiz do problema.
 */     