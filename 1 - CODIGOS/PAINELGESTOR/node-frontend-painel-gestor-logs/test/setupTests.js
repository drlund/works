/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom';
import 'jest-styled-components';
import React from 'react';
import { TextDecoder, TextEncoder } from 'util';

import * as Permissoes from 'utils/getPermissoesUsuario';
import * as PermissionHook from 'hooks/useVerifyPermission';

import history from '../src/history';
import * as GenericFetch from '../src/services/apis/GenericFetch';
import { mockFormData } from './mockFormData';
import { mockHistoryPushWithQuery } from './__mocks__/mockHistoryPushWithQuery';

/** @type {jest.SpyInstance<Promise<unknown>>} */
// @ts-ignore
const fetchSpy = jest.spyOn(
  GenericFetch,
  // @ts-ignore
  GenericFetch.fetch.name
);
globalThis.fetchSpy = fetchSpy;

// disponibiliza o React para todos os testes
// por algum motivo, deveria funcionar só com o import, mas não esta sendo o caso
// @ts-ignore
globalThis.React = React;

// necessário para alguns componentes do antd
// @ts-ignore
// eslint-disable-next-line func-names
globalThis.matchMedia = globalThis.matchMedia || function () {
  return {
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};

// evita erros de componentes que usam o history
globalThis.historySpy = jest.spyOn(
  history,
  // @ts-ignore
  history.push.name
);

// não disponibilizado no jsdom por default
globalThis.TextDecoder = TextDecoder;
globalThis.TextEncoder = TextEncoder;

// crypto.randomUUID => não suportado em alguns browsers (babel não esta transpilando)
// @ts-ignore
globalThis.crypto = {
  randomUUID: jest.fn().mockReturnValue('randomUUID')
};
// usando o uuid/v4 usar:
// import uuidModule from 'uuid/v4';
// jest.mock('uuid/v4');
// uuidModule.mockImplementation(() => 'randomUUID');

// mocka qualquer form chamado
// caso ache necessário, é possível fazer o override durante o teste
mockFormData();

// spy para o get permissões
/** @type {jest.SpiedFunction<Permissoes.getPermissoesUsuario>} */
const getPermissoesUsuarioSpy = jest.spyOn(
  Permissoes,
  // @ts-ignore
  Permissoes.getPermissoesUsuario.name
);
// @ts-ignore
globalThis.getPermissoesUsuario = getPermissoesUsuarioSpy;

// spy para o useVerifyPermission hook
/** @type {jest.SpiedFunction<PermissionHook.useVerifyPermission>} */
const permissionHookMock = jest.spyOn(
  PermissionHook,
  // @ts-ignore
  PermissionHook.useVerifyPermission.name
);
// @ts-ignore
globalThis.permissionHookMock = permissionHookMock;

globalThis.routerDomPushMock = mockHistoryPushWithQuery();
