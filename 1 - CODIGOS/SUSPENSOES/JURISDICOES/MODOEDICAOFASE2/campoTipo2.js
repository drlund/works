/**
 * Se você deseja mapear o campo "tipo" no formulário para o valor selecionado do `Radio.Group`, sem modificar o 
 * nome do campo no banco de dados ou na requisição, você pode simplesmente ajustar o código do formulário para 
 * refletir essa mudança.
 * 
 * 1. Primeiro, remova o estado `tipoSelecionadoValue` que havíamos adicionado anteriormente, pois não será mais 
 * necessário.
 * 
 * 2. No componente `Form.Item` onde está o campo "tipo", ajuste o valor do campo para o estado `tipoSelecionado`:
 */

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
  {/* Usar o estado tipoSelecionado como valor do campo */}
  {renderComponentesInput()}
</Form.Item>


/**
 * 3. Certifique-se de que a função `renderComponentesInput` não passe mais o `tipoSelecionadoValue` para o componente 
 * `InputFunciSuspensao`:
*/

const renderComponentesInput = () => {
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
    />
  );
};


//4. Em `InputFunciSuspensao`, você pode usar o prop `tipoSelecionado` para determinar como exibir o valor:


const InputFunciSuspensao = ({ disabled, value, tipoSelecionado }) => {
  // Resto do código

  return (
    <Input
      disabled={disabled}
      value={tipoSelecionado === 'matriculas' ? formatValueMatricula(value) : value}
      onChange={handleChange}
    />
  );
};

/**
 * Dessa forma, o campo "tipo" no formulário será mapeado para o "valor" selecionado no `Radio.Group`, sem a necessidade 
 * de modificar o nome do campo no banco de dados ou na requisição. Certifique-se de verificar se as outras partes do código 
 * estão consistentes com essa abordagem.
 */