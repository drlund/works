/**
 * O erro "Cannot read properties of undefined (reading 'find')" geralmente ocorre quando você está tentando acessar a propriedade 'find' em um objeto que 
 * é undefined. No seu código, parece que você está tentando acessar a propriedade 'find' em 'dadosSuspensoes[tipo]', onde 'tipo' é determinado em um loop. 
 * Se 'dadosSuspensoes[tipo]' não for definido, você receberá esse erro.
 * 
 * Para solucionar esse problema, verifique se 'dadosSuspensoes[tipo]' está definido antes de chamar a função 'find'. Você pode fazer isso assim:
 */

/**
 * Isso garantirá que você só tente chamar 'find' em 'dadosSuspensoes[tipo]' se ele estiver definido, evitando o erro "Cannot read properties of undefined". 
 * Certifique-se também de verificar se 'registroEncontrado' é definido antes de usá-lo posteriormente no código.
 * 
 */

for (const tipo of tipos) {
  if (dadosSuspensoes[tipo]) {
    registroEncontrado = dadosSuspensoes[tipo].find(
      (/** @type {{ id: any; }} */ item) => item.id === id,
    );
    if (registroEncontrado) {
      break;
    }
  }
}
