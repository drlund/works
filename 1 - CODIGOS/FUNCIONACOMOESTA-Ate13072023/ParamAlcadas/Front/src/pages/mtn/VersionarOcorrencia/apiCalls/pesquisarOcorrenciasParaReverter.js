import { message } from 'antd';
import apiModel from 'services/apis/ApiModel';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const pesquisarOcorrenciasParaReverter = async ({
  nrMtn,
  matriculaEnvolvido,
  matriculaAnalista,
  periodoPesquisa,
}) => {
  try {
    const ocorrencias = await fetch(
      FETCH_METHODS.GET,
      '/mtn/adm/ocorrencias-para-reversao',
      {
        params: {
          nrMtn,
          matriculaEnvolvido,
          matriculaAnalista,
          periodoPesquisa,
        },
      },
    );

    return ocorrencias;
  } catch (e) {
    console.log(e);
    message.error('Erro ao pesquisar ocorrências passíveis de reversão.');
  }
};

export default pesquisarOcorrenciasParaReverter;
