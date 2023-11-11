/** @type {Procuracoes.Outorgante} */
// @ts-ignore
export const outorgadoSemProcuracao = {
  ativo: 1,
  idProcuracao: 1,
  idProxy: null,
  nome: 'Teste1',
  matricula: 'F1111111',
  cargoNome: 'cargoNome teste1',
  prefixo: 'prefixo teste1',
  cpf: 'cpf teste1',
  dataNasc: 'dataNasc teste1',
  estadoCivil: 'estadoCivil teste1',
  rg: 'rg teste1',
  municipio: 'municipio teste1',
  uf: 'uf teste1',
};

/** @type {Procuracoes.Outorgante} */
// @ts-ignore
export const outorgadoComProcuracaoAgregada = {
  ativo: 1,
  idProcuracao: 2,
  idProxy: null,
  nome: 'Teste2',
  matricula: 'F1111112',
  cargoNome: 'cargoNome teste2',
  prefixo: 'prefixo teste2',
  cpf: 'cpf teste2',
  dataNasc: 'dataNasc teste2',
  estadoCivil: 'estadoCivil teste2',
  rg: 'rg teste2',
  municipio: 'municipio teste2',
  uf: 'uf teste2',
  procuracao: [
    {
      procuracaoAgregada: {
        procuracaoId: 40,
        procuracaoAtiva: 1,
        emissao: '2022-05-23',
        manifesto: '2022-05-23',
        vencimento: '2021-12-01',
        folha: 'folha teste2',
        livro: 'livro teste2',
        doc: 'teste2',
        cartorio: 'cartorio teste2',
        cartorioId: 2,
      },
      outorgado: {
        matricula: 'F1111121',
        nome: 'nome teste2.1',
        cargo: 'cargo teste2.1',
        prefixo: 'prefixo teste2.1',
        cpf: 'cpf teste2.1',
        rg: 'rg teste2.1',
        estadoCivil: 'estadoCivil teste2.1',
        municipio: 'municipio teste2.1',
        uf: 'uf teste2.1',
        endereco: 'endereço teste2.1',
      },
      subsidiarias: [
        {
          id: 1,
          subAtivo: 1,
          nome: 'BB',
          nome_completo: 'BANCO DO BRASIL S.A.',
          cnpj: '04740876000125'
        },
        {
          id: 2,
          subAtivo: 1,
          nome: 'BB CARTOES',
          nome_completo: 'BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.',
          cnpj: '31591399000156'
        },
        {
          id: 3,
          subAtivo: 1,
          nome: 'BB CONSÓRCIOS',
          nome_completo: 'BB CONSÓRCIOS S.A.',
          cnpj: '24933830000130'
        },
      ]
    },
  ]
};

/** @type {Procuracoes.Outorgante} */
// @ts-ignore
export const outorgadoComProcuracaoNaoAgregada = {
  ativo: 1,
  idProcuracao: null,
  idProxy: '1',
  nome: 'Teste3',
  matricula: 'F1111113',
  cargoNome: 'cargoNome teste3',
  prefixo: 'prefixo teste3',
  cpf: 'cpf teste3',
  dataNasc: 'dataNasc teste3',
  estadoCivil: 'estadoCivil teste3',
  rg: 'rg teste3',
  municipio: 'municipio teste3',
  uf: 'uf teste3',
  procuracao: [
    {
      procuracaoAgregada: null,
      outorgado: {
        matricula: 'F1111131',
        nome: 'nome teste3.1',
        cargo: 'cargo teste3.1',
        prefixo: 'prefixo teste3.1',
        cpf: 'cpf teste3.1',
        rg: 'rg teste3.1',
        estadoCivil: 'estadoCivil teste3.1',
        municipio: 'municipio teste3.1',
        uf: 'uf teste3.1',
        endereco: 'endereço teste3.1',
      },
      subsidiarias: [
        {
          id: 1,
          subAtivo: 1,
          nome: 'BB',
          nome_completo: 'BANCO DO BRASIL S.A.',
          cnpj: '04740876000125',
          procuracaoId: 43,
          procuracaoAtiva: 1,
          emissao: '2022-05-24',
          manifesto: '2022-05-24',
          vencimento: '2021-12-01',
          folha: 'folha teste3.1.3',
          livro: 'livro teste3.1.3',
          doc: 'teste3.1.3',
          cartorio: 'cartorio teste3.1.3',
          cartorioId: 313,
        },
        {
          id: 2,
          subAtivo: 1,
          nome: 'BB CARTOES',
          nome_completo: 'BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.',
          cnpj: '31591399000156',
          procuracaoId: 38,
          procuracaoAtiva: 1,
          emissao: '2021-12-01',
          manifesto: '2021-12-01',
          vencimento: '2021-12-01',
          folha: 'folha teste3.1.1',
          livro: 'livro teste3.1.1',
          doc: 'teste3.1.1',
          cartorio: 'cartorio teste3.1.1',
          cartorioId: 311,
        },
        {
          id: 3,
          subAtivo: 1,
          nome: 'BB CONSÓRCIOS',
          nome_completo: 'BB CONSÓRCIOS S.A.',
          cnpj: '24933830000130',
          procuracaoId: 42,
          procuracaoAtiva: 1,
          emissao: '2022-04-24',
          manifesto: '2022-04-24',
          vencimento: '2021-12-01',
          folha: 'folha teste3.1.2',
          livro: 'livro teste3.1.2',
          doc: 'teste3.1.2',
          cartorio: 'cartorio teste3.1.2',
          cartorioId: 312,
        },
      ]
    }
  ]
};

/** @type {Procuracoes.Outorgante} */
// @ts-ignore
export const outorgadoComProcuracaoCompleta = {
  ativo: 1,
  idProcuracao: 4,
  idProxy: null,
  nome: 'Teste4',
  matricula: 'F1111140',
  cargoNome: 'cargoNome teste4',
  prefixo: 'prefixo teste4',
  cpf: 'cpf teste4',
  dataNasc: 'dataNasc teste4',
  estadoCivil: 'estadoCivil teste4',
  rg: 'rg teste4',
  municipio: 'municipio teste4',
  uf: 'uf teste4',
  procuracao: [
    {
      procuracaoAgregada: {
        procuracaoId: 40,
        procuracaoAtiva: 1,
        emissao: '2022-05-23',
        manifesto: '2022-05-23',
        vencimento: '2021-12-01',
        folha: 'folha teste4',
        livro: 'livro teste4',
        doc: 'teste4',
        cartorio: 'cartorio teste4',
        cartorioId: 4,
      },
      outorgado: {
        matricula: 'F1111141',
        nome: 'nome teste4.1',
        cargo: 'cargo teste4.1',
        prefixo: 'prefixo teste4.1',
        cpf: 'cpf teste4.1',
        rg: 'rg teste4.1',
        estadoCivil: 'estadoCivil teste4.1',
        municipio: 'municipio teste4.1',
        uf: 'uf teste4.1',
        endereco: 'endereço teste4.1',
      },
      subsidiarias: [
        {
          id: 1,
          subAtivo: 1,
          nome: 'BB',
          nome_completo: 'BANCO DO BRASIL S.A.',
          cnpj: '04740876000125'
        },
        {
          id: 2,
          subAtivo: 1,
          nome: 'BB CARTOES',
          nome_completo: 'BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.',
          cnpj: '31591399000156'
        },
        {
          id: 3,
          subAtivo: 1,
          nome: 'BB CONSÓRCIOS',
          nome_completo: 'BB CONSÓRCIOS S.A.',
          cnpj: '24933830000130'
        },
      ]
    },
    {
      procuracaoAgregada: null,
      outorgado: {
        matricula: 'F1111142',
        nome: 'nome teste4.2',
        cargo: 'cargo teste4.2',
        prefixo: 'prefixo teste4.2',
        cpf: 'cpf teste4.2',
        rg: 'rg teste4.2',
        estadoCivil: 'estadoCivil teste4.2',
        municipio: 'municipio teste4.2',
        uf: 'uf teste4.2',
        endereco: 'endereço teste4.2',
      },
      subsidiarias: [
        {
          id: 1,
          subAtivo: 1,
          nome: 'BB',
          nome_completo: 'BANCO DO BRASIL S.A.',
          cnpj: '04740876000125',
          procuracaoId: 43,
          procuracaoAtiva: 1,
          emissao: '2022-05-24',
          manifesto: '2022-05-24',
          vencimento: '2021-12-01',
          folha: 'folha teste4.2.3',
          livro: 'livro teste4.2.3',
          doc: 'teste4.2.3',
          cartorio: 'cartorio teste4.2.3',
          cartorioId: 423,
        },
        {
          id: 2,
          subAtivo: 1,
          nome: 'BB CARTOES',
          nome_completo: 'BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.',
          cnpj: '31591399000156',
          procuracaoId: 38,
          procuracaoAtiva: 1,
          emissao: '2021-12-01',
          manifesto: '2021-12-01',
          vencimento: '2021-12-01',
          folha: 'folha teste4.2.1',
          livro: 'livro teste4.2.1',
          doc: 'teste4.2.1',
          cartorio: 'cartorio teste4.2.1',
          cartorioId: 1,
        },
        {
          id: 3,
          subAtivo: 1,
          nome: 'BB CONSÓRCIOS',
          nome_completo: 'BB CONSÓRCIOS S.A.',
          cnpj: '24933830000130',
          procuracaoId: 42,
          procuracaoAtiva: 1,
          emissao: '2022-04-24',
          manifesto: '2022-04-24',
          vencimento: '2021-12-01',
          folha: 'folha teste4.2.2',
          livro: 'livro teste4.2.2',
          doc: 'teste4.2.2',
          cartorio: 'cartorio teste4.2.2',
          cartorioId: 422,
        },
      ]
    }
  ]
};

/** @type {Procuracoes.Outorgante} */
// @ts-ignore
export const outorgadoAgregadoMultiploLevels = {
  ativo: 1,
  idProcuracao: 5,
  idProxy: null,
  nome: 'Teste5',
  matricula: 'F1111150',
  cargoNome: 'cargoNome teste5',
  prefixo: 'prefixo teste5',
  cpf: 'cpf teste5',
  dataNasc: 'dataNasc teste5',
  estadoCivil: 'estadoCivil teste5',
  rg: 'rg teste5',
  municipio: 'municipio teste5',
  uf: 'uf teste5',
  procuracao: [
    {
      procuracaoAgregada: {
        procuracaoId: 51,
        procuracaoAtiva: 1,
        emissao: '2022-05-23',
        manifesto: '2022-05-23',
        vencimento: '2021-12-01',
        folha: 'folha teste5.1',
        livro: 'livro teste5.1',
        doc: 'teste5.1',
        cartorio: 'cartorio teste5.1',
        cartorioId: 51,
      },
      outorgado: {
        matricula: 'F1111151',
        nome: 'nome teste5.1',
        cargo: 'cargo teste5.1',
        prefixo: 'prefixo teste5.1',
        cpf: 'cpf teste5.1',
        rg: 'rg teste5.1',
        estadoCivil: 'estadoCivil teste5.1',
        municipio: 'municipio teste5.1',
        uf: 'uf teste5.1',
        endereco: 'endereço teste5.1',
      },
      subsidiarias: [
        {
          id: 1,
          subAtivo: 1,
          nome: 'BB',
          nome_completo: 'BANCO DO BRASIL S.A.',
          cnpj: '05750876000125'
        },
        {
          id: 2,
          subAtivo: 1,
          nome: 'BB CARTOES',
          nome_completo: 'BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.',
          cnpj: '31591399000156'
        },
        {
          id: 3,
          subAtivo: 1,
          nome: 'BB CONSÓRCIOS',
          nome_completo: 'BB CONSÓRCIOS S.A.',
          cnpj: '25933830000130'
        },
      ]
    },
    {
      procuracaoAgregada: {
        procuracaoId: 52,
        procuracaoAtiva: 1,
        emissao: '2022-05-23',
        manifesto: '2022-05-23',
        vencimento: '2021-12-01',
        folha: 'folha teste5.2',
        livro: 'livro teste5.2',
        doc: 'teste5.2',
        cartorio: 'cartorio teste5.2',
        cartorioId: 52,
      },
      outorgado: {
        matricula: 'F1111152',
        nome: 'nome teste5.2',
        cargo: 'cargo teste5.2',
        prefixo: 'prefixo teste5.2',
        cpf: 'cpf teste5.2',
        rg: 'rg teste5.2',
        estadoCivil: 'estadoCivil teste5.2',
        municipio: 'municipio teste5.2',
        uf: 'uf teste5.2',
        endereco: 'endereço teste5.2',
      },
      subsidiarias: [
        {
          id: 1,
          subAtivo: 1,
          nome: 'BB',
          nome_completo: 'BANCO DO BRASIL S.A.',
          cnpj: '05750876000125'
        },
        {
          id: 2,
          subAtivo: 1,
          nome: 'BB CARTOES',
          nome_completo: 'BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.',
          cnpj: '31591399000156'
        },
        {
          id: 3,
          subAtivo: 1,
          nome: 'BB CONSÓRCIOS',
          nome_completo: 'BB CONSÓRCIOS S.A.',
          cnpj: '25933830000130'
        },
      ]
    },
    {
      procuracaoAgregada: {
        procuracaoId: 53,
        procuracaoAtiva: 1,
        emissao: '2022-05-23',
        manifesto: '2022-05-23',
        vencimento: '2021-12-01',
        folha: 'folha teste5.3',
        livro: 'livro teste5.3',
        doc: 'teste5.3',
        cartorio: 'cartorio teste5.3',
        cartorioId: 53,
      },
      outorgado: {
        matricula: 'F1111153',
        nome: 'nome teste5.3',
        cargo: 'cargo teste5.3',
        prefixo: 'prefixo teste5.3',
        cpf: 'cpf teste5.3',
        rg: 'rg teste5.3',
        estadoCivil: 'estadoCivil teste5.3',
        municipio: 'municipio teste5.3',
        uf: 'uf teste5.3',
        endereco: 'endereço teste5.3',
      },
      subsidiarias: [
        {
          id: 1,
          subAtivo: 1,
          nome: 'BB',
          nome_completo: 'BANCO DO BRASIL S.A.',
          cnpj: '05750876000125'
        },
        {
          id: 2,
          subAtivo: 1,
          nome: 'BB CARTOES',
          nome_completo: 'BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.',
          cnpj: '31591399000156'
        },
        {
          id: 3,
          subAtivo: 1,
          nome: 'BB CONSÓRCIOS',
          nome_completo: 'BB CONSÓRCIOS S.A.',
          cnpj: '25933830000130'
        },
      ]
    },
    {
      procuracaoAgregada: null,
      outorgado: {
        matricula: 'F1111154',
        nome: 'nome teste5.4',
        cargo: 'cargo teste5.4',
        prefixo: 'prefixo teste5.4',
        cpf: 'cpf teste5.4',
        rg: 'rg teste5.4',
        estadoCivil: 'estadoCivil teste5.4',
        municipio: 'municipio teste5.4',
        uf: 'uf teste5.4',
        endereco: 'endereço teste5.4',
      },
      subsidiarias: [
        {
          id: 1,
          subAtivo: 1,
          nome: 'BB',
          nome_completo: 'BANCO DO BRASIL S.A.',
          cnpj: '04740876000125',
          procuracaoId: 543,
          procuracaoAtiva: 1,
          emissao: '2022-05-24',
          manifesto: '2022-05-24',
          vencimento: '2021-12-01',
          folha: 'folha teste4.4.3',
          livro: 'livro teste4.4.3',
          doc: 'teste4.4.3',
          cartorio: 'cartorio teste4.4.3',
          cartorioId: 443,
        },
        {
          id: 2,
          subAtivo: 1,
          nome: 'BB CARTOES',
          nome_completo: 'BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.',
          cnpj: '31591399000156',
          procuracaoId: 541,
          procuracaoAtiva: 1,
          emissao: '2021-12-01',
          manifesto: '2021-12-01',
          vencimento: '2021-12-01',
          folha: 'folha teste4.4.1',
          livro: 'livro teste4.4.1',
          doc: 'teste4.4.1',
          cartorio: 'cartorio teste4.4.1',
          cartorioId: 441,
        },
        {
          id: 3,
          subAtivo: 1,
          nome: 'BB INVESTIMENTO',
          nome_completo: 'BB BANCO DE INVESTIMENTO S.A.',
          cnpj: '24933830000130',
          procuracaoId: 542,
          procuracaoAtiva: 1,
          emissao: '2022-04-24',
          manifesto: '2022-04-24',
          vencimento: '2021-12-01',
          folha: 'folha teste4.4.2',
          livro: 'livro teste4.4.2',
          doc: 'teste4.4.2',
          cartorio: 'cartorio teste4.4.2',
          cartorioId: 442,
        },
      ]
    }
  ]
};
