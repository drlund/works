/**Para fazer o ajuste no frontend para que ele saiba que "comite" é "prefixo" em "listaComiteParamAlcadas", você precisa modificar o código no 
 * frontend para enviar a variável corretamente com o nome "prefixo". Aqui estão algumas opções de como você pode fazer isso:
 * 
 * Ao usar a opção 2, você está passando um objeto de parâmetros para o Axios, onde a chave "prefixo" corresponde ao nome esperado pelo método 
 * no backend, e o valor é a variável "comite" do frontend.
 * 
 * Escolha a opção que melhor se adequa ao seu código e faça as alterações correspondentes no frontend. Certifique-se também de que o backend 
 * esteja configurado para receber a variável "prefixo" corretamente no endpoint correspondente.
*/

/**
 * Opção 1: Alterar o nome da variável no frontend: no frontend, onde você está fazendo a chamada para o método "listaComiteParamAlcadas", 
 * você deve alterar o nome da variável de "comite" para "prefixo". Por exemplo:
*/

// Antes
const comite = "valor do comite";
axios.get(`/api/listaComiteParamAlcadas?comite=${comite}`)
  .then(response => {
    // processar a resposta
  })
  .catch(error => {
    // lidar com erros
  });

// Depois
const prefixo = "valor do comite";
axios.get(`/api/listaComiteParamAlcadas?prefixo=${prefixo}`)
  .then(response => {
    // processar a resposta
  })
  .catch(error => {
    // lidar com erros
  });

/** Opção 2: Mapear a variável no frontend: se você não puder alterar o nome da variável no frontend, pode mapear a variável 
 * "comite" para "prefixo" no momento em que você faz a chamada para o método. Por exemplo:
*/


const comite = "valor do comite";
axios.get(`/api/listaComiteParamAlcadas`, {
  params: {
    prefixo: comite
  }
})
.then(response => {
  // processar a resposta
})
.catch(error => {
  // lidar com erros
});
