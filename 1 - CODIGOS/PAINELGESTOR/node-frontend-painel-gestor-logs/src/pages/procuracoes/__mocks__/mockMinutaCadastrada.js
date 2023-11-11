import { createPatch } from 'diff';

export const mockMinutaCadastrada = {
  idMinuta: 'id minuta cadastrada mock',
  idFluxo: 'id fluxo mock', // '9bca0a03-9b9e-454c-a6a1-b963942fc25c',
  matriculaOutorgado: 'matricula outorgado mock',
  outorgante_idProcuracao: null,
  outorgante_idProxy: 180,
  outorgante_subsidiariasSelected: '[1,2,4]',
  idTemplateBase: 'id template base mock', // '824985f7-5153-11ed-8f01-0050568b6c10',
  dadosMinuta_customData: '{"mockField":"MockData"}',
  dadosMinuta_diffs: createPatch('', 'old minuta', 'new mock minuta'),
  createdAt: '26/10/2022 10:46',
  updatedAt: '26/10/2022 10:46',
};
