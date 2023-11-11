import { Select } from 'antd';
import React, { useState } from 'react';
import { useCartorios } from '.';

/**
 * @typedef {Procuracoes.Cartorio} Cartorio
 */

export function useSelectCartorio(
  /** @type {number} */ defaultIdCartorio = null,
  /** @type {(cartorio: Cartorio) => void} */ cb = () => { }
) {
  const { lista: listaCartorios } = useCartorios();
  const [cartorio, setCartorio] = useState(() => {
    if (defaultIdCartorio) {
      const defaultCartorio = findCartorio(defaultIdCartorio);
      cb(defaultCartorio);
      return defaultCartorio;
    }
    return null;
  });

  function findCartorio(/** @type {Cartorio['id']} */ cartorioId) {
    return listaCartorios?.find(
      (item) => item.id === cartorioId
    ) || null;
  }

  const handleChangeCartorio = (/** @type {Cartorio['id']} */ cartorioId) => {
    const changedCartorio = findCartorio(cartorioId);
    cb(changedCartorio);
    setCartorio(changedCartorio);
  };

  const component = () => (
    <Select
      placeholder="Cartórios"
      onChange={handleChangeCartorio}
      value={cartorio?.id}
      style={{ width: 250 }}
    >
      {listaCartorios?.map((cartorioItem) => (
        <Select.Option key={cartorioItem.id} value={cartorioItem.id}>
          {cartorioItem.nome}
        </Select.Option>
      )) || null}
    </Select>
  );

  return {
    cartorio,
    setCartorio,
    SelectCartorio: component,
  };
}
