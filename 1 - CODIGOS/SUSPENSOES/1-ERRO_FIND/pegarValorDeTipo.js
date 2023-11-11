/**
 * Para transformar o campo "tipo" e seu valor da tabela "getSuspensoes" para o campo "valor" da "view" de nome "
 * getSuspensoesView," você precisa fazer algumas alterações no seu código. A ideia é usar a tabela "getSuspensoes" 
 * para obter o valor correspondente e, em seguida, mapeá-lo para o campo "valor" na "view" quando estiver 
 * preenchendo o formulário.
 */

// Aqui estão os passos que você pode seguir:

// 1. Importe as funções necessárias para obter os dados da tabela "getSuspensoes" e "getSuspensoesView":

import { getSuspensoes, getSuspensoesView } from '../../apiCalls/apiParamSuspensao';

/**
 * 2. Modifique a função `useEffect` para buscar os dados da tabela "getSuspensoes" e "getSuspensoesView" e fazer 
 * a correspondência entre o campo "tipo" e "valor":
 */

useEffect(() => {
  if (id && tipo) {
    Promise.all([getSuspensoesView(), getSuspensoes()]).then(([viewData, suspensaoData]) => {
      const tipoSuspensoesKeys = Object.keys(viewData);
      let suspensao = null;
      for (const key of tipoSuspensoesKeys) {
        suspensao = viewData[key].find((item) => item.id === id);
        if (suspensao) {
          break;
        }
      }
      if (suspensao) {
        // Encontre o valor correspondente na tabela "getSuspensoes"
        const tipoCorrespondente = suspensao.tipo;
        const valorCorrespondente = suspensaoData.find((item) => item.tipo === tipoCorrespondente)?.valor;

        // Defina o estado do formulário com os valores correspondentes
        setFormData({
          tipo: valorCorrespondente, // Defina o valor correspondente aqui
          validade,
          tipoSuspensao,
        });
      }
    });
  }
}, [id, tipo, validade]);

/**
 * 3. Agora, quando o formulário for preenchido, ele usará o valor correspondente da tabela "getSuspensoes" para o 
 * campo "tipo." Certifique-se de ajustar o código onde você está renderizando e validando o campo "tipo" para refletir 
 * essa alteração.
 * 
 * Isso deve permitir que você transforme o campo "tipo" e seu valor da tabela "getSuspensoes" para o campo "valor" 
 * na "view" "getSuspensoesView" ao preencher o formulário de edição. Certifique-se de ajustar os detalhes conforme 
 * necessário para atender aos requisitos específicos do seu aplicativo.
 */