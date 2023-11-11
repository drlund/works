import EtapaCartorio from '.';

/** @type {Procuracoes.AllFluxosBaseFluxo} */
export const ETAPA_CARTORIO = {
  titulo: 'Cartório',
  nomeCampo: 'cartorio',
  componente: EtapaCartorio,
  validar: (dados) => new Promise((resolve, reject) => {
    if (!dados) {
      reject('Selecione um cartório!');
    }
    resolve(dados);
  })
};
