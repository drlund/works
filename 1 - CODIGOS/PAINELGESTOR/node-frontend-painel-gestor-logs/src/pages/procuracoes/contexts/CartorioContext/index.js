import { message } from 'antd';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import getListaCartorios from './getListaCartorios';

/**
 * @typedef {Procuracoes.Cartorio} Cartorio
 * @typedef {{lista: Cartorio[]|null; reload: () => void; shouldLoading: boolean;}} CartorioContext
 */

const Cartorios = createContext(/** @type {CartorioContext|null} */(null));

export function CartorioContext(/** @type {{ children: import('react').ReactNode}} */ { children }) {
  const [listaCartorios, setListaCartorios] = useState(/** @type {Cartorio[]|null} */(null));
  // passa pra cima se deveria colocar o spinner ou não
  const [shouldLoading, setShouldLoading] = useState(false);

  useEffect(() => {
    if (listaCartorios === null) {
      onGetListaCartorios();
    }
  }, [listaCartorios]);

  const onGetListaCartorios = useCallback(() => {
    setShouldLoading(true);
    getListaCartorios()
      .then(setListaCartorios)
      .catch((error) => {
        message.error(
          typeof error === 'string'
            ? error
            : 'Erro ao recuperar lista de cartórios',
        );
      })
      .finally(() => {
        setShouldLoading(false);
      });
  }, []);

  const values = useMemo(() => ({
    lista: listaCartorios,
    reload: onGetListaCartorios,
    shouldLoading,
  }), [listaCartorios, onGetListaCartorios, shouldLoading]);

  return (
    <Cartorios.Provider value={values}>
      {children}
    </Cartorios.Provider>
  );
}

export function useCartorios() {
  return /** @type {CartorioContext} */(useContext(Cartorios) ?? {
    lista: null,
    shouldLoading: false,
  });
}
