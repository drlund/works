/**
 * Com base na nova estrutura de dados da consulta "getSuspensoes", onde cada chave representa um tipo de suspensão e os 
 * valores são arrays de objetos com informações específicas, você pode manipular essas informações no `handleEdit` da 
 * seguinte maneira:
 * 

1. **Importe Moment:**
   Certifique-se de que a biblioteca Moment esteja importada para lidar com as datas. Se você já está usando Moment, 
   pode ignorar essa etapa.

2. **Manipule os Dados no `handleEdit`:**
   Dentro da função `handleEdit`, primeiro busque o registro correspondente com base no 'id' da consulta "getSuspensoes" 
   e depois atualize o estado do formulário com esses valores.

Aqui está o código atualizado para o seu componente `FormParamSuspensaoPatch` com base na nova estrutura de dados:
*/

import moment from 'moment'; // Certifique-se de importar a biblioteca Moment

// ... (código existente)

function FormParamSuspensaoPatch({ location }) {
  // ... (código existente)

  const handleEdit = async (id) => {
    try {
      const dadosSuspensoes = await getSuspensoes(); // Buscar dados da consulta "getSuspensoes"
     
      const tipos = [
        'paramVicePresi',
        'paramDiretoria',
        'paramSuper',
        'paramGerev',
        'paramPrefixo',
        'paramMatricula'
      ];

      let registroEncontrado = null;

      for (const tipo of tipos) {
        registroEncontrado = dadosSuspensoes[tipo].find(item => item.id === id);
        if (registroEncontrado) {
          break;
        }
      }

      if (registroEncontrado) {
        // Preencher os campos do formulário com os dados encontrados
        setFormData({
          tipo: registroEncontrado[tipoSelecionadoMap[registroEncontrado.tipoSuspensao]],
          validade: moment(registroEncontrado.validade),
          tipoSuspensao: registroEncontrado.tipoSuspensao,
          // ...preencher outros campos conforme necessário
        });

        // Definir o tipo apropriado de entrada, etc.
        // ... (similar ao seu código existente)

        // Mostrar o formulário (se estiver oculto)
        setModalVisible(true);
      }
    } catch (erro) {
      // Lidar com o erro
      console.error('Erro ao buscar/editar dados:', erro);
    }
  };

  // ... (código existente)

  return (
    <>
      {/* ... (código existente) */}
      <Card>
        {/* ... (código existente) */}
        <Form
          // ... (props existentes)
          initialValues={formData} // Preencher o formulário com os dados iniciais
        >
          {/* ... (itens de formulário existentes) */}
        </Form>
      </Card>
    </>
  );
}

export default FormParamSuspensaoPatch;

/**
 * Certifique-se de que a variável `tipoSelecionadoMap` esteja definida corretamente para mapear os valores de `tipoSuspensao`
 *  para os campos correspondentes do formulário.
 * 
 * Lembre-se de adaptar este exemplo ao seu código e estrutura específicos. Isso deve permitir que você manipule as informações 
 * corretas da consulta "getSuspensoes" ao clicar no ícone de edição.
 */