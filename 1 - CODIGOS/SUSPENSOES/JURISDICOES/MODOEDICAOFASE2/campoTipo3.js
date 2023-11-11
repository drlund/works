/**
 * Para que o campo "tipo" no formulário mostre o valor correspondente a "valor" vindo dos dados, você pode 
 * fazer o seguinte:

1. Alterar o estado inicial do componente para conter "valor" em vez de "tipo".
2. Configurar o campo "tipo" no `Radio.Group` para usar os valores "valor" dos dados.
3. Utilizar a propriedade `initialValues` para definir o valor inicial do campo "tipo" no formulário.

Aqui está o código modificado:
*/

function FormParamSuspensaoPatch({ location }) {
  // Resto do código

  const [formData, setFormData] = useState({
    tipo: '', // Deixe vazio para ser preenchido pelo initialValues
    validade: "31/08/2023",
    tipoSuspensao: "4",
  });

  useEffect(() => {
    if (location.state) {
      const { tipo, valor, tipoSuspensao, validade } = location.state;
      setFormData({
        tipo: valor, // Defina o valor vindo dos dados
        validade,
        tipoSuspensao,
      });
    }
  }, [location.state]);

  // Resto do código

  return (
    <>
      {/* Resto do código */}
      <Form
        form={form}
        {...layout}
        name="control-ref"
        onFinish={editaSuspensao}
        initialValues={formData}
      >
        {/* Resto do código */}
        <Form.Item label="Tipo">
          <Radio.Group
            disabled
            value={formData.tipo} // Defina o valor do estado formData
            onChange={(e) => {
              handleTipoChange(e);
              setTipoSelecionadoValidator(e.target.value);
            }}
          >
            {/* Opções de Radio */}
          </Radio.Group>
        </Form.Item>
        {/* Resto do código */}
      </Form>
      {/* Resto do código */}
    </>
  );
}

export default FormParamSuspensaoPatch;

/**
 * Ao definir o valor inicial do campo "tipo" no estado `formData` usando o valor vindo dos dados (`valor`), você 
 * garante que o campo "tipo" será preenchido corretamente com o valor correspondente ao carregar o formulário. 
 * Certifique-se de que o valor de "valor" corresponda a uma das opções de `Radio` do campo "tipo".
 */