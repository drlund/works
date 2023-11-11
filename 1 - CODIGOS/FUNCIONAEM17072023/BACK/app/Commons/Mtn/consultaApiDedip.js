"use strict";
const axios = require("axios").default;
const MtnConsultaDedipDipesApiLog = use(
  "App/Models/Postgres/MtnConsultaDedipDipesApiLog"
);

async function consultaApiDedip(
  dadosUsuario,
  envolvido,
  idMedida,
  idMedidaConvertidoParamDedip
) {
  let BBSSOToken = dadosUsuario.bb_token;

  if (BBSSOToken === "localhost") {
    let mockBBSSOToken =
      "YXZbCR-gYXti2FLjPjM90zdnNio.*AAJTSQACMDMAAlNLABxHSVhsR3VDQ2FiWjJ5S0NDRHE5OElDbXUrcFU9AAR0eXBlAANDVFMAAlMxAAIwMg..*";
    BBSSOToken = mockBBSSOToken;
  }

  try {
    let dedipResponse = await axios.get(
      `https://services.dipes.intranet.bb.com.br/cmdapi/apps/recorr_contu?matricula=${envolvido.matricula.substr(
        1
      )}&tipoConducao=1&medidaAplicada=${idMedidaConvertidoParamDedip}&haveraContabilizacao=0`,
      {
        headers: {
          "Content-Type": "application/json",
          Cookie: `BBSSOToken=${BBSSOToken}`,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,es;q=0.6",
        },
      }
    );

    //Salva no banco de dados a consulta com sucesso
    await MtnConsultaDedipDipesApiLog.create({
      matricula: envolvido.matricula,
      medida_pesquisada: idMedida,
      id_mtn: envolvido.id_mtn,
      mat_resp_analise: dadosUsuario.matricula,
      resposta_api: JSON.stringify(dedipResponse?.data),
    });
    //Retorna a consulta com data e status
    return dedipResponse;
  } catch (error) {
    return error;
  }
}

module.exports = consultaApiDedip;
