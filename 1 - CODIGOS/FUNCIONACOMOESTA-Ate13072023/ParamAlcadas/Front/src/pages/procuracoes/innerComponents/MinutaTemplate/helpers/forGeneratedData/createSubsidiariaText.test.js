import cloneDeep from 'lodash.clonedeep';
import {
  outorgadoAgregadoMultiploLevels,
  outorgadoComProcuracaoCompleta,
  outorgadoComProcuracaoNaoAgregada
} from 'pages/procuracoes/innerComponents/AcordeaoProcuracoes/__mocks__/mockData';
import { createSubsidiariaText } from './createSubsidiariaText';

describe('createSubsidiariaText()', () => {
  const [
    bb, // texto especial aligneas
    bbCartoes, // normal
    bbConsorcios, // normal
  ] = [1, 2, 3];

  describe('outorgante não agregado', () => {
    describe('with only one subsidiaria', () => {
      describe('subsidiaria without special text', () => {
        const outorgante = getOutorgantesMock(outorgadoComProcuracaoNaoAgregada, [bbConsorcios]);
        it('creates the text', () => {
          expect(createSubsidiariaText(outorgante)).toEqual('BB CONSÓRCIOS S.A., nos termos da procuração lavrada cartorio teste3.1.2, à(s) folha(s) nº folha teste3.1.2, do(s) livro(s) nº livro teste3.1.2, em 24/04/2022');
        });
      });

      describe('subsidiaria bb', () => {
        const outorgante = getOutorgantesMock(outorgadoComProcuracaoNaoAgregada, [bb]);
        it('creates the text', () => {
          expect(createSubsidiariaText(outorgante)).toEqual('BANCO DO BRASIL S.A., com exceção daqueles descritos na alínea "14.a" e observadas as alíneas "9", "13", "14.b", "14.c" e "14.d", nos termos da procuração lavrada cartorio teste3.1.3, à(s) folha(s) nº folha teste3.1.3, do(s) livro(s) nº livro teste3.1.3, em 24/05/2022');
        });
      });

      describe('subsidiaria bb cartoes', () => {
        const outorgante = getOutorgantesMock(outorgadoComProcuracaoNaoAgregada, [bbCartoes]);
        it('creates the text', () => {
          expect(createSubsidiariaText(outorgante)).toEqual('BB ADMINISTRADORA DE CARTOES DE CREDITO S.A., nos termos da procuração lavrada cartorio teste3.1.1, à(s) folha(s) nº folha teste3.1.1, do(s) livro(s) nº livro teste3.1.1, em 01/12/2021');
        });
      });
    });

    describe('with all subsidiarias', () => {
      const outorgante = getOutorgantesMock(outorgadoComProcuracaoNaoAgregada);
      it('creates the text', () => {
        expect(createSubsidiariaText(outorgante)).toEqual('BANCO DO BRASIL S.A., com exceção daqueles descritos na alínea "14.a" e observadas as alíneas "9", "13", "14.b", "14.c" e "14.d", nos termos da procuração lavrada cartorio teste3.1.3, à(s) folha(s) nº folha teste3.1.3, do(s) livro(s) nº livro teste3.1.3, em 24/05/2022, e pela Subsidiária BB ADMINISTRADORA DE CARTOES DE CREDITO S.A., nos termos da procuração lavrada cartorio teste3.1.1, à(s) folha(s) nº folha teste3.1.1, do(s) livro(s) nº livro teste3.1.1, em 01/12/2021, e pela Subsidiária BB CONSÓRCIOS S.A., nos termos da procuração lavrada cartorio teste3.1.2, à(s) folha(s) nº folha teste3.1.2, do(s) livro(s) nº livro teste3.1.2, em 24/04/2022');
      });
    });
  });

  describe('outorgante agregado with multiple levels', () => {
    describe('with only one subsidiaria', () => {
      describe('subsidiaria without special text', () => {
        const outorgante = getOutorgantesMock(outorgadoComProcuracaoCompleta, [bbConsorcios]);
        it('creates the text with info from previous procurações', () => {
          expect(createSubsidiariaText(outorgante)).toEqual('BB CONSÓRCIOS S.A., da procuração lavrada no cartorio teste4, à(s) folha(s) nº folha teste4, do(s) livro(s) nº livro teste4, em 23/05/2022');
        });
      });

      describe('subsidiaria bb', () => {
        const outorgante = getOutorgantesMock(outorgadoComProcuracaoCompleta, [bb]);
        it('creates the text with info from previous procurações', () => {
          expect(createSubsidiariaText(outorgante)).toEqual('BANCO DO BRASIL S.A., com exceção daqueles descritos na alínea "14.a" e observadas as alíneas "9", "13", "14.b", "14.c" e "14.d", da procuração lavrada no cartorio teste4, à(s) folha(s) nº folha teste4, do(s) livro(s) nº livro teste4, em 23/05/2022');
        });
      });

      describe('subsidiaria bb cartoes', () => {
        const outorgante = getOutorgantesMock(outorgadoComProcuracaoCompleta, [bbCartoes]);
        it('creates the text with info from previous procurações', () => {
          expect(createSubsidiariaText(outorgante)).toEqual('BB ADMINISTRADORA DE CARTOES DE CREDITO S.A., da procuração lavrada no cartorio teste4, à(s) folha(s) nº folha teste4, do(s) livro(s) nº livro teste4, em 23/05/2022');
        });
      });
    });

    describe('with all subsidiarias', () => {
      const outorgante = getOutorgantesMock(outorgadoComProcuracaoCompleta);
      it('creates the text with info from previous procurações', () => {
        expect(createSubsidiariaText(outorgante)).toEqual('BANCO DO BRASIL S.A., com exceção daqueles descritos na alínea "14.a" e observadas as alíneas "9", "13", "14.b", "14.c" e "14.d", BB ADMINISTRADORA DE CARTOES DE CREDITO S.A., BB CONSÓRCIOS S.A., da procuração lavrada no cartorio teste4, à(s) folha(s) nº folha teste4, do(s) livro(s) nº livro teste4, em 23/05/2022');
      });
    });
  });

  describe('outorgante agregado', () => {
    describe('with only one subsidiaria', () => {
      describe('subsidiaria without special text', () => {
        const outorgante = getOutorgantesMock(outorgadoAgregadoMultiploLevels, [bbConsorcios]);
        it('creates the text with info from previous procurações', () => {
          expect(createSubsidiariaText(outorgante)).toEqual('BB CONSÓRCIOS S.A., da procuração lavrada no cartorio teste5.1, à(s) folha(s) nº folha teste5.1, do(s) livro(s) nº livro teste5.1, em 23/05/2022');
        });
      });

      describe('subsidiaria bb', () => {
        const outorgante = getOutorgantesMock(outorgadoAgregadoMultiploLevels, [bb]);
        it('creates the text with info from previous procurações', () => {
          expect(createSubsidiariaText(outorgante)).toEqual('BANCO DO BRASIL S.A., com exceção daqueles descritos na alínea "14.a" e observadas as alíneas "9", "13", "14.b", "14.c" e "14.d", da procuração lavrada no cartorio teste5.1, à(s) folha(s) nº folha teste5.1, do(s) livro(s) nº livro teste5.1, em 23/05/2022');
        });
      });

      describe('subsidiaria bb cartoes', () => {
        const outorgante = getOutorgantesMock(outorgadoAgregadoMultiploLevels, [bbCartoes]);
        it('creates the text with info from previous procurações', () => {
          expect(createSubsidiariaText(outorgante)).toEqual('BB ADMINISTRADORA DE CARTOES DE CREDITO S.A., da procuração lavrada no cartorio teste5.1, à(s) folha(s) nº folha teste5.1, do(s) livro(s) nº livro teste5.1, em 23/05/2022');
        });
      });
    });

    describe('with all subsidiarias', () => {
      const outorgante = getOutorgantesMock(outorgadoAgregadoMultiploLevels);
      it('creates the text with info from previous procurações', () => {
        expect(createSubsidiariaText(outorgante)).toEqual('BANCO DO BRASIL S.A., com exceção daqueles descritos na alínea "14.a" e observadas as alíneas "9", "13", "14.b", "14.c" e "14.d", BB ADMINISTRADORA DE CARTOES DE CREDITO S.A., BB CONSÓRCIOS S.A., da procuração lavrada no cartorio teste5.1, à(s) folha(s) nº folha teste5.1, do(s) livro(s) nº livro teste5.1, em 23/05/2022');
      });
    });
  });

  function getOutorgantesMock(outorgado, subsidiariasSelected = [1, 2, 3]) {
    return cloneDeep({
      outorgantes: [outorgado],
      outorganteSelecionado: {
        idProcuracao: outorgado.idProcuracao,
        idProxy: outorgado.idProxy,
        nome: outorgado.nome,
        matricula: outorgado.matricula,
        subsidiariasSelected
      },
    });
  }
});
