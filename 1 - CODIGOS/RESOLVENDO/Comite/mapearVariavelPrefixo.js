/**
 * Para mapear a variável "comite" para "prefixo" na chamada do método "listaComiteParamAlcadas" dentro da função 
 * "buscarComites", você pode fazer da forma abaixo. Nesse exemplo, a variável "prefixoValue" é atribuída ao valor 
 * de "comite.value" caso exista ou ao valor de "comite" diretamente. Em seguida, essa variável é passada como 
 * argumento na chamada para o método "listaComiteParamAlcadas", substituindo a variável "comite". 
 * 
 * Lembre-se de ajustar o restante do código no frontend para garantir que o valor correto seja passado para a 
 * função "buscarComites". Certifique-se também de que o backend esteja configurado para receber a variável "prefixo" 
 * corretamente no endpoint correspondente.
*/

function buscarComites() {
  if (comite.value || comite === prefixo) {
    const prefixoValue = comite.value || comite; // Obter o valor do comite ou prefixo

    setComite(prefixoValue);
    listaComiteParamAlcadas(prefixoValue) // Enviar o valor como "prefixo"
      .then((result) => {
        const comitePrefixo = result.map((item) => item.PREFIXO);
        setTemComite(comitePrefixo);
        console.log(comitePrefixo);
      })
      .catch(() => {
        setTemComite([]);
      });
  } else {
    setTemComite([]);
  }

  if (comite.length === 0) { // Verificar se comite está vazio
    message.error('Prefixo informado para comitê, não possui comitê!');
  }
}
