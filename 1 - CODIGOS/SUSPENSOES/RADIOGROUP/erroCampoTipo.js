/**
 * Para resolver o problema em que uma mensagem de erro é exibida ao selecionar uma opção no Radio.Group diferente de "Matrícula" e incluir o valor definido 
 * no Radio.Group no campo, você precisa modificar a lógica do código na função `handleTipoChange` e nas regras de validação no Form.Item para "Tipo".
 * 
 * Ao limpar o campo "tipo" quando uma opção diferente de "Matrícula" é selecionada e simplificar as regras de validação, você deve alcançar o comportamento 
 * desejado sem a mensagem de erro e sem que o valor seja incluído no campo.
 * 
 * Aqui está uma versão modificada da função `handleTipoChange` e das regras de validação:
 */

const handleTipoChange = (/** @type {{ target: { value: any; }; }} */ e) => {
  const valorSelecionado = e.target.value;
 
  // Limpe o valor do campo 'tipo' quando uma opção diferente de 'Matrícula' for selecionada
  if (valorSelecionado !== 'matricula') {
    form.setFieldsValue({ tipo: '' });
  }
 
  const valorRadioGroup = tipoJurisdicoesMap[valorSelecionado];
  setTipoSelecionado(valorRadioGroup);
  setTipoSelecionadoTemp(valorRadioGroup);

  // Você pode remover a parte 'formatoInput', pois não parece ser usada

  const dadosJurisdicoes = getTiposJurisdicoes();
  const jurisdicaoSelecionada = tipoJurisdicoesMap[valorSelecionado];

  setValidaJurisdicao(
    Object.values(dadosJurisdicoes).filter(
      (prefixoTipo) => prefixoTipo === jurisdicaoSelecionada,
    ),
  );

  setOpcaoSelecionada(valorSelecionado);
};

// E para o Form.Item "Tipo," você pode simplificar as regras da seguinte forma:

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
        if (!value) {
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
          new Error(
            `O campo não é válido para o tipo de ${chaveJurisdicao} selecionado!`,
          ),
        );
      },
    }),
  ]}
>
  {/* Renderize o componente de input apropriado com base no 'tipoSelecionado' */}
  {tipoSelecionado === 'matricula' ? (
    <InputFunciSuspensao
      value={tipoInputValue}
      tipoSelecionado={tipoSelecionado}
    />
  ) : (
    <InputPrefixoAlcada
      value={tipoInputValue}
      tipoSelecionado={tipoSelecionado}
      ref={tipoInputRef}
    />
  )}
</Form.Item>
