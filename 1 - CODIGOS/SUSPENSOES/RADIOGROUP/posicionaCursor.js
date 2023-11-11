/**
 * Entendi o que você deseja agora. Para posicionar o cursor no campo de entrada (input) quando uma seleção for feita no `<Radio.Group>`, você pode usar 
 * a propriedade `defaultValue` para definir o valor inicial do campo "tipo" como vazio (""). Isso fará com que o cursor seja posicionado no campo.
 * 
 * Certifique-se de remover qualquer valor inicial definido para o campo "tipo" (por exemplo, `initialValue`) e usar apenas a propriedade `defaultValue` 
 * para garantir que o cursor seja posicionado no campo quando uma seleção for feita no `<Radio.Group>`.
 * 
 * Aqui está como você pode fazer isso:
 */

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    {
      required: true,
      message: mostrarMensagemValidacao
        ? 'Por favor, selecione um tipo!'
        : '',
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
