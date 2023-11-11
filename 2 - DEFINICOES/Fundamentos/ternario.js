/**
 * Ele funciona como uma forma mais compacta de expressar uma estrutura condicional if-else, retornando o valor_se_verdadeiro quando a 
 * condição é verdadeira e valor_se_falso quando a condição é falsa. Nesse caso, estamos verificando se `parametroExistente` é verdadeiro 
 * e se `parametroExistente.ativo` é falso. Se ambas as condições forem verdadeiras, `acao` receberá o valor "Reinclusão"; caso contrário, 
 * receberá o valor "Inclusão". 
 * 
 * Para transformar a estrutura de controle em um operador ternário, você pode fazer o seguinte:
*/

let acao = parametroExistente && !parametroExistente.ativo ? "Reinclusão" : "Inclusão";

// O operador ternário tem a seguinte sintaxe:


condição ? valor_se_verdadeiro : valor_se_falso

