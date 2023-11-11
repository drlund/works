const UcGetPoderesOutorgante = require("./UcGetPoderesOutorgante");

describe("UcGetProcuracoesOutorgante", () => {
  const mockRepository = {
    getPoderesByOutorgante: jest.fn(),
  };

  const matriculaCorreta = "F0000000";
  const matriculaComLetraIncorreta = "C0000000";
  const matriculaComTamanhoIncorreto = "F00000";

  it("should go through the database, run the repository search function one time  with 'matriculaPesquisa' as parameter", async () => {
    const ucGetPoderesOutorgante = new UcGetPoderesOutorgante(mockRepository);
    ucGetPoderesOutorgante.validate({
      matriculaPesquisa: matriculaCorreta,
    });
    await ucGetPoderesOutorgante.run();

    expect(mockRepository.getPoderesByOutorgante).toHaveBeenCalledTimes(1);
    expect(mockRepository.getPoderesByOutorgante).toHaveBeenCalledWith(
      matriculaCorreta
    );
  });

  it("should return an error if validate() method is not called before run()", async () => {
    const ucGetPoderesOutorgante = new UcGetPoderesOutorgante(mockRepository);
    const { payload, error } = await ucGetPoderesOutorgante.run();
    expect(error).toStrictEqual({
      msg: "Dados devem ser validados através do método validate()",
      code: 500,
    });
    expect(payload).toBeNull();
  });

  it("should return the array of results returned from respository", async () => {
    const mockResult = ["mockContent1", "mockContent2", "mockContent3"];
    mockRepository.getPoderesByOutorgante.mockResolvedValue(mockResult);

    const ucGetPoderesOutorgante = new UcGetPoderesOutorgante(
      mockRepository
    );
    ucGetPoderesOutorgante.validate({
      matriculaPesquisa: matriculaCorreta,
    });
    const { payload, error } = await ucGetPoderesOutorgante.run();

    expect(error).toBeNull();
    expect(Array.isArray(payload)).toBe(true);
  });

  it("should return error when search term length is invalid", async () => {
    const ucGetPoderesOutorgante = new UcGetPoderesOutorgante(
      mockRepository
    );

    ucGetPoderesOutorgante.validate({
      matriculaPesquisa: matriculaComTamanhoIncorreto,
    });

    const { error, payload } = await ucGetPoderesOutorgante.run();

    expect(error).toStrictEqual({ msg: "Matrícula inválida!", code: 400 });
    expect(payload).toBeNull();
  });

  it("should return error when search term first letter is not F", async () => {
    const ucGetPoderesOutorgante = new UcGetPoderesOutorgante(
      mockRepository
    );

    ucGetPoderesOutorgante.validate({
      matriculaPesquisa: matriculaComLetraIncorreta,
    });

    const { error, payload } = await ucGetPoderesOutorgante.run();

    expect(error).toStrictEqual({ msg: "Matrícula inválida!", code: 400 });
    expect(payload).toBeNull();
  });

  it("should return an empty array when something diferent of array is returned from the repository ", async () => {
    mockRepository.getPoderesByOutorgante.mockResolvedValue(null);
    const ucGetPoderesOutorgante = new UcGetPoderesOutorgante(
      mockRepository
    );
    ucGetPoderesOutorgante.validate({
      matriculaPesquisa: matriculaCorreta,
    });
    const { error, payload } = await ucGetPoderesOutorgante.run();

    expect(error).toBeNull();

    expect(payload).toEqual([]);
  });

  it("should throw an error if repository thrown a error", async () => {
    mockRepository.getPoderesByOutorgante.mockImplementation(() => {
      throw new Error("Erro de banco de dados");
    });

    const ucGetPoderesOutorgante = new UcGetPoderesOutorgante(
      mockRepository
    );
    ucGetPoderesOutorgante.validate({
      matriculaPesquisa: matriculaCorreta,
    });
    const { error, payload } = await ucGetPoderesOutorgante.run();
    expect(error).toBeInstanceOf(Error);
    expect(payload).toBeNull();
  });
});
