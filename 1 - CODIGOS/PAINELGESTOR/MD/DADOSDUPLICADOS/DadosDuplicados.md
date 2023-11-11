O comportamento de mostrar duas páginas repetidas ao clicar no botão "Carregar Mais!" pode ocorrer se o estado `atualizacoes` não estiver sendo atualizado de forma correta ou se a lógica de paginação não estiver funcionando como esperado. Para corrigir isso, você pode tentar o seguinte:

1. **Verifique a função `carregaMaisDados`:** Certifique-se de que a função `carregaMaisDados` está sendo chamada apenas uma vez quando o botão "Carregar Mais!" é clicado. Verifique se não há chamadas duplicadas ou outras lógicas que podem estar causando esse comportamento.

2. **Atualização do estado `atualizacoes`:** Garanta que o estado `atualizacoes` esteja sendo atualizado de forma correta e não duplicada. A função `setAtualizacoes([...atualizacoes, ...data])` deve adicionar os novos dados à matriz existente, não substituí-los.

3. **Verifique a lógica de paginação no backend:** Verifique a lógica no seu backend que está lidando com a paginação. Pode haver um problema no servidor que está retornando os dados duplicados.

4. **Depuração no frontend:** Use ferramentas de depuração no navegador para inspecionar o estado `atualizacoes` antes e depois de clicar no botão "Carregar Mais!". Isso pode ajudar a identificar quando e onde os dados duplicados estão sendo adicionados.

5. **Limpeza do estado antes de fazer a chamada do backend:** Certifique-se de que o estado `atualizacoes` esteja limpo (vazio) antes de fazer a chamada do backend quando o botão "Carregar Mais!" é clicado. Isso evitará que os dados antigos sejam mantidos na matriz.

Por favor, verifique esses pontos e, se possível, compartilhe mais detalhes do seu código ou dos resultados da depuração para que eu possa oferecer uma assistência mais específica.