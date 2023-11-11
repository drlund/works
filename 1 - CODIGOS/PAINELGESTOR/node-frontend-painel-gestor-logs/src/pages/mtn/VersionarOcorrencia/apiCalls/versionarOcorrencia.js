import { message } from 'antd';
import { FETCH_METHODS, fetch } from 'services/apis/GenericFetch';

const versionarOcorrencia = async (idEnvolvido) => {
  try {
    await fetch(FETCH_METHODS.POST, '/mtn/adm/envolvido/versionar-ocorrencia', {
      idEnvolvido,
    });
  } catch (e) { 
    message.error('Erro ao versionar essa ocorrência.');
  }
};
export default versionarOcorrencia;
