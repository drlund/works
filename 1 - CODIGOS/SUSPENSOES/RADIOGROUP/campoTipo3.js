/**
 * O problema que você está enfrentando ocorre porque a validação está sendo disparada assim que o valor do campo "tipo" muda, mesmo antes do usuário ter 
 * a chance de inserir um valor válido. Para resolver isso, você precisa condicionar a validação apenas quando o formulário for submetido e o campo "tipo" 
 * não estiver vazio.
 * 
 * Neste código, a validação será aplicada apenas se `mostrarMensagemValidacao` for verdadeiro e o campo "tipo" não estiver vazio. Isso deve impedir que a 
 * mensagem de erro seja exibida antes que o usuário tenha a chance de inserir um valor válido. Certifique-se de atualizar `mostrarMensagemValidacao` conforme 
 * necessário com base em outras interações do usuário ou eventos no seu componente.
 * 
 * Você pode fazer isso ajustando o `rules` do `Form.Item` do campo "tipo" para ser condicional com base em uma variável de estado que controla se a validação 
 * deve ser aplicada. Algo assim:
 */

<Form.Item
  name="tipo"
  label="Tipo"
  rules={[
    ({ getFieldValue }) => ({
      validator(_, value) {
        if (!value || validaJurisdicao.includes(value)) {
          return Promise.resolve();
        }

        if (!tipoSelecionado || !mostrarMensagemValidacao) {
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
