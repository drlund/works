/**
 * Com essas alterações, quando o usuário selecionar "Incluir novo tipo de suspensão" no dropdown, um modal será exibido, 
 * permitindo ao usuário inserir a nova mensagem de suspensão. Após o usuário clicar no botão "Salvar" no modal, você pode 
 * tratar a lógica de salvamento na função `handleSaveNewSuspensionType` (por exemplo, salvar a nova mensagem de suspensão 
 * no banco de dados).
 * 
 * Para adicionar uma nova opção no dropdown "Select" que permita ao usuário inserir uma nova mensagem de suspensão, caso 
 * a opção desejada não esteja disponível, você pode modificar o código da seguinte forma:
 * 
 * 1. Atualize o código JSX dentro do componente "FormParamSuspensao" para adicionar a opção "Incluir novo tipo de suspensão" 
 * como o último item no dropdown "Select".
 * 
 * 2. Trate o caso em que o usuário seleciona a opção "Incluir novo tipo de suspensão" e exiba um modal ou campo de entrada 
 * para que o usuário insira a nova mensagem de suspensão.
 * 
 * Aqui está o código modificado:
*/

// ... (imports existentes)

import { Modal } from 'antd'; // Adicione este import para o modal

// ... (código existente)

function FormParamSuspensao({ location }) {
  // ... (código existente)

  // Estado para controlar a visibilidade do modal
  const [modalVisible, setModalVisible] = useState(false);

  // Estado para controlar a nova mensagem de suspensão inserida pelo usuário
  const [novoTipoDeSuspensao, setNovoTipoDeSuspensao] = useState('');

  // Função para lidar com a alteração do novo tipo de suspensão inserido
  const handleNovoTipoDeSuspensaoChange = (e) => {
    setNovoTipoDeSuspensao(e.target.value);
  };

  // Função para lidar quando o usuário clicar no botão "Salvar" no modal
  const handleSalvaNovoTipoDeSuspensao = () => {
    // Salvar o novo tipo de suspensão em newSuspensionType no banco de dados ou realizar qualquer ação necessária
    // ...

    // Fechar o modal
    setModalVisible(false);
  };

  return (
    <>
      {/* ... (código JSX existente) */}
      <Card>
        <Form
          form={form}
          {...layout}
          name="control-ref"
          onFinish={gravaSuspensao}
        >
          {/* ... (código JSX existente) */}
          <Form.Item name="tipoSuspensao" label="Tipo de Suspensão" required>
            <Select
              placeholder="Selecione o tipo de suspensão"
              onChange={(value) => {
                if (value === 'new') {
                  setModalVisible(true);
                }
              }}
            >
              {tiposSuspensao.map((tipo) => (
                <Select.Option key={tipo.id} value={tipo.id}>
                  {tipo.mensagem}
                </Select.Option>
              ))}
              {/* Adicione a opção "Incluir novo tipo de suspensão" */}
              <Select.Option key="new" value="new">
                Incluir novo tipo de suspensão
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="validade" label="Validade" required>
            <Input placeholder="Data de validade" />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              style={{ marginRight: 10, borderRadius: 3 }}
              type="primary"
              htmlType="submit"
            >
              Salvar
            </Button>
            <Button
              style={{ borderRadius: 3 }}
              type="danger"
              onClick={() => history.goBack()}
            >
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* Modal para lidar com a entrada do novo tipo de suspensão */}
      <Modal
        visible={modalVisible}
        title="Incluir novo tipo de suspensão"
        onCancel={() => setModalVisible(false)}
        onOk={handleSalvaNovoTipoDeSuspensao}
      >
        <Input
          value={novoTipoDeSuspensao}
          onChange={handleNovoTipoDeSuspensaoChange}
          placeholder="Digite o novo tipo de suspensão"
        />
      </Modal>
    </>
  );
}

export default FormParamSuspensao;
