/**
 * O campo "Tipo" é necessário para que o usuário possa digitar um valor correspondente ao tipo selecionado no `Radio.Group`.
 * Então, para que o campo "Tipo" seja preenchido automaticamente com o valor correspondente ao tipo selecionado no `Radio.Group`, 
 * você pode fazer a seguinte alteração no código:
 */

// Resto do código...

function FormParamSuspensao({ location }) {
  // Resto do código...

  const handleTipoChange = (e) => {
    setSelectedTipo(e.target.value);
    form.setFieldsValue({ tipo: e.target.value }); // Adiciona esta linha para atualizar o campo "Tipo"
  };

  // Resto do código...

  return (
    <>
      {/* Resto do código... */}
      <Card>
        <Form
          form={form}
          {...layout}
          name="control-ref"
          onFinish={incluirSuspensao}
        >
          <Form.Item label="Tipo">
            <Radio.Group onChange={handleTipoChange} value={selectedTipo}>
              <Radio value="vicePresi"> Vice Presidência </Radio>
              <Radio value="diretoria"> Unid. Estratégica </Radio>
              <Radio value="super"> Unid. Tática </Radio>
              <Radio value="gerev"> Comercial </Radio>
              <Radio value="prefixo"> Prefixo </Radio>
              <Radio value="matricula"> Matrícula </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="tipo"
            label="Tipo"
            rules={[
              {
                required: true,
                message: 'Por favor, digite o tipo!',
              },
            ]}
          >
            <Input placeholder="Tipo" />
          </Form.Item>
          <Form.Item name="tipoSuspensao" label="Tipo de Suspensão" required>
            <Select
              placeholder="Selecione o tipo de suspensão"
              onChange={(value) => {
                if (value === 'novo') {
                  setModalVisible(true);
                }
              }}
            >
              {tiposSuspensao.map((tipo) => (
                <Select.Option key={tipo.id} value={tipo.id}>
                  {tipo.mensagem}
                </Select.Option>
              ))}
              <Select.Option
                key="novo"
                value="novo"
                style={{ fontWeight: 'bold', color: 'green' }}
              >
                ** INCLUIR NOVO TIPO DE SUSPENSÃO **
              </Select.Option>
            </Select>
          </Form.Item>
          {/* Resto do código... */}
        </Form>
      </Card>
    </>
  );
}

export default FormParamSuspensao;
