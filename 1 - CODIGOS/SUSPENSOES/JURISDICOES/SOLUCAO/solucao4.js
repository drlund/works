/**
 * Parece que a verificação para o tipo selecionado não está funcionando corretamente. Vamos revisar o código para encontrar 
 * a causa do problema.
 * 
 * Após adicionar esses logs, tente novamente selecionar uma opção no botão "Radio" e verifique a saída no console do navegador. 
 * Isso nos ajudará a entender melhor o que pode estar causando o problema. Se possível, compartilhe os logs para que eu possa 
 * investigar mais detalhadamente.
 * 
 * Podemos adicionar alguns logs para verificarmos o valor de `tipoSelecionadoNoRadio` e o mapeamento `tipoJurisdicoesMap` 
 * antes de mostrar a mensagem de erro. Assim, poderemos identificar o que está causando o problema. Aqui está o código revisado:
 */

function FormParamSuspensao() {
  // ... outros estados e código ...

  function isValidTipoValue(value, tipoSelecionado) {
    switch (tipoSelecionado) {
      // ... restante do código ...
    }
  }

  function incluirSuspensao() {
    const dadosForm = form.getFieldsValue();
    const tipoSelecionadoNoRadio = tipoJurisdicoesMap[tipoSelecionado];

    console.log('tipoSelecionadoNoRadio:', tipoSelecionadoNoRadio);
    console.log('tipoJurisdicoesMap:', tipoJurisdicoesMap);

    if (!tipoSelecionadoNoRadio) {
      message.error('Opção de tipo selecionada inválida!');
      return;
    }

    // Restante do código igual ao anterior
    // ...
  }

  // ... restante do seu código ...
}
