/**
 * A expressão `const tipoSelecionado = tipoSelecionado;` não faz sentido, pois está tentando atribuir o próprio 
 * valor a uma constante. A intenção era acessar o valor do estado `tipoSelecionado` diretamente na função. Peço 
 * desculpas pela confusão.
 * 
 * Aqui está a correção:
 */

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: 'Por favor, selecione um tipo!',
    },
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (tipoSelecionado === 'matriculas') {
          if (/^F\d{7}$/.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject('Formato de matrícula inválido!');
        }

        if (!value || validaJurisdicao.includes(value)) {
          return Promise.resolve();
        }

        if (!tipoSelecionado) {
          return Promise.resolve();
        }

        const chaveJurisdicao = tipoSelecionado;
        const isValid = validarTipo(value, chaveJurisdicao);

        if (isValid) {
          return Promise.resolve();
        }

        return Promise.reject(
          'O tipo selecionado não é válido para esta opção.',
        );
      },
    }),
  ]}
>
  {renderComponentesInput()}
</Form.Item>
