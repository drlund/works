"use strict";

const Solicitacao = require("../Entidades/Solicitacao");
const UCListarSolicitacoes = require("../UseCases/UCListarSolicitacoes");

describe("Flexibilização de Critérios", () => {
  // TODO: arrumar teste
  xit("Caso de Uso UCListarSolicitacoes", async () => {
    const repmock = {
      listarSolicitacoes: jest.fn(),
    };
    const usuario = {
      prefixo: 9009
    }
    const solicitacaoMock = [{
      "id": 1,
      "codFunci": "F4683333",
      "nomeFunci": "JEFFERSON ALEXANDRE",
      "codFuncao": 14011,
      "nomeFuncao": "ASSESSOR I UT",
      "codOportunidade": null,
      "nomeOportunidade": null,
      "codFuncaoPretendida": 10000,
      "nomeFuncaoPretendida": "ASSESSOR -I UT",
      "codPrefixoDestino": 8592,
      "nomePrefixoDestino": "DIPES",
      "codPrefixoOrigem": 9009,
      "nomePrefixoOrigem": "SUPERADM",
      "id_ordem": 1,
      "id_status": 1,
      "id_localizacao": 1,
      "createdAt": "2023-03-07 13:44:09",
      "updatedAt": "2023-03-07 13:44:09",
      "tipos": [
        {
          "id": 1,
          "nome": "Flexibilização de Critérios",
          "cor": "#576ba5",
          "ativo": "1",
          "pivot": {
            "id_tipo": 1,
            "id_solicitacao": 1
          }
        },
        {
          "id": 2,
          "nome": "Flexibilização de Trava Institucional",
          "cor": "#fa9a50",
          "ativo": "1",
          "pivot": {
            "id_tipo": 2,
            "id_solicitacao": 1
          }
        }
      ],
      "status": {
        "id": 1,
        "nome": "Aguardando Manifestação",
        "cor": "#f9f7f4"
      },
      "localizacao": {
        "id": 1,
        "nome": "Em Manifestação",
        "cor": "#fa9a50"
      }
    }];
    repmock.listarSolicitacoes.mockResolvedValue(solicitacaoMock);

    const ucListarSolicitacoes = new UCListarSolicitacoes({
      repository: { solicitacoes: repmock },
    });

    const saida = Solicitacao.listarSolicitacoes(solicitacaoMock);

    const { error, payload } = await ucListarSolicitacoes.run(usuario);
    expect(error).toBeFalsy();
    expect(payload).not.toBeNull();
    expect(payload[0]).toHaveProperty('id');
    expect(payload[0]).toMatchObject(saida[0]);
  });
});
