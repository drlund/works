import {
  outorgadoComProcuracaoAgregada,
  outorgadoComProcuracaoCompleta,
  outorgadoComProcuracaoNaoAgregada,
  outorgadoSemProcuracao
} from '../__mocks__/mockData';
import { extractAcordeaoItemData } from './extractAcordeaoItemData';

describe('extractAcordeaoItemData()', () => {
  describe('when outorgado sem procuracao', () => {
    it('returns ativo', () => {
      const { ativo } = extractAcordeaoItemData(outorgadoSemProcuracao);
      expect(ativo).toBe(outorgadoSemProcuracao.ativo);
    });

    it('returns header', () => {
      const { CollapsePanelHeader } = extractAcordeaoItemData(outorgadoSemProcuracao);
      expect(CollapsePanelHeader).toEqual(
        `${outorgadoSemProcuracao.matricula} - ${outorgadoSemProcuracao.nome} (${outorgadoSemProcuracao.cargoNome})`
      );
    });

    it('returns an empty dataSource', () => {
      const { tableDataSource } = extractAcordeaoItemData(outorgadoSemProcuracao);
      expect(tableDataSource).toEqual([]);
    });
  });

  describe('when outorgado com procuracao', () => {
    describe('when outorgado com procuracao agregada', () => {
      it('returns ativo', () => {
        const { ativo } = extractAcordeaoItemData(outorgadoComProcuracaoAgregada);
        expect(ativo).toBe(outorgadoComProcuracaoAgregada.ativo);
      });

      it('returns header', () => {
        const { CollapsePanelHeader } = extractAcordeaoItemData(outorgadoComProcuracaoAgregada);
        expect(CollapsePanelHeader).toEqual(
          `${outorgadoComProcuracaoAgregada.matricula} - ${outorgadoComProcuracaoAgregada.nome} (${outorgadoComProcuracaoAgregada.cargoNome})`
        );
      });

      it('returns the dataSource', () => {
        const { tableDataSource } = extractAcordeaoItemData(outorgadoComProcuracaoAgregada);
        const procuracao0 = outorgadoComProcuracaoAgregada.procuracao[0];

        expect(tableDataSource).toEqual([
          {
            ...procuracao0.procuracaoAgregada,
            outorgante: undefined,
            nome: procuracao0.outorgado.nome,
            matricula: procuracao0.outorgado.matricula,
            cargo: procuracao0.outorgado.cargo,
            manifesto: procuracao0.procuracaoAgregada.manifesto,
            procuracaoId: procuracao0.procuracaoAgregada.procuracaoId,
            subsidiarias: procuracao0.subsidiarias
              .reduce((acc, cur) => {
                acc.push(cur.nome);
                return acc;
              }, []),
            vencimento: procuracao0.procuracaoAgregada.vencimento,
            acoes: [
              { 'Baixar Procuracão': procuracao0.procuracaoAgregada.doc }
            ],
            raw: procuracao0,
          }
        ]);
      });
    });

    describe('when outorgado com procuracao não agregada', () => {
      it('returns ativo', () => {
        const { ativo } = extractAcordeaoItemData(outorgadoComProcuracaoNaoAgregada);
        expect(ativo).toBe(outorgadoComProcuracaoNaoAgregada.ativo);
      });

      it('returns header', () => {
        const { CollapsePanelHeader } = extractAcordeaoItemData(outorgadoComProcuracaoNaoAgregada);
        expect(CollapsePanelHeader).toEqual(
          `${outorgadoComProcuracaoNaoAgregada.matricula} - ${outorgadoComProcuracaoNaoAgregada.nome} (${outorgadoComProcuracaoNaoAgregada.cargoNome})`
        );
      });

      it('returns the dataSource', () => {
        const { tableDataSource } = extractAcordeaoItemData(outorgadoComProcuracaoNaoAgregada);
        const procuracao0 = outorgadoComProcuracaoNaoAgregada.procuracao[0];
        expect(tableDataSource).toEqual([
          {
            nome: procuracao0.outorgado.nome,
            matricula: procuracao0.outorgado.matricula,
            cargo: procuracao0.outorgado.cargo,
            subsIds: procuracao0.subsidiarias.reduce((acc, s) => {
              acc.push(s.procuracaoId);
              return acc;
            }, []),
            subsidiarias: procuracao0.subsidiarias
              .reduce((acc, cur) => {
                acc.push(cur.nome);
                return acc;
              }, []),
            manifesto: procuracao0.subsidiarias
              .reduce((acc, cur) => {
                if (acc > new Date(cur.manifesto)) {
                  return new Date(cur.manifesto);
                }
                return acc;
              }, new Date(999999999999999)),
            vencimento: new Date(procuracao0.subsidiarias[0].vencimento),
            acoes: procuracao0.subsidiarias.map((s) => ({
              [s.procuracaoId]: {
                doc: s.doc,
                nome: s.nome,
              }
            }))
          }
        ]);
      });
    });

    describe('when outorgado com procuracao completa', () => {
      it('returns ativo', () => {
        const { ativo } = extractAcordeaoItemData(outorgadoComProcuracaoCompleta);
        expect(ativo).toBe(outorgadoComProcuracaoCompleta.ativo);
      });

      it('returns header', () => {
        const { CollapsePanelHeader } = extractAcordeaoItemData(outorgadoComProcuracaoCompleta);
        expect(CollapsePanelHeader).toEqual(
          `${outorgadoComProcuracaoCompleta.matricula} - ${outorgadoComProcuracaoCompleta.nome} (${outorgadoComProcuracaoCompleta.cargoNome})`
        );
      });

      it('returns the dataSource', () => {
        const { tableDataSource } = extractAcordeaoItemData(outorgadoComProcuracaoCompleta);
        const procuracao0 = outorgadoComProcuracaoCompleta.procuracao[0];
        const procuracao1 = outorgadoComProcuracaoCompleta.procuracao[1];
        expect(tableDataSource).toEqual([
          {
            ...procuracao0.procuracaoAgregada,
            outorgante: procuracao1.outorgado,
            nome: procuracao0.outorgado.nome,
            matricula: procuracao0.outorgado.matricula,
            cargo: procuracao0.outorgado.cargo,
            manifesto: procuracao0.procuracaoAgregada.manifesto,
            procuracaoId: procuracao0.procuracaoAgregada.procuracaoId,
            subsidiarias: procuracao0.subsidiarias
              .reduce((acc, cur) => {
                acc.push(cur.nome);
                return acc;
              }, []),
            vencimento: procuracao0.procuracaoAgregada.vencimento,
            acoes: [
              { 'Baixar Procuracão': procuracao0.procuracaoAgregada.doc }
            ],
            raw: procuracao0,
          },
          {
            nome: procuracao1.outorgado.nome,
            matricula: procuracao1.outorgado.matricula,
            cargo: procuracao1.outorgado.cargo,
            subsIds: procuracao1.subsidiarias.reduce((acc, s) => {
              acc.push(s.procuracaoId);
              return acc;
            }, []),
            subsidiarias: procuracao1.subsidiarias
              .reduce((acc, cur) => {
                acc.push(cur.nome);
                return acc;
              }, []),
            manifesto: procuracao1.subsidiarias
              .reduce((acc, cur) => {
                if (acc > new Date(cur.manifesto)) {
                  return new Date(cur.manifesto);
                }
                return acc;
              }, new Date(999999999999999)),
            vencimento: new Date(procuracao1.subsidiarias[0].vencimento),
            acoes: procuracao1.subsidiarias.map((s) => ({
              [s.procuracaoId]: {
                doc: s.doc,
                nome: s.nome,
              }
            }))
          }
        ]);
      });
    });
  });
});
