/**
 * Para ajustar o campo "tipo" do formulário com o "valor" selecionado a partir do `Radio.Group`, você precisará fazer 
 * algumas modificações no código. A ideia é mapear o "valor" selecionado para o campo "tipo" do formulário.
 * 
 * Vamos seguir os seguintes passos:
 * 
 * 1. No estado inicial do componente `FormParamSuspensaoPatch`, adicione um estado para controlar o "valor" selecionado 
 * do `Radio.Group`:
 */


const [tipoSelecionadoValue, setTipoSelecionadoValue] = useState(''); // Estado para controlar o valor selecionado


// 2. No `Radio.Group`, atualize o evento `onChange` para atualizar o estado `tipoSelecionadoValue`:

<Radio.Group
  disabled
  onChange={(e) => {
    handleTipoChange(e);
    setTipoSelecionadoValue(e.target.value); // Atualiza o estado com o valor selecionado
  }}
>
  {/* Resto do código */}
</Radio.Group>

3. No `Form.Item` onde está o campo "tipo", ajuste o valor do campo para o estado `tipoSelecionadoValue`:

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: 'Por favor, selecione um tipo!',
    },
    () => ({
      validator(_, value) {
        const tipoSelecionado = tipoSelecionadoTemp;
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
  {/* Usar o estado tipoSelecionadoValue como valor do campo */}
  {renderComponentesInput(tipoSelecionadoValue)}
</Form.Item>

// 4. Atualize a função `renderComponentesInput` para aceitar o parâmetro `tipoSelecionadoValue`:

const renderComponentesInput = (tipoSelecionadoValue) => {
  if (selecionaTipo !== 'matriculas') {
    return (
      <InputPrefixoAlcada
        disabled
        value={tipoInputValue}
        tipoSelecionado={tipoSelecionado}
        ref={tipoInputRef}
      />
    );
  }
  return (
    <InputFunciSuspensao
      disabled
      value={tipoInputValue}
      tipoSelecionado={tipoSelecionado}
      tipoSelecionadoValue={tipoSelecionadoValue} // Passe o valor para o componente
    />
  );
};

// 5. Dentro do componente `InputFunciSuspensao`, você deve ajustar como o valor é exibido de acordo com o `tipoSelecionadoValue`:

const InputFunciSuspensao = ({ disabled, value, tipoSelecionado, tipoSelecionadoValue }) => {
  // Resto do código

  return (
    <Input
      disabled={disabled}
      value={tipoSelecionadoValue === 'matriculas' ? formatValueMatricula(value) : value}
      onChange={handleChange}
    />
  );
};

/**
 * Lembre-se de fazer os ajustes necessários em outras partes do código, se necessário. A ideia principal é utilizar 
 * o estado `tipoSelecionadoValue` para controlar o valor do campo "tipo" do formulário e exibir o valor correto no 
 * componente `InputFunciSuspensao`.
 */