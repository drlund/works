/** Para verificar se o campo "temComite" contém o valor fornecido pelo campo "InputPrefixo", você pode adicionar 
 * um evento de mudança ao campo "InputPrefixo" e comparar o valor digitado com a lista "temComite". Aqui está um 
 * exemplo de como você pode fazer isso:

1. Adicione um estado para armazenar o valor do campo "InputPrefixo" digitado pelo usuário e outro estado para 
armazenar o resultado da verificação:
*/
const [inputPrefixoValue, setInputPrefixoValue] = useState("");
const [prefixoTemComite, setPrefixoTemComite] = useState(false);

/** 2. No componente "InputPrefixo", adicione o evento `onChange` e atualize o estado `inputPrefixoValue` com
 * o valor digitado:
 */

<InputPrefixo
  // ...
  value={inputPrefixoValue}
  onChange={(cod_dependencia) => {
    setInputPrefixoValue(cod_dependencia.value);
    // Restante do código
  }}
/>;

/** 3. Adicione um efeito para verificar se o valor digitado está presente na lista "temComite" sempre que o
 * estado `inputPrefixoValue` for alterado:
 */

useEffect(() => {
  if (inputPrefixoValue) {
    const prefixoExiste = temComite.includes(inputPrefixoValue);
    setPrefixoTemComite(prefixoExiste);
  } else {
    setPrefixoTemComite(false);
  }
}, [inputPrefixoValue, temComite]);

/**
 * 4. Agora você pode usar o estado `prefixoTemComite` para exibir uma mensagem ou tomar qualquer ação com base
 * na existência do prefixo na lista "temComite". Por exemplo:
 */

{
  prefixoTemComite && (
    <span style={{ color: "red" }}>O prefixo possui comitê.</span>
  );
}

<Form.Item name="comite" label="Comitê/Nome comitê" higth="150px" required>
  <InputPrefixo
    labelInValue
    placeholder="Comitê/Nome"
    value={comite}
    onChange={(comite) => {
      setComite(comite.value);
      buscarComites(comite);
    }}
    defaultOptions={[
      {
        prefixo: location.state.comite,
        nome: location.state.nomeComite,
      },
    ]}
  />
  {prefixoTemComite && (
    <span style={{ color: "red" }}>O prefixo possui comitê.</span>
  )}
</Form.Item>;

// Lembre-se de ajustar o código de acordo com o restante da sua aplicação.
