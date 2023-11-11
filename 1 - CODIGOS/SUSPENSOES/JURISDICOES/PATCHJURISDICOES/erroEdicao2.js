/**
 * O erro "Erro ao buscar/editar dados" pode ser causado por vários motivos. Vou analisar o código e apontar algumas 
 * possíveis causas:

1. **Variável `record` não definida**: No trecho de código onde você está chamando `patchSuspensao`, há referências a uma 
variável `record` que não está definida em nenhum lugar dentro da função `editaSuspensao`. Verifique se você deve usar 
`registroEncontrado` em vez de `record`.

2. **Chamada incorreta da função `patchSuspensao`**: A chamada para a função `patchSuspensao` parece estar faltando os 
parâmetros necessários. Certifique-se de que está passando os parâmetros corretos para essa função.

3. **Erro na API de requisição**: O erro também pode estar relacionado a um erro na API de requisição. Certifique-se de 
que a função `getSuspensoes` e `patchSuspensao` estejam implementadas corretamente e tratando os erros adequadamente.

4. **Manipulação inadequada do estado**: Verifique se a manipulação do estado das variáveis `formData`, `dadosSuspensoesForm`
 e outras variáveis relacionadas está correta e de acordo com as necessidades da aplicação.

5. **Chamada duplicada da função `patchSuspensao`**: Note que você está chamando `patchSuspensao` duas vezes dentro do bloco 
`if (permissao.includes('PARAM_SUSPENSOES_USUARIO'))`. Certifique-se de que isso é intencional e não está causando conflitos.

6. **Tratamento de erro inadequado**: O tratamento de erro no bloco `catch` pode não estar exibindo uma mensagem clara o 
suficiente para diagnosticar o problema. Tente logar o erro no console para entender melhor qual é o erro específico que 
está ocorrendo.

Para solucionar o problema, sugiro fazer uma análise mais detalhada do código, verificar se todas as variáveis estão sendo 
tratadas corretamente, e certificar-se de que as funções da API de requisição estão sendo chamadas com os parâmetros corretos 
e tratando os erros adequadamente. Além disso, você pode tentar logar informações relevantes no console para depurar o erro 
e identificar a causa raiz.
*/