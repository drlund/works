import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import combineReducers from 'services/reducers';

export * from './antdTestUtils';

const setupStore = (/** @type {Object} */ preloadedState) => createStore(
  combineReducers,
  preloadedState,
  compose(applyMiddleware(reduxThunk)),
);

/**
 * State a ser passado para o store
 * @param {GetProps<render>} ui
 * @param {Parameters<render>['1'] & { preloadedState?: Object, withMemoryRouter?: boolean }} [options]
 */
export const renderWithRedux = (ui, {
  preloadedState = {
    app: {
      authState: {
        isLoggedIn: true,
        token: 'mock token',
        sessionData: /** @type {import('@/hooks/useUsuarioLogado').UsuarioLogado} */({
          chave: 'F9999999',
          nome_usuario: 'Mock User',
          prefixo: '9009',
          nome_funcao: 'Dev',
        })
      }
    }
  },
  withMemoryRouter = false,
  ...options
} = {}) => {
  const store = setupStore(preloadedState);

  /**
   * @param {{ children: React.ReactNode}} props
   */
  function AllTheProviders({ children }) {
    const baseElement = (
      <Provider store={store}>
        {children}
      </Provider>
    );

    if (withMemoryRouter) {
      return (
        <MemoryRouter>
          {baseElement}
        </MemoryRouter>
      );
    }

    return baseElement;
  }

  return render(ui, {
    wrapper: AllTheProviders,
    legacyRoot: true,
    ...options
  });
};


export function toPlayground() {
  // eslint-disable-next-line testing-library/no-debugging-utils
  const link = screen.logTestingPlaygroundURL();

  try {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:51337', false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(link);
  } catch (err) {
    if (!(err instanceof DOMException)) {
      throw err;
    }

    if (err.message.includes('connect ECONNREFUSED')) {
      throw new Error('Playground server is not running. Maybe you forgot to remove the call `toPlayground()`?');
    } else if (/cross origin .* forbidden/i.test(err.message)) {
      /**
       * jest network error forbidden
       * it completes the connection, but an error is thrown
       */
    } else {
      throw err;
    }
  }

  return link;
}
