/**
 * Criar uma função semelhante para buscar os valores das jurisdições com base na opção selecionada no `Radio.Group`. 
 * Isso pode ajudar a resolver o problema. Aqui está uma ideia de como você pode fazer isso:
 */

function buscarJurisdicoes(valorSelecionado) {
  if (valorSelecionado) {
    const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];

    if (!valorRadioGroup) {
      message.error('Opção de tipo selecionada inválida!');
      return;
    }

    getTiposJurisdicoes(valorRadioGroup)
      .then((result) => {
        const jurisdicoes = result.map(
          (/** @type {{ valorSelecionado: number; }} */ item) => item.valorSelecionado,
        );
        setContemJurisdicao(jurisdicoes);
      })
      .catch(() => {
        setContemJurisdicao([]);
      });
  } else {
    setContemJurisdicao([]);
  }
}

/**
 * Em seguida, você pode chamar essa função no seu `handleTipoChange` para buscar as jurisdições com base na opção 
 * selecionada no `Radio.Group`:
 */

const handleTipoChange = (e) => {
  const valorSelecionado = e.target.value;
  buscarJurisdicoes(valorSelecionado);

  // Resto do seu código...
};

Certifique-se de que a função `listaComiteParamAlcadas` (que substitui `getTiposJurisdicoes`) esteja funcionando conforme o esperado para retornar os dados corretos das jurisdições.

Isso deve ajudar a separar a lógica de busca das jurisdições em uma função específica, o que pode facilitar o entendimento e a manutenção do código. Certifique-se de adaptar as variáveis e os nomes das funções conforme necessário para se adequarem ao seu código atual.