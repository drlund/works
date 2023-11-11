/**
 * Se o formulário não está carregando os dados corretamente, você deve verificar as etapas relacionadas ao 
 * preenchimento dos campos com os valores existentes. Aqui estão algumas dicas para resolver esse problema:
 * 
 * 1. **Verifique os Dados Iniciais**: Certifique-se de que os dados vindos de `location.state` estejam sendo 
 * passados corretamente para o componente e que esses valores estejam corretos. Verifique se `validade` e 
 * `tipoSuspensao` estão sendo passados corretamente e possuem os valores esperados.
 * 
 * 2. **Preencha os Campos do Formulário**: No início do seu componente `FormParamSuspensaoPatch`, você pode 
 * usar o hook `useState` para definir o estado inicial dos campos do formulário. Por exemplo:
 */

   const [formData, setFormData] = useState({
     validade: validade,
     tipoSuspensao: tipoSuspensao,
   });

/**
 * 3. **Use o `initialValues` do Formulário**: Ao definir o componente `<Form>` do Ant Design, você pode usar a 
 * prop `initialValues` para preencher os campos com os valores iniciais. Exemplo:
 */


    /**
     * 3. **Use o `initialValues` do Formulário**: Ao definir o componente `<Form>` do Ant Design, você pode usar a
     * prop `initialValues` para preencher os campos com os valores iniciais. Exemplo:
     */

    <>
    /**
     * 3. **Use o `initialValues` do Formulário**: Ao definir o componente `<Form>` do Ant Design, você pode usar a
     * prop `initialValues` para preencher os campos com os valores iniciais. Exemplo:
     */
    <Form
        form={form}
        {...layout}
        name="control-ref"
        onFinish={editaSuspensao}
        initialValues={formData} // Adicione esta linha
    >
    </Form>
    /**
     * 4. **Verifique os Nomes dos Campos**: Ao definir o `name` em `<Form.Item>`, verifique se os nomes dos campos
     * coincidem com os nomes dos campos no estado do componente. Por exemplo:
     */
    <>
        <Form.Item
            name="validade"
            label="Validade"
            required
        ></Form.Item>
    </>
    //   Certifique-se de que `name="validade"` corresponda ao campo `validade` no estado do `formData`.
    /** 5. **Verifique os Valores dos Componentes de Input**: Em seus componentes de input personalizados, como
     * `InputPrefixoAlcada` e `InputFunciSuspensao`, verifique se você está usando o valor correto para preenchê-los.
     * Por exemplo:
     */
    <InputPrefixoAlcada
        disabled
        value={formData.tipoSuspensao} // Use o valor correto aqui
        tipoSelecionado={tipoSelecionado}
        ref={tipoInputRef} /></>

/**
 * Certifique-se de verificar todos esses pontos para garantir que os dados sejam preenchidos corretamente no 
 * formulário. Se o problema persistir, pode ser útil colocar alguns `console.log` em várias partes do código 
 * para depurar e rastrear onde exatamente os valores não estão sendo passados corretamente.
 */