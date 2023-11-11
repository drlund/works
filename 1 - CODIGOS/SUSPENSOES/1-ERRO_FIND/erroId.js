/**
 * O objeto que você mencionou, onde a chave `id` contém os dados que você deseja acessar, parece estar estruturado de forma 
 * incomum. Para acessar os valores dentro desse objeto, você pode fazê-lo da seguinte maneira:
 */

const idData = {}; // Seu objeto id aqui

const { tipo, tipoSuspensao, validade } = idData;

/**
 * Isso irá extrair os valores `tipo`, `tipoSuspensao` e `validade` do objeto `idData` para que você possa usá-los em seu 
 * código. Certifique-se de que `idData` corresponda à estrutura que você mencionou em sua pergunta.
 */

// Se você deseja acessar valores dentro de `validade`, você pode fazer algo semelhante:

const idData = {}; // Seu objeto id aqui

const { tipo, tipoSuspensao, validade } = idData;
const { campo1, campo2 } = validade;

/**
 * Isso irá extrair os valores dentro de `validade` (supondo que `validade` seja um objeto aninhado) para que você possa usá-los 
 * em seu código.
 * 
 * Lembre-se de substituir `{}` por seu objeto `idData` real na sua função `editaSuspensao` para acessar os dados corretos. 
 * Certifique-se de que os nomes das chaves correspondam aos que você recebe da consulta, caso contrário, você receberá valores 
 * indefinidos.
 */