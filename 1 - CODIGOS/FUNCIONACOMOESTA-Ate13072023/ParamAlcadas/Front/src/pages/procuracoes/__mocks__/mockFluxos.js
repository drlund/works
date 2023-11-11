export const mockFluxos = /** @type {const} */ ({
  // export const mockFluxos = ({
  // export const mockFluxos = /** @type {Record<string,{minuta: string, fluxo: FluxoType, visibilidade?: string[]}>} */ ({
  'f8dd7ebd-8c5c-4f7e-92c0-4a9ac7e52ba4': {
    minuta: '1º Nível Gerencial UT (Superintendente UT)',
    fluxo: 'SUBSIDIARIA'
  },
  '9bca0a03-9b9e-454c-a6a1-b963942fc25c': {
    minuta: '2º Nível Gerencial UT (Gerente de Negócios ou Administração) | Pública',
    fluxo: 'PUBLICA'
  },
  '9b27efa1-99f3-4787-b6c8-ae018721c02c': {
    minuta: '2º Nível Gerencial UT (Gerente de Negócios ou Administração) | Particular',
    fluxo: 'PARTICULAR'
  },
  '183e8ee8-29bf-44b9-8b2a-06c0b20020a9': {
    minuta: '2º Nível Gerencial UT (Superintendente Regional ou Gerente de Negócios) em substituição ao Superintendente UT | Pública',
    fluxo: 'PUBLICA'
  },
  'e9b1d2c5-ace3-4349-ad2d-6c6f757d49da': {
    minuta: '2º Nível Gerencial UT (Superintendente Regional ou Gerente de Negócios) em substituição ao Superintendente UT | Particular',
    fluxo: 'PARTICULAR'
  },
  '33c79330-1c11-4021-bf7c-d22e70359438': {
    minuta: '1º Nível Gerencial UN (Gerente Geral)',
    fluxo: 'PUBLICA'
  },
  '6e7d44f6-3c9f-4efe-87aa-6307af65df17': {
    minuta: '2º Nível Gerencial UN (Gerente de Negócios ou Administração) | Pública',
    fluxo: 'PUBLICA'
  },
  '89998559-8d58-4031-a708-8386379ba8bf': {
    minuta: '2º Nível Gerencial UN (Gerente de Negócios ou Administração) | Particular',
    fluxo: 'PARTICULAR'
  },
  'a6c2cb94-8c1a-4d5c-8208-b9e49f53bd21': {
    minuta: '3º Nível Gerencial UN (Demais Gerentes) | Pública',
    fluxo: 'PUBLICA',
    visibilidade: ['9009']
  },
  'f2a79756-0a31-44af-aa3a-cbcfcd5d03ef': {
    minuta: '3º Nível Gerencial UN (Demais Gerentes) | Particular',
    fluxo: 'PARTICULAR'
  },
  'b5dfd889-9196-4199-9706-2da7900c98b4': {
    minuta: '3º Nível Gerencial UN (Demais Gerentes) em substituição ao Gerente Geral UN | Pública',
    fluxo: 'PUBLICA',
    visibilidade: ['9009']
  },
  '7c87cabf-6f73-4a63-aae1-8619417c52c6': {
    minuta: '3º Nível Gerencial UN (Demais Gerentes) em substituição ao Gerente Geral UN | Particular',
    fluxo: 'PARTICULAR'
  }
});

/**
 * @typedef {typeof mockFluxos[keyof typeof mockFluxos]} OneFluxo
 * @typedef {OneFluxo['fluxo']} FluxoType
 * @typedef {OneFluxo['minuta']} MinutaType
 */


export const fluxos = Object.values(mockFluxos).reduce((acc, curr) => {
  if (!acc[curr.fluxo]) {
    acc[curr.fluxo] = [];
  }

  acc[curr.fluxo].push(curr.minuta);
  return acc;
}, /** @type {Record<FluxoType, MinutaType[]>} */({}));

export const mockFluxoSubsidiaria = fluxos.SUBSIDIARIA[0];
export const mockFluxoPublica = fluxos.PUBLICA[0];
export const mockFluxoParticular = fluxos.PARTICULAR[0];

/**
 * @param {MinutaType} minutaProcura
 */
export const getFluxoComIdFluxo = (minutaProcura) => {
  const [fluxoComMinuta] = Object.entries(mockFluxos)
    .map(([idFluxo, { fluxo, minuta }]) => {
      if (minuta === minutaProcura) {
        return { idFluxo, minuta, fluxo };
      }
      return false;
    })
    .filter(Boolean);

  return /** @type {NonFalsy<typeof fluxoComMinuta>} */(fluxoComMinuta);
};
