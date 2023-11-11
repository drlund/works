import { screen } from '@testing-library/react';

import { startRender } from 'pages/procuracoes/tests/utils';
import { FETCH_METHODS } from 'services/apis/GenericFetch';

import { MassificadoContinue } from '.';

globalThis.URL.createObjectURL = jest.fn(() => 'mock-url');

jest.mock('@react-pdf/renderer', () => ({
  Document: () => <div>Document</div>,
  Image: () => <div>Image</div>,
  Page: () => <div>Page</div>,
  PDFViewer: () => <div>PDF Viewer</div>,
  PDFDownloadLink: () => <div>PDFDownloadLink</div>,
  StyleSheet: { create: () => { } },
  Text: () => <div>Text</div>,
  View: () => <div>View</div>
}));

describe('continue from idMassificado/<MassificadoMinuta>', () => {
  const mockFluxo = {
    fluxo: "PUBLICA",
    idFluxo: "9bca0a03-9b9e-454c-a6a1-b963942fc25c",
    minuta: "2º Nível Gerencial UT (Gerente de Negócios ou Administração) | Pública"
  };

  const mockPoderes = {
    outorganteSelecionado: {
      idProcuracao: 2,
      idProxy: null,
      matricula: "F1111112",
      nome: "Teste2",
      subsidiariasSelected: [1, 2, 3]
    },
    outorgantes: [{
      ativo: 1,
      cargoNome: "cargoNome teste2",
      cpf: "cpf teste2",
      dataNasc: "dataNasc teste2",
      estadoCivil: "estadoCivil teste2",
      idProcuracao: 2,
      idProxy: null,
      matricula: "F1111112",
      municipio: "municipio teste2",
      nome: "Teste2",
      prefixo: "prefixo teste2",
      procuracao: [{
        outorgado: {
          cargo: "cargo teste2.1",
          cpf: "cpf teste2.1",
          endereco: "endereço teste2.1",
          estadoCivil: "estadoCivil teste2.1",
          matricula: "F1111121",
          municipio: "municipio teste2.1",
          nome: "nome teste2.1",
          prefixo: "prefixo teste2.1",
          rg: "rg teste2.1",
          uf: "uf teste2.1"
        },
        procuracaoAgregada: {
          cartorio: "cartorio teste2",
          cartorioId: 2,
          doc: "teste2",
          emissao: "2022-05-23",
          folha: "folha teste2",
          livro: "livro teste2",
          manifesto: "2022-05-23",
          procuracaoAtiva: 1,
          procuracaoId: 40,
          vencimento: "2021-12-01"
        },
        subsidiarias: [{
          cnpj: "04740876000125",
          id: 1,
          nome: "BB",
          nome_completo: "BANCO DO BRASIL S.A.",
          subAtivo: 1
        }, {
          cnpj: "31591399000156",
          id: 2,
          nome: "BB CARTOES",
          nome_completo: "BB ADMINISTRADORA DE CARTOES DE CREDITO S.A.",
          subAtivo: 1
        }, {
          cnpj: "24933830000130",
          id: 3,
          nome: "BB CONSÓRCIOS",
          nome_completo: "BB CONSÓRCIOS S.A.",
          subAtivo: 1
        }]
      }],
      rg: "rg teste2",
      uf: "uf teste2"
    }]
  };

  const mockOutorgadoMassificado = {
    fetchingMatriculas: {},
    listaDeMatriculas: [
      "F0000000",
      "F1111111",
      "F1234567"
    ],
    outorgados: {
      F0000000: {
        dependencia: {
          prefixo: 'mock dep prefixo ok',
          nome: 'mock dep nome ok',
          super: 'mock dep super ok',
          municipio: 'mock dep municipio ok',
          uf: 'mock dep uf ok',
        },
        error: null,
        matricula: "F0000000",
        nome: "mock funci ok",
        prefixoLotacao: "mock prefixo ok"
      },
      F1111111: {
        dependencia: {
          prefixo: 'mock dep prefixo ok2',
          nome: 'mock dep nome ok2',
          super: 'mock dep super ok2',
          municipio: 'mock dep municipio ok2',
          uf: 'mock dep uf ok2'
        },
        error: null,
        matricula: "F1111111",
        nome: "mock funci ok2",
        prefixoLotacao: "mock prefixo ok2"
      },
      F1234567: {
        dependencia: {
          prefixo: 'mock dep prefixo error',
          nome: 'mock dep nome error',
          super: 'mock dep super error',
          municipio: 'mock dep municipio error',
          uf: 'mock dep uf error'
        },
        error: "mock error with funci",
        matricula: "F1234567",
        nome: "mock funci error",
        prefixoLotacao: "mock prefixo error"
      },
      F9999999: {
        error: "mock error no funci",
        matricula: "F9999999"
      }
    },
    uuidMatriculas: {
      F0000000: "randomUUID",
      F1111111: "randomUUID",
      F1234567: "randomUUID",
      F9999999: "randomUUID",
    },
  };

  const mockDadosMinuta = {
    ativo: 1,
    createdAt: "mock createdAt",
    customData: {
      cartorio: {
        monthToday: Intl.DateTimeFormat('pt-br', { month: 'long' }).format(new Date()),
        dayToday: new Date().getDate(),
        yearToday: new Date().getFullYear(),
      }
    },
    idFluxo: "mock id fluxo",
    idMinuta: "randomUUID",
    idTemplate: "mock id template",
    massificado: {
      F0000000: {
        diffs: "Index: diff",
        idMinuta: "randomUUID",
        isValid: true,
        template: "mock template"
      },
      F1111111: {
        diffs: "Index: diff",
        idMinuta: "randomUUID",
        isValid: true,
        template: "mock template"
      },
      hasError: [],
      numberOfValid: 2
    },
    templateBase: "mock template"
  };

  // valores vindos do teste de MassificadoMinuta
  const mockMassificado = {
    dadosMinuta: mockDadosMinuta,
    outorgadoMassificado: mockOutorgadoMassificado,
    poderes: mockPoderes,
    tipoFluxo: mockFluxo,
  };

  const mockId = '12345';

  beforeEach(async () => {
    await startRender(MassificadoContinue, {
      timesFetchIsCalled: 1,
      initialEntries: [`/${mockId}`],
      routePath: '/:idMassificado',
      beforeRender: () => {
        globalThis.permissionHookMock.mockReturnValue(true);
        globalThis.fetchSpy.mockResolvedValue(mockMassificado);
      }
    });

  });

  it('calls the api', async () => {
    expect(globalThis.fetchSpy)
      .toHaveBeenLastCalledWith(FETCH_METHODS.GET, `/procuracoes/massificado/minuta/regenerate/${mockId}`);
  });

  it('renders the page', async () => {
    // difícil conseguir renderizar a página completamente
    // e apenas os mocks não são suficientes
    // pelo menos, é possível verificar se chega ou não até aqui

    screen.getByRole('heading', {
      name: /baixar minuta/i
    });

    screen.getByRole('link', {
      name: /download download da lista para cartório/i
    });

    screen.getByText(/pdf viewer/i);

    screen.getByText(/pdfdownloadlink/i);
  });
});
