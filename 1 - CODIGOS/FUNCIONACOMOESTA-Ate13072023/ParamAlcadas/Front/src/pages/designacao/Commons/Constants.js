export default function Constants() {
  return {
    TIPOS: {
      DESIGNACAO: 1,
      ADICAO: 2
    },
    SITUACOES: {
      DE_ACORDO_PENDENTE: 1,
      ANALISE_DIPES: 3,
      ANALISE_DIVAR: 4,
      CONCLUIDO: 5,
      CANCELADO: 6,
      ANALISE_OUTRA: 7,
      ANALISE_GEPES: 8,
      ANALISE_UAV: 9,
      ANALISE_SUPERADM: 2,
      ANALISE_URV: 10
    },
    STATUS: {
      SOLICITADO: 1,
      AUTORIZADO: 2,
      NAO_AUTORIZADO: 3,
      EXECUTADO: 4
    },
    ABA_ACORDO: '1',
    ABA_PENDENCIAS_OUTROS: '2',
    ABA_PENDENCIAS_PREFIXO: '3',
    ABA_MINHAS_PENDENCIAS: '4',
    ABA_REGISTRO: '5',
    ABA_CONSULTAS: '6',
    TABS: [
      {
        key: '1',
        short: 'deAcordo',
        nome: 'Pendências De Acordo',
        acesso: ['SUPERADM', 'DIVAR', 'DIRAV', 'DIPES', 'GEPES', 'AGENCIAS', 'OUTROS', 'REGISTRO'],
        quadro: 'De Acordo'
      },
      {
        key: '2',
        short: 'analiseOutros',
        nome: 'Pendências de Análise - Outros',
        acesso: ['SUPERADM', 'DIVAR', 'DIRAV', 'DIPES', 'GEPES', 'AGENCIAS', 'OUTROS', 'REGISTRO'],
        quadro: 'de Análise'
      },
      {
        key: '3',
        short: 'analisePrefixo',
        nome: 'Pendências de Análise - Meu Prefixo',
        acesso: ['SUPERADM', 'DIVAR', 'DIRAV', 'DIPES', 'GEPES', 'AGENCIAS', 'OUTROS', 'REGISTRO'],
        quadro: 'de Análise - Meu Prefixo'
      },
      {
        key: '4',
        short: 'minhasPendencias',
        nome: 'Minhas Pendências',
        acesso: ['SUPERADM', 'DIVAR', 'DIRAV', 'DIPES', 'GEPES', 'AGENCIAS', 'OUTROS', 'REGISTRO'],
        quadro: 'de minha Responsabilidade'
      },
      {
        key: '5',
        short: 'registro',
        nome: 'Registro de Movimentação',
        acesso: ['REGISTRO'],
        quadro: 'de Registro de Movimentação'
      },
      {
        key: '6',
        short: 'consultas',
        nome: 'Consultas',
        acesso: ['SUPERADM', 'DIVAR', 'DIRAV', 'DIPES', 'GEPES', 'AGENCIAS', 'OUTROS', 'REGISTRO'],
        quadro: ':: Consultas Diversas'
      }
    ],
    CODIGOS_PRIORIZADOS: [
      200, 222, 201, 224, 225, 226, 227, 228, 232, 233, 235, 236, 237, 238, 239, 302, 303, 304,
      321, 330, 331, 332, 333, 334, 335, 336, 337, 339, 340, 360, 361, 362, 363, 461, 462, 481,
      482, 483, 600, 601, 603, 604, 605, 610, 615, 620, 800, 850],
    NEGATIVAS: {
      limitrofes: {
        label: 'Municípios Não-Limítrofes',
        arquivos: 'limitrofesFiles',
      },
      certs: {
        label: 'Funcionário sem a Certificação exigida',
        arquivos: 'certsFiles',
      },
      posse: {
        label: 'Funcionário pendente de Posse',
        arquivos: 'posseFiles',
      },
      incorporado: {
        label: 'Funcionário Incorporado',
        arquivos: 'incorporadoFiles',
      },
      nomeacao: {
        label: 'Funcionário pendente de Nomeação',
        arquivos: 'nomeacaoFiles',
      },
      odi: {
        label: 'Funcionário impedido no sistema ODI',
        arquivos: 'odiFiles',
      },
      inamovivel: {
        label: 'Funcionário Inamovível',
        arquivos: 'inamovivelFiles',
      },
      vcp: {
        label: 'Funcionário em VCP',
        arquivos: 'vcpFiles',
      },
      habitualidade: {
        label: 'Funcionário impedido por Habitualidade',
        arquivos: 'habitualidadeFiles',
      },
      trilhaEtica: {
        label: 'Funcionário não completou a Trilha Ética',
        arquivos: 'trilhaEticaFiles',
      },
      opcional: {
        label: 'Informações Adicionais (Opcional)',
        arquivos: 'opcionalFiles',
      },
    },
    TEXTO_HIERARQUIA: 'IN 381-1 item 11.2.3. Não é permitida a movimentação transitória se resultar em subordinação '
      + 'hierárquica direta entre funcionários, quando existir entre eles relação de '
      + 'parentesco até o 3° grau, consanguíneos ou afins, em linha direta ou colateral.',
  };
}
