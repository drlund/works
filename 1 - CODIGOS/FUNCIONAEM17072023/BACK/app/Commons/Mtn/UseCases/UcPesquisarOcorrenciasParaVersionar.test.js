const mockException = jest.fn();
globalThis.use = jest.fn().mockReturnValue(mockException);

const UcPesquisarOcorrenciasParaVersionar = require("./UcPesquisarOcorrenciasParaVersionar");

const NR_MTN = "123456789";
const MATRICULA_ENVOLVIDO = "F0000000";
const MATRICULA_ANALISTA = "F1111111";
const PERIODO_INICIO = "2022-01-01";
const PERIODO_FIM = "2022-11-01";

const FILTROS_VALIDOS = {
  nrMtn: NR_MTN,
  matriculaEnvolvido: MATRICULA_ENVOLVIDO,
  matriculaAnalista: MATRICULA_ANALISTA,
  periodoPesquisa: {
    inicio: PERIODO_INICIO,
    fim: PERIODO_FIM,
  },
};

const runUseCase = async (filtros) => {
  const ucPesquisarOcorrenciasParaVersionar =
    new UcPesquisarOcorrenciasParaVersionar({ repository: [] });
  const { error, payload } = await ucPesquisarOcorrenciasParaVersionar.run(
    filtros
  );

  return { error, payload };
};

describe("UcPesquisarOcorrenciasParaVersionar", () => {
  describe("erros", () => {

    it("período de pesquisa não informado", async () => {

      const filtros = {
        ...FILTROS_VALIDOS,
        periodoPesquisa: null
      }

      const {error, payload} = await runUseCase(filtros);

      expect(payload).toBeUndefined();
      expect(error).not.toBeUndefined();
      expect(error).toStrictEqual([
        "O período de pesquisa é obrigatório.",
        400,
      ]);

    });

    it("número MTN inválido", async () => {

      const NR_MTN_INVALIDO = "INVÁLIDO";

      const filtros = {
        ...FILTROS_VALIDOS,
        nrMtn: NR_MTN_INVALIDO,
      };

      const { error, payload } = await runUseCase(filtros);

      expect(payload).toBeUndefined();
      expect(error).not.toBeUndefined();
      expect(error).toStrictEqual([
        `O número do MTN (${NR_MTN_INVALIDO}) deve ser somente numérico.`,
        400,
      ]);
    });

    it("matrícula do analista inválida", async () => {
      const MATRICULAS_INVALIDAS = {
        tamanho: "F123456789",
        letraInicial: "U0000000",
        numerais: "F00h0000",
      };

      for (const tipoMatriculaInvalida of Object.keys(MATRICULAS_INVALIDAS)) {
        const filtros = {
          ...FILTROS_VALIDOS,
          matriculaAnalista: MATRICULAS_INVALIDAS[tipoMatriculaInvalida],
        };

        const { error, payload } = await runUseCase(filtros);

        expect(payload).toBeUndefined();
        expect(error).not.toBeUndefined();
        expect(error).toStrictEqual([
          `Matrícula do analista (${filtros.matriculaAnalista}) está em um formato errado.`,
          400,
        ]);
      }
    });

    it("matrícula do envolvido inválida", async () => {
      const MATRICULAS_INVALIDAS = {
        tamanho: "F123456789",
        letraInicial: "U0000000",
        numerais: "F00h0000",
      };

      for (const tipoMatriculaInvalida of Object.keys(MATRICULAS_INVALIDAS)) {
        const filtros = {
          ...FILTROS_VALIDOS,
          matriculaEnvolvido: MATRICULAS_INVALIDAS[tipoMatriculaInvalida],
        };

        const { error, payload } = await runUseCase(filtros);

        expect(payload).toBeUndefined();
        expect(error).not.toBeUndefined();
        expect(error).toStrictEqual([
          `Matrícula do envolvido (${filtros.matriculaEnvolvido}) está em um formato errado.`,
          400,
        ]);
      }
    });

  });

  describe("sucesso", () => {

  })
});
