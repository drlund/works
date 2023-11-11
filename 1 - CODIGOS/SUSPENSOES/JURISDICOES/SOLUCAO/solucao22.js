/**
 * Parece que o problema está relacionado à utilização da variável `tipoSelecionado` para acessar propriedades do objeto `dadosJurisdicoes`. 
 * Uma possível solução é garantir que `tipoSelecionado` não esteja indefinido antes de acessar as propriedades do objeto. Você pode adicionar 
 * uma verificação antes de usar a variável, por exemplo:

function validarTipo(value, tipoSelecionado) {
  if (!tipoSelecionado) {
    return false; // ou faça alguma outra ação apropriada
  }

  const chaveJurisdicao = `${tipoSelecionado}Juris`;

  const dadosDaJurisdicao = dadosJurisdicoes[chaveJurisdicao];
  if (!dadosDaJurisdicao) {
    return false;
  }

  const valoresDaJurisdicao = dadosDaJurisdicao.map(item => Object.values(item)[0]);
  return valoresDaJurisdicao.includes(value);
}

Dessa forma, você garante que `tipoSelecionado` esteja definido antes de usá-lo para construir a chave `chaveJurisdicao`. Certifique-se também de que a função `validarTipo` seja chamada corretamente com os argumentos apropriados no contexto em que é usada.

