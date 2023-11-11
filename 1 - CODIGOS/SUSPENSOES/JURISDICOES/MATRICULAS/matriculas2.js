/**
 * Lembre-se de adaptar as partes relevantes do seu código de acordo com essas instruções. Essas etapas devem 
 * ajudar você a lidar com a entrada no formato "F0000000" e a consulta por nome no mesmo campo.
 * 
 * Parece que você precisa adaptar o componente `InputPrefixoAlcada` para lidar com os diferentes formatos, 
 * incluindo o formato "F0000000" para a opção "matriculas" e também para permitir a digitação de um nome 
 * que possa ser consultado em "getMatriculas". Aqui estão as etapas que você pode seguir:
 * 
 * 1. **Adaptar o Componente `InputPrefixoAlcada`**: Modifique o componente `InputPrefixoAlcada` para aceitar 
 * diferentes formatos de entrada, incluindo "0000" e "F0000000". Você pode adicionar uma propriedade chamada 
 * `format` para controlar o formato aceito. No componente, verifique o valor da propriedade `format` e ajuste 
 * a validação e o tratamento da entrada de acordo.
 */

// Modifique o componente InputPrefixoAlcada para aceitar diferentes formatos
// ...

<>/**
 * Parece que você precisa adaptar o componente `InputPrefixoAlcada` para lidar com os diferentes formatos,
 * incluindo o formato "F0000000" para a opção "matriculas" e também para permitir a digitação de um nome
 * que possa ser consultado em "getMatriculas". Aqui estão as etapas que você pode seguir:
 *
 * 1. **Adaptar o Componente `InputPrefixoAlcada`**: Modifique o componente `InputPrefixoAlcada` para aceitar
 * diferentes formatos de entrada, incluindo "0000" e "F0000000". Você pode adicionar uma propriedade chamada
 * `format` para controlar o formato aceito. No componente, verifique o valor da propriedade `format` e ajuste
 * a validação e o tratamento da entrada de acordo.
 */
    // Modifique o componente InputPrefixoAlcada para aceitar diferentes formatos
    // ...
    <Input
        placeholder="Tipo"
        value={format === 'matriculas' ? value.toUpperCase() : value}
        onChange={handleChange} />
    // 2. **Atualizar a Renderização do Componente**:
    /**
     * No seu componente `FormParamSuspensao`, ao renderizar o componente `InputPrefixoAlcada`, você pode passar
     * a propriedade `format` com o valor apropriado com base na opção selecionada.
    */
    <Form.Item
        name="tipo"
        label="Tipo"
        rules={[
            // ...
        ]}
    >
        <InputPrefixoAlcada
            placeholder="Tipo"
            value={tipoInputValue}
            ref={tipoInputRef}
            format={tipoSelecionado} // Passa a opção selecionada como o formato
        />
    </Form.Item></>

// 3. **Lidar com Consulta por Nome**:
   
/**
 * Se a consulta por nome também é suportada, você precisará criar uma lógica para determinar quando a entrada 
 * representa um nome e quando representa um valor no formato "F0000000". Você pode adicionar uma condição para 
 * verificar se o valor digitado corresponde ao formato de matrícula (começa com "F" seguido por 7 dígitos numéricos) 
 * e, caso contrário, realizar a consulta por nome em `getMatriculas`.
 */

const handleMatriculaChange = (/** @type {{ target: { value: string; }; }} */ e) => {
  const valor = e.target.value;

  if (/^F\d{7}$/i.test(valor)) {
    // É uma matrícula no formato "F0000000"
    // Trate a lógica para a matrícula aqui
  } else {
    // Não é uma matrícula, pode ser um nome
    // Execute a consulta por nome em getMatriculas
  }
};
