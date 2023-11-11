/**
 * Para verificar a lógica de validação do formulário e garantir que todos os campos necessários, incluindo 
 * `matriculaResponsavel`, estejam preenchidos corretamente antes de enviar os dados para o backend, você pode 
 * seguir os passos abaixo:
 * 
 * 1. **Validação no Componente:**
 * 
 * Dentro do componente `FormParamSuspensao`, a validação do formulário é definida na propriedade `rules` ao 
 * criar os campos do formulário. Você pode adicionar regras de validação para garantir que os campos obrigatórios 
 * sejam preenchidos corretamente. No caso do campo `matriculaResponsavel`, você pode adicionar uma regra de 
 * validação para garantir que ele seja preenchido.
 */

<Form.Item
  name="matriculaResponsavel"
  label="Matrícula do Responsável"
  rules={[
    {
      required: true,
      message: 'Por favor, preencha a matrícula do responsável!',
    },
  ]}
>
  <Input />
</Form.Item>

//2. **Chamada de API Condicionada:**

/**
 * Antes de chamar a API `gravarSuspensao`, você pode realizar uma verificação final para garantir que o formulário 
 * esteja validado antes de fazer a chamada para o backend. Você já está usando `form.validateFields()` para validar 
 * os campos. No entanto, você pode adicionar uma verificação específica para a matrícula do responsável antes de 
 * prosseguir com a chamada da API.
 */

if (permissao.includes('PARAM_SUSPENSOES_USUARIO')) {
  form.validateFields().then(() => {
    // Verificar a matrícula do responsável
    if (!form.getFieldValue('matriculaResponsavel')) {
      message.error('Preencha a matrícula do responsável antes de salvar.');
      return;
    }

    gravarSuspensao({ ...dadosSuspensao })
      .then((dadosSuspensoesForm) => {
        setDadosSuspensoesForm(dadosSuspensoesForm);
        history.goBack();
      })
      .catch(() => message.error('Falha ao gravar suspensão! Verifique!'));
  });
}

