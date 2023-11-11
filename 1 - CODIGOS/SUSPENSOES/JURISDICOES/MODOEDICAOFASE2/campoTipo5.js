/**
 * Se o campo "tipo" contém as descrições a serem exibidas no `Radio.Group`, você precisará ajustar o código para 
 * garantir que as descrições corretas sejam exibidas.
 * 
 * Aqui está o código modificado para alcançar isso:
 */

<Form.Item label="Tipo">
  <Radio.Group
    disabled
    value={formData.tipo} // Usando o campo "tipo" para preencher o valor selecionado
    onChange={(e) => {
      handleTipoChange(e);
      setTipoSelecionadoValidator(e.target.value);
    }}
  >
    {/* Use o campo "valor" como valor e o campo "tipo" como descrição */}
    <Radio value={tipoSelecionadoMap['Vice Presidencia']}> Vice Presidência </Radio>
    <Radio value={tipoSelecionadoMap['Unid. Estratégica']}> Unid. Estratégica </Radio>
    <Radio value={tipoSelecionadoMap['Unid. Tática']}> Unid. Tática </Radio>
    <Radio value={tipoSelecionadoMap['Comercial']}> Comercial </Radio>
    <Radio value={tipoSelecionadoMap['Prefixo']}> Prefixo </Radio>
    <Radio value={tipoSelecionadoMap['Matrícula']}> Matrícula </Radio>
  </Radio.Group>
</Form.Item>

/**
 * No código acima, você deve definir `tipoSelecionadoMap` para mapear as descrições para os valores correspondentes, 
 * por exemplo:
 */

const tipoSelecionadoMap = {
  'Vice Presidencia': 'cd_vicepres_juris',
  'Unid. Estratégica': 'cd_diretor_juris',
  'Unid. Tática': 'cd_super_juris',
  'Comercial': 'cd_gerev_juris',
  'Prefixo': 'prefixo',
  'Matrícula': 'matriculas',
};

/**
 * Isso garantirá que, ao exibir as opções do `Radio.Group`, as descrições sejam exibidas corretamente e os valores 
 * correspondentes sejam usados para atualizar o estado do formulário.
 * 
 * Lembrando que você precisará ajustar a estrutura dos dados e o mapeamento conforme necessário, para que corresponda 
 * aos valores exatos que você recebe e usa em seu aplicativo.
 */