/**
 * Certifique-se de adicionar a lógica de renderização condicional e a atualização do estado da variável `selecionaTipo` 
 * nos locais apropriados do seu código. A regra de validação agora verificará o formato da matrícula apenas quando 
 * a opção "Matrícula" estiver selecionada. Para as outras opções, a validação será aplicada de acordo com a lógica 
 * anteriormente discutida.
 * 
 * A implementação sugerida será um pouco diferente no seu caso devido à estrutura do seu código. Vamos adicionar a 
 * lógica de validação conforme discutido anteriormente. Primeiro, declare uma função separada para lidar com a 
 * renderização condicional dos componentes de entrada com base na opção selecionada. Em seguida, atualize a regra 
 * de validação no `Form.Item` para aplicar a validação apenas quando "Matrícula" estiver selecionada. Aqui está 
 * como você pode fazer isso:
*/

// ... (código anterior)

function FormParamSuspensao({ location }) {
  // ... (código anterior)

  const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
    const valorSelecionado = e.target.value;

    // ... (código anterior)

    if (valorRadioGroup === 'matriculas') {
      setSelecionaTipo('matriculas');
    } else {
      setSelecionaTipo('');
    }

    // ... (código anterior)
  };

  const renderComponentesInput = () => {
    if (selecionaTipo === 'matriculas') {
      return (
        <InputFunciSuspensao
          value={tipoInputValue}
          tipoSelecionado={tipoSelecionado}
        />
      );
    }
    return (
      <InputPrefixoAlcada
        value={tipoInputValue}
        tipoSelecionado={tipoSelecionado}
        ref={tipoInputRef}
      />
    );
  };

  return (
    <>
      {/* ... (código anterior) */}

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
              const tipoSelecionado = tipoSelecionadoTemp;
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

      {/* ... (código anterior) */}
    </>
  );
}

export default FormParamSuspensao;
