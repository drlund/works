//Vou esclarecer a situação:

/**
 * O problema é que o campo `tipoSelecionado` não está disponível diretamente dentro do escopo da função de validação. Para resolver isso, 
 * você pode definir um estado local para armazenar o valor de `tipoSelecionado` e atualizá-lo sempre que o campo mudar. Aqui está como 
 * você pode fazer isso:
 */

/**
 * Neste exemplo, estamos definindo um novo estado chamado `tipoSelecionadoValidator` e atualizando-o sempre que o valor do rádio muda através da função 
 * `handleTipoChange`. Em seguida, utilizamos esse estado dentro das regras do campo `tipo`. Isso garantirá que o valor correto de `tipoSelecionado` 
 * esteja disponível dentro da função de validação. Certifique-se de fazer as alterações em outras partes do seu código onde `tipoSelecionado` é usado, 
 * para utilizar `tipoSelecionadoValidator` onde necessário.
 */


// Dentro da função FormParamSuspensao
const [tipoSelecionadoValidator, setTipoSelecionadoValidator] = useState('');

// ...

<Form.Item label="Tipo">
  <Radio.Group
    onChange={(e) => {
      handleTipoChange(e);
      setTipoSelecionadoValidator(e.target.value);
    }}
  >
    {/* ... Radios ... */}
  </Radio.Group>
</Form.Item>

{/* ... Dentro das regras do campo 'tipo' ... */}
rules={[
  {
    required: true,
    message: 'Por favor, selecione um tipo!',
  },
  ({ getFieldValue }) => ({
    validator(_, value) {
      const tipoSelecionado = tipoSelecionadoValidator;
      if (!value || validaJurisdicao.includes(value)) {
        return Promise.resolve();
      }

      if (!tipoSelecionado) {
        return Promise.resolve();
      }

      const isValid = validarTipo(value, tipoSelecionado);

      if (isValid) {
        return Promise.resolve();
      }

      return Promise.reject(
        'O tipo selecionado não é válido para esta opção.',
      );
    },
  }),
]}

