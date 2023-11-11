// Importações omitidas para maior clareza

function FormParamAlcadas({ location }) {
    // Código anterior omitido
   
    return (
      <>
        {/* Código anterior omitido */}
        <Card>
          <Form
            initialValues={{
              prefixoDestino,
              nomePrefixo,
              comissaoDestino,
              nomeComissaoDestino,
              comite,
              nomeComite,
              observacao,
            }}
            form={form}
            {...layout}
            name="control-ref"
            onFinish={gravaEditaParametros}
          >
            {/* Código anterior omitido */}
            <Form.Item
              name="observacao"
              label="Observação"
              rules={[
                {
                  required: true,
                  message: 'Por favor, digite uma observação!',
                },
              ]}
            >
              <TextArea
                disabled={id !== 0}
                rows={4}
                type="text"
                placeholder="Observação!"
                value={`${observacao} Matrícula: ${matricula} Nome: ${nomeUsuario}`}
              />
            </Form.Item>
            {/* Código anterior omitido */}
          </Form>
        </Card>
      </>
    );
  }
  
  export default FormParamAlcadas;