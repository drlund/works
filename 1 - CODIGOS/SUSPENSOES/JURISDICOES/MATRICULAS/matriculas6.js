/**
 * Se a regra de validação também é necessária para as outras opções, a abordagem anterior não é adequada. 
 * Vamos reverter a lógica para incluir a regra de validação para todas as opções, mas garantir que a validação 
 * seja aplicada apenas quando "Matrícula" estiver selecionada.
 * 
 * Aqui está como você pode fazer isso:
 */

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (tipoSelecionado === 'matricula') {
          if (!value || validaJurisdicao.includes(value)) {
            return Promise.resolve();
          }

          return Promise.reject(
            'O tipo selecionado não é válido para esta opção.'
          );
        }

        // Adicione outras regras de validação para outras opções aqui, se necessário

        return Promise.resolve();
      },
    }),
  ]}
>
  {renderInputComponent()}
</Form.Item>

/**
 * Substitua o trecho relevante do seu código pelo acima. Nesse código, estamos usando uma função validator que 
 * verifica se a opção "Matrícula" está selecionada no `Radio.Group`. Se sim, aplicamos a validação específica 
 * para essa opção. Se não, você pode adicionar as regras de validação necessárias para as outras opções dentro 
 * do bloco `else`. Isso deve garantir que a validação seja aplicada de forma adequada para cada opção do 
 * `Radio.Group`.
 */