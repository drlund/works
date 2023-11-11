const UcSalvarParecer = require("./UcSalvarParecer");

const moment = require("moment");

const { mtnConsts } = require("../../../Commons/Constants");

const { medidas, tiposAnexo } = mtnConsts;

const mockAnexoRepository = {
  salvarAnexos: jest.fn(),
};

const mockEnvolvidoRepository = {
  getPareceresPendentesAprovacao: jest.fn(),
  getDadosEnvolvido: jest.fn(),
  salvarAprovacaoMedida: jest.fn(),
  getDadosCompletosEnvolvido: jest.fn(),
  moveAnexosToRecurso: jest.fn(),
  limparParecerEnvolvido: jest.fn(),
  marcarEnvolvidoComoAprovado: jest.fn(),
  update: jest.fn(),
};

const mockMedidaRepository = {
  getDadosMedida: jest.fn(),
};

const mockRecursoRepository = {
  getRecursoByEnvolvido: jest.fn(),
  create: jest.fn(),
};

const mockExecutarAcao = jest.fn();
const mockInsereTimeline = jest.fn();

const mockTrx = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

const ID_PARECER = 1;

const DADOS_USUARIO = {
  chave: "F0000000",
  nome_usuario: "FULANO DE TAL",
  prefixo: "0000",
  dependencia: "DEPENDENCIA EXEMPLO",
};

const DADOS_PARECER = {
  arquivos: [{ arquivo: 1 }],
  dadosUsuario: DADOS_USUARIO,
  idEnvolvido: ID_PARECER,
  txtParecer: "PARECER EXEMPLO",
  idMedida: medidas.ORIENTACOES,
  nrGedip: null,
};

const DADOS_PARECER_RASCUNHO = {
  ...DADOS_PARECER,
  finalizar: false,
};

const DADOS_PARECER_RASCUNHO_GEDIP = {
  ...DADOS_PARECER,
  finalizar: false,
  idMedida: medidas.GEDIP,
  nrGedip: "123",
};

const DADOS_PARECER_FINAL = {
  ...DADOS_PARECER,
  finalizar: true,
};

const DADOS_PARECER_FINAL_GEDIP = {
  ...DADOS_PARECER,
  finalizar: true,
  idMedida: medidas.GEDIP,
  nrGedip: "123"
};

const runUseCase = async ({
  arquivos,
  dadosUsuario,
  idEnvolvido,
  txtParecer,
  idMedida,
  finalizar,
  nrGedip,
}) => {
  const ucSalvarParecer = new UcSalvarParecer({
    repository: {
      anexo: mockAnexoRepository,
      envolvido: mockEnvolvidoRepository,
      medida: mockMedidaRepository,
      recurso: mockRecursoRepository,
    },
    functions: {
      // A função foi passada dessa maneira para preservar o escopo do `this`
      executarAcao: mockExecutarAcao,
      insereTimeline: mockInsereTimeline
    },
    trx: mockTrx,
  });

  const { error, payload } = await ucSalvarParecer.run({
    arquivos,
    dadosUsuario,
    idEnvolvido,
    txtParecer,
    idMedida,
    finalizar,
    nrGedip,
  });

  return { error, payload };
};

describe("UCSalvarParecer", () => {
  mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue({
    id: 1,
    respondido_em: null,
    aprovacao_pendente: false,
  });
  mockRecursoRepository.getRecursoByEnvolvido.mockResolvedValue(null);
  describe("ao salvar rascunho", () => {
    it("sucesso, para medida que não é GEDIP", async () => {
      mockMedidaRepository.getDadosMedida.mockResolvedValue({
        id: 1,
      });

      const { error, payload } = await runUseCase(DADOS_PARECER_RASCUNHO);

      expect(error).toBeUndefined();
      expect(payload).toBeUndefined();

      expect(mockEnvolvidoRepository.getDadosEnvolvido).toBeCalledTimes(1);
      expect(mockEnvolvidoRepository.getDadosEnvolvido).toHaveBeenCalledWith(
        {
          idEnvolvido: DADOS_PARECER_RASCUNHO.idEnvolvido,
          loadRecursos: true,
          loadAnexos: false,
        },
        mockTrx
      );

      expect(mockAnexoRepository.salvarAnexos).toBeCalledTimes(1);
      expect(mockAnexoRepository.salvarAnexos).toBeCalledWith(
        {
          arquivos: DADOS_PARECER_RASCUNHO.arquivos,
          tipoAnexo: tiposAnexo.PARECER,
          idVinculo: DADOS_PARECER_RASCUNHO.idEnvolvido,
          dadosUsuario: DADOS_PARECER.dadosUsuario,
        },
        mockTrx
      );

      expect(mockEnvolvidoRepository.update).toBeCalledTimes(1);
      expect(mockEnvolvidoRepository.update).toBeCalledWith(
        DADOS_PARECER_RASCUNHO.idEnvolvido,
        {
          id_medida: DADOS_PARECER_RASCUNHO.idMedida,
          mat_resp_analise: DADOS_PARECER_RASCUNHO.dadosUsuario.chave,
          nome_resp_analise: DADOS_PARECER_RASCUNHO.dadosUsuario.nome_usuario,
          txt_analise: DADOS_PARECER_RASCUNHO.txtParecer,
          enviado_aprovacao_em: null,
        },
        mockTrx
      );

      expect(mockInsereTimeline).toBeCalledTimes(0);
    });

    it("sucesso, para medida  que é GEDIP", async () => {
      mockMedidaRepository.getDadosMedida.mockResolvedValue({
        id: 4,
      });

      const { error, payload } = await runUseCase(DADOS_PARECER_RASCUNHO_GEDIP);

      expect(error).toBeUndefined();
      expect(payload).toBeUndefined();

      expect(mockEnvolvidoRepository.getDadosEnvolvido).toBeCalledTimes(1);
      expect(mockEnvolvidoRepository.getDadosEnvolvido).toHaveBeenCalledWith(
        {
          idEnvolvido: DADOS_PARECER_RASCUNHO.idEnvolvido,
          loadRecursos: true,
          loadAnexos: false,
        },
        mockTrx
      );

      expect(mockAnexoRepository.salvarAnexos).toBeCalledTimes(1);
      expect(mockAnexoRepository.salvarAnexos).toBeCalledWith(
        {
          arquivos: DADOS_PARECER_RASCUNHO.arquivos,
          tipoAnexo: tiposAnexo.PARECER,
          idVinculo: DADOS_PARECER_RASCUNHO.idEnvolvido,
          dadosUsuario: DADOS_PARECER.dadosUsuario,
        },
        mockTrx
      );

      expect(mockEnvolvidoRepository.update).toBeCalledTimes(1);
      expect(mockEnvolvidoRepository.update).toBeCalledWith(
        DADOS_PARECER_RASCUNHO.idEnvolvido,
        {
          id_medida: 4,
          mat_resp_analise: DADOS_PARECER_RASCUNHO_GEDIP.dadosUsuario.chave,
          nome_resp_analise:
            DADOS_PARECER_RASCUNHO_GEDIP.dadosUsuario.nome_usuario,
          txt_analise: DADOS_PARECER_RASCUNHO_GEDIP.txtParecer,
          enviado_aprovacao_em: null,
          nr_gedip: DADOS_PARECER_RASCUNHO_GEDIP.nrGedip,
        },
        mockTrx
      );
      expect(mockInsereTimeline).toBeCalledTimes(0);
    });
  });

  describe("ao salvar parecer final", () => {

    it("sucesso, para a medida que não é GEDIP", async () => {
      mockMedidaRepository.getDadosMedida.mockResolvedValue({
        id: 1,
      });

      const { error, payload } = await runUseCase(DADOS_PARECER_FINAL);

      expect(error).toBeUndefined();
      expect(payload).toBeUndefined();

      expect(mockEnvolvidoRepository.getDadosEnvolvido).toBeCalledTimes(1);
      expect(mockEnvolvidoRepository.getDadosEnvolvido).toHaveBeenCalledWith(
        {
          idEnvolvido: DADOS_PARECER_FINAL.idEnvolvido,
          loadRecursos: true,
          loadAnexos: false,
        },
        mockTrx
      );

      expect(mockAnexoRepository.salvarAnexos).toBeCalledTimes(1);
      expect(mockAnexoRepository.salvarAnexos).toBeCalledWith(
        {
          arquivos: DADOS_PARECER_FINAL.arquivos,
          tipoAnexo: tiposAnexo.PARECER,
          idVinculo: DADOS_PARECER_FINAL.idEnvolvido,
          dadosUsuario: DADOS_PARECER_FINAL.dadosUsuario,
        },
        mockTrx
      );

      expect(mockEnvolvidoRepository.update).toBeCalledTimes(1);
      expect(mockEnvolvidoRepository.update).toBeCalledWith(
        DADOS_PARECER_FINAL.idEnvolvido,
        {
          id_medida: DADOS_PARECER_FINAL.idMedida,
          mat_resp_analise: DADOS_PARECER_FINAL.dadosUsuario.chave,
          nome_resp_analise: DADOS_PARECER_FINAL.dadosUsuario.nome_usuario,
          txt_analise: DADOS_PARECER_FINAL.txtParecer,
          enviado_aprovacao_em: moment().format("YYYY-MM-DD HH:mm"),
          aprovacao_pendente: true
        },
        mockTrx
      );
      expect(mockInsereTimeline).toBeCalledTimes(1);
      expect(mockInsereTimeline).toBeCalledWith({
        idEnvolvido: DADOS_PARECER_FINAL.idEnvolvido,
        idAcao: mtnConsts.acoes.ENVIOU_PARA_APROVACAO,
        dadosRespAcao: DADOS_PARECER_FINAL.dadosUsuario,
        tipoNotificacao: null,
        trx: mockTrx
      });
    });

    it("sucesso, para a medida que é GEDIP", async () => {
      mockMedidaRepository.getDadosMedida.mockResolvedValue({
        id: medidas.GEDIP,
      });

      const { error, payload } = await runUseCase(DADOS_PARECER_FINAL_GEDIP);

      expect(error).toBeUndefined();
      expect(payload).toBeUndefined();

      expect(mockEnvolvidoRepository.getDadosEnvolvido).toBeCalledTimes(1);
      expect(mockEnvolvidoRepository.getDadosEnvolvido).toHaveBeenCalledWith(
        {
          idEnvolvido: DADOS_PARECER_FINAL.idEnvolvido,
          loadRecursos: true,
          loadAnexos: false,
        },
        mockTrx
      );

      expect(mockAnexoRepository.salvarAnexos).toBeCalledTimes(1);
      expect(mockAnexoRepository.salvarAnexos).toBeCalledWith(
        {
          arquivos: DADOS_PARECER_FINAL.arquivos,
          tipoAnexo: tiposAnexo.PARECER,
          idVinculo: DADOS_PARECER_FINAL.idEnvolvido,
          dadosUsuario: DADOS_PARECER_FINAL.dadosUsuario,
        },
        mockTrx
      );

      expect(mockEnvolvidoRepository.update).toBeCalledTimes(1);
      expect(mockEnvolvidoRepository.update).toBeCalledWith(
        DADOS_PARECER_RASCUNHO.idEnvolvido,
        {
          id_medida: DADOS_PARECER_FINAL_GEDIP.idMedida,
          mat_resp_analise: DADOS_PARECER_FINAL.dadosUsuario.chave,
          nome_resp_analise: DADOS_PARECER_FINAL.dadosUsuario.nome_usuario,
          txt_analise: DADOS_PARECER_FINAL.txtParecer,
          enviado_aprovacao_em: moment().format("YYYY-MM-DD HH:mm"),
          aprovacao_pendente: true,
          nr_gedip: DADOS_PARECER_RASCUNHO_GEDIP.nrGedip,
        },
        mockTrx
      );
      expect(mockInsereTimeline).toBeCalledTimes(1);
      expect(mockInsereTimeline).toBeCalledWith({
        idEnvolvido: DADOS_PARECER_FINAL.idEnvolvido,
        idAcao: mtnConsts.acoes.ENVIOU_PARA_APROVACAO,
        dadosRespAcao: DADOS_PARECER_FINAL.dadosUsuario,
        tipoNotificacao: null,
        trx: mockTrx
      });
    });

  });

  describe("erros de execução", () => {

    it("texto do parecer não foi informado", async () => {
        const {txtParecer, DADOS_PARECER_SEM_TEXTO} = DADOS_PARECER;
        const { error, payload } = await runUseCase({...DADOS_PARECER_SEM_TEXTO});
        expect(payload).toBeUndefined();
        expect(error[0]).toBe('O texto do parecer é obrigatório');
        expect(error[1]).toBe(400);
    })

    it("id do envolvido inválido", async () => {
      mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue(null);
      const { error, payload } = await runUseCase({...DADOS_PARECER});
      expect(payload).toBeUndefined();
      expect(error[0]).toBe('Envolvido inválido');
      expect(error[1]).toBe(400);
    })

    it("medida inválida", async () => {
      mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue({
        id: 1,
        respondido_em: null,
        aprovacao_pendente: false,
      });
      mockMedidaRepository.getDadosMedida.mockResolvedValue(null);
      const { error, payload } = await runUseCase({...DADOS_PARECER});
      expect(payload).toBeUndefined();
      expect(error[0]).toBe('Medida inválida');
      expect(error[1]).toBe(400);
    })

    it("parecer já registrado", async () => {
      mockEnvolvidoRepository.getDadosEnvolvido.mockResolvedValue({respondido_em: true});
      const { error, payload } = await runUseCase({...DADOS_PARECER});
      expect(payload).toBeUndefined();
      expect(error[0]).toBe('Parecer já registrado');
      expect(error[1]).toBe(400);
    })


  })
});
