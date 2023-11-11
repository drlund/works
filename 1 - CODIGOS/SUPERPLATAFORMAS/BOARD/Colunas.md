Você pode recriar a estrutura de colunas usando a propriedade `dataIndex` no seguinte formato:

```javascript
const columns = [
  {
    title: 'Nome da Plataforma',
    dataIndex: 'nome',
    key: 'nome',
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: 'Matrícula do Responsável',
    dataIndex: 'responsavelMatricula',
    key: 'responsavelMatricula',
  },
  {
    title: 'Nome do Responsável',
    dataIndex: 'responsavelNome',
    key: 'responsavelNome',
  },
  {
    title: 'Nome da Plataforma',
    dataIndex: 'plataformas[0].nome',
    key: 'plataformaNome',
  },
  {
    title: 'ID da Plataforma',
    dataIndex: 'plataformas[0].id',
    key: 'plataformaId',
  },
  {
    title: 'UOR',
    dataIndex: 'plataformas[0].uor',
    key: 'plataformaUOR',
  },
  {
    title: 'Matrícula do Responsável da Plataforma',
    dataIndex: 'plataformas[0].matriculaResponsavel',
    key: 'plataformaMatriculaResponsavel',
  },
  {
    title: 'Nome do Responsável da Plataforma',
    dataIndex: 'plataformas[0].nomeResponsavel',
    key: 'plataformaNomeResponsavel',
  },
];
```

Essa estrutura `columns` usa `dataIndex` para mapear as propriedades dos seus dados. Certifique-se de que os dados que você passa para a tabela têm a mesma estrutura para que a exibição funcione corretamente.