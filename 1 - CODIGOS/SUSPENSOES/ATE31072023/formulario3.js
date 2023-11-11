/**
 * Para exibir a mensagem ao invés do "id" no campo "tipoSuspensao" do formulário, você precisa mapear os dados dos 
 * tipos de suspensão para que a propriedade "value" do componente `Select.Option` seja o "id" e a propriedade de 
 * exibição seja a mensagem que você deseja mostrar.
 * 
 * Neste exemplo, assumimos que os dados dos tipos de suspensão têm uma propriedade chamada "mensagem" que contém a 
 * mensagem que você deseja exibir no campo "tipoSuspensao". A propriedade "value" do componente `Select.Option` 
 * ainda é definida como o "id" para que você possa obter o "id" do tipo de suspensão selecionado ao enviar o formulário.
 * 
 * Aqui está como você pode fazer isso:
*/


function FormParamSuspensao({ location }) {
  // ... código existente

  const [tiposSuspensao, setTiposSuspensao] = useState([]);

  useEffect(() => {
    const fetchTiposSuspensao = async () => {
      try {
        const data = await getTipoSuspensao();
        setTiposSuspensao(data);
      } catch (error) {
        console.error('Erro ao buscar os tipos de suspensão:', error);
      }
    };

    fetchTiposSuspensao();
  }, []);

  // ... código existente

  return (
    <>
      {/* ... código existente ... */}

      <Form.Item name="tipoSuspensao" label="Tipo de Suspensão" required>
        <Select
          placeholder="Selecione o tipo de suspensão"
        >
          {/* Passo 3: Mapeie os dados para exibir a mensagem ao invés do "id" */}
          {tiposSuspensao.map((tipo) => (
            <Select.Option key={tipo.id} value={tipo.id}>
              {tipo.mensagem} {/* Use a propriedade "mensagem" aqui */}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* ... código existente ... */}
    </>
  );
}

export default FormParamSuspensao;
