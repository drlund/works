/**Para criar um arquivo de definição de tipo (.d.ts) para encapsular o tipo de uma chamada de importação, você precisa seguir os seguintes passos:
 * 
 * 1. Crie um novo arquivo com a extensão .d.ts. Por exemplo, `getPermissoesUsuario.d.ts`. 
 * 2. No arquivo `.d.ts`, você precisa definir a estrutura do tipo para a função `getPermissoesUsuario`. Supondo que a função retorne um array de 
 * strings, você pode fazer o seguinte:
 * 
 * Com essa abordagem, você definiu o tipo de retorno da função `getPermissoesUsuario` como um array de strings em um arquivo de definição de tipo. 
 * Dessa forma, o TypeScript poderá inferir o tipo corretamente quando você usar a função em outros lugares do seu código.
*/



declare module 'utils/getPermissoesUsuario' {
  export function getPermissoesUsuario(): string[];
}

// 3. Salve o arquivo `.d.ts`.

// 4. Agora, você pode usar a importação tipada em outros arquivos da seguinte forma:


import { getPermissoesUsuario } from 'utils/getPermissoesUsuario';

const permissoes: string[] = getPermissoesUsuario();
